from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from app.routers.auth import get_current_user
from models.resume import Resume
from app.routers.resume import SKILLS
from app.routers.jobs import JOB_ROLES


router = APIRouter(
    prefix="/personalized-learning",
    tags=["Personalized Learning"]
)


LEARNING_PATHS = {
    "Frontend Developer": {
        "Node.js": {
            "priority": "Critical",
            "reason": "Node.js will extend your frontend skills into full-stack development.",
            "topics": [
                "Node.js fundamentals",
                "Express.js",
                "REST API development"
            ],
            "practice": [
                "Build a REST API with Node.js",
                "Create CRUD APIs with Express.js",
                "Connect an Express API to PostgreSQL"
            ],
            "project": "Build a full-stack task management application using React, Node.js and PostgreSQL."
        },
        "TypeScript": {
            "priority": "High",
            "reason": "Advanced TypeScript will make your React applications more scalable and maintainable.",
            "topics": [
                "Generics",
                "Interfaces and type composition",
                "Advanced utility types"
            ],
            "practice": [
                "Convert a JavaScript React component to TypeScript",
                "Create reusable generic components",
                "Build strongly typed API services"
            ],
            "project": "Build a type-safe React dashboard using TypeScript."
        },
        "React": {
            "priority": "High",
            "reason": "Advanced React knowledge will strengthen your existing frontend foundation.",
            "topics": [
                "React hooks",
                "State management",
                "Performance optimization"
            ],
            "practice": [
                "Build custom React hooks",
                "Implement reusable state management",
                "Optimize unnecessary component renders"
            ],
            "project": "Build a production-style React career dashboard."
        }
    },

    "Full Stack Developer": {
        "Node.js": {
            "priority": "Critical",
            "reason": "Node.js is the main missing skill preventing you from completing the full-stack stack.",
            "topics": [
                "Node.js fundamentals",
                "Express.js",
                "REST API development"
            ],
            "practice": [
                "Create a CRUD API with Express",
                "Implement JWT authentication",
                "Connect Node.js with PostgreSQL"
            ],
            "project": "Build a full-stack student management system using React, Node.js and PostgreSQL."
        },
        "Docker": {
            "priority": "High",
            "reason": "Docker will help you deploy and manage your full-stack applications consistently.",
            "topics": [
                "Images and containers",
                "Dockerfiles",
                "Docker Compose"
            ],
            "practice": [
                "Containerize a React application",
                "Containerize a Node.js API",
                "Run React, Node.js and PostgreSQL with Docker Compose"
            ],
            "project": "Dockerize a complete React, Node.js and PostgreSQL application."
        },
        "AWS": {
            "priority": "Medium",
            "reason": "Cloud deployment skills will make your full-stack projects more production-ready.",
            "topics": [
                "EC2",
                "S3",
                "IAM fundamentals"
            ],
            "practice": [
                "Deploy a backend on EC2",
                "Upload files to S3",
                "Configure basic IAM permissions"
            ],
            "project": "Deploy a full-stack application on AWS."
        }
    },

    "Backend Developer": {
        "Docker": {
            "priority": "Critical",
            "reason": "Docker is the main missing skill in your backend development stack.",
            "topics": [
                "Docker images and containers",
                "Dockerfiles",
                "Docker Compose"
            ],
            "practice": [
                "Containerize a FastAPI application",
                "Connect FastAPI with PostgreSQL using Docker",
                "Create a multi-container backend"
            ],
            "project": "Build and containerize a FastAPI and PostgreSQL backend."
        },
        "AWS": {
            "priority": "High",
            "reason": "Cloud deployment is an important next step for backend developers.",
            "topics": [
                "EC2 deployment",
                "S3 storage",
                "IAM and security"
            ],
            "practice": [
                "Deploy a FastAPI application",
                "Configure an S3 bucket",
                "Create an IAM user with limited permissions"
            ],
            "project": "Deploy a FastAPI application with PostgreSQL on AWS."
        },
        "Redis": {
            "priority": "High",
            "reason": "Redis will strengthen your backend knowledge in caching and fast data access.",
            "topics": [
                "Redis data structures",
                "Caching",
                "Session storage"
            ],
            "practice": [
                "Add caching to a FastAPI endpoint",
                "Store sessions using Redis",
                "Implement cache expiration"
            ],
            "project": "Build a FastAPI application with PostgreSQL and Redis caching."
        },
        "Pytest": {
            "priority": "Medium",
            "reason": "Automated testing will improve the reliability of your backend applications.",
            "topics": [
                "Unit testing",
                "API testing",
                "Fixtures"
            ],
            "practice": [
                "Write tests for FastAPI endpoints",
                "Create reusable pytest fixtures",
                "Test authentication endpoints"
            ],
            "project": "Create a fully tested FastAPI REST API."
        }
    },

    "Data Scientist": {
        "Machine Learning": {
            "priority": "Critical",
            "reason": "Machine Learning is the largest missing skill for a data science career.",
            "topics": [
                "Supervised learning",
                "Model evaluation",
                "Feature engineering"
            ],
            "practice": [
                "Train a classification model",
                "Compare multiple ML algorithms",
                "Evaluate a model using cross-validation"
            ],
            "project": "Build an end-to-end student performance prediction system."
        },
        "Deep Learning": {
            "priority": "High",
            "reason": "Deep learning will expand your capabilities beyond traditional machine learning.",
            "topics": [
                "Neural networks",
                "CNNs",
                "Model training"
            ],
            "practice": [
                "Build a neural network",
                "Train a CNN on image data",
                "Compare training configurations"
            ],
            "project": "Build an image classification application."
        },
        "Algorithms": {
            "priority": "High",
            "reason": "Strong algorithmic knowledge improves both data science and technical interview performance.",
            "topics": [
                "Searching",
                "Sorting",
                "Graph algorithms"
            ],
            "practice": [
                "Solve searching problems",
                "Implement sorting algorithms",
                "Solve graph traversal problems"
            ],
            "project": "Build an algorithm visualization tool."
        }
    },

    "Machine Learning Engineer": {
        "Machine Learning": {
            "priority": "Critical",
            "reason": "Machine Learning is essential for transitioning into an ML engineering role.",
            "topics": [
                "Supervised learning",
                "Unsupervised learning",
                "Model evaluation"
            ],
            "practice": [
                "Train classification models",
                "Build regression models",
                "Compare model performance"
            ],
            "project": "Build and deploy a machine learning prediction API."
        },
        "Deep Learning": {
            "priority": "Critical",
            "reason": "Deep learning is important for modern AI and computer vision applications.",
            "topics": [
                "Neural networks",
                "CNNs",
                "Transfer learning"
            ],
            "practice": [
                "Build a neural network",
                "Train an image classifier",
                "Use transfer learning"
            ],
            "project": "Build an image recognition system."
        },
        "Docker": {
            "priority": "High",
            "reason": "Docker is important for packaging and deploying machine learning applications.",
            "topics": [
                "Docker images",
                "Dockerfiles",
                "Containerized ML APIs"
            ],
            "practice": [
                "Containerize an ML model",
                "Create a Dockerized prediction API",
                "Run an ML API with Docker Compose"
            ],
            "project": "Deploy a Dockerized machine learning API."
        },
        "Algorithms": {
            "priority": "High",
            "reason": "Strong algorithms and data structures are important for ML engineering interviews.",
            "topics": [
                "Arrays and strings",
                "Trees and graphs",
                "Dynamic programming"
            ],
            "practice": [
                "Solve array and string problems",
                "Solve tree and graph problems",
                "Practice dynamic programming"
            ],
            "project": "Build an interactive data structures and algorithms visualizer."
        }
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
def get_personalized_learning(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Resume
    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if not resume:
        return {
            "message": "Please upload your resume first.",
            "learning_plan": None
        }

    # Current skills
    current_skills = extract_resume_skills(
        resume.file_path
    )

    # Career matching
    career_matches = find_best_career(
        current_skills
    )

    best_career = career_matches[0]

    career_target = best_career["role"]

    # Missing skills
    missing_skills = [
        skill
        for skill in best_career["required_skills"]
        if skill not in current_skills
    ]

    # Personalized learning recommendations
    recommendations = []

    learning_path = LEARNING_PATHS.get(
        career_target,
        {}
    )

    for skill, recommendation in learning_path.items():
        recommendations.append({
            "skill": skill,
            "priority": recommendation["priority"],
            "reason": recommendation["reason"],
            "topics": recommendation["topics"],
            "practice": recommendation["practice"],
            "project": recommendation["project"]
        })

    # Add missing skills not covered by the learning path
    for skill in missing_skills:
        if not any(
            item["skill"] == skill
            for item in recommendations
        ):
            recommendations.append({
                "skill": skill,
                "priority": "High",
                "reason": f"{skill} is required for your {career_target} target.",
                "topics": [
                    f"{skill} fundamentals",
                    f"{skill} practical usage",
                    f"{skill} project implementation"
                ],
                "practice": [
                    f"Practice {skill} fundamentals",
                    f"Build a small {skill} application",
                    f"Use {skill} in an existing project"
                ],
                "project": f"Build a practical project using {skill}."
            })

    return {
        "career_target": career_target,
        "career_match_percentage": best_career[
            "match_percentage"
        ],
        "current_skills": current_skills,
        "missing_skills": missing_skills,
        "learning_plan": {
            "learning_direction": (
                f"Build toward {career_target} "
                "while strengthening your existing technical foundation."
            ),
            "recommendations": recommendations
        }
    }