import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "@/styles/Home.module.css"

interface Todo {
  id: number;
  name: string;
  due_date: string;
  description: string;
}

const Home: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Omit<Todo, 'id'>>({
    name: '',
    due_date: '',
    description: ''
  });
  const [editing, setEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get('http://localhost:8000/todos');
      setTodos(response.data);
    };

    fetchTodos();
  }, []);

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:8000/todos', newTodo);
    setTodos([...todos, response.data]);
    setNewTodo({
      name: '',
      due_date: '',
      description: ''
    });
  };

  const updateTodo = async (id: number) => {
    const response = await axios.put(`http://localhost:8000/todos/${id}`, currentTodo);
    setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
    setEditing(false);
    setCurrentTodo(null);
  };

  const deleteTodo = async (id: number) => {
    await axios.delete(`http://localhost:8000/todos/${id}`);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (todo: Todo) => {
    setEditing(true);
    setCurrentTodo(todo);
  };

  return (
    <>
    <header>
      <h1>Todo List</h1>
    </header>
    <div className={styles.container}>
      {editing ? (
        <div className={styles.editBox}>
          <h2>Edit Todo</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentTodo) updateTodo(currentTodo.id);
            }}
          >
            <label>Name</label>
            <input
              type="text"
              value={currentTodo?.name || ""}
              onChange={(e) =>
                setCurrentTodo({
                  ...currentTodo!,
                  name: e.target.value,
                })
              }
            />
            <label>Due Date</label>
            <input
              type="text"
              value={currentTodo?.due_date || ""}
              onChange={(e) =>
                setCurrentTodo({
                  ...currentTodo!,
                  due_date: e.target.value,
                })
              }
            />
            <label>Description</label>
            <input
              type="text"
              value={currentTodo?.description || ""}
              onChange={(e) =>
                setCurrentTodo({
                  ...currentTodo!,
                  description: e.target.value,
                })
              }
            />
            <button type="submit">Update</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </form>
        </div>
      ) : (
        <div className={styles.addBox}>
          <h2>Add a Todo</h2>
          <form onSubmit={createTodo} className={styles.form}>
            <div className={styles.formInner}>
            <div>
              <label>Name</label>
              <input
                type="text"
                value={newTodo.name}
                onChange={(e) => setNewTodo({ ...newTodo, name: e.target.value })}
              />
            </div>
            <div>
              <label>Due Date</label>
              <input
                type="text"
                value={newTodo.due_date}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, due_date: e.target.value })
                }
              />
            </div>
            <div>
            <label>Description</label>
            <input
              type="text"
              value={newTodo.description}
              onChange={(e) =>
                setNewTodo({ ...newTodo, description: e.target.value })
              }
            />
            </div>
            </div>
            <button type="submit">Add</button>
          </form>
        </div>
      )}

      <div className={styles.viewBox}>
        <h2>View Todos</h2>
        <div className={styles.viewWrapper}>
        {todos.map((todo) => (
          <div key={todo.id} className={styles.viewInner}>
            <div className={styles.viewItems}>
              <h3>{todo.name}</h3>
              <p>Due: {todo.due_date}</p>
              <p>{todo.description}</p>
            </div>
            <button onClick={() => editTodo(todo)}>Edit</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;

