from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from app.routers.auth import get_current_user
from models.resume import Resume
from app.routers.resume import SKILLS

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


JOB_ROLES = {
    "Backend Developer": [
        "Python",
        "FastAPI",
        "SQL",
        "PostgreSQL",
        "REST API",
        "Git",
        "Docker",
    ],
    "Frontend Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Git",
        "REST API",
    ],
    "Full Stack Developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "SQL",
        "Git",
        "REST API",
    ],
    "Data Scientist": [
        "Python",
        "SQL",
        "Machine Learning",
        "Deep Learning",
        "Algorithms",
    ],
    "Machine Learning Engineer": [
        "Python",
        "Machine Learning",
        "Deep Learning",
        "Data Structures",
        "Algorithms",
        "Git",
        "Docker",
    ],
}


@router.get("/recommendations")
def get_job_recommendations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if not resume:
        return {
            "message": "Please upload your resume first.",
            "recommendations": []
        }

    from pypdf import PdfReader

    reader = PdfReader(resume.file_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + " "

    text_lower = text.lower()

    current_skills = []

    for skill in SKILLS:
        if skill.lower() in text_lower:
            current_skills.append(skill)

    recommendations = []

    for role, required_skills in JOB_ROLES.items():

        matched_skills = [
            skill
            for skill in required_skills
            if skill in current_skills
        ]

        percentage = (
            len(matched_skills) / len(required_skills)
        ) * 100

        recommendations.append({
            "role": role,
            "match_percentage": round(percentage, 2),
            "matched_skills": matched_skills,
            "required_skills": required_skills,
        })

    recommendations.sort(
        key=lambda x: x["match_percentage"],
        reverse=True
    )

    return {
        "current_skills": current_skills,
        "recommendations": recommendations
    }