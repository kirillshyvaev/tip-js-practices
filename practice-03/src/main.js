import { demoTasks, variantTasks, variantNumber } from "./data.js";
import { findTaskById, setTaskCompleted, removeTask } from "./task-service.js";
import { getVisibleTasks } from "./task-selectors.js";
import { renderTaskList, renderSummary, renderEmptyState } from "./task-view.js";

const elements = {
  list: document.querySelector("#task-list"),
  filters: document.querySelector("#task-filters"),
  summary: document.querySelector("#task-summary"),
  empty: document.querySelector("#empty-message"),
  message: document.querySelector("#operation-message"),
  datasetLabel: document.querySelector("#dataset-label"),
};

// Готовая служебная часть: ?dataset=variant включает данные своего варианта.
// Наборы не смешиваются, редактировать код для переключения не требуется.
const isVariant = new URLSearchParams(window.location.search).get("dataset") === "variant";
const initialTasks = isVariant ? variantTasks : demoTasks;
let currentTasks = initialTasks.map((task) => ({ ...task }));
let currentFilter = "all";

elements.datasetLabel.textContent = isVariant
  ? `Индивидуальный вариант: ${variantNumber ?? "не указан"}`
  : "Общий контрольный набор";

const FILTERS = new Set(["all", "pending", "completed"]);
const ACTIONS = new Set(["toggle", "delete"]);

function setMessage(text) {
  elements.message.textContent = text;
}

// Отрисовка из состояния: полный список + фильтр -> карточки, сводка, пустое состояние.
// Здесь ничего не изменяется и не создаются подписки.
function renderApp() {
  const visible = getVisibleTasks(currentTasks, currentFilter);

  renderTaskList(elements.list, visible);
  renderSummary(elements.summary, currentTasks, visible.length);
  renderEmptyState(elements.empty, currentTasks.length, visible.length);

  elements.filters.querySelectorAll("button[data-filter]").forEach((button) => {
    const active = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

// Делегированный обработчик на ul#task-list.
function handleTaskListClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  // Нажать могли на вложенный span, поэтому поднимаемся к кнопке.
  const button = target.closest("button[data-action]");
  if (button === null || !elements.list.contains(button)) return;

  const { action } = button.dataset;
  if (!ACTIONS.has(action)) return;

  const card = button.closest("li[data-task-id]");
  if (card === null) return;

  // dataset хранит строку; Number("4abc") даёт NaN, а не 4.
  const rawId = card.dataset.taskId;
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id <= 0) {
    setMessage(`Ошибка: некорректный идентификатор задачи «${rawId}»`);
    return;
  }

  let result;
  if (action === "delete") {
    result = removeTask(currentTasks, id);
  } else {
    // Текущий статус берётся из данных, а не из DOM.
    const task = findTaskById(currentTasks, id);
    if (!task) {
      setMessage(`Ошибка: задача с id ${id} не найдена`);
      return;
    }
    result = setTaskCompleted(currentTasks, id, !task.completed);
  }

  if (!result.ok) {
    setMessage(`Ошибка: ${result.error}`);
    return;
  }

  currentTasks = result.tasks;
  setMessage("");
  renderApp();
  restoreTaskFocus(id, action);
}

// Делегированный обработчик на #task-filters.
function handleFilterClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const button = target.closest("button[data-filter]");
  if (button === null || !elements.filters.contains(button)) return;

  const { filter } = button.dataset;
  if (!FILTERS.has(filter)) return;

  // Фильтр меняет только режим показа, currentTasks не трогается.
  currentFilter = filter;
  setMessage("");
  renderApp();
}

// Готовая вспомогательная функция. Сохраняет понятную позицию клавиатурного фокуса
// после замены карточек. Если карточки больше нет, фокус получает активный фильтр.
function restoreTaskFocus(id, action) {
  const actionButton = elements.list.querySelector(
    `[data-task-id="${id}"] button[data-action="${action}"]`,
  );
  const filterButton = elements.filters.querySelector(`[data-filter="${currentFilter}"]`);
  (actionButton ?? filterButton)?.focus();
}

// Подписки выполняются один раз. Эти контейнеры не заменяются при перерисовке.
elements.list.addEventListener("click", handleTaskListClick);
elements.filters.addEventListener("click", handleFilterClick);

// До реализации renderApp ожидается сообщение о заглушке.
// try/catch здесь — готовая диагностика старта, а не замена проверки result.ok.
try {
  renderApp();
} catch (error) {
  elements.message.textContent = `Ошибка запуска: ${error.message}`;
  console.error(error);
}
