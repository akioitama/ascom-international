import re
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".doc", ".docx"}
CV_EXTENSIONS = {".pdf", ".doc", ".docx"}


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "item"


def like_pattern(value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    return f"%{escaped}%"


def ensure_upload_dir(*parts: str) -> Path:
    path = Path(settings.upload_dir).joinpath(*parts)
    path.mkdir(parents=True, exist_ok=True)
    return path


async def save_upload(upload: UploadFile | None, folder: str, allowed: set[str] | None = None) -> str | None:
    if upload is None or not upload.filename:
        return None
    extension = Path(upload.filename).suffix.lower()
    permitted = allowed or ALLOWED_EXTENSIONS
    if extension not in permitted:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File type is not allowed")
    data = await upload.read()
    max_bytes = settings.max_upload_mb * 1024 * 1024
    if len(data) > max_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File exceeds the size limit")
    name = f"{uuid.uuid4().hex}{extension}"
    destination = ensure_upload_dir(folder) / name
    destination.write_bytes(data)
    return f"/uploads/{folder}/{name}"
