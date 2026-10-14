"use strict";

// Задание 3. Сводка выполнения задач.
// Вариант 4 (номер в журнале 28): 20 задач, выполнено 11.
const totalTasks = 20;
const completedTasks = 11;

const maxTasks = 1000;

// Проверки от типа к границам; сохраняется только первая найденная причина.
let errorText = "";

if (typeof totalTasks !== "number" || typeof completedTasks !== "number") {
  errorText = "количество задач должно быть числом, строки не принимаются";
} else if (!Number.isFinite(totalTasks) || !Number.isFinite(completedTasks)) {
  errorText = "недопустимое числовое значение (NaN или бесконечность)";
} else if (!Number.isInteger(totalTasks) || !Number.isInteger(completedTasks)) {
  errorText = "количество задач должно быть целым, дробное значение недопустимо";
} else if (totalTasks < 0 || completedTasks < 0) {
  errorText = "количество задач не может быть отрицательным";
} else if (totalTasks > maxTasks) {
  errorText = `общее количество задач больше ${maxTasks}`;
} else if (completedTasks > totalTasks) {
  errorText = "выполнено больше задач, чем существует";
}

if (errorText !== "") {
  console.log(`Ошибка: ${errorText}`);
} else if (totalTasks === 0) {
  // Возможен только случай 0 и 0, поэтому деления на ноль нет.
  console.log("Задач пока нет");
} else {
  const remainingTasks = totalTasks - completedTasks;
  const percentage = (completedTasks / totalTasks) * 100;

  // Статус определяется по количествам, а не по округлённому проценту.
  let status = "Завершено";
  if (completedTasks === 0) {
    status = "Не начато";
  } else if (completedTasks < totalTasks) {
    status = "В работе";
  }

  console.log(`Всего задач: ${totalTasks}`);
  console.log(`Выполнено: ${completedTasks}`);
  console.log(`Осталось: ${remainingTasks}`);
  console.log(`Прогресс: ${percentage.toFixed(1)}%`);
  console.log(`Статус: ${status}`);
}
