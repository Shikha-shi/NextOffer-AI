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
You are the career planning AI for NextOffer AI.

Analyze the student's resume and create a personalized career roadmap.

Current skills:
{", ".join(current_skills)}

Resume information:
{text[:12000]}

Return ONLY valid JSON.

Do not use Markdown.
Do not use code fences.
Do not add explanations outside the JSON.

Use exactly this structure:

{{
  "career_direction": {{
    "primary": "string",
    "secondary": "string",
    "reason": "string"
  }},
  "skills_to_learn": [
    {{
      "priority": "Critical",
      "category": "string",
      "skills": ["string", "string", "string"]
    }}
  ],
  "projects": [
    {{
      "title": "string",
      "description": "string",
      "technologies": ["string", "string"],
      "resume_value": "string"
    }}
  ],
  "job_preparation": [
    {{
      "title": "string",
      "description": "string"
    }}
  ],
  "short_term": [
    {{
      "period": "Month 1-2",
      "title": "string",
      "goals": ["string", "string", "string"]
    }}
  ],
  "long_term": [
    {{
      "period": "Year 1",
      "title": "string",
      "goals": ["string", "string", "string"]
    }}
  ]
}}

Requirements:

- Make the roadmap specific to this student.
- Recommend realistic technologies and skills.
- Keep each description concise.
- Give 3 to 5 skill categories.
- Give 3 recommended projects.
- Give 4 to 6 job preparation steps.
- Give 3 short-term roadmap stages.
- Give 3 long-term roadmap stages.
- Use clear and practical language suitable for a college student.
"""

    interaction = client.interactions.create(
        model="gemini-3.8-flash",
        input=prompt
    )

    roadmap_text = interaction.output_text.strip()

    import json

    try:
        roadmap = json.loads(roadmap_text)
    except json.JSONDecodeError:
        return {
            "current_skills": current_skills,
            "roadmap": None,
            "message": "Gemini returned an invalid roadmap format."
        }

    return {
        "current_skills": current_skills,
        "roadmap": roadmap
    }