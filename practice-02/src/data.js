// Общий контрольный набор. Для своего варианта ниже предусмотрен отдельный массив.
// Идентификатор задачи не совпадает с её индексом в массиве.
export const demoTasks = [
  { id: 1, title: "Изучить функции", completed: true, priority: "medium" },
  { id: 4, title: "Подготовить модель задач", completed: false, priority: "high" },
  { id: 7, title: "Проверить методы массивов", completed: false, priority: "low" },
  { id: 10, title: "Оформить README", completed: true, priority: "medium" },
];

// Вариант 4 (номер в журнале 28): подготовка семинара.
// K = 3 — выполнены первые три задачи.
export const variantNumber = 4;
export const variantTasks = [
  { id: 11, title: "Согласовать тему и дату семинара", completed: true, priority: "high" },
  { id: 23, title: "Забронировать аудиторию", completed: true, priority: "medium" },
  { id: 37, title: "Составить список участников", completed: true, priority: "low" },
  { id: 41, title: "Подготовить презентацию для семинара", completed: false, priority: "high" },
  { id: 58, title: "Разослать приглашения участникам", completed: false, priority: "medium" },
  { id: 64, title: "Подготовить вопросы для обсуждения", completed: false, priority: "low" },
];
