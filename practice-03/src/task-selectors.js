// Новый модуль ПР3. Вход: корректный массив задач и фильтр all / pending / completed.
// Всегда возвращается новый массив; порядок и сами объекты сохраняются.
export function getVisibleTasks(tasks, filter = "all") {
  switch (filter) {
    case "pending":
      return tasks.filter((task) => !task.completed);
    case "completed":
      return tasks.filter((task) => task.completed);
    default:
      // "all": копия, чтобы наружу не уходил исходный массив.
      return tasks.slice();
  }
}
