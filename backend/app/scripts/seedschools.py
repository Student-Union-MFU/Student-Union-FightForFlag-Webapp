# scripts/seed_schools.py
from app.db import SessionLocal
from models.school import School

SCHOOL_CODE_MAP = {
    "10": "School of Liberal Arts",
    "11": "School of Science",
    "12": "School of Management",
    "14": "School of Agro-Industry",
    "15": "School of Applied Digital Technology",
    "16": "School of Law",
    "17": "School of Cosmetic Science",
    "18": "School of Health Science",
    "19": "School of Nursing",
    "21": "School of Medicine",
    "22": "School of Dentistry",
    "23": "School of Social Innovation",
    "24": "School of Sinology",
    "25": "School of Integrative Medicine",
}

def seed_schools():
    db = SessionLocal()
    try:
        for code, name in SCHOOL_CODE_MAP.items():
            existing = db.query(School).filter(School.code == code).first()
            if not existing:
                db.add(School(code=code, name=name))
        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    seed_schools()