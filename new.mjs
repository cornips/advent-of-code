import fs from "node:fs/promises";
import { join } from "node:path";
import { getExerciseDirectories, showHelp, verbose, YEAR } from "./utils.mjs";

if (showHelp()) {
  console.log(`Create a new exercise folder with \`pnpm new [number]\`.
This will create a new folder with the current year and the given exercise
number. To create a new exercise for today, just run \`pnpm new\`.

Usage: pnpm new [number] [options]
Options:
  -h, --help\t\tShow this help
  -v, --verbose\t\tShow verbose output
  --year number\t\tRun a specific year (also set by env var YEAR)
  \t\t\tDefaults to current year`);
  process.exit(0);
}

(async () => {
  try {
    await fs.access(YEAR);
  } catch (err) {
    verbose(`Creating directory for year ${YEAR}`);
    await fs.mkdir(YEAR);
  }

  const exerciseDirectories = await getExerciseDirectories(YEAR);
  const exerciseDirName = process.argv[2] || new Date().getDate().toString();

  if (exerciseDirectories.includes(exerciseDirName)) {
    console.log("Directory for today already exists");
    process.exit();
  }

  verbose(`Creating directory for exercise ${exerciseDirName}`);
  await fs.mkdir(join(YEAR, exerciseDirName));

  fs.readFile("template.mjs", "utf8")
    .then((content) => {
      content = content.replaceAll("${year}", YEAR);
      content = content.replaceAll("${day}", exerciseDirName);
      fs.writeFile(join(YEAR, exerciseDirName, "index.mjs"), content, "utf8");
      fs.writeFile(join(YEAR, exerciseDirName, "input.txt"), "", "utf8");
    })
    .catch((err) => {
      throw err;
    });

  console.log("Directory created for today's exercise:", exerciseDirName);
})();
