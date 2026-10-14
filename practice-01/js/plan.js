"use strict";

// Задание 4. План выполнения оставшихся задач по дням.
// Вариант 4 (номер в журнале 28): 20 задач, выполнено 11, норма 6 в день.
const totalTasks = 20;
const completedTasks = 11;
const dailyLimit = 6;

const maxValue = 1000;

let errorText = "";

// Сначала количества задач (как в progress.js), затем дневная норма.
if (typeof totalTasks !== "number" || typeof completedTasks !== "number") {
  errorText = "количество задач должно быть числом, строки не принимаются";
} else if (!Number.isFinite(totalTasks) || !Number.isFinite(completedTasks)) {
  errorText = "недопустимое числовое значение (NaN или бесконечность)";
} else if (!Number.isInteger(totalTasks) || !Number.isInteger(completedTasks)) {
  errorText = "количество задач должно быть целым";
} else if (totalTasks < 0 || completedTasks < 0) {
  errorText = "количество задач не может быть отрицательным";
} else if (totalTasks > maxValue) {
  errorText = `общее количество задач больше ${maxValue}`;
} else if (completedTasks > totalTasks) {
  errorText = "некорректное число выполненных задач (больше общего)";
} else if (typeof dailyLimit !== "number") {
  // Норма проверяется даже тогда, когда задач не осталось.
  errorText = "дневная норма должна быть числом, а не строкой";
} else if (!Number.isInteger(dailyLimit)) {
  errorText = "дневная норма должна быть целым числом";
} else if (dailyLimit < 1 || dailyLimit > maxValue) {
  errorText = `дневная норма должна быть от 1 до ${maxValue}`;
}

if (errorText !== "") {
  console.log(`Ошибка: ${errorText}`);
} else {
  let left = totalTasks - completedTasks;
  let day = 0;

  console.log(left === 0 ? "Все задачи уже выполнены" : `Осталось задач: ${left}`);

  // left уменьшается минимум на 1 за итерацию, так как dailyLimit >= 1.
  while (left > 0) {
    day += 1;
    const doneToday = Math.min(dailyLimit, left);
    left -= doneToday;
    console.log(`День ${day}: выполнено ${doneToday}, осталось ${left}`);
  }

  console.log(`Потребуется дней: ${day}`);
}
