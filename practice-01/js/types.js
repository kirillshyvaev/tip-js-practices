"use strict";

// Задание 2. Значение каждого выражения и тип результата.
// Строки выводятся через JSON.stringify, чтобы были видны кавычки.

const results = [
  ['"8" + 2', "8" + 2],
  ['"8" - 2', "8" - 2],
  ['Number("8") + 2', Number("8") + 2],
  ['"12" > "3"', "12" > "3"],
  ['12 === "12"', 12 === "12"],
  ['Number("")', Number("")],
  ['Number("text")', Number("text")],
  ['Boolean("false")', Boolean("false")],
  ["typeof null", typeof null],
  ["typeof NaN", typeof NaN],
];

for (let i = 0; i < results.length; i += 1) {
  const [expression, value] = results[i];
  const shown = typeof value === "string" ? JSON.stringify(value) : value;
  console.log(`${String(i + 1).padStart(2)}. ${expression.padEnd(17)} = ${shown} | тип: ${typeof value}`);
}
