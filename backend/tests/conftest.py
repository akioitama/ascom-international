import os

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///./test_ascom.db"
os.environ["SECRET_KEY"] = "test-secret-key-value"
os.environ["ADMIN_EMAIL"] = "admin@ascomintl.com"
os.environ["ADMIN_PASSWORD"] = "test-password-123"
os.environ["ADMIN_NAME"] = "Test Admin"
os.environ["SEED_ON_STARTUP"] = "true"
os.environ["ENVIRONMENT"] = "test"
os.environ["UPLOAD_DIR"] = "test_uploads"

import pytest
from fastapi.testclient import TestClient

from app.db.base import Base
from app.db.session import engine
from app.main import app


@pytest.fixture()
def client():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as test_client:
        yield test_client
    Base.metadata.drop_all(bind=engine)
