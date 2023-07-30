from fastapi import FastAPI, HTTPException
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
    id: Optional[int] = None
    name: str
    due_date: str
    description: str

todos = []

@app.get("/todos", response_model=List[Todo])
async def get_todos():
    return todos

@app.post("/todos", response_model=Todo)
async def create_todo(todo: Todo):
    todo.id = len(todos)
    todos.append(todo)
    return todo

@app.get("/todos/{id}", response_model=Todo)
async def get_todo(id: int):
    for todo in todos:
        if todo.id == id:
            return todo
    raise HTTPException(status_code=404, detail="Todo not found")

@app.put("/todos/{id}", response_model=Todo)
async def update_todo(id: int, todo: Todo):
    for index, existing_todo in enumerate(todos):
        if existing_todo.id == id:
            todos[index] = todo
            return todo
    raise HTTPException(status_code=404, detail="Todo not found")

@app.delete("/todos/{id}", response_model=Todo)
async def delete_todo(id: int):
    for index, existing_todo in enumerate(todos):
        if existing_todo.id == id:
            return todos.pop(index)
    raise HTTPException(status_code=404, detail="Todo not found")
