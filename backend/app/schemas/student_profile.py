from pydantic import BaseModel, ConfigDict, Field


class StudentProfileBase(BaseModel):
    phone: str | None = Field(default=None, max_length=15)
    location: str | None = Field(default=None, max_length=150)
    college: str | None = Field(default=None, max_length=200)
    degree: str | None = Field(default=None, max_length=100)
    branch: str | None = Field(default=None, max_length=150)
    graduation_year: int | None = None
    target_role: str | None = Field(default=None, max_length=150)
    preferred_industry: str | None = Field(default=None, max_length=150)
    preferred_location: str | None = Field(default=None, max_length=150)
    work_mode: str | None = Field(default=None, max_length=50)
    technical_skills: str | None = None
    soft_skills: str | None = None
    experience_level: str | None = Field(default=None, max_length=100)
    projects: str | None = None


class StudentProfileCreate(StudentProfileBase):
    pass


class StudentProfileUpdate(BaseModel):
    phone: str | None = Field(default=None, max_length=15)
    location: str | None = Field(default=None, max_length=150)
    college: str | None = Field(default=None, max_length=200)
    degree: str | None = Field(default=None, max_length=100)
    branch: str | None = Field(default=None, max_length=150)
    graduation_year: int | None = None
    target_role: str | None = Field(default=None, max_length=150)
    preferred_industry: str | None = Field(default=None, max_length=150)
    preferred_location: str | None = Field(default=None, max_length=150)
    work_mode: str | None = Field(default=None, max_length=50)
    technical_skills: str | None = None
    soft_skills: str | None = None
    experience_level: str | None = Field(default=None, max_length=100)
    projects: str | None = None


class StudentProfileResponse(StudentProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int