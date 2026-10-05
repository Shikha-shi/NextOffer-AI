from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database.database import get_db
from app.routers.auth import get_current_user
from app.routers.personalized_learning import (
    extract_resume_skills,
    find_best_career,
    LEARNING_PATHS,
)
from models.resume import Resume


router = APIRouter(
    prefix="/learning-resources",
    tags=["Learning Resources"]
)

security = HTTPBearer()


RESOURCE_LIBRARY = {
    "Node.js": {
        "videos": [
            {
                "title": "Node.js Tutorial for Beginners",
                "url": "https://www.youtube.com/results?search_query=Node.js+tutorial+for+beginners"
            }
        ],
        "notes": [
            {
                "title": "Node.js Documentation",
                "url": "https://nodejs.org/docs/latest/api/"
            }
        ],
        "practice": [
            {
                "title": "Node.js Practice",
                "url": "https://www.hackerrank.com/domains/tutorials/10-days-of-javascript"
            }
        ],
        "courses": [
            {
                "title": "Free Node.js Courses",
                "url": "https://www.freecodecamp.org/news/tag/nodejs/"
            }
        ]
    },

    "TypeScript": {
        "videos": [
            {
                "title": "TypeScript Tutorial",
                "url": "https://www.youtube.com/results?search_query=TypeScript+tutorial+for+beginners"
            }
        ],
        "notes": [
            {
                "title": "TypeScript Handbook",
                "url": "https://www.typescriptlang.org/docs/handbook/"
            }
        ],
        "practice": [
            {
                "title": "TypeScript Exercises",
                "url": "https://typescript-exercises.github.io/"
            }
        ],
        "courses": [
            {
                "title": "Free TypeScript Resources",
                "url": "https://www.freecodecamp.org/news/tag/typescript/"
            }
        ]
    },

    "React": {
        "videos": [
            {
                "title": "React Tutorial",
                "url": "https://www.youtube.com/results?search_query=React+tutorial+for+beginners"
            }
        ],
        "notes": [
            {
                "title": "React Documentation",
                "url": "https://react.dev/learn"
            }
        ],
        "practice": [
            {
                "title": "React Practice Projects",
                "url": "https://www.frontendmentor.io/"
            }
        ],
        "courses": [
            {
                "title": "Free React Resources",
                "url": "https://www.freecodecamp.org/news/tag/react/"
            }
        ]
    },

    "Docker": {
        "videos": [
            {
                "title": "Docker Tutorial",
                "url": "https://www.youtube.com/results?search_query=Docker+tutorial+for+beginners"
            }
        ],
        "notes": [
            {
                "title": "Docker Documentation",
                "url": "https://docs.docker.com/get-started/"
            }
        ],
        "practice": [
            {
                "title": "Docker Labs",
                "url": "https://labs.play-with-docker.com/"
            }
        ],
        "courses": [
            {
                "title": "Docker Learning Resources",
                "url": "https://www.freecodecamp.org/news/tag/docker/"
            }
        ]
    },

    "AWS": {
        "videos": [
            {
                "title": "AWS Tutorial for Beginners",
                "url": "https://www.youtube.com/results?search_query=AWS+tutorial+for+beginners"
            }
        ],
        "notes": [
            {
                "title": "AWS Documentation",
                "url": "https://docs.aws.amazon.com/"
            }
        ],
        "practice": [
            {
                "title": "AWS Skill Builder",
                "url": "https://skillbuilder.aws/"
            }
        ],
        "courses": [
            {
                "title": "AWS Free Learning",
                "url": "https://aws.amazon.com/training/"
            }
        ]
    },

    "Redis": {
        "videos": [
            {
                "title": "Redis Tutorial",
                "url": "https://www.youtube.com/results?search_query=Redis+tutorial+for+beginners"
            }
        ],
        "notes": [
            {
                "title": "Redis Documentation",
                "url": "https://redis.io/docs/latest/"
            }
        ],
        "practice": [
            {
                "title": "Redis University",
                "url": "https://university.redis.io/"
            }
        ],
        "courses": [
            {
                "title": "Redis Learning",
                "url": "https://redis.io/learn/"
            }
        ]
    },

    "Pytest": {
        "videos": [
            {
                "title": "Pytest Tutorial",
                "url": "https://www.youtube.com/results?search_query=Pytest+tutorial+Python"
            }
        ],
        "notes": [
            {
                "title": "Pytest Documentation",
                "url": "https://docs.pytest.org/"
            }
        ],
        "practice": [
            {
                "title": "Pytest Practice",
                "url": "https://www.codewars.com/"
            }
        ],
        "courses": [
            {
                "title": "Free Pytest Resources",
                "url": "https://www.freecodecamp.org/news/tag/python/"
            }
        ]
    },

    "Machine Learning": {
        "videos": [
            {
                "title": "Machine Learning Tutorials",
                "url": "https://www.youtube.com/results?search_query=machine+learning+course+for+beginners"
            }
        ],
        "notes": [
            {
                "title": "Scikit-learn User Guide",
                "url": "https://scikit-learn.org/stable/user_guide.html"
            }
        ],
        "practice": [
            {
                "title": "Kaggle Learn",
                "url": "https://www.kaggle.com/learn"
            }
        ],
        "courses": [
            {
                "title": "Free Machine Learning Courses",
                "url": "https://www.freecodecamp.org/news/tag/machine-learning/"
            }
        ]
    },

    "Deep Learning": {
        "videos": [
            {
                "title": "Deep Learning Tutorials",
                "url": "https://www.youtube.com/results?search_query=deep+learning+course+for+beginners"
            }
        ],
        "notes": [
            {
                "title": "Deep Learning Resources",
                "url": "https://www.deeplearning.ai/"
            }
        ],
        "practice": [
            {
                "title": "Kaggle Learn",
                "url": "https://www.kaggle.com/learn"
            }
        ],
        "courses": [
            {
                "title": "Free Deep Learning Resources",
                "url": "https://www.freecodecamp.org/news/tag/deep-learning/"
            }
        ]
    },

    "Algorithms": {
        "videos": [
            {
                "title": "Algorithms Tutorials",
                "url": "https://www.youtube.com/results?search_query=algorithms+data+structures+course"
            }
        ],
        "notes": [
            {
                "title": "Algorithms and Data Structures",
                "url": "https://www.geeksforgeeks.org/dsa/"
            }
        ],
        "practice": [
            {
                "title": "LeetCode",
                "url": "https://leetcode.com/problemset/"
            }
        ],
        "courses": [
            {
                "title": "Free DSA Resources",
                "url": "https://www.freecodecamp.org/news/tag/data-structures/"
            }
        ]
    },
}


@router.get("")
def get_learning_resources(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    current_user = get_current_user(
        credentials=credentials,
        db=db
    )

    resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .first()
    )

    if not resume:
        return {
            "message": "Please upload your resume first.",
            "resources": []
        }

    current_skills = extract_resume_skills(
        resume.file_path
    )

    career_matches = find_best_career(
        current_skills
    )

    if not career_matches:
        return {
            "career_target": None,
            "career_match_percentage": 0,
            "current_skills": current_skills,
            "resources": []
        }

    best_career = career_matches[0]

    career_target = best_career["role"]

    learning_path = LEARNING_PATHS.get(
        career_target,
        {}
    )

    resources = []

    for skill in learning_path:
        resource_data = RESOURCE_LIBRARY.get(skill)

        if resource_data:
            resources.append({
                "skill": skill,
                "priority": learning_path[skill]["priority"],
                "reason": learning_path[skill]["reason"],
                "videos": resource_data["videos"],
                "notes": resource_data["notes"],
                "practice": resource_data["practice"],
                "courses": resource_data["courses"],
                "project": learning_path[skill]["project"],
            })

    return {
        "career_target": career_target,
        "career_match_percentage": best_career["match_percentage"],
        "current_skills": current_skills,
        "resources": resources
    }