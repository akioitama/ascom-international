"""Initial schema.

Revision ID: 001_initial
Revises:
Create Date: 2026-11-09
"""

from pathlib import Path

from alembic import op

revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    sql = Path(__file__).with_name("ddl.sql").read_text(encoding="utf-8")
    for statement in sql.split(";"):
        cleaned = statement.strip()
        if cleaned:
            op.execute(cleaned)


def downgrade() -> None:
    tables = [
        "project_products",
        "project_images",
        "product_documents",
        "product_specs",
        "products",
        "projects",
        "division_offerings",
        "applications",
        "jobs",
        "inquiries",
        "media_assets",
        "statistics",
        "site_settings",
        "resources",
        "organizations",
        "industries",
        "highlights",
        "divisions",
        "product_categories",
        "company_values",
        "company_profiles",
        "users",
    ]
    for table in tables:
        op.execute(f"DROP TABLE IF EXISTS {table} CASCADE")
