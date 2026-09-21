import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'logsy-tasks'

const FILTERS = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
}

function loadSavedTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY)

    if (!savedTasks) {
      return []
    }

    const parsedTasks = JSON.parse(savedTasks)

    return Array.isArray(parsedTasks) ? parsedTasks : []
  } catch {
    return []
  }
}

function App() {
  const [taskTitle, setTaskTitle] = useState('')
  const [tasks, setTasks] = useState(loadSavedTasks)
  const [selectedFilter, setSelectedFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

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

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task,
      ),
    )
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    )
  }

  const completedCount = tasks.filter((task) => task.completed).length

  const filteredTasks = tasks.filter((task) => {
    if (selectedFilter === 'active') {
      return !task.completed
    }

    if (selectedFilter === 'completed') {
      return task.completed
    }

    return true
  })

  function getEmptyMessage() {
    if (tasks.length === 0) {
      return {
        title: 'No tasks yet.',
        detail: 'Add your first task using the form above.',
      }
    }

    if (selectedFilter === 'active') {
      return {
        title: 'No active tasks.',
        detail: 'Everything has been completed.',
      }
    }

    if (selectedFilter === 'completed') {
      return {
        title: 'No completed tasks.',
        detail: 'Complete a task to see it here.',
      }
    }

    return {
      title: 'No tasks found.',
      detail: 'Try selecting another filter.',
    }
  }

  const emptyMessage = getEmptyMessage()

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
            <div>
              <h2 id="task-heading">Your tasks</h2>

              <p className="completion-summary">
                {completedCount} of {tasks.length} completed
              </p>
            </div>

            <span className="task-count">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          <div className="filter-bar" aria-label="Filter tasks">
            {Object.entries(FILTERS).map(([filterValue, filterLabel]) => (
              <button
                className={
                  selectedFilter === filterValue ? 'filter-active' : ''
                }
                type="button"
                key={filterValue}
                onClick={() => setSelectedFilter(filterValue)}
              >
                {filterLabel}
              </button>
            ))}
          </div>

          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>{emptyMessage.title}</p>
              <span>{emptyMessage.detail}</span>
            </div>
          ) : (
            <ul className="task-list">
              {filteredTasks.map((task) => (
                <li
                  className={`task-item ${task.completed ? 'task-item-completed' : ''
                    }`}
                  key={task.id}
                >
                  <label className="task-content">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />

                    <span>{task.title}</span>
                  </label>

                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                  >
                    Delete
                  </button>
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