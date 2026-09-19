from app.db import SessionLocal
from models.school import School


SCHOOL_CODE_MAP = {
    "10": {
        "name": "School of Liberal Arts",
        "color": "#808285",
    },
    "11": {
        "name": "School of Science",
        "color": "#FFF100",
    },
    "12": {
        "name": "School of Management",
        "color": "#00ADFE",
    },
    "14": {
        "name": "School of Agro-Industry",
        "color": "#F499C1",
    },
    "15": {
        "name": "School of Applied Digital Technology",
        "color": "#140858",
    },
    "16": {
        "name": "School of Law",
        "color": "#FFFFFF",
    },
    "17": {
        "name": "School of Cosmetic Science",
        "color": "#EC008B",
    },
    "18": {
        "name": "School of Health Science",
        "color": "#4DAB47",
    },
    "19": {
        "name": "School of Nursing",
        "color": "#F5821F",
    },
    "21": {
        "name": "School of Medicine",
        "color": "#006400",
    },
    "22": {
        "name": "School of Dentistry",
        "color": "#642B8E",
    },
    "23": {
        "name": "School of Social Innovation",
        "color": "#FFECA9",
    },
    "24": {
        "name": "School of Sinology",
        "color": "#ED1C24",
    },
    "25": {
        "name": "School of Integrative Medicine",
        "color": "#40E0D0",
    },
}


def seed_schools():
    db = SessionLocal()

    try:
        for code, data in SCHOOL_CODE_MAP.items():
            existing = (
                db.query(School)
                .filter(School.code == code)
                .first()
            )

            if existing:
                existing.name = data["name"]
                existing.color = data["color"]
            else:
                db.add(
                    School(
                        code=code,
                        name=data["name"],
                        color=data["color"],
                    )
                )

        db.commit()

    finally:
        db.close()


if __name__ == "__main__":
    seed_schools()