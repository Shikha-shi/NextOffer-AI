import os
import shutil
from pypdf import PdfReader

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.routers.auth import get_current_user
from database.database import get_db
from models.resume import Resume
SKILLS = [
    "Python",
    "C",
    "C++",
    "Java",
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "FastAPI",
    "Django",
    "Flask",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "SQL",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Git",
    "GitHub",
    "Docker",
    "AWS",
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
    "Data Structures",
    "Algorithms",
    "REST API",
    "WebSocket",
]
ROLE_SKILLS = {
    "backend developer": [
        "Python",
        "FastAPI",
        "SQL",
        "PostgreSQL",
        "REST API",
        "Git",
        "Docker",
        "AWS",
    ],

    "frontend developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Git",
        "REST API",
    ],

    "full stack developer": [
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "SQL",
        "Git",
        "REST API",
        "Docker",
    ],

    "data scientist": [
        "Python",
        "SQL",
        "Machine Learning",
        "Deep Learning",
        "Algorithms",
    ],

    "machine learning engineer": [
        "Python",
        "Machine Learning",
        "Deep Learning",
        "Data Structures",
        "Algorithms",
        "Git",
        "Docker",
    ],
}

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


UPLOAD_DIR = "uploads/resumes"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Invalid file name."
        )

    existing_resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    file_name = f"user_{current_user.id}_resume.pdf"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if existing_resume:
        existing_resume.file_name = file.filename
        existing_resume.file_path = file_path
    else:
        resume = Resume(
            user_id=current_user.id,
            file_name=file.filename,
            file_path=file_path,
        )

        db.add(resume)

    db.commit()

    return {
        "message": "Resume uploaded successfully.",
        "file_name": file.filename,
    }


@router.get("/me")
def get_my_resume(
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
            "uploaded": False
        }

    return {
        "uploaded": True,
        "file_name": resume.file_name,
        "uploaded_at": resume.uploaded_at,
    }

@router.get("/text")
def extract_resume_text(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="No resume uploaded."
        )

    try:
        reader = PdfReader(resume.file_path)

        extracted_text = ""

        for page in reader.pages:
            text = page.extract_text()

            if text:
                extracted_text += text + "\n"

        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from this PDF."
            )

        return {
            "file_name": resume.file_name,
            "text": extracted_text,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to read resume: {str(e)}"
        )

@router.get("/skills")
def extract_resume_skills(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="No resume uploaded."
        )

    try:
        reader = PdfReader(resume.file_path)

        extracted_text = ""

        for page in reader.pages:
            text = page.extract_text()

            if text:
                extracted_text += text + "\n"

        text_lower = extracted_text.lower()

        detected_skills = []

        for skill in SKILLS:
            if skill.lower() in text_lower:
                detected_skills.append(skill)

        return {
            "file_name": resume.file_name,
            "skills": detected_skills,
            "total_skills": len(detected_skills),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze resume: {str(e)}"
        )

@router.get("/skill-gap")
def skill_gap_analysis(
    role: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="No resume uploaded."
        )

    role_key = role.lower().strip()

    required_skills = ROLE_SKILLS.get(role_key)

    if not required_skills:
        raise HTTPException(
            status_code=400,
            detail="Unsupported role."
        )

    try:
        reader = PdfReader(resume.file_path)

        extracted_text = ""

        for page in reader.pages:
            text = page.extract_text()

            if text:
                extracted_text += text + "\n"

        text_lower = extracted_text.lower()

        current_skills = []

        for skill in SKILLS:
            if skill.lower() in text_lower:
                current_skills.append(skill)

        current_skill_set = {
            skill.lower()
            for skill in current_skills
        }

        matched_skills = [
            skill
            for skill in required_skills
            if skill.lower() in current_skill_set
        ]

        missing_skills = [
            skill
            for skill in required_skills
            if skill.lower() not in current_skill_set
        ]

        total_required = len(required_skills)

        match_percentage = (
            len(matched_skills) / total_required * 100
            if total_required
            else 0
        )

        return {
            "role": role,
            "current_skills": current_skills,
            "required_skills": required_skills,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "match_percentage": round(match_percentage, 2),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze skill gap: {str(e)}"
        )