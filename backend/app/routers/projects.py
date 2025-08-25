from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from bson import ObjectId

from app.models import Project, ProjectCreate, ProjectUpdate, User
from app.database import db
from app.routers.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(project: ProjectCreate, current_user: User = Depends(get_current_user)):
    project_dict = project.model_dump()
    project_dict["owner_id"] = current_user["_id"]
    result = db.projects.insert_one(project_dict)
    created_project = db.projects.find_one({"_id": result.inserted_id})
    return created_project

@router.get("/", response_model=List[Project])
async def list_projects(current_user: User = Depends(get_current_user)):
    projects = list(db.projects.find({"owner_id": current_user["_id"]}))
    return projects

@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str, current_user: User = Depends(get_current_user)):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project_id")
    project = db.projects.find_one({"_id": ObjectId(project_id)})
    if project is None or project["owner_id"] != current_user["_id"]:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}", response_model=Project)
async def update_project(project_id: str, project: ProjectUpdate, current_user: User = Depends(get_current_user)):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project_id")
    
    existing_project = db.projects.find_one({"_id": ObjectId(project_id)})
    if existing_project is None or existing_project["owner_id"] != current_user["_id"]:
        raise HTTPException(status_code=404, detail="Project not found")

    update_data = project.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = db.projects.update_one(
        {"_id": ObjectId(project_id)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")

    updated_project = db.projects.find_one({"_id": ObjectId(project_id)})
    return updated_project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: str, current_user: User = Depends(get_current_user)):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project_id")
    
    existing_project = db.projects.find_one({"_id": ObjectId(project_id)})
    if existing_project is None or existing_project["owner_id"] != current_user["_id"]:
        raise HTTPException(status_code=404, detail="Project not found")

    result = db.projects.delete_one({"_id": ObjectId(project_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
