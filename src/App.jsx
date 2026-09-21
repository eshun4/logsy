import { useState } from 'react'
import './App.css'

function App() {
  const [taskTitle, setTaskTitle] = useState('')
  const [tasks, setTasks] = useState([])

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedTitle = taskTitle.trim()

    if (!trimmedTitle) {
      return
    }

    const newTask = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      completed: false,
    }

    setTasks((currentTasks) => [newTask, ...currentTasks])
    setTaskTitle('')
  }

  return (
    <main className="app-shell">
      <section className="task-app">
        <header className="app-header">
          <p className="eyebrow">Simple task tracking</p>
          <h1>Logsy</h1>
          <p className="app-description">
            Capture what needs to be done and keep your day organized.
          </p>
        </header>

        <form className="task-form" onSubmit={handleSubmit}>
          <label htmlFor="task-title">New task</label>

          <div className="task-input-row">
            <input
              id="task-title"
              type="text"
              value={taskTitle}
              onChange={(event) => setTaskTitle(event.target.value)}
              placeholder="What do you need to accomplish?"
              autoComplete="off"
            />

            <button type="submit">Add task</button>
          </div>
        </form>

        <section className="task-section" aria-labelledby="task-heading">
          <div className="task-section-heading">
            <h2 id="task-heading">Your tasks</h2>

            <span className="task-count">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet.</p>
              <span>Add your first task using the form above.</span>
            </div>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li className="task-item" key={task.id}>
                  <span>{task.title}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  )
}

export default App