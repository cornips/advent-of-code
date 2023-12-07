import fs from "node:fs/promises";
import { verbose } from "../../utils.mjs";

/**
 * https://adventofcode.com/${year}/day/${day}
 * Goal:
 */

(async () => {
  const input = await fs.readFile("input.txt", "utf8");

  verbose(`-- Exercise ${day} --`);
})();
