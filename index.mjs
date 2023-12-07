import inquirer from "inquirer";
import { spawn } from "node:child_process";
import fs from "node:fs";
import { join } from "node:path";
import nodemon from "nodemon";
import {
  DAY,
  getExerciseDirectories,
  getYearDirectories,
  isWatchMode,
  PROJECT_ROOT,
  showHelp,
  YEAR,
  YEAR_SET,
} from "./utils.mjs";

if (showHelp()) {
  console.log(`Advent of Code solutions runner

Usage: pnpm start [options]
Options:
  -h, --help\t\tShow this help
  -v, --verbose\t\tShow verbose output
  -w, --watch\t\tWatch for changes and re-run
  -t, --today\t\tRun today's exercise
  --year number\t\tRun a specific year (also set by env var YEAR)
  --day number\t\tRun a specific day (also set by env var DAY)
  
See also: pnpm new -h`);
  process.exit(0);
}

const spawnYear = (year = YEAR) => {
  return spawn(
    "node",
    [join(PROJECT_ROOT, "index.mjs"), ...process.argv.slice(2)],
    {
      cwd: PROJECT_ROOT,
      stdio: "inherit",
      env: {
        ...process.env,
        YEAR: year,
      },
    },
  );
};
const spawnExercise = (exercise) => {
  const spawnFile = join(PROJECT_ROOT, YEAR, exercise, "index.mjs");
  const spawnOptions = {
    cwd: join(PROJECT_ROOT, YEAR, exercise),
    stdio: "inherit",
    env: process.env,
  };

  try {
    fs.accessSync(spawnFile, fs.constants.F_OK);
  } catch (error) {
    console.error(`Exercise ${YEAR}/${exercise} does not exist`);
    console.log(
      `Run \`pnpm new ${exercise} --year ${YEAR}\` to create a new exercise directory`,
    );
    process.exit(1);
  }

  if (isWatchMode()) {
    const timestamp = () => new Date().toTimeString().slice(0, 8);
    console.log("Watch mode is active");
    return nodemon({
      watch: join(PROJECT_ROOT, YEAR, exercise),
      ext: "mjs,txt",
      quiet: true,
      spawn: true,
      cwd: join(PROJECT_ROOT, YEAR, exercise),
      exec: `node ${spawnFile} ${process.argv.slice(2).join(" ")}`,
    })
      .on("restart", () => console.log(timestamp(), "Restarted"))
      .on("quit", () => console.log(timestamp(), "Exit watch mode"))
      .on("crash", () => console.log(timestamp(), "Crashed"))
      .on("exit", () => console.log(timestamp(), "Finished"));
  }
  return spawn("node", [spawnFile, ...process.argv.slice(2)], spawnOptions);
};
const quit = () => {
  console.log("Goodbye");
  process.exit(0);
};
const selectYear = async () => {
  const yearDirectories = await getYearDirectories();
  inquirer
    .prompt([
      {
        type: "list",
        name: "year",
        message: "Which year do you want to run?",
        choices: [...yearDirectories, new inquirer.Separator(), "Quit"],
        default: yearDirectories.length - 1,
      },
    ])
    .then(({ year }) => {
      if (year === "Quit") return quit();
      return spawnYear(year);
    });
};
const askHowToContinue = (exercise) => {
  if (isWatchMode()) return;
  inquirer
    .prompt([
      {
        type: "expand",
        name: "runAgain",
        message: "Do you want to run another exercise?",
        choices: [
          {
            key: "y",
            name: "Yes",
            value: true,
          },
          {
            key: "n",
            name: "No",
            value: false,
          },
          {
            key: "r",
            name: "Repeat this exercise",
            value: 1,
          },
        ],
        default: 0,
      },
    ])
    .then(({ runAgain }) => {
      if (runAgain === true) return spawnYear();
      if (runAgain === 1) {
        return spawnExercise(exercise).on("exit", () =>
          askHowToContinue(exercise),
        );
      }
      return quit();
    });
};

if (!YEAR_SET && !DAY) {
  await selectYear();
} else {
  (async () => {
    if (DAY) {
      return spawnExercise(DAY).on("exit", () => askHowToContinue(DAY));
    }

    const exerciseDirectories = await getExerciseDirectories(YEAR);
    inquirer
      .prompt([
        {
          type: "list",
          name: "exercise",
          message: "Which exercise do you want to run?",
          choices: [
            ...exerciseDirectories,
            new inquirer.Separator(),
            {
              name: "≪ Back to year selection",
              value: "back",
            },
          ],
          default: exerciseDirectories.length - 1,
        },
      ])
      .then(({ exercise }) => {
        if (exercise === "back") return selectYear();
        spawnExercise(exercise).on("exit", () => askHowToContinue(exercise));
      });
  })();
}
