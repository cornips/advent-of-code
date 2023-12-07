import fs from "node:fs/promises";
import { verbose } from "../../utils.mjs";
/**
 * https://adventofcode.com/2023/day/1
 * Goal:
 *   Part 1:
 *     Get the first and last digit of each line in the input file and
 *     add them together.
 *   Part 2:
 *     Same as part 1, but if the line contains a number spelled out,
 *     interpret it as digit. For example, "one" is "1", "eighttwo" is
 *     "82", etc. Beware, "eightwo" is "82", not "8wo".
 */

(async () => {
  const input = await fs.readFile("input.txt", "utf8");
  let sumOfFirstAndLastDigits = 0;
  let sumOfFirstAndLastStringDigits = 0;

  // Part 1
  input.split("\n").forEach((line) => {
    if (!line) return;
    const firstDigit = line.match(/\d/)?.shift();
    const lastDigit = line.match(/\d(?=[^\d]*$)/)?.shift();
    const firstAndLastDigit = parseInt([firstDigit, lastDigit].join(""));
    sumOfFirstAndLastDigits += firstAndLastDigit;
    verbose(line, "(", firstAndLastDigit, ")", sumOfFirstAndLastDigits);
  });

  console.log(
    "Part 1 - Sum of first-and-last digits:",
    sumOfFirstAndLastDigits,
  );

  // Part 2
  input.split("\n").forEach((line) => {
    if (!line) return;
    line = line.replace(
      /(?=(one|two|three|four|five|six|seven|eight|nine))/g,
      (match, word) => {
        return {
          one: "1",
          two: "2",
          three: "3",
          four: "4",
          five: "5",
          six: "6",
          seven: "7",
          eight: "8",
          nine: "9",
        }[word];
      },
    );
    const firstDigit = line.match(/\d/)?.shift();
    const lastDigit = line.match(/\d(?=[^\d]*$)/)?.shift();
    const firstAndLastDigit = parseInt([firstDigit, lastDigit].join(""));
    sumOfFirstAndLastStringDigits += firstAndLastDigit;
    verbose(line, "(", firstAndLastDigit, ")", sumOfFirstAndLastStringDigits);
  });

  console.log(
    "Part 2 - Sum of first-and-last string digits:",
    sumOfFirstAndLastStringDigits,
  );
})();
