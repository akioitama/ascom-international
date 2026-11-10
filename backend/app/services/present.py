def company_dict(company) -> dict:
    return {
        "id": company.id,
        "legal_name": company.legal_name,
        "summary": company.summary,
        "about": company.about,
        "signage_since_year": company.signage_since_year,
        "country": company.country,
        "head_office_address": company.head_office_address,
        "factory_address": company.factory_address,
        "phone_primary": company.phone_primary,
        "phone_mobile": company.phone_mobile,
        "phone_secondary": company.phone_secondary,
        "email_primary": company.email_primary,
        "email_careers": company.email_careers,
        "hours_weekday": company.hours_weekday,
        "hours_sunday": company.hours_sunday,
        "facebook_url": company.facebook_url,
        "map_factory_lat": company.map_factory_lat,
        "map_factory_lng": company.map_factory_lng,
        "map_factory_note": company.map_factory_note,
        "seo_title": company.seo_title,
        "seo_description": company.seo_description,
    }


def value_dict(item) -> dict:
    return {
        "id": item.id,
        "title": item.title,
        "description": item.description,
        "icon_key": item.icon_key,
        "sort_order": item.sort_order,
    }


def offering_dict(item) -> dict:
    return {"id": item.id, "title": item.title, "description": item.description, "sort_order": item.sort_order}


def division_dict(item, detailed: bool = False) -> dict:
    payload = {
        "id": item.id,
        "slug": item.slug,
        "name": item.name,
        "summary": item.summary,
        "hero_image": item.hero_image,
        "hero_caption": item.hero_caption,
        "hero_is_company_photo": item.hero_is_company_photo,
        "is_active": item.is_active,
        "show_in_navigation": item.show_in_navigation,
        "sort_order": item.sort_order,
        "seo_title": item.seo_title,
        "seo_description": item.seo_description,
    }
    if detailed:
        payload["body"] = item.body
        payload["offerings"] = [offering_dict(offering) for offering in item.offerings]
    return payload


def category_dict(item) -> dict:
    return {
        "id": item.id,
        "slug": item.slug,
        "name": item.name,
        "description": item.description,
        "sort_order": item.sort_order,
        "is_active": item.is_active,
    }


def spec_dict(item) -> dict:
    return {"id": item.id, "label": item.label, "value": item.value, "sort_order": item.sort_order}


def document_dict(item) -> dict:
    return {"id": item.id, "title": item.title, "file_url": item.file_url, "sort_order": item.sort_order}


def product_dict(item, detailed: bool = False) -> dict:
    payload = {
        "id": item.id,
        "slug": item.slug,
        "name": item.name,
        "summary": item.summary,
        "hero_image": item.hero_image,
        "hero_caption": item.hero_caption,
        "hero_is_company_photo": item.hero_is_company_photo,
        "verification_note": item.verification_note,
        "is_active": item.is_active,
        "is_featured": item.is_featured,
        "sort_order": item.sort_order,
        "seo_title": item.seo_title,
        "seo_description": item.seo_description,
        "category": category_dict(item.category) if item.category else None,
        "division": {"id": item.division.id, "slug": item.division.slug, "name": item.division.name} if item.division else None,
    }
    if detailed:
        payload["description"] = item.description
        payload["category_id"] = item.category_id
        payload["division_id"] = item.division_id
        payload["specs"] = [spec_dict(spec) for spec in item.specs]
        payload["documents"] = [document_dict(document) for document in item.documents]
    return payload


def image_dict(item) -> dict:
    return {
        "id": item.id,
        "url": item.url,
        "alt": item.alt,
        "is_company_photo": item.is_company_photo,
        "sort_order": item.sort_order,
    }


def project_dict(item, detailed: bool = False) -> dict:
    cover = item.images[0].url if item.images else None
    payload = {
        "id": item.id,
        "slug": item.slug,
        "title": item.title,
        "summary": item.summary,
        "client_name": item.client_name,
        "location": item.location,
        "cover_image": cover,
        "is_featured": item.is_featured,
        "is_active": item.is_active,
        "sort_order": item.sort_order,
        "seo_title": item.seo_title,
        "seo_description": item.seo_description,
        "division": {"id": item.division.id, "slug": item.division.slug, "name": item.division.name} if item.division else None,
    }
    if detailed:
        payload["description"] = item.description
        payload["division_id"] = item.division_id
        payload["images"] = [image_dict(image) for image in item.images]
        payload["products"] = [{"id": product.id, "slug": product.slug, "name": product.name} for product in item.products]
    return payload


def industry_dict(item, detailed: bool = False) -> dict:
    payload = {
        "id": item.id,
        "slug": item.slug,
        "name": item.name,
        "summary": item.summary,
        "image": item.image,
        "image_caption": item.image_caption,
        "image_is_company_photo": item.image_is_company_photo,
        "is_active": item.is_active,
        "sort_order": item.sort_order,
        "seo_title": item.seo_title,
        "seo_description": item.seo_description,
    }
    if detailed:
        payload["body"] = item.body
    return payload


def organization_dict(item) -> dict:
    return {
        "id": item.id,
        "name": item.name,
        "kind": item.kind,
        "logo_url": item.logo_url,
        "notes": item.notes,
        "sort_order": item.sort_order,
        "is_active": item.is_active,
    }


def resource_dict(item, detailed: bool = False) -> dict:
    payload = {
        "id": item.id,
        "slug": item.slug,
        "title": item.title,
        "summary": item.summary,
        "category": item.category,
        "file_url": item.file_url,
        "is_active": item.is_active,
        "sort_order": item.sort_order,
        "seo_title": item.seo_title,
        "seo_description": item.seo_description,
    }
    if detailed:
        payload["body"] = item.body
    return payload


def job_dict(item, detailed: bool = False) -> dict:
    payload = {
        "id": item.id,
        "slug": item.slug,
        "title": item.title,
        "department": item.department,
        "location": item.location,
        "is_active": item.is_active,
        "seo_title": item.seo_title,
        "seo_description": item.seo_description,
    }
    if detailed:
        payload["description"] = item.description
    return payload


def statistic_dict(item) -> dict:
    return {
        "id": item.id,
        "label": item.label,
        "value": item.value,
        "source_note": item.source_note,
        "is_verified": item.is_verified,
        "is_public": item.is_public,
        "sort_order": item.sort_order,
    }


def highlight_dict(item) -> dict:
    return {
        "id": item.id,
        "group_key": item.group_key,
        "title": item.title,
        "summary": item.summary,
        "href": item.href,
        "sort_order": item.sort_order,
    }


def inquiry_dict(item) -> dict:
    return {
        "id": item.id,
        "full_name": item.full_name,
        "company": item.company,
        "email": item.email,
        "phone": item.phone,
        "country": item.country,
        "category": item.category,
        "subject": item.subject,
        "message": item.message,
        "attachment_path": item.attachment_path,
        "status": item.status,
        "created_at": item.created_at,
    }


def application_dict(item) -> dict:
    return {
        "id": item.id,
        "job_id": item.job_id,
        "job_title": item.job.title if item.job else None,
        "full_name": item.full_name,
        "email": item.email,
        "phone": item.phone,
        "message": item.message,
        "cv_path": item.cv_path,
        "status": item.status,
        "created_at": item.created_at,
    }


def user_dict(item) -> dict:
    return {"id": item.id, "email": item.email, "full_name": item.full_name, "role": item.role}
