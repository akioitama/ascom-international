from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import delete, func, select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models import (
    Application,
    CompanyProfile,
    CompanyValue,
    Division,
    DivisionOffering,
    Industry,
    Inquiry,
    Job,
    MediaAsset,
    Organization,
    Product,
    ProductCategory,
    ProductDocument,
    ProductSpec,
    Project,
    ProjectImage,
    Resource,
    SiteSetting,
    Statistic,
    User,
)
from app.schemas.inputs import (
    CategoryWrite,
    CompanyUpdate,
    DivisionWrite,
    IndustryWrite,
    InquiryStatus,
    JobWrite,
    OrganizationWrite,
    ProductWrite,
    ProjectWrite,
    ResourceWrite,
    SettingsUpdate,
    StatisticWrite,
    ValueList,
)
from app.services.present import (
    application_dict,
    category_dict,
    company_dict,
    division_dict,
    industry_dict,
    inquiry_dict,
    job_dict,
    organization_dict,
    product_dict,
    project_dict,
    resource_dict,
    statistic_dict,
    value_dict,
)
from app.utils.files import save_upload, slugify

router = APIRouter(dependencies=[Depends(get_current_user)])


def ok(data, meta=None):
    payload = {"data": data}
    if meta is not None:
        payload["meta"] = meta
    return payload


def _get(db: Session, model, item_id: UUID):
    item = db.get(model, item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Record not found")
    return item


def _slug(db: Session, model, requested: str | None, fallback: str, current_id: UUID | None = None) -> str:
    slug = slugify(requested or fallback)
    existing = db.scalar(select(model).where(model.slug == slug))
    if existing is not None and existing.id != current_id:
        raise HTTPException(status_code=409, detail="That address is already in use")
    return slug


def _disk(url: str) -> Path:
    if not url or not url.startswith("/uploads/"):
        raise HTTPException(status_code=404, detail="File not found")
    root = Path(settings.upload_dir).resolve()
    path = (root / url.removeprefix("/uploads/")).resolve()
    if root not in path.parents and path != root:
        raise HTTPException(status_code=400, detail="Invalid file path")
    if not path.is_file():
        raise HTTPException(status_code=404, detail="File not found")
    return path


@router.get("/admin/dashboard")
def dashboard(db: Session = Depends(get_db)):
    def count(model, *where):
        query = select(func.count()).select_from(model)
        for clause in where:
            query = query.where(clause)
        return db.scalar(query) or 0

    recent = db.scalars(select(Inquiry).order_by(Inquiry.created_at.desc()).limit(6)).all()
    return ok(
        {
            "products": count(Product),
            "projects": count(Project),
            "inquiries": count(Inquiry),
            "new_inquiries": count(Inquiry, Inquiry.status == "new"),
            "applications": count(Application),
            "jobs": count(Job, Job.is_active.is_(True)),
            "recent_inquiries": [inquiry_dict(item) for item in recent],
        }
    )


@router.get("/admin/company")
def get_company(db: Session = Depends(get_db)):
    company = db.scalar(select(CompanyProfile))
    values = db.scalars(select(CompanyValue).order_by(CompanyValue.sort_order)).all()
    return ok({"profile": company_dict(company), "values": [value_dict(item) for item in values]})


@router.patch("/admin/company")
def update_company(body: CompanyUpdate, db: Session = Depends(get_db)):
    company = db.scalar(select(CompanyProfile))
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(company, key, value)
    db.commit()
    db.refresh(company)
    return ok(company_dict(company))


@router.put("/admin/values")
def replace_values(body: ValueList, db: Session = Depends(get_db)):
    db.execute(delete(CompanyValue))
    for index, item in enumerate(body.values, start=1):
        db.add(CompanyValue(title=item.title, description=item.description, icon_key=item.icon_key, sort_order=item.sort_order or index))
    db.commit()
    values = db.scalars(select(CompanyValue).order_by(CompanyValue.sort_order)).all()
    return ok([value_dict(item) for item in values])


@router.get("/admin/settings")
def get_settings(db: Session = Depends(get_db)):
    rows = db.scalars(select(SiteSetting)).all()
    return ok({row.key: row.value for row in rows})


@router.put("/admin/settings")
def update_settings(body: SettingsUpdate, db: Session = Depends(get_db)):
    for key, value in body.settings.items():
        row = db.get(SiteSetting, key)
        if row is None:
            db.add(SiteSetting(key=key[:80], value=value))
        else:
            row.value = value
    db.commit()
    rows = db.scalars(select(SiteSetting)).all()
    return ok({row.key: row.value for row in rows})


@router.get("/admin/divisions")
def admin_divisions(db: Session = Depends(get_db)):
    rows = db.scalars(select(Division).options(selectinload(Division.offerings)).order_by(Division.sort_order)).all()
    return ok([division_dict(item, detailed=True) for item in rows])


@router.post("/admin/divisions", status_code=201)
def create_division(body: DivisionWrite, db: Session = Depends(get_db)):
    data = body.model_dump()
    offerings = data.pop("offerings") or []
    data["slug"] = _slug(db, Division, data.get("slug"), data["name"])
    division = Division(**data)
    for index, offering in enumerate(offerings, start=1):
        division.offerings.append(DivisionOffering(**offering, sort_order=offering.get("sort_order") or index))
    db.add(division)
    db.commit()
    db.refresh(division)
    return ok(division_dict(division, detailed=True))


@router.patch("/admin/divisions/{item_id}")
def update_division(item_id: UUID, body: DivisionWrite, db: Session = Depends(get_db)):
    division = db.scalar(select(Division).where(Division.id == item_id).options(selectinload(Division.offerings)))
    if division is None:
        raise HTTPException(status_code=404, detail="Record not found")
    data = body.model_dump(exclude_unset=True)
    offerings = data.pop("offerings", None)
    if "slug" in data or "name" in data:
        data["slug"] = _slug(db, Division, data.get("slug", division.slug), data.get("name", division.name), division.id)
    for key, value in data.items():
        setattr(division, key, value)
    if offerings is not None:
        division.offerings.clear()
        for index, offering in enumerate(offerings, start=1):
            division.offerings.append(
                DivisionOffering(title=offering["title"], description=offering.get("description", ""), sort_order=offering.get("sort_order") or index)
            )
    db.commit()
    db.refresh(division)
    return ok(division_dict(division, detailed=True))


@router.delete("/admin/divisions/{item_id}")
def delete_division(item_id: UUID, db: Session = Depends(get_db)):
    db.delete(_get(db, Division, item_id))
    db.commit()
    return ok({"deleted": True})


@router.get("/admin/categories")
def admin_categories(db: Session = Depends(get_db)):
    rows = db.scalars(select(ProductCategory).order_by(ProductCategory.sort_order)).all()
    return ok([category_dict(item) for item in rows])


@router.post("/admin/categories", status_code=201)
def create_category(body: CategoryWrite, db: Session = Depends(get_db)):
    data = body.model_dump()
    data["slug"] = _slug(db, ProductCategory, data.get("slug"), data["name"])
    item = ProductCategory(**data)
    db.add(item)
    db.commit()
    db.refresh(item)
    return ok(category_dict(item))


@router.patch("/admin/categories/{item_id}")
def update_category(item_id: UUID, body: CategoryWrite, db: Session = Depends(get_db)):
    item = _get(db, ProductCategory, item_id)
    data = body.model_dump(exclude_unset=True)
    if "slug" in data or "name" in data:
        data["slug"] = _slug(db, ProductCategory, data.get("slug", item.slug), data.get("name", item.name), item.id)
    for key, value in data.items():
        setattr(item, key, value)
    db.commit()
    return ok(category_dict(item))


@router.delete("/admin/categories/{item_id}")
def delete_category(item_id: UUID, db: Session = Depends(get_db)):
    db.delete(_get(db, ProductCategory, item_id))
    db.commit()
    return ok({"deleted": True})


def _product_query():
    return select(Product).options(
        selectinload(Product.category),
        selectinload(Product.division),
        selectinload(Product.specs),
        selectinload(Product.documents),
        selectinload(Product.projects),
    )


def _apply_product_children(db: Session, product: Product, data: dict) -> None:
    specs = data.pop("specs", None)
    documents = data.pop("documents", None)
    project_ids = data.pop("project_ids", None)
    for key, value in data.items():
        setattr(product, key, value)
    if specs is not None:
        product.specs.clear()
        for index, spec in enumerate(specs, start=1):
            product.specs.append(ProductSpec(label=spec["label"], value=spec["value"], sort_order=spec.get("sort_order") or index))
    if documents is not None:
        product.documents.clear()
        for index, document in enumerate(documents, start=1):
            product.documents.append(ProductDocument(title=document["title"], file_url=document["file_url"], sort_order=document.get("sort_order") or index))
    if project_ids is not None:
        product.projects = list(db.scalars(select(Project).where(Project.id.in_(project_ids))).all()) if project_ids else []


@router.get("/admin/products")
def admin_products(db: Session = Depends(get_db)):
    rows = db.scalars(_product_query().order_by(Product.sort_order)).all()
    return ok([product_dict(item, detailed=True) for item in rows])


@router.post("/admin/products", status_code=201)
def create_product(body: ProductWrite, db: Session = Depends(get_db)):
    data = body.model_dump()
    data["slug"] = _slug(db, Product, data.get("slug"), data["name"])
    product = Product(name=data["name"], slug=data["slug"], summary=data["summary"], category_id=data["category_id"])
    db.add(product)
    _apply_product_children(db, product, data)
    db.commit()
    stored = db.scalar(_product_query().where(Product.id == product.id))
    return ok(product_dict(stored, detailed=True))


@router.get("/admin/products/{item_id}")
def admin_product(item_id: UUID, db: Session = Depends(get_db)):
    item = db.scalar(_product_query().where(Product.id == item_id))
    if item is None:
        raise HTTPException(status_code=404, detail="Record not found")
    return ok(product_dict(item, detailed=True))


@router.patch("/admin/products/{item_id}")
def update_product(item_id: UUID, body: ProductWrite, db: Session = Depends(get_db)):
    product = db.scalar(_product_query().where(Product.id == item_id))
    if product is None:
        raise HTTPException(status_code=404, detail="Record not found")
    data = body.model_dump(exclude_unset=True)
    if "slug" in data or "name" in data:
        data["slug"] = _slug(db, Product, data.get("slug", product.slug), data.get("name", product.name), product.id)
    _apply_product_children(db, product, data)
    db.commit()
    stored = db.scalar(_product_query().where(Product.id == product.id))
    return ok(product_dict(stored, detailed=True))


@router.delete("/admin/products/{item_id}")
def delete_product(item_id: UUID, db: Session = Depends(get_db)):
    db.delete(_get(db, Product, item_id))
    db.commit()
    return ok({"deleted": True})


def _project_query():
    return select(Project).options(selectinload(Project.images), selectinload(Project.division), selectinload(Project.products))


def _apply_project_children(db: Session, project: Project, data: dict) -> None:
    images = data.pop("images", None)
    product_ids = data.pop("product_ids", None)
    for key, value in data.items():
        setattr(project, key, value)
    if images is not None:
        project.images.clear()
        for index, image in enumerate(images, start=1):
            project.images.append(
                ProjectImage(
                    url=image["url"],
                    alt=image["alt"],
                    is_company_photo=image.get("is_company_photo", True),
                    sort_order=image.get("sort_order") or index,
                )
            )
    if product_ids is not None:
        project.products = list(db.scalars(select(Product).where(Product.id.in_(product_ids))).all()) if product_ids else []


@router.get("/admin/projects")
def admin_projects(db: Session = Depends(get_db)):
    rows = db.scalars(_project_query().order_by(Project.sort_order)).all()
    return ok([project_dict(item, detailed=True) for item in rows])


@router.post("/admin/projects", status_code=201)
def create_project(body: ProjectWrite, db: Session = Depends(get_db)):
    data = body.model_dump()
    data["slug"] = _slug(db, Project, data.get("slug"), data["title"])
    project = Project(title=data["title"], slug=data["slug"], summary=data["summary"])
    db.add(project)
    _apply_project_children(db, project, data)
    db.commit()
    stored = db.scalar(_project_query().where(Project.id == project.id))
    return ok(project_dict(stored, detailed=True))


@router.get("/admin/projects/{item_id}")
def admin_project(item_id: UUID, db: Session = Depends(get_db)):
    item = db.scalar(_project_query().where(Project.id == item_id))
    if item is None:
        raise HTTPException(status_code=404, detail="Record not found")
    return ok(project_dict(item, detailed=True))


@router.patch("/admin/projects/{item_id}")
def update_project(item_id: UUID, body: ProjectWrite, db: Session = Depends(get_db)):
    project = db.scalar(_project_query().where(Project.id == item_id))
    if project is None:
        raise HTTPException(status_code=404, detail="Record not found")
    data = body.model_dump(exclude_unset=True)
    if "slug" in data or "title" in data:
        data["slug"] = _slug(db, Project, data.get("slug", project.slug), data.get("title", project.title), project.id)
    _apply_project_children(db, project, data)
    db.commit()
    stored = db.scalar(_project_query().where(Project.id == project.id))
    return ok(project_dict(stored, detailed=True))


@router.delete("/admin/projects/{item_id}")
def delete_project(item_id: UUID, db: Session = Depends(get_db)):
    db.delete(_get(db, Project, item_id))
    db.commit()
    return ok({"deleted": True})


@router.get("/admin/industries")
def admin_industries(db: Session = Depends(get_db)):
    rows = db.scalars(select(Industry).order_by(Industry.sort_order)).all()
    return ok([industry_dict(item, detailed=True) for item in rows])


@router.post("/admin/industries", status_code=201)
def create_industry(body: IndustryWrite, db: Session = Depends(get_db)):
    data = body.model_dump()
    data["slug"] = _slug(db, Industry, data.get("slug"), data["name"])
    item = Industry(**data)
    db.add(item)
    db.commit()
    db.refresh(item)
    return ok(industry_dict(item, detailed=True))


@router.patch("/admin/industries/{item_id}")
def update_industry(item_id: UUID, body: IndustryWrite, db: Session = Depends(get_db)):
    item = _get(db, Industry, item_id)
    data = body.model_dump(exclude_unset=True)
    if "slug" in data or "name" in data:
        data["slug"] = _slug(db, Industry, data.get("slug", item.slug), data.get("name", item.name), item.id)
    for key, value in data.items():
        setattr(item, key, value)
    db.commit()
    return ok(industry_dict(item, detailed=True))


@router.delete("/admin/industries/{item_id}")
def delete_industry(item_id: UUID, db: Session = Depends(get_db)):
    db.delete(_get(db, Industry, item_id))
    db.commit()
    return ok({"deleted": True})


@router.get("/admin/resources")
def admin_resources(db: Session = Depends(get_db)):
    rows = db.scalars(select(Resource).order_by(Resource.sort_order)).all()
    return ok([resource_dict(item, detailed=True) for item in rows])


@router.post("/admin/resources", status_code=201)
def create_resource(body: ResourceWrite, db: Session = Depends(get_db)):
    data = body.model_dump()
    data["slug"] = _slug(db, Resource, data.get("slug"), data["title"])
    item = Resource(**data)
    db.add(item)
    db.commit()
    db.refresh(item)
    return ok(resource_dict(item, detailed=True))


@router.patch("/admin/resources/{item_id}")
def update_resource(item_id: UUID, body: ResourceWrite, db: Session = Depends(get_db)):
    item = _get(db, Resource, item_id)
    data = body.model_dump(exclude_unset=True)
    if "slug" in data or "title" in data:
        data["slug"] = _slug(db, Resource, data.get("slug", item.slug), data.get("title", item.title), item.id)
    for key, value in data.items():
        setattr(item, key, value)
    db.commit()
    return ok(resource_dict(item, detailed=True))


@router.delete("/admin/resources/{item_id}")
def delete_resource(item_id: UUID, db: Session = Depends(get_db)):
    db.delete(_get(db, Resource, item_id))
    db.commit()
    return ok({"deleted": True})


@router.get("/admin/organizations")
def admin_organizations(db: Session = Depends(get_db)):
    rows = db.scalars(select(Organization).order_by(Organization.kind, Organization.sort_order)).all()
    return ok([organization_dict(item) for item in rows])


@router.post("/admin/organizations", status_code=201)
def create_organization(body: OrganizationWrite, db: Session = Depends(get_db)):
    item = Organization(**body.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return ok(organization_dict(item))


@router.patch("/admin/organizations/{item_id}")
def update_organization(item_id: UUID, body: OrganizationWrite, db: Session = Depends(get_db)):
    item = _get(db, Organization, item_id)
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    return ok(organization_dict(item))


@router.delete("/admin/organizations/{item_id}")
def delete_organization(item_id: UUID, db: Session = Depends(get_db)):
    db.delete(_get(db, Organization, item_id))
    db.commit()
    return ok({"deleted": True})


@router.get("/admin/jobs")
def admin_jobs(db: Session = Depends(get_db)):
    rows = db.scalars(select(Job).order_by(Job.title)).all()
    return ok([job_dict(item, detailed=True) for item in rows])


@router.post("/admin/jobs", status_code=201)
def create_job(body: JobWrite, db: Session = Depends(get_db)):
    data = body.model_dump()
    data["slug"] = _slug(db, Job, data.get("slug"), data["title"])
    item = Job(**data)
    db.add(item)
    db.commit()
    db.refresh(item)
    return ok(job_dict(item, detailed=True))


@router.patch("/admin/jobs/{item_id}")
def update_job(item_id: UUID, body: JobWrite, db: Session = Depends(get_db)):
    item = _get(db, Job, item_id)
    data = body.model_dump(exclude_unset=True)
    if "slug" in data or "title" in data:
        data["slug"] = _slug(db, Job, data.get("slug", item.slug), data.get("title", item.title), item.id)
    for key, value in data.items():
        setattr(item, key, value)
    db.commit()
    return ok(job_dict(item, detailed=True))


@router.delete("/admin/jobs/{item_id}")
def delete_job(item_id: UUID, db: Session = Depends(get_db)):
    db.delete(_get(db, Job, item_id))
    db.commit()
    return ok({"deleted": True})


@router.get("/admin/applications")
def applications(db: Session = Depends(get_db)):
    rows = db.scalars(select(Application).options(selectinload(Application.job)).order_by(Application.created_at.desc())).all()
    return ok([application_dict(item) for item in rows])


@router.get("/admin/applications/{item_id}/cv")
def application_cv(item_id: UUID, db: Session = Depends(get_db)):
    item = _get(db, Application, item_id)
    if not item.cv_path:
        raise HTTPException(status_code=404, detail="No CV was attached")
    return FileResponse(_disk(item.cv_path), filename=Path(item.cv_path).name)


@router.get("/admin/inquiries")
def inquiries(db: Session = Depends(get_db)):
    rows = db.scalars(select(Inquiry).order_by(Inquiry.created_at.desc())).all()
    return ok([inquiry_dict(item) for item in rows])


@router.patch("/admin/inquiries/{item_id}")
def update_inquiry(item_id: UUID, body: InquiryStatus, db: Session = Depends(get_db)):
    if body.status not in {"new", "reviewed", "closed"}:
        raise HTTPException(status_code=422, detail="Status must be new, reviewed or closed")
    item = _get(db, Inquiry, item_id)
    item.status = body.status
    db.commit()
    return ok(inquiry_dict(item))


@router.get("/admin/inquiries/{item_id}/attachment")
def inquiry_attachment(item_id: UUID, db: Session = Depends(get_db)):
    item = _get(db, Inquiry, item_id)
    if not item.attachment_path:
        raise HTTPException(status_code=404, detail="No file was attached")
    return FileResponse(_disk(item.attachment_path), filename=Path(item.attachment_path).name)


@router.get("/admin/statistics")
def statistics(db: Session = Depends(get_db)):
    rows = db.scalars(select(Statistic).order_by(Statistic.sort_order)).all()
    return ok([statistic_dict(item) for item in rows])


@router.post("/admin/statistics", status_code=201)
def create_statistic(body: StatisticWrite, db: Session = Depends(get_db)):
    item = Statistic(**body.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return ok(statistic_dict(item))


@router.patch("/admin/statistics/{item_id}")
def update_statistic(item_id: UUID, body: StatisticWrite, db: Session = Depends(get_db)):
    item = _get(db, Statistic, item_id)
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    return ok(statistic_dict(item))


@router.delete("/admin/statistics/{item_id}")
def delete_statistic(item_id: UUID, db: Session = Depends(get_db)):
    db.delete(_get(db, Statistic, item_id))
    db.commit()
    return ok({"deleted": True})


@router.get("/admin/media")
def media(db: Session = Depends(get_db)):
    rows = db.scalars(select(MediaAsset).order_by(MediaAsset.created_at.desc())).all()
    return ok([{"id": item.id, "filename": item.filename, "url": item.url, "alt": item.alt, "mime_type": item.mime_type} for item in rows])


@router.post("/admin/media", status_code=201)
async def upload_media(
    file: UploadFile = File(...),
    alt: str = Form(""),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    del user
    url = await save_upload(file, "library")
    asset = MediaAsset(filename=file.filename or "upload", url=url or "", alt=alt.strip(), mime_type=file.content_type or "")
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return ok({"id": asset.id, "url": asset.url, "alt": asset.alt, "filename": asset.filename})
