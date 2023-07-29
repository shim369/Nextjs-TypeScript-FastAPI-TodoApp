from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Todo(BaseModel):
    name: str
    due_date: str
    description: str

todos = []

@app.get("/todos", response_model=List[Todo])
async def get_todos():
    return todos

@app.post("/todos", response_model=Todo)
async def create_todo(todo: Todo):
    todos.append(todo)
    return todo

@app.get("/todos/{id}", response_model=Todo)
async def get_todo(id: int):
    return todos[id]

@app.put("/todos/{id}", response_model=Todo)
async def update_todo(id: int, todo: Todo):
    todos[id] = todo
    return todo

@app.delete("/todos/{id}", response_model=Todo)
async def delete_todo(id: int):
    return todos.pop(id)
