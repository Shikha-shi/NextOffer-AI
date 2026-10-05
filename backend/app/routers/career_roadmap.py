from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from google import genai

from database.database import get_db
from app.settings import settings
from app.routers.auth import get_current_user
from models.resume import Resume
from app.routers.resume import SKILLS


router = APIRouter(
    prefix="/career-roadmap",
    tags=["Career Roadmap"]
)


client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)


@router.get("")
def generate_career_roadmap(
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
            "roadmap": None
        }

    from pypdf import PdfReader

    reader = PdfReader(resume.file_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + " "

    text_lower = text.lower()

    current_skills = [
        skill
        for skill in SKILLS
        if skill.lower() in text_lower
    ]

    prompt = f"""
You are a career guidance AI for NextOffer AI.

Analyze the student's resume information and create a personalized
career roadmap.

Current skills:
{", ".join(current_skills)}

Resume information:
{text[:12000]}

Create a practical roadmap for the student.

Include:
1. Recommended career direction
2. Skills the student should learn next
3. Recommended projects
4. Learning priorities
5. Job preparation steps
6. A short-term roadmap
7. A long-term roadmap

Keep the response structured, practical, and suitable for a college student.
"""

    interaction = client.interactions.create(
        model="gemini-3.8-flash",
        input=prompt
    )

    return {
        "current_skills": current_skills,
        "roadmap": interaction.output_text
    }