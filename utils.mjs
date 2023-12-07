import fs from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const hasFlag = (arg) => {
  if (Array.isArray(arg)) return arg.some((a) => process.argv.includes(a));
  return process.argv.includes(arg);
};
const getArgumentValue = (arg) => {
  const index = process.argv.indexOf(arg);
  return index > -1 ? process.argv[index + 1] : null;
};

export const isWatchMode = () => hasFlag(["--watch", "-w"]);
export const isVerbose = () => hasFlag(["--verbose", "-v"]);
export const runToday = () => hasFlag(["--today", "-t"]);
export const showHelp = () => hasFlag(["--help", "-h"]);
export const PROJECT_ROOT = dirname(fileURLToPath(import.meta.url));
export const YEAR_SET =
  runToday() || process.env.YEAR || getArgumentValue("--year");
export const YEAR =
  (!runToday() && YEAR_SET) || new Date().getFullYear().toString();
export const DAY = runToday()
  ? new Date().getDate().toString()
  : process.env.DAY || getArgumentValue("--day");
export const verbose = (...message) => isVerbose() && console.log(...message);

const getDirectories = async (pathFromProjectRoot = "") =>
  (
    await fs.readdir(join(PROJECT_ROOT, pathFromProjectRoot), {
      withFileTypes: true,
    })
  )
    .filter(
      (dir) =>
        dir.isDirectory() &&
        dir.name !== "node_modules" &&
        !/^\./g.test(dir.name),
    )
    .map((dir) => dir.name);

export const getYearDirectories = async () => await getDirectories();

export const getExerciseDirectories = async (year) =>
  await getDirectories(year);
