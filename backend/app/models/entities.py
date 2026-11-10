import uuid

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from app.db.base import Base, TimestampMixin, new_uuid


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(160))
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(40), default="admin")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class CompanyProfile(Base, TimestampMixin):
    __tablename__ = "company_profiles"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    legal_name: Mapped[str] = mapped_column(String(160))
    summary: Mapped[str] = mapped_column(Text)
    about: Mapped[str] = mapped_column(Text)
    signage_since_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    country: Mapped[str] = mapped_column(String(80), default="Pakistan")
    head_office_address: Mapped[str] = mapped_column(Text)
    factory_address: Mapped[str] = mapped_column(Text)
    phone_primary: Mapped[str] = mapped_column(String(40))
    phone_mobile: Mapped[str] = mapped_column(String(40))
    phone_secondary: Mapped[str | None] = mapped_column(String(40), nullable=True)
    email_primary: Mapped[str] = mapped_column(String(255))
    email_careers: Mapped[str] = mapped_column(String(255))
    hours_weekday: Mapped[str] = mapped_column(String(160))
    hours_sunday: Mapped[str] = mapped_column(String(80))
    facebook_url: Mapped[str | None] = mapped_column(String(400), nullable=True)
    map_factory_lat: Mapped[str | None] = mapped_column(String(40), nullable=True)
    map_factory_lng: Mapped[str | None] = mapped_column(String(40), nullable=True)
    map_factory_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    seo_title: Mapped[str] = mapped_column(String(180))
    seo_description: Mapped[str] = mapped_column(Text)


class CompanyValue(Base, TimestampMixin):
    __tablename__ = "company_values"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    title: Mapped[str] = mapped_column(String(120))
    description: Mapped[str] = mapped_column(Text)
    icon_key: Mapped[str] = mapped_column(String(40), default="shield")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)


class Division(Base, TimestampMixin):
    __tablename__ = "divisions"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(160))
    summary: Mapped[str] = mapped_column(Text)
    body: Mapped[str] = mapped_column(Text, default="")
    hero_image: Mapped[str | None] = mapped_column(String(400), nullable=True)
    hero_caption: Mapped[str | None] = mapped_column(Text, nullable=True)
    hero_is_company_photo: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    show_in_navigation: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    seo_title: Mapped[str | None] = mapped_column(String(180), nullable=True)
    seo_description: Mapped[str | None] = mapped_column(Text, nullable=True)

    offerings: Mapped[list["DivisionOffering"]] = relationship(
        back_populates="division", cascade="all, delete-orphan", order_by="DivisionOffering.sort_order"
    )


class DivisionOffering(Base):
    __tablename__ = "division_offerings"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    division_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("divisions.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(180))
    description: Mapped[str] = mapped_column(Text, default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    division: Mapped[Division] = relationship(back_populates="offerings")


class Highlight(Base):
    __tablename__ = "highlights"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    group_key: Mapped[str] = mapped_column(String(40), index=True)
    title: Mapped[str] = mapped_column(String(180))
    summary: Mapped[str] = mapped_column(Text)
    href: Mapped[str | None] = mapped_column(String(240), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Industry(Base, TimestampMixin):
    __tablename__ = "industries"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(160))
    summary: Mapped[str] = mapped_column(Text)
    body: Mapped[str] = mapped_column(Text, default="")
    image: Mapped[str | None] = mapped_column(String(400), nullable=True)
    image_caption: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_is_company_photo: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    seo_title: Mapped[str | None] = mapped_column(String(180), nullable=True)
    seo_description: Mapped[str | None] = mapped_column(Text, nullable=True)


project_products = Table(
    "project_products",
    Base.metadata,
    Column("project_id", Uuid(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
    Column("product_id", Uuid(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), primary_key=True),
)


class ProductCategory(Base, TimestampMixin):
    __tablename__ = "product_categories"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(160))
    description: Mapped[str] = mapped_column(Text, default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    products: Mapped[list["Product"]] = relationship(back_populates="category")


class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    slug: Mapped[str] = mapped_column(String(180), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(180))
    summary: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text, default="")
    category_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("product_categories.id"), index=True)
    division_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("divisions.id"), nullable=True, index=True)
    hero_image: Mapped[str | None] = mapped_column(String(400), nullable=True)
    hero_caption: Mapped[str | None] = mapped_column(Text, nullable=True)
    hero_is_company_photo: Mapped[bool] = mapped_column(Boolean, default=False)
    verification_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    seo_title: Mapped[str | None] = mapped_column(String(180), nullable=True)
    seo_description: Mapped[str | None] = mapped_column(Text, nullable=True)

    category: Mapped[ProductCategory] = relationship(back_populates="products")
    division: Mapped[Division | None] = relationship()
    specs: Mapped[list["ProductSpec"]] = relationship(
        back_populates="product", cascade="all, delete-orphan", order_by="ProductSpec.sort_order"
    )
    documents: Mapped[list["ProductDocument"]] = relationship(
        back_populates="product", cascade="all, delete-orphan", order_by="ProductDocument.sort_order"
    )
    projects: Mapped[list["Project"]] = relationship(secondary=project_products, back_populates="products")


class ProductSpec(Base):
    __tablename__ = "product_specs"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    product_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), index=True)
    label: Mapped[str] = mapped_column(String(120))
    value: Mapped[str] = mapped_column(String(240))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    product: Mapped[Product] = relationship(back_populates="specs")


class ProductDocument(Base):
    __tablename__ = "product_documents"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    product_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(180))
    file_url: Mapped[str] = mapped_column(String(400))
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    product: Mapped[Product] = relationship(back_populates="documents")


class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    slug: Mapped[str] = mapped_column(String(180), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    summary: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text, default="")
    division_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("divisions.id"), nullable=True, index=True)
    client_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    location: Mapped[str | None] = mapped_column(String(240), nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    seo_title: Mapped[str | None] = mapped_column(String(180), nullable=True)
    seo_description: Mapped[str | None] = mapped_column(Text, nullable=True)

    division: Mapped[Division | None] = relationship()
    images: Mapped[list["ProjectImage"]] = relationship(
        back_populates="project", cascade="all, delete-orphan", order_by="ProjectImage.sort_order"
    )
    products: Mapped[list[Product]] = relationship(secondary=project_products, back_populates="projects")


class ProjectImage(Base):
    __tablename__ = "project_images"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    project_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("projects.id", ondelete="CASCADE"), index=True)
    url: Mapped[str] = mapped_column(String(400))
    alt: Mapped[str] = mapped_column(String(240))
    is_company_photo: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    project: Mapped[Project] = relationship(back_populates="images")


class Organization(Base, TimestampMixin):
    __tablename__ = "organizations"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(200))
    kind: Mapped[str] = mapped_column(String(40), index=True)
    logo_url: Mapped[str | None] = mapped_column(String(400), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Resource(Base, TimestampMixin):
    __tablename__ = "resources"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    slug: Mapped[str] = mapped_column(String(180), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    summary: Mapped[str] = mapped_column(Text, default="")
    body: Mapped[str] = mapped_column(Text, default="")
    category: Mapped[str] = mapped_column(String(80), index=True)
    file_url: Mapped[str | None] = mapped_column(String(400), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    seo_title: Mapped[str | None] = mapped_column(String(180), nullable=True)
    seo_description: Mapped[str | None] = mapped_column(Text, nullable=True)


class Job(Base, TimestampMixin):
    __tablename__ = "jobs"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    slug: Mapped[str] = mapped_column(String(180), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(180))
    department: Mapped[str] = mapped_column(String(120), default="")
    location: Mapped[str] = mapped_column(String(160), default="Lahore, Pakistan")
    description: Mapped[str] = mapped_column(Text, default="")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    seo_title: Mapped[str | None] = mapped_column(String(180), nullable=True)
    seo_description: Mapped[str | None] = mapped_column(Text, nullable=True)

    applications: Mapped[list["Application"]] = relationship(back_populates="job")


class Application(Base, TimestampMixin):
    __tablename__ = "applications"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    job_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("jobs.id"), nullable=True)
    full_name: Mapped[str] = mapped_column(String(160))
    email: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(40))
    message: Mapped[str] = mapped_column(Text, default="")
    cv_path: Mapped[str | None] = mapped_column(String(400), nullable=True)
    status: Mapped[str] = mapped_column(String(40), default="received")

    job: Mapped[Job | None] = relationship(back_populates="applications")


class Inquiry(Base, TimestampMixin):
    __tablename__ = "inquiries"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    full_name: Mapped[str] = mapped_column(String(160))
    company: Mapped[str] = mapped_column(String(180), default="")
    email: Mapped[str] = mapped_column(String(255), index=True)
    phone: Mapped[str] = mapped_column(String(40))
    country: Mapped[str] = mapped_column(String(80))
    category: Mapped[str] = mapped_column(String(80), index=True)
    subject: Mapped[str] = mapped_column(String(200))
    message: Mapped[str] = mapped_column(Text)
    attachment_path: Mapped[str | None] = mapped_column(String(400), nullable=True)
    status: Mapped[str] = mapped_column(String(40), default="new", index=True)


class MediaAsset(Base, TimestampMixin):
    __tablename__ = "media_assets"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    filename: Mapped[str] = mapped_column(String(240))
    url: Mapped[str] = mapped_column(String(400))
    alt: Mapped[str] = mapped_column(String(240), default="")
    mime_type: Mapped[str] = mapped_column(String(80), default="")


class Statistic(Base, TimestampMixin):
    __tablename__ = "statistics"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=new_uuid)
    label: Mapped[str] = mapped_column(String(180))
    value: Mapped[str] = mapped_column(String(80))
    source_note: Mapped[str] = mapped_column(Text, default="")
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)


class SiteSetting(Base):
    __tablename__ = "site_settings"

    key: Mapped[str] = mapped_column(String(80), primary_key=True)
    value: Mapped[str] = mapped_column(Text, default="")
