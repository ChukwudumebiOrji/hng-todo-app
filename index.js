"use strict"

const addBtn = document.getElementById("add-button")

const taskList = [
  {
    id: 1,
    title: "Task 1",
    description: "Description for Task 1",
    deadline: "2026-06-30, 20:47",
    priority: "High",
    isCompleted: false,
  },
  {
    id: 2,
    title: "Task 2",
    description: "Description for Task 2",
    deadline: "2024-07-05, 12:00",
    priority: "Medium",
    isCompleted: false,
  },
  {
    id: 3,
    title: "Task 3",
    description: "Description for Task 3",
    deadline: "2026-07-10, 03:10",
    priority: "Low",
    isCompleted: false,
  },
]

addBtn.addEventListener("click", () => {
  console.log("Add button clicked")
})

const renderTasks = () => {
  const taskListContainer = document.querySelector(".todo-list")
  taskListContainer.innerHTML = ""

  taskList.forEach((task) => {
    const taskCard = document.createElement("div")
    taskCard.className = "todo-card"
    taskCard.setAttribute("data-testid", "test-todo-card")

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.checked = task.isCompleted
    checkbox.addEventListener("change", (e) =>
      changeStatus(task.id, e.target.checked),
    )

    const checkboxContainer = document.createElement("div")
    checkboxContainer.className = "checkbox-container"
    checkboxContainer.appendChild(checkbox)

    taskCard.appendChild(checkboxContainer)

    const taskDetails = document.createElement("div")
    taskDetails.className = "todo-details"
    taskDetails.setAttribute("data-testid", "test-todo-details")

    const titleContainer = document.createElement("div")
    titleContainer.className = "todo-title-container"

    const title = document.createElement("h3")
    title.textContent = task.title
    titleContainer.appendChild(title)

    const description = document.createElement("p")
    description.textContent = task.description

    const deadline = document.createElement("time")
    deadline.innerHTML = getRemainingTime(task.deadline)

    const intervalId = setInterval(() => {
      deadline.innerHTML = getRemainingTime(task.deadline)
    }, 30000)

    const priority = document.createElement("p")
    priority.innerHTML = `Priority: <span id="priority">${task.priority}</span>`

    const status = document.createElement("p")
    status.textContent = `Status: ${task.isCompleted ? "Completed" : "Pending"}`

    const showDropdownButton = document.createElement("button")
    showDropdownButton.innerHTML = '<i class="fa-solid fa-chevron-down"></i>'
    showDropdownButton.setAttribute("data-testid", "test-show-dropdown-button")
    showDropdownButton.className = "show-dropdown-button"
    showDropdownButton.id = `show-dropdown-button-${task.id}`
    showDropdownButton.ariaLabel = "Show task details"
    showDropdownButton.addEventListener("click", (e) => {
      let isVisible = dropdown.style.display === "block"

      if (!isVisible) {
        taskDetails.after(dropdown)
        dropdown.style.display = "block"
        showDropdownButton.innerHTML = '<i class="fa-solid fa-chevron-up"></i>'
      } else {
        dropdown.style.display = "none"
        showDropdownButton.innerHTML =
          '<i class="fa-solid fa-chevron-down"></i>'
      }
    })

    const dropdown = document.createElement("div")
    dropdown.className = "todo-dropdown"
    dropdown.setAttribute("data-testid", "test-todo-dropdown")

    taskDetails.appendChild(titleContainer)
    taskDetails.appendChild(deadline)
    taskDetails.appendChild(status)
    taskDetails.appendChild(showDropdownButton)

    dropdown.appendChild(description)
    dropdown.appendChild(priority)
    const actions = document.createElement("div")
    actions.className = "todo-actions"

    const editButton = document.createElement("button")
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>'
    editButton.setAttribute("data-testid", "test-edit-button")
    editButton.className = "todo-button"
    editButton.setAttribute("id", `edit-button-${task.id}`)
    editButton.ariaLabel = "Edit task"
    editButton.addEventListener("click", () => {
      console.log(`Edit button clicked for task ID: ${task.id}`)
    })

    const deleteButton = document.createElement("button")
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>'
    deleteButton.setAttribute("data-testid", "test-delete-button")
    deleteButton.className = "todo-button"
    deleteButton.setAttribute("id", `delete-button-${task.id}`)
    deleteButton.ariaLabel = "Delete task"
    deleteButton.addEventListener("click", () => {
      console.log(`Delete button clicked for task ID: ${task.id}`)
    })

    actions.appendChild(editButton)
    actions.appendChild(deleteButton)

    taskCard.appendChild(taskDetails)
    taskCard.appendChild(actions)

    taskListContainer.appendChild(taskCard)
  })
}

const changeStatus = (taskId, isCompleted) => {
  const task = taskList.find((t) => t.id === taskId)
  if (task) {
    task.isCompleted = isCompleted
    renderTasks()
  }
}

const getRemainingTime = (deadline) => {
  const deadlineDate = new Date(deadline)
  const now = new Date()
  const timeDiff = deadlineDate - now

  if (timeDiff <= 0) {
    return "Deadline passed"
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

  return `Deadline in <span id="deadline-time">${days} days, ${hours} hours, ${minutes} minutes</span>`
}

renderTasks()
