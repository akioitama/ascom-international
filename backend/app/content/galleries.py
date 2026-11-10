"""Published ASCOM project photographs, in gallery order.

The fetch script saves these as /media/projects/{slug}/{n}.jpg.
Only images that already appear on ascomintl.com are listed.
"""

BASE = "https://ascomintl.com/wp-content/uploads/2025/05/"

GALLERIES: dict[str, list[tuple[str, str]]] = {
    "fire-crash-truck": [
        (BASE + "WhatsApp-Image-2025-05-02-at-2.02.05-AM.jpeg", "Fire crash trucks lined up inside an industrial hall, from ASCOM's published project photographs."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.02.07-AM-1.jpeg", "Fire crash truck photographed for ASCOM's published fire crash truck project."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.02.06-AM.jpeg", "Fire crash truck detail from ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.02.06-AM-1.jpeg", "Fire crash truck photographed in ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.02.05-AM-1.jpeg", "Further view from ASCOM's published fire crash truck gallery."),
    ],
    "firefighting-cylinders": [
        (BASE + "WhatsApp-Image-2025-05-02-at-2.48.31-AM-1.jpeg", "Red firefighting cylinders stored in a workshop, from ASCOM's published project photographs."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.48.32-AM.jpeg", "Firefighting cylinders from ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.48.33-AM.jpeg", "Firefighting cylinder valves from ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.48.31-AM.jpeg", "Rows of firefighting cylinders from ASCOM's published project gallery."),
    ],
    "rwmc-vehicle-branding": [
        (BASE + "WhatsApp-Image-2025-05-02-at-2.15.39-AM-2.jpeg", "RWMC operational vehicle with body branding, from ASCOM's published project photographs."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.15.42-AM.jpeg", "RWMC vehicle branding from ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.15.41-AM.jpeg", "RWMC vehicle paint and lettering from ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.15.40-AM.jpeg", "Further RWMC vehicle photograph from ASCOM's published project gallery."),
    ],
    "mobile-foam-unit": [
        (BASE + "WhatsApp-Image-2025-05-02-at-2.09.52-AM.jpeg", "Yellow mobile foam units on wheeled frames inside a workshop, from ASCOM's published project photographs."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.09.53-AM.jpeg", "Mobile foam units from ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.09.52-AM-1.jpeg", "Mobile foam unit detail from ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.09.53-AM-1.jpeg", "Further mobile foam units from ASCOM's published project gallery."),
    ],
    "water-trailer": [
        (BASE + "WhatsApp-Image-2025-05-02-at-2.06.54-AM-1.jpeg", "Two-wheel water trailers, from ASCOM's published project photographs."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.06.57-AM.jpeg", "Water trailers from ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.06.56-AM.jpeg", "Water trailer chassis from ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.06.55-AM.jpeg", "Further water trailers from ASCOM's published project gallery."),
    ],
    "cycle-boats": [
        (BASE + "WhatsApp-Image-2025-05-02-at-2.34.05-AM-1.jpeg", "Cycle boats at a lake, from ASCOM's published project photographs."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.34.12-AM.jpeg", "Cycle boats from ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.34.05-AM.jpeg", "Cycle boat frames from ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.34.04-AM.jpeg", "Further cycle boat photograph from ASCOM's published project gallery."),
    ],
    "sundar-prefabricated-site": [
        (BASE + "WhatsApp-Image-2025-05-02-at-2.47.44-AM.jpeg", "Crew at the prefabricated construction site at Sundar Industrial Estate, from ASCOM's published project photographs."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.47.45-AM.jpeg", "Prefabricated site photograph published by ASCOM."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.47.44-AM-1.jpeg", "Steelwork at the Sundar prefabricated site, from ASCOM's published gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.47.45-AM-1.jpeg", "Further view of the Sundar prefabricated site published by ASCOM."),
    ],
    "wildlife-vehicle-back-body": [
        (BASE + "WhatsApp-Image-2025-05-02-at-2.39.09-AM.jpeg", "Fabricated vehicle back body with Wildlife Rangers livery, from ASCOM's published project photographs."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.39.12-AM.jpeg", "Vehicle back body from ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.39.11-AM.jpeg", "Vehicle back body detail from ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.39.10-AM.jpeg", "Further vehicle back body photograph published by ASCOM."),
    ],
    "wildlife-vehicle-branding": [
        (BASE + "WhatsApp-Image-2025-05-02-at-2.37.04-AM-8.jpeg", "Wildlife Rangers vehicles after painting and branding, from ASCOM's published project photographs."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.37.04-AM.jpeg", "Wildlife Rangers vehicle livery from ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.37.04-AM-4.jpeg", "Wildlife Rangers door branding from ASCOM's published project gallery."),
        (BASE + "WhatsApp-Image-2025-05-02-at-2.37.04-AM-1.jpeg", "Further Wildlife Rangers vehicle photograph published by ASCOM."),
    ],
}
