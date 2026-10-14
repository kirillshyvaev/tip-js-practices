// Операции над списком задач.
// Функции ничего не печатают, не работают с DOM и не изменяют входные массивы и объекты.
// Ожидаемая ошибка возвращается как { ok: false, error }.

const ALLOWED_PRIORITIES = ["low", "medium", "high"];
const TITLE_MAX = 100;

function fail(error) {
  return { ok: false, error };
}

function done(tasks) {
  return { ok: true, tasks };
}

// null — id корректен, иначе текст ошибки.
function checkId(id) {
  if (typeof id !== "number") {
    return "Идентификатор должен быть числом";
  }
  if (!Number.isSafeInteger(id) || id <= 0) {
    return "Идентификатор должен быть положительным целым числом";
  }
  return null;
}

// { title } — очищенное название, либо { error }.
function cleanTitle(title) {
  if (typeof title !== "string") {
    return { error: "Название должно быть строкой" };
  }
  const trimmed = title.trim();
  if (trimmed.length === 0 || trimmed.length > TITLE_MAX) {
    return { error: `Название должно содержать от 1 до ${TITLE_MAX} символов` };
  }
  return { title: trimmed };
}

export function createTask(id, title, priority = "medium") {
  const idError = checkId(id);
  if (idError) return fail(idError);

  const cleaned = cleanTitle(title);
  if (cleaned.error) return fail(cleaned.error);

  if (!ALLOWED_PRIORITIES.includes(priority)) {
    return fail("Приоритет может быть только low, medium или high");
  }

  return {
    ok: true,
    task: { id, title: cleaned.title, completed: false, priority },
  };
}

export function findTaskById(tasks, id) {
  return tasks.find((task) => task.id === id);
}

export function getPendingTasks(tasks) {
  return tasks.filter((task) => !task.completed);
}

export function getTaskTitles(tasks) {
  return tasks.map((task) => task.title);
}

export function getTaskStats(tasks) {
  const total = tasks.length;
  let completed = 0;
  for (const task of tasks) {
    if (task.completed) completed += 1;
  }
  // Процент не округляется: toFixed — задача вывода.
  const progress = total === 0 ? 0 : (completed / total) * 100;
  return { total, completed, pending: total - completed, progress };
}

export function addTask(tasks, id, title, priority = "medium") {
  const created = createTask(id, title, priority);
  if (!created.ok) return created;

  // Уникальность id можно проверить только здесь: createTask не знает о списке.
  if (findTaskById(tasks, id)) {
    return fail(`Задача с id ${id} уже существует`);
  }
  return done([...tasks, created.task]);
}

export function setTaskCompleted(tasks, id, completed) {
  const idError = checkId(id);
  if (idError) return fail(idError);

  if (completed !== true && completed !== false) {
    return fail("Статус выполнения должен быть true или false");
  }
  if (!findTaskById(tasks, id)) {
    return fail(`Задача с id ${id} не найдена`);
  }

  // Копируется только изменяемая задача, остальные объекты переходят по ссылке.
  return done(tasks.map((task) => (task.id === id ? { ...task, completed } : task)));
}

export function renameTask(tasks, id, title) {
  const idError = checkId(id);
  if (idError) return fail(idError);

  const cleaned = cleanTitle(title);
  if (cleaned.error) return fail(cleaned.error);

  if (!findTaskById(tasks, id)) {
    return fail(`Задача с id ${id} не найдена`);
  }

  return done(tasks.map((task) => (task.id === id ? { ...task, title: cleaned.title } : task)));
}

export function removeTask(tasks, id) {
  const idError = checkId(id);
  if (idError) return fail(idError);

  if (!findTaskById(tasks, id)) {
    return fail(`Задача с id ${id} не найдена`);
  }
  return done(tasks.filter((task) => task.id !== id));
}
