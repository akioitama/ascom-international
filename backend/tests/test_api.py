def test_health(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "ok"


def test_home_uses_researched_content(client):
    response = client.get("/api/v1/home")
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["profile"]["legal_name"] == "ASCOM International"
    assert data["profile"]["email_primary"] == "info@ascomintl.com"
    assert data["settings"]["hero_title"] == "Engineering Solutions. Building Progress."
    assert len(data["values"]) == 6
    assert data["statistics"] == []
    names = {item["name"] for item in data["divisions"]}
    assert "Manufacturing" in names
    assert "Road Beautification" not in names
    assert any(item["slug"] == "fire-crash-truck" for item in data["projects"])


def test_water_trailer_keeps_only_published_specs(client):
    response = client.get("/api/v1/products/water-trailer-1-5-ton")
    assert response.status_code == 200
    specs = {item["label"]: item["value"] for item in response.json()["data"]["specs"]}
    assert specs["Capacity"] == "400 gallons"
    assert "Pump" not in specs


def test_contact_validation_and_persistence(client):
    rejected = client.post("/api/v1/contact", data={"full_name": "A", "email": "not-an-email"})
    assert rejected.status_code == 422

    accepted = client.post(
        "/api/v1/contact",
        data={
            "full_name": "Ayesha Khan",
            "company": "North Works",
            "email": "ayesha@example.com",
            "phone": "+92 300 0000000",
            "country": "Pakistan",
            "category": "Manufacturing",
            "subject": "Metal fabrication",
            "message": "We need a fabricated assembly for a site in Lahore.",
        },
    )
    assert accepted.status_code == 201
    honeypot = client.post(
        "/api/v1/contact",
        data={
            "full_name": "Spam Bot",
            "email": "spam@example.com",
            "phone": "1234567",
            "country": "Pakistan",
            "category": "General",
            "subject": "Offer",
            "message": "This is a long enough spam message for the form.",
            "fax_number": "filled",
        },
    )
    assert honeypot.status_code == 400


def test_admin_requires_auth_and_can_create_a_product(client):
    blocked = client.get("/api/v1/admin/dashboard")
    assert blocked.status_code == 401
    login = client.post("/api/v1/auth/login", json={"email": "admin@ascomintl.com", "password": "test-password-123"})
    assert login.status_code == 200
    token = login.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    dashboard = client.get("/api/v1/admin/dashboard", headers=headers)
    assert dashboard.status_code == 200
    assert dashboard.json()["data"]["inquiries"] == 0
    categories = client.get("/api/v1/product-categories").json()["data"]
    category_id = categories[0]["id"]
    created = client.post(
        "/api/v1/admin/products",
        headers=headers,
        json={
            "name": "Test bollard note",
            "summary": "A note created from the admin API.",
            "description": "Created during the automated test.",
            "category_id": category_id,
            "is_active": True,
            "specs": [{"label": "Height", "value": "To be confirmed"}],
        },
    )
    assert created.status_code == 201
    slug = created.json()["data"]["slug"]
    public = client.get(f"/api/v1/products/{slug}")
    assert public.status_code == 200
    assert public.json()["data"]["specs"][0]["value"] == "To be confirmed"


def test_unknown_project_is_a_clean_404(client):
    response = client.get("/api/v1/projects/not-a-real-project")
    assert response.status_code == 404
    assert "error" in response.json()
