from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database.database import get_db
from app.routers.auth import get_current_user
from models.resume import Resume
from app.routers.resume import SKILLS
from app.routers.jobs import JOB_ROLES

router = APIRouter(
    prefix="/career-roadmap",
    tags=["Career Roadmap"]
)


ROADMAP_PLANS = {
    "Frontend Developer": {
        "secondary": "Full Stack Developer",
        "skills": [
            {
                "priority": "Critical",
                "category": "Backend Development",
                "skills": ["Node.js", "REST API", "SQL"]
            },
            {
                "priority": "High",
                "category": "Advanced Frontend",
                "skills": ["TypeScript", "React", "State Management"]
            },
            {
                "priority": "High",
                "category": "Development Practices",
                "skills": ["Git", "Testing", "API Integration"]
            }
        ],
        "projects": [
            {
                "title": "Full Stack Career Platform",
                "description": "Build a career platform with authentication, profiles, dashboards and job recommendations.",
                "technologies": [
                    "React",
                    "TypeScript",
                    "Node.js",
                    "PostgreSQL"
                ],
                "resume_value": "Demonstrates full-stack development and real-world application architecture."
            },
            {
                "title": "Advanced React Dashboard",
                "description": "Build a responsive dashboard with reusable components and API integration.",
                "technologies": [
                    "React",
                    "TypeScript",
                    "Tailwind CSS"
                ],
                "resume_value": "Demonstrates advanced frontend development skills."
            },
            {
                "title": "Job Tracking Application",
                "description": "Create an application for tracking applications, interviews and job opportunities.",
                "technologies": [
                    "React",
                    "TypeScript",
                    "REST API",
                    "PostgreSQL"
                ],
                "resume_value": "Shows practical frontend and API integration experience."
            }
        ]
    },

    "Full Stack Developer": {
        "secondary": "Backend Developer",
        "skills": [
            {
                "priority": "Critical",
                "category": "Backend Development",
                "skills": ["Node.js", "Express.js", "REST API"]
            },
            {
                "priority": "High",
                "category": "Database",
                "skills": ["PostgreSQL", "SQL", "Database Design"]
            },
            {
                "priority": "High",
                "category": "Deployment",
                "skills": ["Docker", "AWS", "CI/CD"]
            }
        ],
        "projects": [
            {
                "title": "Full Stack E-Commerce Platform",
                "description": "Build an e-commerce platform with authentication, products, cart and payments.",
                "technologies": [
                    "React",
                    "Node.js",
                    "PostgreSQL",
                    "Docker"
                ],
                "resume_value": "Demonstrates complete full-stack application development."
            },
            {
                "title": "Student Management System",
                "description": "Create a system for managing students, courses and academic records.",
                "technologies": [
                    "React",
                    "Node.js",
                    "PostgreSQL"
                ],
                "resume_value": "Demonstrates CRUD operations, database design and API development."
            },
            {
                "title": "Real-Time Collaboration App",
                "description": "Build a real-time application with messaging and live updates.",
                "technologies": [
                    "React",
                    "Node.js",
                    "WebSocket",
                    "PostgreSQL"
                ],
                "resume_value": "Demonstrates real-time communication and full-stack architecture."
            }
        ]
    },

    "Backend Developer": {
        "secondary": "Full Stack Developer",
        "skills": [
            {
                "priority": "Critical",
                "category": "Backend Engineering",
                "skills": ["FastAPI", "REST API", "Authentication"]
            },
            {
                "priority": "High",
                "category": "Database",
                "skills": ["PostgreSQL", "SQL", "Database Design"]
            },
            {
                "priority": "High",
                "category": "Deployment",
                "skills": ["Docker", "AWS", "CI/CD"]
            }
        ],
        "projects": [
            {
                "title": "Production REST API",
                "description": "Build a secure REST API with authentication, validation and database integration.",
                "technologies": [
                    "FastAPI",
                    "PostgreSQL",
                    "JWT",
                    "SQLAlchemy"
                ],
                "resume_value": "Demonstrates production-ready backend development."
            },
            {
                "title": "Real-Time Chat Backend",
                "description": "Build a scalable backend supporting real-time communication between users.",
                "technologies": [
                    "FastAPI",
                    "WebSocket",
                    "PostgreSQL"
                ],
                "resume_value": "Demonstrates real-time backend and WebSocket development."
            },
            {
                "title": "Cloud Deployed API",
                "description": "Deploy a FastAPI application with database and secure environment configuration.",
                "technologies": [
                    "FastAPI",
                    "PostgreSQL",
                    "Docker",
                    "AWS"
                ],
                "resume_value": "Demonstrates deployment and cloud backend skills."
            }
        ]
    },

    "Data Scientist": {
        "secondary": "Machine Learning Engineer",
        "skills": [
            {
                "priority": "Critical",
                "category": "Machine Learning",
                "skills": [
                    "Machine Learning",
                    "Feature Engineering",
                    "Model Evaluation"
                ]
            },
            {
                "priority": "High",
                "category": "Deep Learning",
                "skills": [
                    "Deep Learning",
                    "Neural Networks",
                    "CNNs"
                ]
            },
            {
                "priority": "High",
                "category": "Data Analysis",
                "skills": [
                    "Python",
                    "SQL",
                    "Statistics"
                ]
            }
        ],
        "projects": [
            {
                "title": "Student Performance Predictor",
                "description": "Build a machine learning system that predicts student academic performance.",
                "technologies": [
                    "Python",
                    "Machine Learning",
                    "SQL"
                ],
                "resume_value": "Demonstrates an end-to-end machine learning workflow."
            },
            {
                "title": "Customer Churn Prediction",
                "description": "Predict customers who are likely to leave a service.",
                "technologies": [
                    "Python",
                    "Machine Learning",
                    "Pandas"
                ],
                "resume_value": "Demonstrates practical classification and data analysis."
            },
            {
                "title": "Image Classification System",
                "description": "Build an image classification model using deep learning.",
                "technologies": [
                    "Python",
                    "Deep Learning",
                    "CNN"
                ],
                "resume_value": "Demonstrates practical deep learning experience."
            }
        ]
    },

    "Machine Learning Engineer": {
        "secondary": "Data Scientist",
        "skills": [
            {
                "priority": "Critical",
                "category": "Machine Learning",
                "skills": [
                    "Machine Learning",
                    "Model Evaluation",
                    "Feature Engineering"
                ]
            },
            {
                "priority": "Critical",
                "category": "Deep Learning",
                "skills": [
                    "Deep Learning",
                    "CNNs",
                    "Transfer Learning"
                ]
            },
            {
                "priority": "High",
                "category": "Deployment",
                "skills": [
                    "FastAPI",
                    "Docker",
                    "AWS"
                ]
            }
        ],
        "projects": [
            {
                "title": "ML Prediction API",
                "description": "Train a machine learning model and expose predictions through a REST API.",
                "technologies": [
                    "Python",
                    "Machine Learning",
                    "FastAPI",
                    "Docker"
                ],
                "resume_value": "Demonstrates both ML development and deployment."
            },
            {
                "title": "Computer Vision Application",
                "description": "Build an image recognition application using a deep learning model.",
                "technologies": [
                    "Python",
                    "Deep Learning",
                    "CNN"
                ],
                "resume_value": "Demonstrates practical computer vision experience."
            },
            {
                "title": "Production ML Pipeline",
                "description": "Create a pipeline for training, evaluating and deploying machine learning models.",
                "technologies": [
                    "Python",
                    "Machine Learning",
                    "Docker",
                    "AWS"
                ],
                "resume_value": "Demonstrates production-oriented ML engineering."
            }
        ]
    }
}


def extract_resume_skills(resume_path: str):
    from pypdf import PdfReader

    reader = PdfReader(resume_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + " "

    text_lower = text.lower()

    return [
        skill
        for skill in SKILLS
        if skill.lower() in text_lower
    ]


def find_best_career(current_skills):
    career_matches = []

    for role, required_skills in JOB_ROLES.items():
        matched_skills = [
            skill
            for skill in required_skills
            if skill in current_skills
        ]

        percentage = (
            len(matched_skills) / len(required_skills)
        ) * 100

        career_matches.append({
            "role": role,
            "match_percentage": round(percentage, 2),
            "matched_skills": matched_skills,
            "required_skills": required_skills
        })

    career_matches.sort(
        key=lambda item: item["match_percentage"],
        reverse=True
    )

    return career_matches


@router.get("")
def generate_career_roadmap(
    career: str | None = Query(
        default=None,
        description="Career path for which the roadmap should be generated"
    ),
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

    current_skills = extract_resume_skills(
        resume.file_path
    )

    career_matches = find_best_career(
        current_skills
    )

    if career:
        selected_career = career.strip()

        matched_career = next(
            (
                item
                for item in career_matches
                if item["role"].lower() == selected_career.lower()
            ),
            None
        )

        if not matched_career:
            return {
                "message": "Invalid career selection.",
                "available_careers": list(JOB_ROLES.keys()),
                "roadmap": None
            }

        best_career = matched_career
        career_direction = matched_career["role"]

    else:
        best_career = career_matches[0]
        career_direction = best_career["role"]

    plan = ROADMAP_PLANS.get(
        career_direction,
        ROADMAP_PLANS["Backend Developer"]
    )

    current_skills_lower = {
        skill.lower()
        for skill in current_skills
    }

    missing_skills = [
        skill
        for skill in best_career["required_skills"]
        if skill.lower() not in current_skills_lower
    ]

    skill_categories = []

    for category in plan["skills"]:
        new_skills = [
            skill
            for skill in category["skills"]
            if skill.lower() not in current_skills_lower
        ]

        if new_skills:
            skill_categories.append({
                "priority": category["priority"],
                "category": category["category"],
                "skills": new_skills
            })

    for skill in missing_skills:
        already_present = any(
            skill.lower() in {
                item.lower()
                for item in category["skills"]
            }
            for category in skill_categories
        )

        if not already_present:
            skill_categories.append({
                "priority": "High",
                "category": "Career Skills",
                "skills": [skill]
            })

    if not skill_categories:
        skill_categories.append({
            "priority": "Medium",
            "category": "Advanced Skills",
            "skills": [
                "Advanced System Design",
                "Testing",
                "Deployment"
            ]
        })

    roadmap = {
        "career_direction": {
            "primary": career_direction,
            "secondary": plan["secondary"],
            "reason": (
                f"Your resume currently matches "
                f"{best_career['match_percentage']}% of the required "
                f"skills for {career_direction}."
            )
        },
        "skills_to_learn": skill_categories,
        "projects": plan["projects"],
        "job_preparation": [
            {
                "title": "Strengthen Data Structures and Algorithms",
                "description": "Practice arrays, strings, trees, graphs and dynamic programming."
            },
            {
                "title": "Build Strong Projects",
                "description": "Complete practical projects that demonstrate your target career skills."
            },
            {
                "title": "Prepare Technical Interviews",
                "description": "Practice role-specific technical questions and explain your projects clearly."
            },
            {
                "title": "Improve Resume",
                "description": "Highlight measurable project achievements, technologies and relevant skills."
            },
            {
                "title": "Practice Coding Regularly",
                "description": "Solve coding problems consistently and review your solutions."
            }
        ],
        "short_term": [
            {
                "period": "Month 1-2",
                "title": "Strengthen Core Skills",
                "goals": [
                    f"Improve {skill_categories[0]['skills'][0]}",
                    f"Learn {skill_categories[1]['skills'][0] if len(skill_categories) > 1 else skill_categories[0]['skills'][0]}",
                    "Practice coding problems regularly"
                ]
            },
            {
                "period": "Month 3-4",
                "title": "Build Projects",
                "goals": [
                    "Complete one major portfolio project",
                    "Apply newly learned technologies",
                    "Improve GitHub project documentation"
                ]
            },
            {
                "period": "Month 5-6",
                "title": "Interview Preparation",
                "goals": [
                    "Practice technical interviews",
                    "Improve resume and portfolio",
                    "Start applying for internships"
                ]
            }
        ],
        "long_term": [
            {
                "period": "Year 1",
                "title": "Become Job Ready",
                "goals": [
                    f"Become proficient in {career_direction}",
                    "Build multiple strong portfolio projects",
                    "Gain internship or practical experience"
                ]
            },
            {
                "period": "Year 2",
                "title": "Advance Technical Skills",
                "goals": [
                    "Learn advanced system design concepts",
                    "Work with production-level technologies",
                    "Contribute to real-world projects"
                ]
            },
            {
                "period": "Year 3",
                "title": "Launch Your Career",
                "goals": [
                    "Prepare for placement opportunities",
                    "Build a strong professional portfolio",
                    "Target software engineering roles"
                ]
            }
        ]
    }

    return {
        "selected_career": career_direction,
        "current_skills": current_skills,
        "career_match_percentage": best_career["match_percentage"],
        "available_careers": list(JOB_ROLES.keys()),
        "roadmap": roadmap
    }