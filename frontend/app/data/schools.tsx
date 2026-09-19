export interface School {
    id: string;
    code: string;
    name: string;
    color: string;
    voteCount: number;
}

export const SCHOOLS: School[] = [
    {
        id: "liberal-arts",
        code: "10",
        name: "School of Liberal Arts",
        color: "#808285",
        voteCount: 0,
    },
    {
        id: "science",
        code: "11",
        name: "School of Science",
        color: "#FFF100",
        voteCount: 0,
    },
    {
        id: "management",
        code: "12",
        name: "School of Management",
        color: "#00ADFE",
        voteCount: 0,
    },
    {
        id: "agro-industry",
        code: "14",
        name: "School of Agro-Industry",
        color: "#F499C1",
        voteCount: 0,
    },
    {
        id: "adt",
        code: "15",
        name: "School of Applied Digital Technology",
        color: "#140858",
        voteCount: 0,
    },
    {
        id: "law",
        code: "16",
        name: "School of Law",
        color: "#FFFFFF",
        voteCount: 0,
    },
    {
        id: "cosmetic-science",
        code: "17",
        name: "School of Cosmetic Science",
        color: "#EC008B",
        voteCount: 0,
    },
    {
        id: "health-science",
        code: "18",
        name: "School of Health Science",
        color: "#4DAB47",
        voteCount: 0,
    },
    {
        id: "nursing",
        code: "19",
        name: "School of Nursing",
        color: "#F5821F",
        voteCount: 0,
    },
    {
        id: "medicine",
        code: "21",
        name: "School of Medicine",
        color: "#004E42",
        voteCount: 0,
    },
    {
        id: "dentistry",
        code: "22",
        name: "School of Dentistry",
        color: "#642B8E",
        voteCount: 0,
    },
    {
        id: "social-innovation",
        code: "23",
        name: "School of Social Innovation",
        color: "#FFECA9",
        voteCount: 0,
    },
    {
        id: "sinology",
        code: "24",
        name: "School of Sinology",
        color: "#ED1C24",
        voteCount: 0,
    },
    {
        id: "integrative-medicine",
        code: "25",
        name: "School of Integrative Medicine",
        color: "#40E0D0",
        voteCount: 0,
    },
];

export const MAJOR_CODE_MAP: Record<string, string> = {
    "10-06": "English / Thai Language and Culture for Foreigners",

    "11-02": "Applied Chemistry",
    "11-05": "Biosciences / Biological Science",
    "11-12": "Materials Engineering",

    "12-01": "Accounting",
    "12-02": "Economics",
    "12-03": "Business Administration",
    "12-05": "Tourism Business and Events",
    "12-07": "Hospitality Business Management",
    "12-09": "Logistics and Supply Chain Management",

    "14-01": "Innovative Food Science and Technology",
    "14-07": "Agri-Food Logistics",

    "15-01": "Computer Engineering",
    "15-02": "Digital and Communication Engineering",
    "15-03": "Software Engineering",
    "15-06": "Multimedia Technology and Animation",

    "16-01": "Laws",
    "16-06": "Business Law and Chinese Communication",

    "17-01": "Cosmetic Science",
    "17-03": "Beauty Technology",

    "18-04": "Public Health",
    "18-06": "Sports and Health Science",
    "18-07": "Environmental Health",
    "18-08": "Occupational Health and Safety",

    "19-01": "Nursing Science / Practical Nursing",

    "21-01": "Medicine",

    "22-01": "Doctor of Dental Surgery",

    "23-01": "International Development",

    "24-01": "Chinese Studies",
    "24-02": "Business Chinese",
    "24-03": "Teaching Chinese Language",
    "24-04": "Chinese Language and Culture",

    "25-01": "Applied Thai Traditional Medicine",
    "25-02": "Physical Therapy",
    "25-03": "Traditional Chinese Medicine",
};

export function getMajorCount(
    schoolCode: string | number
): number {
    const code = String(schoolCode).padStart(2, "0");

    return Object.keys(MAJOR_CODE_MAP).filter((key) =>
        key.startsWith(code + "-")
    ).length;
}