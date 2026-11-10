from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.content.galleries import GALLERIES
from app.core.config import settings
from app.core.security import hash_password
from app.models import (
    CompanyProfile,
    CompanyValue,
    Division,
    DivisionOffering,
    Highlight,
    Industry,
    Organization,
    Product,
    ProductCategory,
    ProductSpec,
    Project,
    ProjectImage,
    Resource,
    SiteSetting,
    Statistic,
    User,
)

CONTENT_DIR = Path(__file__).resolve().parents[1] / "content"
SPEC_NOTE = None


def seed(db: Session) -> None:
    _ensure_admin(db)
    if db.scalar(select(CompanyProfile.id)):
        db.commit()
        return
    _load(db)
    db.commit()


def _ensure_admin(db: Session) -> None:
    email = settings.admin_email.lower()
    existing = db.scalar(select(User).where(User.email == email))
    if existing:
        return
    db.add(
        User(
            email=email,
            full_name=settings.admin_name,
            password_hash=hash_password(settings.admin_password),
            role="admin",
            is_active=True,
        )
    )


def _load(db: Session) -> None:
    db.add(
        CompanyProfile(
            legal_name="ASCOM International",
            summary="ASCOM International is a Lahore company known for signage and visual branding since 2018, with manufacturing, specialised vehicles, road safety and construction alongside that work.",
            about=(
                "ASCOM International is headquartered in Lahore, Pakistan. Since 2018 it has worked in signage media, "
                "making customised visual communication, vehicle branding and brand visibility.\n\n"
                "Manufacturing at Sundar Industrial Estate, specialised vehicles, road safety and construction sit with that creative work. "
                "Construction is one published division, not the whole of the company.\n\n"
                "The previous website describes the company as a multinational group with a presence in more than one "
                "geography. No overseas office is listed, so this site does not repeat that claim."
            ),
            signage_since_year=2018,
            country="Pakistan",
            head_office_address="333 Block B, Iqbal Avenue II, Khayab-e-Jinnah Road, Lahore, Pakistan.",
            factory_address="Plot No. 742–743, Sundar Industrial Estate, Wara Siddhu, Lahore, Punjab, Pakistan.",
            phone_primary="+92 423 518 9595",
            phone_mobile="+92 323 899 4888",
            phone_secondary="+92-42-35189034",
            email_primary="info@ascomintl.com",
            email_careers="hr@ascomintl.com",
            hours_weekday="Monday to Saturday, 09:00 AM to 05:00 PM",
            hours_sunday="Sunday: closed",
            facebook_url="https://www.facebook.com/profile.php?id=61556687571408",
            map_factory_lat="31.2863456",
            map_factory_lng="74.1736062",
            map_factory_note="The map marks Sundar Industrial Estate. It is not a surveyed pin for plots 742–743.",
            seo_title="ASCOM International",
            seo_description="Signage, branding and visual identity from Lahore since 2018, with manufacturing, vehicles, road safety and construction.",
        )
    )
    values = [
        ("Continuous Improvement", "Excellence is a commitment to keep improving the work.", "refresh", 1),
        ("Leadership", "Strong leadership drives vision, inspires teams, and supports accountability and growth.", "compass", 2),
        ("Accountability and Ownership", "Take responsibility for decisions, actions and their results.", "badge", 3),
        ("Teamwork", "The individual matters, and more is accomplished by working together.", "users", 4),
        ("Open Communication", "Open communication is the foundation of trust for every stakeholder.", "message", 5),
        ("Safety", "HSE is of utmost importance, and safety is a priority.", "shield", 6),
    ]
    for title, description, icon, order in values:
        db.add(CompanyValue(title=title, description=description, icon_key=icon, sort_order=order))

    settings_copy = {
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
    }
    for key, value in settings_copy.items():
        db.add(SiteSetting(key=key, value=value))

    db.add(
        Statistic(
            label="Manufacturing floor area on the previous website",
            value="70,000+ sq ft",
            source_note="The source page adds the words “customize based on actual size”. Not shown publicly until confirmed.",
            is_verified=False,
            is_public=False,
            sort_order=1,
        )
    )
    db.add(
        Statistic(
            label="Technicians and engineers on the previous website",
            value="100+",
            source_note="Published beside an unfinished area figure. Not shown publicly until confirmed.",
            is_verified=False,
            is_public=False,
            sort_order=2,
        )
    )

    divisions = {item["slug"]: _division(db, item) for item in DIVISION_ROWS}
    categories = {item["slug"]: _category(db, item) for item in CATEGORY_ROWS}
    projects = {item["slug"]: _project(db, item, divisions) for item in PROJECT_ROWS}
    for item in PRODUCT_ROWS:
        _product(db, item, categories, divisions, projects)
    for item in INDUSTRY_ROWS:
        _industry(db, item)
    for item in HIGHLIGHT_ROWS:
        db.add(Highlight(**item))
    for item in ORGANIZATION_ROWS:
        db.add(Organization(**item))
    policy = (CONTENT_DIR / "code_of_conduct.txt").read_text(encoding="utf-8")
    db.add(
        Resource(
            slug="code-of-conduct",
            title="Code of conduct",
            summary="Ethical conduct, anti-bribery rules, and how to raise a concern.",
            body=policy,
            category="Governance",
            is_active=True,
            sort_order=1,
            seo_title="Code of conduct",
            seo_description="ASCOM International code of conduct, including anti-bribery expectations and how to raise a concern.",
        )
    )


def _division(db: Session, item: dict) -> Division:
    data = dict(item)
    offerings = data.pop("offerings")
    division = Division(**data)
    for index, offering in enumerate(offerings, start=1):
        division.offerings.append(DivisionOffering(title=offering[0], description=offering[1], sort_order=index))
    db.add(division)
    return division


def _category(db: Session, item: dict) -> ProductCategory:
    category = ProductCategory(**item)
    db.add(category)
    return category


def _project(db: Session, item: dict, divisions: dict[str, Division]) -> Project:
    data = dict(item)
    division_slug = data.pop("division")
    project = Project(division=divisions[division_slug], **data)
    for index, (_url, alt) in enumerate(GALLERIES[project.slug], start=1):
        project.images.append(
            ProjectImage(
                url=f"/media/projects/{project.slug}/{index:02d}.jpg",
                alt=alt,
                is_company_photo=True,
                sort_order=index,
            )
        )
    db.add(project)
    return project


def _product(db: Session, item: dict, categories, divisions, projects) -> None:
    data = dict(item)
    category = categories[data.pop("category")]
    division = divisions[data.pop("division")]
    project_slugs = data.pop("projects")
    specs = data.pop("specs", [])
    product = Product(category=category, division=division, **data)
    for index, (label, value) in enumerate(specs, start=1):
        product.specs.append(ProductSpec(label=label, value=value, sort_order=index))
    for slug in project_slugs:
        product.projects.append(projects[slug])
    db.add(product)


def _industry(db: Session, item: dict) -> None:
    db.add(Industry(**item))


DIVISION_ROWS = [
    {
        "slug": "creative-solutions",
        "name": "Creative Solutions",
        "summary": "Signage, brand visibility and marketing material. ASCOM has worked in signage media since 2018.",
        "body": (
            "Since 2018, ASCOM has described itself as a signage media company, making customised work that improves brand visibility and communication.\n\n"
            "The creative page groups that work into trade marketing, petroleum retail, out-of-home media, road safety products, packaging, giveaways, digital services, road signs, and shop or showroom renovation. "
            "Each group is published as a list. Individual campaigns, sizes and material specifications are not published."
        ),
        "hero_image": "/media/projects/wildlife-vehicle-branding/01.jpg",
        "hero_caption": "Vehicle livery for Wildlife Rangers, from ASCOM's published project photographs.",
        "hero_is_company_photo": True,
        "is_active": True,
        "show_in_navigation": True,
        "sort_order": 1,
        "seo_title": "Creative Solutions",
        "seo_description": "Signage, branding, road signs, packaging and related creative services from ASCOM International.",
        "offerings": [
            ("Signage media", "In-store and on-store printing, signage, fixtures and point-of-sale material."),
            ("Petroleum retail", "Price display units, retail visual identity, lube bays, non-fuel retail development and related civil works."),
            ("Out of home", "Media planning, creative production, execution, reporting and industry analysis, as listed on the current site."),
            ("Road signs", "Regulatory, warning and directional signs, reflective boards, highway signs, and urban or industrial sign systems."),
            ("Packaging and giveaways", "Corrugated and protective packaging, branded packs, corporate gifts and campaign items."),
            ("Shop and showroom work", "Interior and exterior renovation, fixtures, lighting, display and refurbishment."),
            ("Digital services", "The creative page names artificial intelligence, digital marketing, Android and iOS applications, hardware integration and web development. No further scope is published."),
        ],
    },
    {
        "slug": "construction",
        "name": "Construction",
        "summary": "Highways, bridges, buildings, power, dams and airports are the published construction categories.",
        "body": (
            "ASCOM's construction page says the company uses modern machinery and delivers work within agreed timelines and budgets.\n\n"
            "Six categories are named: highways and motorways, flyovers and bridges, buildings, power and energy, dams, and airports. "
            "The page does not name individual contracts in those categories.\n\n"
            "The construction project that is published in full is a prefabricated site at Sundar Industrial Estate."
        ),
        "hero_image": "/media/projects/sundar-prefabricated-site/01.jpg",
        "hero_caption": "Prefabricated construction site at Sundar Industrial Estate, from ASCOM's published photographs.",
        "hero_is_company_photo": True,
        "is_active": True,
        "show_in_navigation": True,
        "sort_order": 2,
        "seo_title": "Construction",
        "seo_description": "Construction categories published by ASCOM International, including highways, bridges, buildings, power, dams and airports.",
        "offerings": [
            ("Highways and motorways", "Listed as a construction category. Named highway contracts are not published."),
            ("Flyovers and bridges", "Listed as a construction category. Named bridge contracts are not published."),
            ("Buildings", "Listed as a construction category."),
            ("Power and energy", "Listed as a construction category."),
            ("Dams", "Listed as a construction category."),
            ("Airports", "Listed as a construction category."),
            ("Prefabricated site work", "A prefabricated construction site at Sundar Industrial Estate is a published project."),
        ],
    },
    {
        "slug": "manufacturing",
        "name": "Manufacturing",
        "summary": "In-house metal, plastic and electrical production at Sundar Industrial Estate.",
        "body": (
            "ASCOM describes itself as a manufacturer, not only a trading company. The factory is at Sundar Industrial Estate, Lahore. "
            "The published account says production is controlled in-house from raw material through packaging, across metal, plastic and electrical goods.\n\n"
            "Published capabilities are CNC machining and metal fabrication, injection molding and plastic processing, powder coating, polishing and plating, "
            "product assembly, private labelling, OEM and ODM customisation, in-house quality testing, and packaging.\n\n"
            "The same page says the company uses energy-efficient processes, waste recycling, ethical labour standards and reduced packaging waste.\n\n"
            "A floor area and a workforce figure appear on the previous website with a note that the area should be customised to the actual size. "
            "Those figures are withheld here until the company confirms them."
        ),
        "hero_image": "/media/projects/firefighting-cylinders/01.jpg",
        "hero_caption": "Firefighting cylinders in a workshop, from ASCOM's published project photographs. This is project photography, not a measured drawing of the factory.",
        "hero_is_company_photo": True,
        "is_active": True,
        "show_in_navigation": True,
        "sort_order": 3,
        "seo_title": "Manufacturing",
        "seo_description": "Metal, plastic and electrical manufacturing capabilities published by ASCOM International.",
        "offerings": [
            ("CNC machining and metal fabrication", "Listed among the in-house production capabilities."),
            ("Injection molding and plastic processing", "Listed among the in-house production capabilities."),
            ("Surface treatment", "Powder coating, polishing and plating."),
            ("Assembly and private labelling", "Product assembly and private labelling are both published."),
            ("OEM and ODM", "Customisation for OEM and ODM work is published, without a separate product list."),
            ("Quality testing and packaging", "In-house quality testing and packaging close the published process."),
        ],
    },
    {
        "slug": "technology-solutions",
        "name": "Technology Solutions",
        "summary": "IT equipment and IT support categories published on the technology page.",
        "body": (
            "The homepage describes this division as IT services and equipment. The technology page is more specific, and this page follows that list without adding services that are not there.\n\n"
            "Equipment categories cover computers and workstations, servers, storage, CCTV recording, and office supplies. "
            "Service categories cover IT infrastructure, network security and IT support, including a published reference to 24/7 helpdesk support.\n\n"
            "The page also says the company works with experienced professionals, certified experts and leading brands. It does not name the certificates or the brands, so this site does not invent them.\n\n"
            "Storage is written on the source page as “NIAS, SAN, Harddrives, Storage Arrays”. NAS is the usual term. Confirm the spelling before treating it as a product name."
        ),
        "hero_image": "/media/atmosphere/technology.jpg",
        "hero_caption": "Atmospheric photograph of data-centre equipment. It is not an ASCOM facility.",
        "hero_is_company_photo": False,
        "is_active": True,
        "show_in_navigation": True,
        "sort_order": 4,
        "seo_title": "Technology Solutions",
        "seo_description": "Computers, servers, storage, CCTV and IT support categories published by ASCOM International.",
        "offerings": [
            ("Computers and workstations", "Laptops, desktops, workstations and all-in-one computers."),
            ("Servers", "Tower, rack and scale servers, as listed."),
            ("Storage", "SAN, hard drives and storage arrays. The source also prints “NIAS”, which needs confirmation."),
            ("CCTV and recording", "CCTV cameras, NVRs and DVRs."),
            ("Office supplies", "Stationery and office supplies."),
            ("IT infrastructure", "Design, implementation and management of IT infrastructure."),
            ("Network security", "Described as protection with an advanced security solution. No product names are published."),
            ("IT support", "Helpdesk and technical support, described as available 24/7."),
        ],
    },
    {
        "slug": "engineering",
        "name": "Engineering",
        "summary": "Mechanical, civil, fabrication and infrastructure activities listed on the engineering page.",
        "body": (
            "ASCOM publishes an engineering page with a list of activities. That list is repeated below.\n\n"
            "The same page also contains prefabricated-building paragraphs written for a different company. "
            "Those paragraphs are not reproduced here.\n\n"
            "Items on the list overlap with manufacturing, construction and road safety. They are shown so the published engineering scope is not dropped."
        ),
        "hero_image": "/media/projects/sundar-prefabricated-site/02.jpg",
        "hero_caption": "Photograph from the published Sundar prefabricated construction project.",
        "hero_is_company_photo": True,
        "is_active": True,
        "show_in_navigation": True,
        "sort_order": 5,
        "seo_title": "Engineering",
        "seo_description": "Engineering activities listed on the ASCOM International website.",
        "offerings": [
            ("Mechanical and HVAC", "HVAC and mechanical design are both on the published list."),
            ("Fabrication and erection", "Fabrication and erection, custom steel fabrication, CNC products and galvanizing."),
            ("Civil works", "Civil construction, civil renovation, pre-engineered buildings and porta cabins."),
            ("Infrastructure utilities", "Telecommunication, transmission towers, water management and pipeline work."),
            ("Road and security", "Road safety, road marking and security products are also named on the engineering page."),
        ],
    },
    {
        "slug": "road-safety",
        "name": "Road Safety",
        "summary": "Traffic products and road signs listed under Creative Solutions.",
        "body": (
            "Road safety is not a separate page on the current website. It is a published part of Creative Solutions, in two lists: road safety products and road signs.\n\n"
            "Products named there are traffic cones, safety barriers, reflective tapes, road studs (cat eyes), speed breakers, convex mirrors, safety bollards and high-visibility gear.\n\n"
            "Signs named there are regulatory signs, warning signs, directional signage, reflective sign boards, custom road signs, highway signage, and urban and industrial sign systems.\n\n"
            "Sizes, standards and reflective grades are not published. The catalogue records the names and leaves specifications empty until the company adds them."
        ),
        "hero_image": "/media/atmosphere/road.jpg",
        "hero_caption": "Atmospheric photograph of a road. It is not an ASCOM installation.",
        "hero_is_company_photo": False,
        "is_active": True,
        "show_in_navigation": True,
        "sort_order": 6,
        "seo_title": "Road Safety",
        "seo_description": "Road safety products and road signs listed by ASCOM International.",
        "offerings": [
            ("Road safety products", "Cones, barriers, tapes, studs, speed breakers, mirrors, bollards and high-visibility gear."),
            ("Road signs", "Regulatory, warning, directional, reflective, highway, urban and industrial signs."),
        ],
    },
    {
        "slug": "vehicle-customisation",
        "name": "Vehicle Customisation",
        "summary": "Firefighting vehicles, trailers, vehicle bodies and livery, as published in project pages.",
        "body": (
            "The current website has no page titled vehicle customisation. The work is published as individual projects, and those projects are the content of this page.\n\n"
            "They cover fire crash trucks supplied to DGP Army in a joint venture with Technofire, mobile foam units supplied to DGP Army as a subcontractor with Metron International, "
            "a 1.5-ton two-wheel water trailer of 400 gallons also linked to DGP Army and Techno Fire, firefighting cylinders, a vehicle back body for Wildlife Rangers, "
            "and painting and branding for Wildlife Rangers and for RWMC operational vehicles.\n\n"
            "Only the water trailer has published figures. Other specifications are left blank."
        ),
        "hero_image": "/media/projects/fire-crash-truck/01.jpg",
        "hero_caption": "Fire crash trucks from ASCOM's published project photographs.",
        "hero_is_company_photo": True,
        "is_active": True,
        "show_in_navigation": True,
        "sort_order": 7,
        "seo_title": "Vehicle Customisation",
        "seo_description": "Specialised vehicles and vehicle bodies published by ASCOM International.",
        "offerings": [
            ("Fire crash trucks", "Manufacture and supply of fire trucks to DGP Army, described as a joint venture with Technofire."),
            ("Mobile foam units", "Manufactured and supplied to DGP Army as a subcontractor with Metron International."),
            ("Water trailers", "1.5 ton, two-wheeler, 400 gallons. The page also names DGP Army and Techno Fire Pvt Ltd."),
            ("Vehicle bodies and livery", "Back bodies and painting for Wildlife Rangers, and painting and branding for RWMC vehicles."),
        ],
    },
    {
        "slug": "road-beautification",
        "name": "Road Beautification",
        "summary": "No published page or service description was found.",
        "body": "The address /road-beautification/ on the current website returns 404. This record is inactive until the company adds a description.",
        "hero_image": None,
        "hero_caption": None,
        "hero_is_company_photo": False,
        "is_active": False,
        "show_in_navigation": False,
        "sort_order": 8,
        "seo_title": "Road Beautification",
        "seo_description": "Inactive until a service description is confirmed.",
        "offerings": [],
    },
    {
        "slug": "waste-management",
        "name": "Waste Management",
        "summary": "No standalone service page was found.",
        "body": (
            "The addresses /waste-management/ and /waste-management-solutions/ return 404. "
            "Related published material is limited to waste recycling as a manufacturing practice, and to vehicle branding for RWMC. "
            "This record stays inactive so those items are not relabelled as a waste-management contract."
        ),
        "hero_image": None,
        "hero_caption": None,
        "hero_is_company_photo": False,
        "is_active": False,
        "show_in_navigation": False,
        "sort_order": 9,
        "seo_title": "Waste Management",
        "seo_description": "Inactive until a service description is confirmed.",
        "offerings": [],
    },
]

CATEGORY_ROWS = [
    {"slug": "firefighting-vehicles", "name": "Firefighting Vehicles", "description": "Fire crash trucks published by ASCOM.", "sort_order": 1},
    {"slug": "mobile-foam-units", "name": "Mobile Foam Units", "description": "Mobile foam units published by ASCOM.", "sort_order": 2},
    {"slug": "firefighting-equipment", "name": "Firefighting Equipment", "description": "Firefighting cylinders published by ASCOM.", "sort_order": 3},
    {"slug": "water-trailers", "name": "Water Trailers", "description": "Water trailers with the figures published by ASCOM.", "sort_order": 4},
    {"slug": "vehicle-bodies", "name": "Vehicle Bodies", "description": "Vehicle bodies, painting and branding.", "sort_order": 5},
    {"slug": "manufactured-equipment", "name": "Manufactured Equipment", "description": "Other manufactured items with a published project page.", "sort_order": 6},
    {"slug": "road-safety-products", "name": "Road Safety Products", "description": "Products named on the creative solutions page. Specifications are not yet published.", "sort_order": 7},
    {"slug": "signage", "name": "Signage", "description": "Sign types named on the creative solutions page.", "sort_order": 8},
    {"slug": "creative-services", "name": "Creative Services", "description": "Service groups from the creative solutions page.", "sort_order": 9},
    {"slug": "technology", "name": "Technology", "description": "Equipment and IT categories from the technology page.", "sort_order": 10},
]

PROJECT_ROWS = [
    {
        "slug": "fire-crash-truck",
        "title": "Fire crash truck",
        "summary": "Manufacture and supply of fire trucks to DGP Army, described as a joint venture with Technofire.",
        "description": "The project page states: manufacture and supply fire trucks to DGP Army (joint venture with Technofire). No date, contract value or engineering specification is published. The photographs are the gallery from that page.",
        "division": "vehicle-customisation",
        "client_name": "DGP Army",
        "location": None,
        "is_featured": True,
        "sort_order": 1,
        "seo_title": "Fire crash truck",
        "seo_description": "ASCOM's published fire crash truck project for DGP Army.",
    },
    {
        "slug": "firefighting-cylinders",
        "title": "Firefighting cylinders",
        "summary": "Manufacturing of firefighting cylinders.",
        "description": "The project page states: manufacturing of fire fighting cylinders. Capacity, standard and client are not named on the page.",
        "division": "manufacturing",
        "client_name": None,
        "location": None,
        "is_featured": True,
        "sort_order": 2,
        "seo_title": "Firefighting cylinders",
        "seo_description": "ASCOM's published firefighting cylinder manufacturing project.",
    },
    {
        "slug": "rwmc-vehicle-branding",
        "title": "RWMC vehicle branding",
        "summary": "Body paint and branding of RWMC operational vehicles.",
        "description": "The project page states: body paint and branding work of RWMC operational vehicles. The photographs show a waste-collection vehicle carrying RWMC and Clean Punjab branding. The page does not describe a waste-collection operating contract.",
        "division": "creative-solutions",
        "client_name": "RWMC",
        "location": None,
        "is_featured": True,
        "sort_order": 3,
        "seo_title": "RWMC vehicle branding",
        "seo_description": "Body paint and branding of RWMC operational vehicles, as published by ASCOM.",
    },
    {
        "slug": "mobile-foam-unit",
        "title": "Mobile foam unit",
        "summary": "Manufactured and supplied to DGP Army as a subcontractor with Metron International.",
        "description": "The project page states: manufacture and supplied to DGP Army as a subcontractor with Metron Intl. Capacity and chassis details are not published.",
        "division": "vehicle-customisation",
        "client_name": "DGP Army",
        "location": None,
        "is_featured": True,
        "sort_order": 4,
        "seo_title": "Mobile foam unit",
        "seo_description": "ASCOM's published mobile foam unit project.",
    },
    {
        "slug": "water-trailer",
        "title": "Water trailer",
        "summary": "1.5-ton, two-wheeler water trailer with a stated capacity of 400 gallons.",
        "description": "The project page states: Water Trailer 1.5 Ton, 2 wheeler, 400 gallons. Manufacture and supply to DGP Army (joint venture with Techno Fire Pvt Ltd).",
        "division": "vehicle-customisation",
        "client_name": "DGP Army",
        "location": None,
        "is_featured": True,
        "sort_order": 5,
        "seo_title": "Water trailer",
        "seo_description": "1.5-ton two-wheel water trailer published by ASCOM International.",
    },
    {
        "slug": "cycle-boats",
        "title": "Cycle boats",
        "summary": "Design and supply of cycle boats for the Tourism Development Corporation of Punjab.",
        "description": "The project page states: design and supply of cycle boats at Kalarkahar lake, Uchali lake, Khabeki lake and Darabi dam, to the Tourism Development Corporation of Punjab. Place names are reproduced as published.",
        "division": "manufacturing",
        "client_name": "Tourism Development Corporation of Punjab",
        "location": "Kalarkahar lake, Uchali lake, Khabeki lake, Darabi dam",
        "is_featured": True,
        "sort_order": 6,
        "seo_title": "Cycle boats",
        "seo_description": "Cycle boats designed and supplied by ASCOM for the Tourism Development Corporation of Punjab.",
    },
    {
        "slug": "sundar-prefabricated-site",
        "title": "Prefabricated site at Sundar",
        "summary": "Prefabricated construction site at Sundar Industrial Estate.",
        "description": "The project page states: pre-fabricated construction site at Sundar Industrial Estate. No floor area or contract value is published.",
        "division": "construction",
        "client_name": None,
        "location": "Sundar Industrial Estate, Lahore",
        "is_featured": True,
        "sort_order": 7,
        "seo_title": "Prefabricated site at Sundar",
        "seo_description": "Prefabricated construction site at Sundar Industrial Estate, published by ASCOM.",
    },
    {
        "slug": "wildlife-vehicle-back-body",
        "title": "Wildlife ranger vehicle back body",
        "summary": "Design and manufacturing of a vehicle back body for Wildlife Rangers.",
        "description": "The project page states: design and manufacturing of a vehicle back body for Wildlife Rangers, Wildlife and Parks Department.",
        "division": "vehicle-customisation",
        "client_name": "Wildlife and Parks Department",
        "location": None,
        "is_featured": True,
        "sort_order": 8,
        "seo_title": "Wildlife ranger vehicle back body",
        "seo_description": "Vehicle back body manufactured by ASCOM for Wildlife Rangers.",
    },
    {
        "slug": "wildlife-vehicle-branding",
        "title": "Wildlife ranger vehicle branding",
        "summary": "Vehicle body painting and branding for Wildlife Rangers.",
        "description": "The project page states: vehicle body paint and branding works for Wildlife Rangers, Wildlife and Parks Department.",
        "division": "creative-solutions",
        "client_name": "Wildlife and Parks Department",
        "location": None,
        "is_featured": True,
        "sort_order": 9,
        "seo_title": "Wildlife ranger vehicle branding",
        "seo_description": "Vehicle painting and branding for Wildlife Rangers, published by ASCOM.",
    },
]


def _product_row(slug, name, summary, description, category, division, projects, featured=False, specs=None, image=None, company_photo=False, caption=None, note=SPEC_NOTE):
    return {
        "slug": slug,
        "name": name,
        "summary": summary,
        "description": description,
        "category": category,
        "division": division,
        "projects": projects,
        "hero_image": image,
        "hero_caption": caption,
        "hero_is_company_photo": company_photo,
        "verification_note": note,
        "is_featured": featured,
        "sort_order": 0,
        "seo_title": name,
        "seo_description": summary,
        "specs": specs or [],
    }


PRODUCT_ROWS = [
    _product_row(
        "fire-crash-truck",
        "Fire crash truck",
        "Fire trucks manufactured and supplied to DGP Army, in a joint venture with Technofire.",
        "Published description: manufacture and supply fire trucks to DGP Army (joint venture with Technofire). Pump ratings, water capacity and chassis specifications are not on the source page.",
        "firefighting-vehicles",
        "vehicle-customisation",
        ["fire-crash-truck"],
        True,
        image="/media/projects/fire-crash-truck/01.jpg",
        company_photo=True,
        caption="Published project photograph.",
    ),
    _product_row(
        "mobile-foam-unit",
        "Mobile foam unit",
        "Supplied to DGP Army as a subcontractor with Metron International.",
        "Published description: manufacture and supplied to DGP Army as a subcontractor with Metron Intl. Foam capacity is not stated.",
        "mobile-foam-units",
        "vehicle-customisation",
        ["mobile-foam-unit"],
        True,
        image="/media/projects/mobile-foam-unit/01.jpg",
        company_photo=True,
        caption="Published project photograph.",
    ),
    _product_row(
        "firefighting-cylinders",
        "Firefighting cylinders",
        "Manufacturing of firefighting cylinders.",
        "The project page records manufacturing of fire fighting cylinders. Working pressure, volume and the applicable standard are not stated.",
        "firefighting-equipment",
        "manufacturing",
        ["firefighting-cylinders"],
        True,
        image="/media/projects/firefighting-cylinders/01.jpg",
        company_photo=True,
        caption="Published project photograph.",
    ),
    _product_row(
        "water-trailer-1-5-ton",
        "Water trailer, 1.5 ton",
        "Two-wheel water trailer with a published capacity of 400 gallons.",
        "Published description: 1.5 ton, two-wheeler, 400 gallons. Manufacture and supply to DGP Army (joint venture with Techno Fire Pvt Ltd).",
        "water-trailers",
        "vehicle-customisation",
        ["water-trailer"],
        True,
        specs=[("Configuration", "Two-wheeler"), ("Rating", "1.5 ton"), ("Capacity", "400 gallons")],
        image="/media/projects/water-trailer/01.jpg",
        company_photo=True,
        caption="Published project photograph.",
        note="Only the three figures printed on the project page are listed.",
    ),
    _product_row(
        "wildlife-ranger-vehicle-back-body",
        "Wildlife ranger vehicle back body",
        "Designed and manufactured for Wildlife Rangers.",
        "Published description: design and manufacturing of a vehicle back body for Wildlife Rangers, Wildlife and Parks Department.",
        "vehicle-bodies",
        "vehicle-customisation",
        ["wildlife-vehicle-back-body"],
        image="/media/projects/wildlife-vehicle-back-body/01.jpg",
        company_photo=True,
        caption="Published project photograph.",
    ),
    _product_row(
        "vehicle-painting-and-branding",
        "Vehicle painting and branding",
        "Body paint and branding for operational vehicles.",
        "Published projects cover RWMC operational vehicles and Wildlife Rangers vehicles for the Wildlife and Parks Department.",
        "vehicle-bodies",
        "creative-solutions",
        ["rwmc-vehicle-branding", "wildlife-vehicle-branding"],
        image="/media/projects/wildlife-vehicle-branding/01.jpg",
        company_photo=True,
        caption="Published project photograph.",
    ),
    _product_row(
        "cycle-boats",
        "Cycle boats",
        "Designed and supplied for the Tourism Development Corporation of Punjab.",
        "Published locations, spelled as on the source page: Kalarkahar lake, Uchali lake, Khabeki lake and Darabi dam.",
        "manufactured-equipment",
        "manufacturing",
        ["cycle-boats"],
        specs=[
            ("Client", "Tourism Development Corporation of Punjab"),
            ("Locations", "Kalarkahar lake, Uchali lake, Khabeki lake, Darabi dam"),
        ],
        image="/media/projects/cycle-boats/01.jpg",
        company_photo=True,
        caption="Published project photograph.",
        note=None,
    ),
]

_ROAD = [
    ("traffic-cones", "Traffic cones"),
    ("safety-barriers", "Safety barriers"),
    ("reflective-tapes", "Reflective tapes"),
    ("road-studs", "Road studs (cat eyes)"),
    ("speed-breakers", "Speed breakers"),
    ("convex-mirrors", "Convex mirrors"),
    ("safety-bollards", "Safety bollards"),
    ("high-visibility-safety-gear", "High-visibility safety gear"),
]
for _slug, _name in _ROAD:
    PRODUCT_ROWS.append(
        _product_row(
            _slug,
            _name,
            f"{_name} are listed under road safety products on the creative solutions page.",
            f"ASCOM lists {_name.lower()} among its road safety products.",
            "road-safety-products",
            "road-safety",
            [],
        )
    )

_SIGNS = [
    ("regulatory-signs", "Regulatory signs"),
    ("warning-signs", "Warning signs"),
    ("directional-signage", "Directional signage"),
    ("reflective-sign-boards", "Reflective sign boards"),
    ("highway-signage", "Highway signage"),
    ("urban-and-industrial-sign-systems", "Urban and industrial sign systems"),
    ("custom-signage", "Custom road sign solutions"),
]
for _slug, _name in _SIGNS:
    PRODUCT_ROWS.append(
        _product_row(
            _slug,
            _name,
            f"{_name} are listed under road signs on the creative solutions page.",
            f"ASCOM lists {_name.lower()} among its road signs.",
            "signage",
            "creative-solutions",
            [],
        )
    )

_CREATIVE = [
    ("petroleum-retail-signage", "Petroleum retail signage", "Price display units, retail visual identity, lube bays and related petroleum signage and civil works."),
    ("trade-marketing-signage", "Trade marketing signage", "In-store and on-store printing, signage, fixtures and POP/POSM."),
    ("shop-and-showroom-branding", "Shop and showroom branding", "Interior and exterior renovation, fixtures, lighting, display and refurbishment."),
]
for _slug, _name, _text in _CREATIVE:
    PRODUCT_ROWS.append(
        _product_row(_slug, _name, _text, _text, "creative-services", "creative-solutions", [])
    )

_TECH = [
    ("computers-and-workstations", "Computers and workstations", "Laptops, desktops, workstations and all-in-one computers."),
    ("servers", "Servers", "Tower, rack and scale servers."),
    ("storage-systems", "Storage systems", "SAN, hard drives and storage arrays. The source page also prints “NIAS”."),
    ("cctv-and-recording", "CCTV and recording", "CCTV cameras, NVRs and DVRs."),
    ("office-supplies", "Office supplies", "Stationery and office supplies."),
    ("it-infrastructure", "IT infrastructure", "Design, implementation and management of IT infrastructure."),
    ("network-security", "Network security", "Described as an advanced security solution. Named products are not published."),
    ("it-support", "IT support", "Helpdesk and technical support, described as available 24/7."),
]
for _slug, _name, _text in _TECH:
    PRODUCT_ROWS.append(
        _product_row(_slug, _name, _text, _text + " No brand is named on the source page.", "technology", "technology-solutions", [])
    )

for index, row in enumerate(PRODUCT_ROWS, start=1):
    row["sort_order"] = index

INDUSTRY_ROWS = [
    {
        "slug": "infrastructure",
        "name": "Infrastructure",
        "summary": "Construction categories, plus a published prefabricated site at Sundar Industrial Estate.",
        "body": "ASCOM lists highways and motorways, flyovers and bridges, buildings, power and energy, dams and airports. The documented construction project is the prefabricated site at Sundar Industrial Estate.",
        "image": "/media/projects/sundar-prefabricated-site/01.jpg",
        "image_caption": "Published photograph from the Sundar prefabricated site.",
        "image_is_company_photo": True,
        "sort_order": 1,
    },
    {
        "slug": "government-and-public-sector",
        "name": "Government and public sector",
        "summary": "Project pages name DGP Army, the Tourism Development Corporation of Punjab, and the Wildlife and Parks Department.",
        "body": "Those three names are written on project pages. Other government marks appear in the logo wall of the previous website. A logo alone is not described here as a contract.",
        "image": "/media/projects/fire-crash-truck/01.jpg",
        "image_caption": "Published fire crash truck photograph. The project page names DGP Army.",
        "image_is_company_photo": True,
        "sort_order": 2,
    },
    {
        "slug": "industrial-manufacturing",
        "name": "Industrial manufacturing",
        "summary": "Metal, plastic and electrical goods from the Sundar factory, including cylinders and fabricated equipment.",
        "body": "Manufacturing capabilities are published as an in-house process list. Project photography shows cylinders, foam units, trailers and vehicle bodies.",
        "image": "/media/projects/firefighting-cylinders/01.jpg",
        "image_caption": "Published photograph of firefighting cylinders.",
        "image_is_company_photo": True,
        "sort_order": 3,
    },
    {
        "slug": "emergency-and-fire-safety",
        "name": "Emergency and fire safety",
        "summary": "Fire crash trucks, mobile foam units and firefighting cylinders.",
        "body": "These three are published projects. The truck and foam unit pages name DGP Army. Specifications beyond the project sentences are not published.",
        "image": "/media/projects/mobile-foam-unit/01.jpg",
        "image_caption": "Published photograph of mobile foam units.",
        "image_is_company_photo": True,
        "sort_order": 4,
    },
    {
        "slug": "transportation",
        "name": "Transportation",
        "summary": "Road signs, road-safety products, and the highway category on the construction page.",
        "body": "Transportation work that is actually described is the road-sign list, the road-safety product list, and the highway and motorway construction category. Named road contracts are not published.",
        "image": "/media/atmosphere/road.jpg",
        "image_caption": "Atmospheric road photograph. Not an ASCOM project.",
        "image_is_company_photo": False,
        "sort_order": 5,
    },
    {
        "slug": "municipal-services",
        "name": "Municipal services",
        "summary": "Body paint and branding of RWMC operational vehicles.",
        "body": "The published RWMC project is vehicle painting and branding. WASA Lahore appears as a logo on the previous website and is not given a project of its own here.",
        "image": "/media/projects/rwmc-vehicle-branding/01.jpg",
        "image_caption": "Published photograph of an RWMC vehicle after branding.",
        "image_is_company_photo": True,
        "sort_order": 6,
    },
    {
        "slug": "commercial-organisations",
        "name": "Commercial organisations",
        "summary": "Signage, retail branding, packaging and giveaways.",
        "body": "Creative Solutions lists trade marketing, petroleum retail identity, shop renovation, packaging and corporate gifts. Commercial logos on the previous site include Mezan, HBL, UMT, the University of the Punjab and Zameen. Those logos are not paired with a written case study.",
        "image": "/media/projects/wildlife-vehicle-branding/01.jpg",
        "image_caption": "Published branding photograph. Commercial case studies were not written up on the previous site.",
        "image_is_company_photo": True,
        "sort_order": 7,
    },
]

HIGHLIGHT_ROWS = [
    {"group_key": "capability", "title": "Signage and branding", "summary": "Signage media, vehicle livery and brand visibility, one part of the company since 2018.", "href": "/businesses/creative-solutions", "sort_order": 1},
    {"group_key": "capability", "title": "Road safety", "summary": "A published list of traffic products and road signs.", "href": "/businesses/road-safety", "sort_order": 2},
    {"group_key": "capability", "title": "Industrial manufacturing", "summary": "Metal, plastic and electrical goods, with CNC, molding, finishing, assembly and testing listed in-house.", "href": "/businesses/manufacturing", "sort_order": 3},
    {"group_key": "capability", "title": "Specialised vehicles", "summary": "Fire crash trucks, foam units, water trailers and vehicle bodies, documented as projects.", "href": "/businesses/vehicle-customisation", "sort_order": 4},
    {"group_key": "capability", "title": "Metal fabrication", "summary": "CNC machining, fabrication, powder coating, polishing and plating.", "href": "/businesses/manufacturing", "sort_order": 5},
    {"group_key": "capability", "title": "Construction", "summary": "One of the published divisions: highways, bridges, buildings, power, dams, airports, and a prefabricated site at Sundar.", "href": "/businesses/construction", "sort_order": 6},
    {"group_key": "why", "title": "Signage since 2018", "summary": "The company dates its signage media work from 2018. That is the longest published history on the site.", "href": "/about", "sort_order": 1},
    {"group_key": "why", "title": "Several disciplines in one company", "summary": "Signage and branding lead. Manufacturing, vehicles, road safety, technology and construction are published alongside them.", "href": "/businesses", "sort_order": 2},
    {"group_key": "why", "title": "In-house manufacturing", "summary": "The company says it controls production from raw material to packaging for metal, plastic and electrical goods.", "href": "/businesses/manufacturing", "sort_order": 3},
    {"group_key": "why", "title": "Custom and OEM work", "summary": "OEM, ODM and private labelling are published manufacturing capabilities.", "href": "/businesses/manufacturing", "sort_order": 4},
    {"group_key": "why", "title": "Documented vehicle projects", "summary": "Fire appliances, foam units, trailers and ranger bodies are published with photographs.", "href": "/projects", "sort_order": 5},
    {"group_key": "why", "title": "A factory at Sundar", "summary": "Production is located at plots 742–743, Sundar Industrial Estate, Lahore.", "href": "/contact", "sort_order": 6},
]

ORGANIZATION_ROWS = [
    ("Pakistan Engineering Council", "registration", "/media/organizations/pec.jpg", "Crest shown on the previous site. The licence scan is not republished.", 1),
    ("Federal Board of Revenue", "registration", "/media/organizations/fbr.jpg", "Logo shown on the previous site.", 2),
    ("Punjab Revenue Authority", "registration", "/media/organizations/pra.jpg", "Logo shown on the previous site.", 3),
    ("Lahore Chamber of Commerce & Industry", "registration", "/media/organizations/lcci.jpg", "Logo shown on the previous site. The membership certificate is not republished.", 4),
    ("Pakistan Single Window", "registration", "/media/organizations/psw.jpg", "Logo shown on the previous site.", 5),
    ("Excise, Taxation & Narcotics Control Department, Punjab", "registration", "/media/organizations/excise.jpg", "Logo shown on the previous site.", 6),
    ("Government of the Punjab", "client", "/media/organizations/govt-punjab.jpg", "Logo shown under clients.", 1),
    ("Government of Sindh", "client", "/media/organizations/govt-sindh.jpg", "Logo shown under clients.", 2),
    ("Government of Khyber Pakhtunkhwa", "client", "/media/organizations/govt-kpk.jpg", "Logo shown under clients.", 3),
    ("Government of Balochistan", "client", "/media/organizations/govt-balochistan.jpg", "Logo shown under clients.", 4),
    ("Pak Army", "client", "/media/organizations/pak-army.jpg", "Logo shown under clients. Project pages use the wording DGP Army.", 5),
    ("PESSI", "client", "/media/organizations/pessi.jpg", "Logo shown under clients.", 6),
    ("Punjab Seed Corporation", "client", "/media/organizations/punjab-seed.jpg", "Logo shown under clients.", 7),
    ("Tourism Development Corporation of Punjab", "client", "/media/organizations/tdcp.jpg", "Logo shown under clients, and named on the cycle boat project.", 8),
    ("RWMC", "client", "/media/organizations/rwmc.jpg", "Logo reads Think Clean / RWMC. Named on the vehicle branding project.", 9),
    ("LDA / TEPA", "client", "/media/organizations/lda-tepa.jpg", "File name lda-tepa. The word TEPA is visible on the mark.", 10),
    ("Punjab Saaf Pani Authority", "client", "/media/organizations/saaf-pani.jpg", "Logo shown under clients.", 11),
    ("Forestry, Wildlife & Fisheries, Punjab", "client", "/media/organizations/fwfp.jpg", "Logo shown under clients.", 12),
    ("WASA Lahore", "client", "/media/organizations/wasa.jpg", "Logo shown under clients. No WASA project text was published.", 13),
    ("Mezan", "client", "/media/organizations/mezan.jpg", "Mezan food mark, shown under clients. Not Meezan Bank.", 14),
    ("Metron International", "client", "/media/organizations/metron.jpg", "Logo shown under clients, and named on the mobile foam unit page.", 15),
    ("HBL", "client", "/media/organizations/hbl.jpg", "Logo shown under clients.", 16),
    ("University of Management and Technology", "client", "/media/organizations/umt.jpg", "Logo shown under clients.", 17),
    ("University of the Punjab", "client", "/media/organizations/punjab-university.jpg", "Logo shown under clients. This is not the University of Peshawar.", 18),
    ("Punjab Wildlife and Parks Department", "client", "/media/organizations/wildlife-parks.jpg", "Logo shown under clients, and named on the wildlife vehicle projects.", 19),
    ("Lahore Safari", "client", "/media/organizations/lahore-safari.jpg", "Logo shown under clients.", 20),
    ("Zameen", "client", "/media/organizations/zameen.jpg", "Logo shown under clients.", 21),
    ("TEVTA", "client", "/media/organizations/tevta.jpg", "TEVTA, Government of the Punjab. Logo shown under clients.", 22),
    ("Wildlife Hospital Safari Zoo", "client", "/media/organizations/wildlife-hospital.png", "Directorate General of Wildlife & Parks mark shown under clients.", 23),
]


def _org_rows():
    rows = []
    for name, kind, logo, notes, order in ORGANIZATION_ROWS:
        rows.append({"name": name, "kind": kind, "logo_url": logo, "notes": notes, "sort_order": order, "is_active": True})
    return rows


ORGANIZATION_ROWS = _org_rows()
