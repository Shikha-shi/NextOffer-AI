from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.database import get_db
from models.student_profile import StudentProfile
from app.schemas.student_profile import (
    StudentProfileCreate,
    StudentProfileResponse,
    StudentProfileUpdate,
)
from app.routers.auth import get_current_user

router = APIRouter(
    prefix="/profile",
    tags=["Student Profile"],
)


@router.post(
    "/",
    response_model=StudentProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_profile(
    profile_data: StudentProfileCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing_profile = (
        db.query(StudentProfile)
        .filter(StudentProfile.user_id == current_user.id)
        .first()
    )

    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student profile already exists.",
        )

    profile = StudentProfile(
        user_id=current_user.id,
        **profile_data.model_dump(),
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


@router.get(
    "/me",
    response_model=StudentProfileResponse,
)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    profile = (
        db.query(StudentProfile)
        .filter(StudentProfile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found.",
        )

    return profile
@router.get("/completion")
def get_profile_completion(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    profile = (
        db.query(StudentProfile)
        .filter(StudentProfile.user_id == current_user.id)
        .first()
    )

    if not profile:
        return {
            "completion_percentage": 0,
            "completed_fields": 0,
            "total_fields": 12,
        }

    fields = [
        profile.phone,
        profile.location,
        profile.college,
        profile.degree,
        profile.branch,
        profile.graduation_year,
        profile.target_role,
        profile.preferred_industry,
        profile.preferred_location,
        profile.work_mode,
        profile.technical_skills,
        profile.experience_level,
    ]

    completed_fields = sum(
        1 for field in fields
        if field is not None and str(field).strip() != ""
    )

    total_fields = len(fields)

    completion_percentage = round(
        (completed_fields / total_fields) * 100
    )

    return {
        "completion_percentage": completion_percentage,
        "completed_fields": completed_fields,
        "total_fields": total_fields,
    }


@router.put(
    "/me",
    response_model=StudentProfileResponse,
)
def update_my_profile(
    profile_data: StudentProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    profile = (
        db.query(StudentProfile)
        .filter(StudentProfile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found.",
        )

    update_data = profile_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)

    return profile