import { demoTasks, variantNumber, variantTasks } from "./data.js";
import {
  createTask,
  findTaskById,
  getPendingTasks,
  getTaskTitles,
  getTaskStats,
  addTask,
  setTaskCompleted,
  renameTask,
  removeTask,
} from "./task-service.js";

// Здесь только порядок шагов и вывод. Работа с задачами — в task-service.js.

function formatStats(tasks) {
  const { total, completed, pending, progress } = getTaskStats(tasks);
  if (total === 0) {
    return "всего 0, Задач пока нет";
  }
  return `всего ${total}, выполнено ${completed}, осталось ${pending}, прогресс ${progress.toFixed(1)}%`;
}

function ids(tasks) {
  return `[${tasks.map((task) => task.id).join(", ")}]`;
}

function showList(caption, tasks) {
  console.log(`\n${caption}`);
  console.table(tasks);
  console.log("Названия:", getTaskTitles(tasks));
  console.log("Невыполненные id:", ids(getPendingTasks(tasks)));
  console.log("Сводка:", formatStats(tasks));
}

// Возвращает новое состояние при успехе и прежнее — при ошибке.
function step(state, label, result) {
  if (!result.ok) {
    console.log(`ОТКАЗ  ${label}: Ошибка: ${result.error}`);
    console.log(`       список не изменился: ${ids(state)}; ${formatStats(state)}`);
    return state;
  }
  console.log(`УСПЕХ  ${label}: ${ids(result.tasks)}; ${formatStats(result.tasks)}`);
  return result.tasks;
}

// ---------- Общий сценарий ----------
console.log("=== Общий сценарий (demoTasks) ===");
const demoBefore = JSON.stringify(demoTasks);
let tasks = demoTasks;

showList("Исходный набор:", tasks);
console.log("\nfindTaskById(tasks, 7):", findTaskById(tasks, 7));
console.log('findTaskById(tasks, "7"):', findTaskById(tasks, "7"));
console.log('createTask(25, "  Новая   задача  ", "low"):', createTask(25, "  Новая   задача  ", "low"));
console.log("");

tasks = step(tasks, "добавить id 20", addTask(tasks, 20, "Добавить проверку", "high"));
tasks = step(tasks, "выполнить id 4", setTaskCompleted(tasks, 4, true));
tasks = step(tasks, "переименовать id 10", renameTask(tasks, 10, "Подготовить инструкцию запуска"));
tasks = step(tasks, "удалить id 7", removeTask(tasks, 7));

// Ожидаемые отказы: пустое название и отсутствующая задача.
tasks = step(tasks, 'переименовать id 1 в "   "', renameTask(tasks, 1, "   "));
tasks = step(tasks, "удалить id 7 повторно", removeTask(tasks, 7));

showList("Итог общего сценария:", tasks);
console.log("\ndemoTasks не изменился:", JSON.stringify(demoTasks) === demoBefore);
console.log("Сводка demoTasks:", formatStats(demoTasks));

// ---------- Индивидуальный вариант ----------
console.log(`\n=== Вариант ${variantNumber}: подготовка семинара ===`);
const variantBefore = JSON.stringify(variantTasks);
let seminar = variantTasks;

showList("Исходный набор варианта:", seminar);
console.log("");

seminar = step(seminar, "добавить id 80",
  addTask(seminar, 80, "Собрать отзывы участников после семинара", "high"));
seminar = step(seminar, "выполнить id 11", setTaskCompleted(seminar, 11, true));
seminar = step(seminar, "переименовать id 23",
  renameTask(seminar, 23, "Забронировать аудиторию с проектором"));
seminar = step(seminar, "удалить id 37", removeTask(seminar, 37));
seminar = step(seminar, "добавить id 80 повторно",
  addTask(seminar, 80, "Собрать отзывы ещё раз", "high"));

showList("Итог варианта:", seminar);
console.log("\nЗадача 23 после переименования:", findTaskById(seminar, 23));
console.log("variantTasks не изменился:", JSON.stringify(variantTasks) === variantBefore);
console.log("Сводка variantTasks:", formatStats(variantTasks));
