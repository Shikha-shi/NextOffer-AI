from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.database import get_db
from app.routers.auth import get_current_user
from models.resume import Resume
from app.routers.resume import SKILLS

router = APIRouter(
    prefix="/ai-assistant",
    tags=["AI Assistant"]
)


class AssistantRequest(BaseModel):
    question: str


@router.post("")
def ask_ai_assistant(
    request: AssistantRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    current_skills = []

    if resume:
        from pypdf import PdfReader

        reader = PdfReader(resume.file_path)

        resume_text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                resume_text += page_text + " "

        resume_text_lower = resume_text.lower()

        current_skills = [
            skill
            for skill in SKILLS
            if skill.lower() in resume_text_lower
        ]

    answer = (
        "Your AI Assistant is temporarily unavailable because the "
        "Gemini API quota has been reached. Your current skills are: "
        f"{', '.join(current_skills) if current_skills else 'No skills detected'}. "
        "Please try again after the Gemini quota resets."
    )

    return {
        "question": request.question,
        "answer": answer,
        "source": "fallback"
    }