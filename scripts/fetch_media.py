"""Download published ASCOM photographs and copy verified logos."""
import sys
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "frontend" / "public" / "media"
sys.path.append(str(ROOT / "backend"))

from app.content.galleries import GALLERIES  # noqa: E402

LOGO_SOURCE = Path(r"h:\Projects\Ascom\research-raw\logos")
LOGO_MAP = {
    "pec.jpg": "pec.jpg",
    "fbr.jpg": "fbr.jpg",
    "pra.jpg": "pra.jpg",
    "tlc.jpg": "lcci.jpg",
    "psw.jpg": "psw.jpg",
    "excise.jpg": "excise.jpg",
    "govtp.jpg": "govt-punjab.jpg",
    "govts.jpg": "govt-sindh.jpg",
    "govtk.jpg": "govt-kpk.jpg",
    "govtb.jpg": "govt-balochistan.jpg",
    "parmy.jpg": "pak-army.jpg",
    "pessi.jpg": "pessi.jpg",
    "psc.jpg": "punjab-seed.jpg",
    "tdp.jpg": "tdcp.jpg",
    "rwmc.jpg": "rwmc.jpg",
    "lda.jpg": "lda-tepa.jpg",
    "pspa.jpg": "saaf-pani.jpg",
    "fwfp.jpg": "fwfp.jpg",
    "wasa.jpg": "wasa.jpg",
    "mezan.jpg": "mezan.jpg",
    "metron.jpg": "metron.jpg",
    "nestle-check.jpg": "hbl.jpg",
    "umt.jpg": "umt.jpg",
    "pu.jpg": "punjab-university.jpg",
    "pwpd.jpg": "wildlife-parks.jpg",
    "safari.jpg": "lahore-safari.jpg",
    "zamen.jpg": "zameen.jpg",
    "tevta.jpg": "tevta.jpg",
    "client-png.png": "wildlife-hospital.png",
    "logo.png": "../brand/ascom-logo.png",
}

ATMOSPHERE = {
    "technology.jpg": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=80",
    "road.jpg": "https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=2000&q=80",
}


def main() -> None:
    session = requests.Session()
    session.headers["User-Agent"] = "ASCOM-website-build/1.0"
    org_dir = PUBLIC / "organizations"
    org_dir.mkdir(parents=True, exist_ok=True)
    (PUBLIC / "brand").mkdir(parents=True, exist_ok=True)
    (PUBLIC / "atmosphere").mkdir(parents=True, exist_ok=True)
    for source_name, target_name in LOGO_MAP.items():
        target = (org_dir / target_name).resolve()
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes((LOGO_SOURCE / source_name).read_bytes())
        print("logo", target.name)
    for slug, images in GALLERIES.items():
        folder = PUBLIC / "projects" / slug
        folder.mkdir(parents=True, exist_ok=True)
        for index, (url, _alt) in enumerate(images, start=1):
            destination = folder / f"{index:02d}.jpg"
            if destination.exists() and destination.stat().st_size > 1000:
                continue
            response = None
            for attempt in range(4):
                try:
                    response = session.get(url, timeout=60)
                    response.raise_for_status()
                    break
                except requests.RequestException as exc:
                    print("retry", slug, index, attempt, exc.__class__.__name__)
                    response = None
            if response is None:
                raise SystemExit(f"Failed to download {url}")
            destination.write_bytes(response.content)
            print(slug, index, len(response.content))
    for name, url in ATMOSPHERE.items():
        destination = PUBLIC / "atmosphere" / name
        if destination.exists() and destination.stat().st_size > 1000:
            continue
        response = None
        for attempt in range(4):
            try:
                response = session.get(url, timeout=60)
                response.raise_for_status()
                break
            except requests.RequestException as exc:
                print("retry atmosphere", name, attempt, exc.__class__.__name__)
                response = None
        if response is None:
            raise SystemExit(f"Failed to download {url}")
        if not response.content.startswith(b"\xff\xd8"):
            raise SystemExit(f"{name} is not a jpeg")
        destination.write_bytes(response.content)
        print("atmosphere", name, len(response.content))


if __name__ == "__main__":
    main()
