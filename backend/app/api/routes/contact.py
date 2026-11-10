import re

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from pydantic import EmailStr, TypeAdapter, ValidationError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Inquiry
from app.schemas.constants import INQUIRY_CATEGORIES
from app.utils.files import save_upload
from app.utils.rate_limit import RateLimiter

router = APIRouter()
limiter = RateLimiter(limit=8, window_seconds=600)
email_adapter = TypeAdapter(EmailStr)
LINK_PATTERN = re.compile(r"https?://", re.I)


@router.post("/contact", status_code=201)
async def contact(
    request: Request,
    full_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    country: str = Form(...),
    category: str = Form(...),
    subject: str = Form(...),
    message: str = Form(...),
    company: str = Form(""),
    fax_number: str = Form(""),
    attachment: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    client = request.client.host if request.client else "unknown"
    if not limiter.allow(client):
        raise HTTPException(status_code=429, detail="Too many messages. Please try again shortly.")
    if fax_number.strip():
        raise HTTPException(status_code=400, detail="The message could not be accepted")
    full_name = full_name.strip()
    subject = subject.strip()
    message = message.strip()
    phone = phone.strip()
    country = country.strip()
    if len(full_name) < 2 or len(subject) < 2 or len(message) < 10 or len(phone) < 6 or len(country) < 2:
        raise HTTPException(status_code=422, detail="Please complete every required field")
    if len(message) > 5000 or len(LINK_PATTERN.findall(message)) > 5:
        raise HTTPException(status_code=422, detail="The message is too long or contains too many links")
    try:
        valid_email = str(email_adapter.validate_python(email.strip()))
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail="Enter a valid email address") from exc
    if category not in INQUIRY_CATEGORIES:
        raise HTTPException(status_code=422, detail="Choose a valid inquiry category")
    path = await save_upload(attachment, "inquiries")
    inquiry = Inquiry(
        full_name=full_name,
        company=company.strip(),
        email=valid_email,
        phone=phone,
        country=country,
        category=category,
        subject=subject,
        message=message,
        attachment_path=path,
        status="new",
    )
    db.add(inquiry)
    db.commit()
    return {"data": {"id": inquiry.id, "status": inquiry.status}}


@router.post("/careers/apply", status_code=201)
async def apply(
    request: Request,
    full_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    message: str = Form(""),
    job_id: str = Form(""),
    fax_number: str = Form(""),
    cv: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    from uuid import UUID

    from app.models import Job
    from app.utils.files import CV_EXTENSIONS

    client = request.client.host if request.client else "unknown"
    if not limiter.allow(f"apply:{client}"):
        raise HTTPException(status_code=429, detail="Too many applications. Please try again shortly.")
    if fax_number.strip():
        raise HTTPException(status_code=400, detail="The application could not be accepted")
    if cv is None or not cv.filename:
        raise HTTPException(status_code=422, detail="Attach a CV as a PDF or Word document")
    try:
        valid_email = str(email_adapter.validate_python(email.strip()))
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail="Enter a valid email address") from exc
    if len(full_name.strip()) < 2 or len(phone.strip()) < 6:
        raise HTTPException(status_code=422, detail="Name and phone are required")
    linked_job = None
    if job_id.strip():
        try:
            linked_job = db.get(Job, UUID(job_id))
        except ValueError as exc:
            raise HTTPException(status_code=422, detail="That vacancy is not valid") from exc
        if linked_job is None or not linked_job.is_active:
            raise HTTPException(status_code=404, detail="That vacancy is not open")
    path = await save_upload(cv, "cvs", CV_EXTENSIONS)
    from app.models import Application

    application = Application(
        job=linked_job,
        full_name=full_name.strip(),
        email=valid_email,
        phone=phone.strip(),
        message=message.strip(),
        cv_path=path,
        status="received",
    )
    db.add(application)
    db.commit()
    return {"data": {"id": application.id, "status": application.status}}
