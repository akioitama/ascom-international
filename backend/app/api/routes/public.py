from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models import (
    CompanyProfile,
    CompanyValue,
    Division,
    Highlight,
    Industry,
    Job,
    Organization,
    Product,
    ProductCategory,
    Project,
    Resource,
    SiteSetting,
    Statistic,
)
from app.services.present import (
    category_dict,
    company_dict,
    division_dict,
    highlight_dict,
    industry_dict,
    job_dict,
    organization_dict,
    product_dict,
    project_dict,
    resource_dict,
    statistic_dict,
    value_dict,
)
from app.utils.files import like_pattern
from app.utils.pagination import paginate

router = APIRouter()


def ok(data, meta=None):
    payload = {"data": data}
    if meta is not None:
        payload["meta"] = meta
    return payload


def _company(db: Session) -> CompanyProfile:
    company = db.scalar(select(CompanyProfile))
    if company is None:
        raise HTTPException(status_code=404, detail="Company profile has not been published")
    return company


@router.get("/health")
def health():
    return ok({"status": "ok"})


@router.get("/company")
def company(db: Session = Depends(get_db)):
    profile = _company(db)
    values = db.scalars(select(CompanyValue).order_by(CompanyValue.sort_order)).all()
    stats = db.scalars(
        select(Statistic).where(Statistic.is_public.is_(True), Statistic.is_verified.is_(True)).order_by(Statistic.sort_order)
    ).all()
    settings = {row.key: row.value for row in db.scalars(select(SiteSetting)).all()}
    return ok({"profile": company_dict(profile), "values": [value_dict(item) for item in values], "statistics": [statistic_dict(item) for item in stats], "settings": settings})


@router.get("/home")
def home(db: Session = Depends(get_db)):
    profile = _company(db)
    divisions = db.scalars(
        select(Division).where(Division.is_active.is_(True)).order_by(Division.sort_order)
    ).all()
    projects = db.scalars(
        select(Project)
        .where(Project.is_active.is_(True), Project.is_featured.is_(True))
        .options(selectinload(Project.images), selectinload(Project.division))
        .order_by(Project.sort_order)
    ).all()
    industries = db.scalars(select(Industry).where(Industry.is_active.is_(True)).order_by(Industry.sort_order)).all()
    organizations = db.scalars(select(Organization).where(Organization.is_active.is_(True)).order_by(Organization.sort_order)).all()
    highlights = db.scalars(select(Highlight).where(Highlight.is_active.is_(True)).order_by(Highlight.sort_order)).all()
    values = db.scalars(select(CompanyValue).order_by(CompanyValue.sort_order)).all()
    stats = db.scalars(
        select(Statistic).where(Statistic.is_public.is_(True), Statistic.is_verified.is_(True)).order_by(Statistic.sort_order)
    ).all()
    settings = {row.key: row.value for row in db.scalars(select(SiteSetting)).all()}
    return ok(
        {
            "profile": company_dict(profile),
            "settings": settings,
            "values": [value_dict(item) for item in values],
            "divisions": [division_dict(item) for item in divisions],
            "highlights": [highlight_dict(item) for item in highlights],
            "projects": [project_dict(item) for item in projects],
            "industries": [industry_dict(item) for item in industries],
            "organizations": [organization_dict(item) for item in organizations],
            "statistics": [statistic_dict(item) for item in stats],
        }
    )


@router.get("/divisions")
def divisions(db: Session = Depends(get_db)):
    rows = db.scalars(select(Division).where(Division.is_active.is_(True)).order_by(Division.sort_order)).all()
    return ok([division_dict(item) for item in rows])


@router.get("/divisions/{slug}")
def division_detail(slug: str, db: Session = Depends(get_db)):
    item = db.scalar(
        select(Division)
        .where(Division.slug == slug, Division.is_active.is_(True))
        .options(selectinload(Division.offerings))
    )
    if item is None:
        raise HTTPException(status_code=404, detail="Division not found")
    projects = db.scalars(
        select(Project)
        .where(Project.division_id == item.id, Project.is_active.is_(True))
        .options(selectinload(Project.images), selectinload(Project.division))
        .order_by(Project.sort_order)
    ).all()
    payload = division_dict(item, detailed=True)
    payload["projects"] = [project_dict(project) for project in projects]
    return ok(payload)


@router.get("/product-categories")
def categories(db: Session = Depends(get_db)):
    rows = db.scalars(select(ProductCategory).where(ProductCategory.is_active.is_(True)).order_by(ProductCategory.sort_order)).all()
    return ok([category_dict(item) for item in rows])


@router.get("/products")
def products(
    q: str | None = None,
    category: str | None = None,
    division: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    sort: str = Query("featured"),
    db: Session = Depends(get_db),
):
    query = (
        select(Product)
        .where(Product.is_active.is_(True))
        .options(selectinload(Product.category), selectinload(Product.division))
    )
    if q:
        pattern = like_pattern(q.strip())
        query = query.where(or_(Product.name.ilike(pattern), Product.summary.ilike(pattern)))
    if category:
        query = query.join(Product.category).where(ProductCategory.slug == category)
    if division:
        query = query.join(Product.division).where(Division.slug == division)
    if sort == "name":
        query = query.order_by(Product.name)
    elif sort == "newest":
        query = query.order_by(Product.created_at.desc())
    else:
        query = query.order_by(Product.is_featured.desc(), Product.sort_order)
    rows, meta = paginate(db.scalars(query).unique().all(), page, page_size)
    return ok([product_dict(item) for item in rows], meta)


@router.get("/products/{slug}")
def product_detail(slug: str, db: Session = Depends(get_db)):
    item = db.scalar(
        select(Product)
        .where(Product.slug == slug, Product.is_active.is_(True))
        .options(
            selectinload(Product.category),
            selectinload(Product.division),
            selectinload(Product.specs),
            selectinload(Product.documents),
            selectinload(Product.projects).selectinload(Project.images),
        )
    )
    if item is None:
        raise HTTPException(status_code=404, detail="Product not found")
    related = db.scalars(
        select(Product)
        .where(Product.category_id == item.category_id, Product.id != item.id, Product.is_active.is_(True))
        .options(selectinload(Product.category), selectinload(Product.division))
        .order_by(Product.sort_order)
        .limit(4)
    ).all()
    payload = product_dict(item, detailed=True)
    payload["projects"] = [project_dict(project) for project in item.projects if project.is_active]
    payload["related_products"] = [product_dict(product) for product in related]
    return ok(payload)


@router.get("/projects")
def projects(
    q: str | None = None,
    division: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = (
        select(Project)
        .where(Project.is_active.is_(True))
        .options(selectinload(Project.images), selectinload(Project.division))
        .order_by(Project.sort_order)
    )
    if q:
        pattern = like_pattern(q.strip())
        query = query.where(or_(Project.title.ilike(pattern), Project.summary.ilike(pattern)))
    if division:
        query = query.join(Project.division).where(Division.slug == division)
    rows, meta = paginate(db.scalars(query).unique().all(), page, page_size)
    return ok([project_dict(item) for item in rows], meta)


@router.get("/projects/{slug}")
def project_detail(slug: str, db: Session = Depends(get_db)):
    item = db.scalar(
        select(Project)
        .where(Project.slug == slug, Project.is_active.is_(True))
        .options(
            selectinload(Project.images),
            selectinload(Project.division),
            selectinload(Project.products).selectinload(Product.category),
        )
    )
    if item is None:
        raise HTTPException(status_code=404, detail="Project not found")
    payload = project_dict(item, detailed=True)
    payload["products"] = [product_dict(product) for product in item.products if product.is_active]
    return ok(payload)


@router.get("/industries")
def industries(db: Session = Depends(get_db)):
    rows = db.scalars(select(Industry).where(Industry.is_active.is_(True)).order_by(Industry.sort_order)).all()
    return ok([industry_dict(item) for item in rows])


@router.get("/industries/{slug}")
def industry_detail(slug: str, db: Session = Depends(get_db)):
    item = db.scalar(select(Industry).where(Industry.slug == slug, Industry.is_active.is_(True)))
    if item is None:
        raise HTTPException(status_code=404, detail="Industry not found")
    return ok(industry_dict(item, detailed=True))


@router.get("/resources")
def resources(category: str | None = None, db: Session = Depends(get_db)):
    query = select(Resource).where(Resource.is_active.is_(True)).order_by(Resource.sort_order)
    if category:
        query = query.where(Resource.category == category)
    rows = db.scalars(query).all()
    return ok([resource_dict(item) for item in rows])


@router.get("/resources/{slug}")
def resource_detail(slug: str, db: Session = Depends(get_db)):
    item = db.scalar(select(Resource).where(Resource.slug == slug, Resource.is_active.is_(True)))
    if item is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    return ok(resource_dict(item, detailed=True))


@router.get("/careers")
def careers(db: Session = Depends(get_db)):
    rows = db.scalars(select(Job).where(Job.is_active.is_(True)).order_by(Job.title)).all()
    return ok([job_dict(item) for item in rows])


@router.get("/careers/{slug}")
def career_detail(slug: str, db: Session = Depends(get_db)):
    item = db.scalar(select(Job).where(Job.slug == slug, Job.is_active.is_(True)))
    if item is None:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    return ok(job_dict(item, detailed=True))


@router.get("/organizations")
def organizations(kind: str | None = None, db: Session = Depends(get_db)):
    query = select(Organization).where(Organization.is_active.is_(True)).order_by(Organization.sort_order)
    if kind:
        query = query.where(Organization.kind == kind)
    rows = db.scalars(query).all()
    return ok([organization_dict(item) for item in rows])
