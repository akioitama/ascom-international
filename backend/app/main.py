import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import IntegrityError

from app.api.routes import admin, auth, contact, public
from app.core.config import settings
from app.core.logging import configure_logging
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.services.seed import seed

logger = logging.getLogger("ascom")


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    if settings.environment == "production" and settings.secret_key.startswith("dev-only"):
        raise RuntimeError("Set SECRET_KEY before running in production")
    Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
    if settings.database_url.startswith("sqlite"):
        Base.metadata.create_all(engine)
    if settings.seed_on_startup:
        db = SessionLocal()
        try:
            seed(db)
        finally:
            db.close()
    yield


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    try:
        response = await call_next(request)
    except Exception:
        logger.exception("Unhandled error on %s %s", request.method, request.url.path)
        raise
    logger.info("%s %s %s", request.method, request.url.path, response.status_code)
    return response


def error_body(code: str, message: str, details=None, status_code: int = 400):
    return JSONResponse(status_code=status_code, content={"error": {"code": code, "message": message, "details": details or []}})


@app.exception_handler(HTTPException)
async def http_error(_request: Request, exc: HTTPException):
    message = exc.detail if isinstance(exc.detail, str) else "Request failed"
    details = exc.detail if isinstance(exc.detail, list) else []
    return error_body("http_error", message, details, exc.status_code)


@app.exception_handler(RequestValidationError)
async def validation_error(_request: Request, exc: RequestValidationError):
    return error_body("validation_error", "Check the submitted fields", exc.errors(), 422)


@app.exception_handler(IntegrityError)
async def integrity_error(_request: Request, _exc: IntegrityError):
    return error_body("conflict", "That record conflicts with existing data", status_code=409)


Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
app.include_router(public.router, prefix="/api/v1")
app.include_router(contact.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")
