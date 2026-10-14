// Собственные проверки ПР2 (Шуваев). Готовый checks.js не изменялся.
// Запуск из корня репозитория: node practice-02/my-checks.js
import assert from "node:assert/strict";
import { variantTasks } from "./src/data.js";
import {
  findTaskById, getPendingTasks, getTaskStats,
  addTask, setTaskCompleted, renameTask, removeTask,
} from "./src/task-service.js";

let passed = 0;
let failed = 0;

function myCheck(name, body) {
  try {
    body();
    passed += 1;
    console.log(`OK: ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`FAIL: ${name}\n  ${error.message}`);
  }
}

myCheck("С1. Цепочка операций над variantTasks не меняет исходный массив", () => {
  const before = JSON.stringify(variantTasks);

  let list = addTask(variantTasks, 80, "Собрать отзывы", "high").tasks;
  list = setTaskCompleted(list, 41, true).tasks;
  list = renameTask(list, 58, "  Разослать напоминания  ").tasks;
  list = removeTask(list, 64).tasks;

  assert.deepEqual(list.map((t) => t.id), [11, 23, 37, 41, 58, 80]);
  assert.equal(findTaskById(list, 58).title, "Разослать напоминания");
  assert.deepEqual(getTaskStats(list), { total: 6, completed: 4, pending: 2, progress: 4 / 6 * 100 });
  assert.equal(getTaskStats(list).progress.toFixed(1), "66.7");
  // Исходные шесть задач остались прежними, включая статус id 41.
  assert.equal(JSON.stringify(variantTasks), before);
  assert.equal(variantTasks[3].completed, false);
});

myCheck("С2. Отказ не создаёт новый массив и не трогает данные", () => {
  const tasks = variantTasks;
  const results = [
    addTask(tasks, 11, "Повтор"),
    setTaskCompleted(tasks, 99, true),
    renameTask(tasks, 23, ""),
    removeTask(tasks, "37"),
  ];
  for (const result of results) {
    assert.equal(result.ok, false);
    assert.equal(typeof result.error, "string");
    assert.equal("tasks" in result, false);
  }
  assert.equal(tasks.length, 6);
});

myCheck("С3. Снять отметку со всех выполненных и вернуть обратно", () => {
  let list = variantTasks;
  for (const id of [11, 23, 37]) {
    list = setTaskCompleted(list, id, false).tasks;
  }
  assert.deepEqual(getTaskStats(list), { total: 6, completed: 0, pending: 6, progress: 0 });
  assert.equal(getPendingTasks(list).length, 6);

  for (const id of [11, 23, 37, 41, 58, 64]) {
    list = setTaskCompleted(list, id, true).tasks;
  }
  assert.deepEqual(getTaskStats(list), { total: 6, completed: 6, pending: 0, progress: 100 });
  assert.deepEqual(getPendingTasks(list), []);
  // Порядок и остальные поля не изменились.
  assert.deepEqual(list.map((t) => [t.id, t.title, t.priority]),
    variantTasks.map((t) => [t.id, t.title, t.priority]));
});

console.log(`\nСобственных проверок пройдено: ${passed}; не пройдено: ${failed}.`);
if (failed > 0) process.exitCode = 1;
