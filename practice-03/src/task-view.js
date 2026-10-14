import { getTaskStats } from "./task-service.js";

// Модуль создаёт DOM по данным и не меняет состояние приложения.

const PRIORITY_TEXT = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

// Создаёт элемент с классом и текстом. Текст всегда через textContent.
function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

// Кнопка действия; подпись лежит во вложенном span.action-label.
function makeActionButton(action, text) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.action = action;
  button.append(makeElement("span", "action-label", text));
  return button;
}

export function createTaskElement(task) {
  const card = document.createElement("li");
  card.className = task.completed ? "task-card is-completed" : "task-card";
  card.dataset.taskId = String(task.id);

  const toggle = makeActionButton("toggle", "Выполнена");
  toggle.setAttribute("aria-pressed", task.completed ? "true" : "false");

  const actions = document.createElement("div");
  actions.className = "task-actions";
  actions.append(toggle, makeActionButton("delete", "Удалить"));

  card.append(
    makeElement("h3", "task-title", task.title),
    makeElement("p", "task-status", task.completed ? "Выполнена" : "В работе"),
    makeElement("p", "task-priority", PRIORITY_TEXT[task.priority]),
    actions,
  );
  return card;
}

export function renderTaskList(listElement, tasks) {
  // Меняются только карточки; сам ul и обработчик на нём сохраняются.
  listElement.replaceChildren(...tasks.map(createTaskElement));
}

export function renderSummary(summaryElement, tasks, visibleCount) {
  // tasks — весь список, visibleCount — сколько карточек показано после фильтра.
  const stats = getTaskStats(tasks);
  const values = {
    total: String(stats.total),
    completed: String(stats.completed),
    pending: String(stats.pending),
    progress: `${stats.progress.toFixed(1)}%`,
    visible: String(visibleCount),
  };

  for (const [name, text] of Object.entries(values)) {
    summaryElement.querySelector(`[data-stat="${name}"]`).textContent = text;
  }
}

export function renderEmptyState(messageElement, total, visibleCount) {
  let text = "";
  if (total === 0) {
    text = "Список задач пуст.";
  } else if (visibleCount === 0) {
    text = "Нет задач по выбранному фильтру.";
  }
  messageElement.textContent = text;
  messageElement.hidden = text === "";
}
