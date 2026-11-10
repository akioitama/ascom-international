from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=200)


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=200)


class OfferingIn(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    description: str = ""
    sort_order: int = 0


class SpecIn(BaseModel):
    label: str = Field(min_length=1, max_length=120)
    value: str = Field(min_length=1, max_length=240)
    sort_order: int = 0


class DocumentIn(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    file_url: str = Field(min_length=1, max_length=400)
    sort_order: int = 0


class ImageIn(BaseModel):
    url: str = Field(min_length=1, max_length=400)
    alt: str = Field(min_length=1, max_length=240)
    is_company_photo: bool = True
    sort_order: int = 0


class CompanyUpdate(BaseModel):
    legal_name: str | None = None
    summary: str | None = None
    about: str | None = None
    signage_since_year: int | None = None
    country: str | None = None
    head_office_address: str | None = None
    factory_address: str | None = None
    phone_primary: str | None = None
    phone_mobile: str | None = None
    phone_secondary: str | None = None
    email_primary: str | None = None
    email_careers: str | None = None
    hours_weekday: str | None = None
    hours_sunday: str | None = None
    facebook_url: str | None = None
    map_factory_lat: str | None = None
    map_factory_lng: str | None = None
    map_factory_note: str | None = None
    seo_title: str | None = None
    seo_description: str | None = None


class ValueIn(BaseModel):
    title: str
    description: str
    icon_key: str = "shield"
    sort_order: int = 0


class ValueList(BaseModel):
    values: list[ValueIn]


class SettingsUpdate(BaseModel):
    settings: dict[str, str]


class DivisionWrite(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    slug: str | None = None
    summary: str
    body: str = ""
    hero_image: str | None = None
    hero_caption: str | None = None
    hero_is_company_photo: bool = False
    is_active: bool = True
    show_in_navigation: bool = True
    sort_order: int = 0
    seo_title: str | None = None
    seo_description: str | None = None
    offerings: list[OfferingIn] | None = None


class CategoryWrite(BaseModel):
    name: str
    slug: str | None = None
    description: str = ""
    sort_order: int = 0
    is_active: bool = True


class ProductWrite(BaseModel):
    name: str
    slug: str | None = None
    summary: str
    description: str = ""
    category_id: UUID
    division_id: UUID | None = None
    hero_image: str | None = None
    hero_caption: str | None = None
    hero_is_company_photo: bool = False
    verification_note: str | None = None
    is_active: bool = True
    is_featured: bool = False
    sort_order: int = 0
    seo_title: str | None = None
    seo_description: str | None = None
    specs: list[SpecIn] | None = None
    documents: list[DocumentIn] | None = None
    project_ids: list[UUID] | None = None


class ProjectWrite(BaseModel):
    title: str
    slug: str | None = None
    summary: str
    description: str = ""
    division_id: UUID | None = None
    client_name: str | None = None
    location: str | None = None
    is_featured: bool = False
    is_active: bool = True
    sort_order: int = 0
    seo_title: str | None = None
    seo_description: str | None = None
    images: list[ImageIn] | None = None
    product_ids: list[UUID] | None = None


class IndustryWrite(BaseModel):
    name: str
    slug: str | None = None
    summary: str
    body: str = ""
    image: str | None = None
    image_caption: str | None = None
    image_is_company_photo: bool = False
    is_active: bool = True
    sort_order: int = 0
    seo_title: str | None = None
    seo_description: str | None = None


class ResourceWrite(BaseModel):
    title: str
    slug: str | None = None
    summary: str = ""
    body: str = ""
    category: str
    file_url: str | None = None
    is_active: bool = True
    sort_order: int = 0
    seo_title: str | None = None
    seo_description: str | None = None


class OrganizationWrite(BaseModel):
    name: str
    kind: str = "client"
    logo_url: str | None = None
    notes: str | None = None
    sort_order: int = 0
    is_active: bool = True


class JobWrite(BaseModel):
    title: str
    slug: str | None = None
    department: str = ""
    location: str = "Lahore, Pakistan"
    description: str = ""
    is_active: bool = True
    seo_title: str | None = None
    seo_description: str | None = None


class StatisticWrite(BaseModel):
    label: str
    value: str
    source_note: str = ""
    is_verified: bool = False
    is_public: bool = False
    sort_order: int = 0


class InquiryStatus(BaseModel):
    status: str
