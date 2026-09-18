import re
from dataclasses import dataclass

MFU_EMAIL_PATTERN = re.compile(r"^(\d{10})@lamduan\.mfu\.ac\.th$")
VALID_YEAR_PREFIXES = {"66", "67", "68", "69"}

DEGREE_LEVELS = {
    "1": "Doctoral / Ph.D.",
    "2": "Master's Degree",
    "3": "Bachelor's Degree",
}

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

MAJOR_CODE_MAP = {
    ("10", "06"): "English / Thai Language and Culture for Foreigners",

    ("11", "02"): "Applied Chemistry",
    ("11", "05"): "Biosciences / Biological Science",
    ("11", "12"): "Materials Engineering",

    ("12", "01"): "Accounting",
    ("12", "02"): "Economics",
    ("12", "03"): "Business Administration",
    ("12", "05"): "Tourism Business and Events",
    ("12", "07"): "Hospitality Business Management",
    ("12", "09"): "Logistics and Supply Chain Management",

    ("14", "01"): "Innovative Food Science and Technology",
    ("14", "07"): "Agri-Food Logistics",

    ("15", "01"): "Computer Engineering", 
    ("15", "02"): "Digital and Communication Engineering",
    ("15", "03"): "Software Engineering", 
    ("15", "06"): "Multimedia Technology and Animation",

    ("16", "01"): "Laws",
    ("16", "06"): "Business Law and Chinese Communication",

    ("17", "01"): "Cosmetic Science", 
    ("17", "03"): "Beauty Technology",

    ("18", "04"): "Public Health",
    ("18", "06"): "Sports and Health Science",
    ("18", "07"): "Environmental Health",
    ("18", "08"): "Occupational Health and Safety",

    ("19", "01"): "Nursing Science / Practical Nursing",

    ("21", "01"): "Medicine",

    ("22", "01"): "Doctor of Dental Surgery",

    ("23", "01"): "International Development",

    ("24", "01"): "Chinese Studies",
    ("24", "02"): "Business Chinese",
    ("24", "03"): "Teaching Chinese Language",
    ("24", "04"): "Chinese Language and Culture",

    ("25", "01"): "Applied Thai Traditional Medicine",
    ("25", "02"): "Physical Therapy",
    ("25", "03"): "Traditional Chinese Medicine", 
}


@dataclass
class MfuStudentInfo:
    student_id: str
    year: str
    degree_level: str
    school: str
    major: str


def parse_mfu_student_email(email: str) -> MfuStudentInfo:
    """Validates MFU student email and extracts ID, year, degree level, school, major.
    Raises ValueError if invalid or unrecognized."""
    match = MFU_EMAIL_PATTERN.match(email)
    if not match:
        raise ValueError("Email must be a valid @lamduan.mfu.ac.th student address")

    student_id = match.group(1)
    year = student_id[0:2]
    level_digit = student_id[2]
    school_code = student_id[3:5]
    major_code = student_id[5:7]

    if year not in VALID_YEAR_PREFIXES:
        raise ValueError(f"Student ID year prefix '{year}' is not allowed")

    degree_level = DEGREE_LEVELS.get(level_digit)
    if degree_level is None:
        raise ValueError(f"Unknown degree level digit '{level_digit}'")

    school = SCHOOL_CODE_MAP.get(school_code)
    if school is None:
        raise ValueError(f"Unknown school code '{school_code}'")

    major = MAJOR_CODE_MAP.get((school_code, major_code))
    if major is None:
        raise ValueError(f"Unknown major code '{major_code}' for school '{school_code}'")

    return MfuStudentInfo(
        student_id=student_id,
        year=year,
        degree_level=degree_level,
        school=school,
        major=major,
    )