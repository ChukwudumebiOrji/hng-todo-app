"use strict"

const addBtn = document.getElementById("add-button")
const DESCRIPTION_COLLAPSE_THRESHOLD = 80
let focusEditButtonTaskId = null

const taskList = [
  {
    id: 1,
    title: "Task 1",
    description:
      "Description for Task 1. This task has a longer description to demonstrate the default collapsed behavior.",
    deadline: "2026-06-30T20:47",
    priority: "High",
    isCompleted: false,
    status: "Pending",
    isEditing: false,
    isExpanded: false,
  },
  {
    id: 2,
    title: "Task 2",
    description: "Description for Task 2",
    deadline: "2024-07-05T12:00",
    priority: "Medium",
    isCompleted: false,
    status: "In Progress",
    isEditing: false,
    isExpanded: true,
  },
  {
    id: 3,
    title: "Task 3",
    description: "Description for Task 3",
    deadline: "2026-07-10T03:10",
    priority: "Low",
    isCompleted: false,
    status: "Pending",
    isEditing: false,
    isExpanded: true,
  },
]

addBtn.addEventListener("click", () => {
  console.log("Add button clicked")
})

const isOverdue = (task) => new Date(task.deadline) - new Date() < 0

const getPriorityClass = (priority) => priority.toLowerCase().replace(/\s+/g, "-")

const getTimeDisplay = (task) => {
  if (task.status === "Done") {
    return "Completed"
  }

  const now = new Date()
  const deadlineDate = new Date(task.deadline)
  const diff = deadlineDate - now
  const absDiff = Math.abs(diff)

  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))

  let value = minutes
  let unit = "minute"

  if (days > 0) {
    value = days
    unit = "day"
  } else if (hours > 0) {
    value = hours
    unit = "hour"
  }

  const pluralizedUnit = value === 1 ? unit : `${unit}s`
  const prefix = diff < 0 ? "Overdue by" : "Due in"

  return `${prefix} ${value} ${pluralizedUnit}`
}

const updateTimeElements = () => {
  taskList.forEach((task) => {
    const timeElement = document.querySelector(`[data-time-task-id="${task.id}"]`)
    const overdueIndicator = document.querySelector(
      `[data-overdue-task-id="${task.id}"]`,
    )
    const card = document.querySelector(`[data-task-id="${task.id}"]`)

    if (!timeElement || !overdueIndicator || !card) {
      return
    }

    const overdue = isOverdue(task) && task.status !== "Done"
    timeElement.textContent = getTimeDisplay(task)
    overdueIndicator.hidden = !overdue
    card.classList.toggle("todo-card-overdue", overdue)
  })
}

const setTaskStatus = (task, status) => {
  task.status = status
  task.isCompleted = status === "Done"
}

const getDisplayDescription = (task) => {
  const isLong = task.description.length > DESCRIPTION_COLLAPSE_THRESHOLD
  if (!isLong || task.isExpanded) {
    return task.description
  }

  return `${task.description.slice(0, DESCRIPTION_COLLAPSE_THRESHOLD)}...`
}

const closeEditMode = (task) => {
  task.isEditing = false
  focusEditButtonTaskId = task.id
  renderTasks()
}

const renderTasks = () => {
  const taskListContainer = document.querySelector(".todo-list")
  taskListContainer.innerHTML = ""

  taskList.forEach((task) => {
    const taskCard = document.createElement("div")
    taskCard.className = "todo-card"
    taskCard.setAttribute("data-testid", "test-todo-card")
    taskCard.setAttribute("data-task-id", task.id)
    taskCard.classList.add(`todo-card-priority-${getPriorityClass(task.priority)}`)

    if (task.status === "Done") {
      taskCard.classList.add("todo-card-done")
    }

    if (task.status === "In Progress") {
      taskCard.classList.add("todo-card-in-progress")
    }

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.checked = task.isCompleted
    checkbox.setAttribute("data-testid", "test-todo-complete-toggle")
    checkbox.addEventListener("change", (e) => {
      if (e.target.checked) {
        setTaskStatus(task, "Done")
      } else if (task.status === "Done") {
        setTaskStatus(task, "Pending")
      }
      renderTasks()
    })

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
    title.setAttribute("data-testid", "test-todo-title")
    titleContainer.appendChild(title)

    const statusControl = document.createElement("select")
    statusControl.setAttribute("data-testid", "test-todo-status-control")
    statusControl.className = "todo-status-control"
    ;["Pending", "In Progress", "Done"].forEach((statusValue) => {
      const option = document.createElement("option")
      option.value = statusValue
      option.textContent = statusValue
      statusControl.appendChild(option)
    })
    statusControl.value = task.status
    statusControl.addEventListener("change", (e) => {
      setTaskStatus(task, e.target.value)
      renderTasks()
    })
    titleContainer.appendChild(statusControl)

    const deadline = document.createElement("time")
    deadline.textContent = getTimeDisplay(task)
    deadline.setAttribute("data-testid", "test-todo-time-remaining")
    deadline.setAttribute("data-time-task-id", task.id)

    const priority = document.createElement("p")
    priority.innerHTML = `Priority: <span>${task.priority}</span>`
    priority.setAttribute("data-testid", "test-todo-priority")

    const priorityIndicator = document.createElement("span")
    priorityIndicator.className = `todo-priority-indicator ${getPriorityClass(task.priority)}`
    priorityIndicator.setAttribute("data-testid", "test-todo-priority-indicator")

    const status = document.createElement("p")
    status.textContent = `Status: ${task.status}`
    status.setAttribute("data-testid", "test-todo-status")

    const overdueIndicator = document.createElement("span")
    overdueIndicator.className = "todo-overdue-indicator"
    overdueIndicator.textContent = "Overdue"
    overdueIndicator.hidden = !(isOverdue(task) && task.status !== "Done")
    overdueIndicator.setAttribute("data-testid", "test-todo-overdue-indicator")
    overdueIndicator.setAttribute("data-overdue-task-id", task.id)

    const collapsibleSection = document.createElement("div")
    collapsibleSection.className = "todo-collapsible-section"
    collapsibleSection.setAttribute("data-testid", "test-todo-collapsible-section")

    const dropdown = document.createElement("div")
    dropdown.className = "todo-dropdown"
    dropdown.setAttribute("data-testid", "test-todo-dropdown")

    const description = document.createElement("p")
    description.textContent = getDisplayDescription(task)
    description.setAttribute("data-testid", "test-todo-description")
    dropdown.appendChild(description)

    const isDescriptionLong = task.description.length > DESCRIPTION_COLLAPSE_THRESHOLD
    if (!task.isExpanded && isDescriptionLong) {
      collapsibleSection.classList.add("collapsed")
    }

    taskDetails.appendChild(titleContainer)
    taskDetails.appendChild(deadline)
    taskDetails.appendChild(overdueIndicator)
    taskDetails.appendChild(status)
    taskDetails.appendChild(priorityIndicator)

    const legacyDropdownHook = document.createElement("span")
    legacyDropdownHook.setAttribute("data-testid", "test-show-dropdown-button")
    legacyDropdownHook.hidden = true

    const expandToggleButton = document.createElement("button")
    expandToggleButton.innerHTML = task.isExpanded
      ? '<i class="fa-solid fa-chevron-up"></i> Collapse'
      : '<i class="fa-solid fa-chevron-down"></i> Expand'
    expandToggleButton.setAttribute("data-testid", "test-todo-expand-toggle")
    expandToggleButton.className = "show-dropdown-button"
    expandToggleButton.type = "button"
    expandToggleButton.ariaLabel = "Toggle task content"
    expandToggleButton.disabled = !isDescriptionLong
    expandToggleButton.addEventListener("click", () => {
      task.isExpanded = !task.isExpanded
      renderTasks()
    })

    taskDetails.appendChild(legacyDropdownHook)
    taskDetails.appendChild(expandToggleButton)
    dropdown.appendChild(priority)
    collapsibleSection.appendChild(dropdown)

    const actions = document.createElement("div")
    actions.className = "todo-actions"

    const editButton = document.createElement("button")
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>'
    editButton.setAttribute("data-testid", "test-todo-edit-button")
    editButton.className = "todo-button"
    editButton.setAttribute("id", `edit-button-${task.id}`)
    editButton.ariaLabel = "Edit task"
    editButton.addEventListener("click", () => {
      task.isEditing = true
      renderTasks()
    })

    const deleteButton = document.createElement("button")
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>'
    deleteButton.setAttribute("data-testid", "test-todo-delete-button")
    deleteButton.className = "todo-button"
    deleteButton.setAttribute("id", `delete-button-${task.id}`)
    deleteButton.ariaLabel = "Delete task"
    deleteButton.addEventListener("click", () => {
      console.log(`Delete button clicked for task ID: ${task.id}`)
    })

    actions.appendChild(editButton)
    actions.appendChild(deleteButton)

    if (task.isEditing) {
      const editForm = document.createElement("form")
      editForm.className = "todo-edit-form"
      editForm.setAttribute("data-testid", "test-todo-edit-form")

      const titleInput = document.createElement("input")
      titleInput.type = "text"
      titleInput.value = task.title
      titleInput.required = true
      titleInput.setAttribute("data-testid", "test-todo-edit-title-input")

      const descriptionInput = document.createElement("textarea")
      descriptionInput.value = task.description
      descriptionInput.setAttribute("data-testid", "test-todo-edit-description-input")

      const prioritySelect = document.createElement("select")
      prioritySelect.setAttribute("data-testid", "test-todo-edit-priority-select")
      ;["Low", "Medium", "High"].forEach((priorityValue) => {
        const option = document.createElement("option")
        option.value = priorityValue
        option.textContent = priorityValue
        prioritySelect.appendChild(option)
      })
      prioritySelect.value = task.priority

      const dueDateInput = document.createElement("input")
      dueDateInput.type = "datetime-local"
      dueDateInput.value = task.deadline
      dueDateInput.required = true
      dueDateInput.setAttribute("data-testid", "test-todo-edit-due-date-input")

      const saveButton = document.createElement("button")
      saveButton.type = "submit"
      saveButton.textContent = "Save"
      saveButton.className = "todo-button"
      saveButton.setAttribute("data-testid", "test-todo-save-button")

      const cancelButton = document.createElement("button")
      cancelButton.type = "button"
      cancelButton.textContent = "Cancel"
      cancelButton.className = "todo-button"
      cancelButton.setAttribute("data-testid", "test-todo-cancel-button")
      cancelButton.addEventListener("click", () => {
        closeEditMode(task)
      })

      editForm.appendChild(titleInput)
      editForm.appendChild(descriptionInput)
      editForm.appendChild(prioritySelect)
      editForm.appendChild(dueDateInput)
      editForm.appendChild(saveButton)
      editForm.appendChild(cancelButton)

      editForm.addEventListener("submit", (event) => {
        event.preventDefault()
        const nextTitle = titleInput.value.trim()
        if (!nextTitle) {
          titleInput.focus()
          return
        }

        task.title = nextTitle
        task.description = descriptionInput.value.trim()
        task.priority = prioritySelect.value
        task.deadline = dueDateInput.value
        task.isExpanded = task.description.length <= DESCRIPTION_COLLAPSE_THRESHOLD
        closeEditMode(task)
      })

      taskCard.appendChild(taskDetails)
      taskCard.appendChild(editForm)
      taskCard.appendChild(actions)
      taskListContainer.appendChild(taskCard)
      return
    }

    taskCard.appendChild(taskDetails)
    taskCard.appendChild(collapsibleSection)
    taskCard.appendChild(actions)

    taskListContainer.appendChild(taskCard)
  })

  updateTimeElements()

  if (focusEditButtonTaskId !== null) {
    const editButton = document.getElementById(`edit-button-${focusEditButtonTaskId}`)
    if (editButton) {
      editButton.focus()
    }
    focusEditButtonTaskId = null
  }
}

renderTasks()
setInterval(updateTimeElements, 30000)
