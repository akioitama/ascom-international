"""Write the public site content into frontend/content/site.json. No database."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT / "backend"))

from app.content.galleries import GALLERIES  # noqa: E402
from app.services.seed import (  # noqa: E402
    CATEGORY_ROWS,
    DIVISION_ROWS,
    HIGHLIGHT_ROWS,
    INDUSTRY_ROWS,
    ORGANIZATION_ROWS,
    PRODUCT_ROWS,
    PROJECT_ROWS,
)

POLICY = (ROOT / "backend" / "app" / "content" / "code_of_conduct.txt").read_text(encoding="utf-8")


def main() -> None:
    divisions = []
    for row in DIVISION_ROWS:
        offerings = [
            {"id": f"{row['slug']}-offer-{index}", "title": title, "description": description}
            for index, (title, description) in enumerate(row["offerings"], start=1)
        ]
        divisions.append({**{key: value for key, value in row.items() if key != "offerings"}, "id": row["slug"], "offerings": offerings})

    categories = [{"id": row["slug"], **row} for row in CATEGORY_ROWS]
    category_by_slug = {row["slug"]: row for row in categories}
    division_by_slug = {row["slug"]: row for row in divisions}

    projects = []
    for row in PROJECT_ROWS:
        images = [
            {
                "id": f"{row['slug']}-{index}",
                "url": f"/media/projects/{row['slug']}/{index:02d}.jpg",
                "alt": alt,
                "is_company_photo": True,
            }
            for index, (_url, alt) in enumerate(GALLERIES[row["slug"]], start=1)
        ]
        division = division_by_slug[row["division"]]
        projects.append(
            {
                "id": row["slug"],
                "slug": row["slug"],
                "title": row["title"],
                "summary": row["summary"],
                "description": row["description"],
                "client_name": row["client_name"],
                "location": row["location"],
                "cover_image": images[0]["url"] if images else None,
                "is_featured": row["is_featured"],
                "is_active": True,
                "sort_order": row["sort_order"],
                "seo_title": row["seo_title"],
                "seo_description": row["seo_description"],
                "division_slug": row["division"],
                "division": {"id": division["slug"], "slug": division["slug"], "name": division["name"]},
                "images": images,
            }
        )

    products = []
    for row in PRODUCT_ROWS:
        category = category_by_slug[row["category"]]
        division = division_by_slug[row["division"]]
        products.append(
            {
                "id": row["slug"],
                "slug": row["slug"],
                "name": row["name"],
                "summary": row["summary"],
                "description": row["description"],
                "hero_image": row["hero_image"],
                "hero_caption": row["hero_caption"],
                "hero_is_company_photo": row["hero_is_company_photo"],
                "verification_note": row["verification_note"],
                "is_featured": row["is_featured"],
                "is_active": True,
                "sort_order": row["sort_order"],
                "seo_title": row["seo_title"],
                "seo_description": row["seo_description"],
                "category_slug": row["category"],
                "division_slug": row["division"],
                "project_slugs": row["projects"],
                "category": {"id": category["slug"], "slug": category["slug"], "name": category["name"], "description": category["description"]},
                "division": {"id": division["slug"], "slug": division["slug"], "name": division["name"]},
                "specs": [
                    {"id": f"{row['slug']}-spec-{index}", "label": label, "value": value}
                    for index, (label, value) in enumerate(row["specs"], start=1)
                ],
                "documents": [],
            }
        )

    payload = {
        "profile": {
            "id": "ascom",
            "legal_name": "ASCOM International",
            "summary": "ASCOM International is a Lahore company known for signage and visual branding since 2018, with manufacturing, specialised vehicles, road safety and construction alongside that work.",
            "about": (
                "ASCOM International is headquartered in Lahore, Pakistan. Since 2018 it has worked in signage media, "
                "making customised visual communication, vehicle branding and brand visibility.\n\n"
                "Manufacturing at Sundar Industrial Estate, specialised vehicles, road safety and construction sit with that creative work. "
                "Construction is one published division, not the whole of the company.\n\n"
                "The previous website describes the company as a multinational group with a presence in more than one "
                "geography. No overseas office is listed, so this site does not repeat that claim."
            ),
            "signage_since_year": 2018,
            "country": "Pakistan",
            "head_office_address": "333 Block B, Iqbal Avenue II, Khayab-e-Jinnah Road, Lahore, Pakistan.",
            "factory_address": "Plot No. 742–743, Sundar Industrial Estate, Wara Siddhu, Lahore, Punjab, Pakistan.",
            "phone_primary": "+92 423 518 9595",
            "phone_mobile": "+92 323 899 4888",
            "phone_secondary": "+92-42-35189034",
            "email_primary": "info@ascomintl.com",
            "email_careers": "hr@ascomintl.com",
            "hours_weekday": "Monday to Saturday, 09:00 AM to 05:00 PM",
            "hours_sunday": "Sunday: closed",
            "facebook_url": "https://www.facebook.com/profile.php?id=61556687571408",
            "map_factory_lat": "31.2863456",
            "map_factory_lng": "74.1736062",
            "map_factory_note": "The map marks Sundar Industrial Estate. It is not a surveyed pin for plots 742–743.",
            "seo_title": "ASCOM International",
            "seo_description": "Signage, branding and visual identity from Lahore since 2018, with manufacturing, vehicles, road safety and construction.",
        },
        "settings": {
            "hero_kicker": "ASCOM International · Lahore",
            "hero_title": "Shaping What the World Sees.",
            "hero_text": "From the first idea to the finished piece. ASCOM International, Lahore.",
            "intro_kicker": "The company",
            "intro_title": "A Lahore company with more than one craft.",
            "intro_body": (
                "ASCOM has worked in signage media since 2018, and that is only one part of the company. "
                "The same business also manufactures, fits out vehicles and takes on wider project work.\n\n"
                "The pages that follow show those areas. They are examples of the work, not a closed list of everything ASCOM can be asked to do."
            ),
            "cta_title": "Have a Brief in Mind?",
            "cta_text": "Talk to the team about signage, branding, manufacturing or a construction requirement.",
            "organization_note": "These marks appear on the previous ASCOM website. A logo is not presented as a contract, endorsement or current registration.",
        },
        "values": [
            {"id": "value-1", "title": "Continuous Improvement", "description": "Excellence is a commitment to keep improving the work.", "icon_key": "refresh", "sort_order": 1},
            {"id": "value-2", "title": "Leadership", "description": "Strong leadership drives vision, inspires teams, and supports accountability and growth.", "icon_key": "compass", "sort_order": 2},
            {"id": "value-3", "title": "Accountability and Ownership", "description": "Take responsibility for decisions, actions and their results.", "icon_key": "badge", "sort_order": 3},
            {"id": "value-4", "title": "Teamwork", "description": "The individual matters, and more is accomplished by working together.", "icon_key": "users", "sort_order": 4},
            {"id": "value-5", "title": "Open Communication", "description": "Open communication is the foundation of trust for every stakeholder.", "icon_key": "message", "sort_order": 5},
            {"id": "value-6", "title": "Safety", "description": "HSE is of utmost importance, and safety is a priority.", "icon_key": "shield", "sort_order": 6},
        ],
        "divisions": divisions,
        "categories": categories,
        "products": products,
        "projects": projects,
        "industries": [{"id": row["slug"], **row, "is_active": True} for row in INDUSTRY_ROWS],
        "highlights": [{"id": f"{row['group_key']}-{row['sort_order']}", **row, "is_active": True} for row in HIGHLIGHT_ROWS],
        "organizations": [{"id": f"org-{index}", **row} for index, row in enumerate(ORGANIZATION_ROWS, start=1) if row["is_active"]],
        "resources": [
            {
                "id": "code-of-conduct",
                "slug": "code-of-conduct",
                "title": "Code of conduct",
                "summary": "Ethical conduct, anti-bribery rules, and how to raise a concern.",
                "body": POLICY,
                "category": "Governance",
                "file_url": None,
                "is_active": True,
                "sort_order": 1,
                "seo_title": "Code of conduct",
                "seo_description": "ASCOM International code of conduct, including anti-bribery expectations and how to raise a concern.",
            }
        ],
        "jobs": [],
    }
    destination = ROOT / "frontend" / "content" / "site.json"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(destination, "products", len(products), "projects", len(projects))


if __name__ == "__main__":
    main()
