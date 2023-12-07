# Advent of Code solutions

This repository contains my solutions to the [Advent of Code](https://adventofcode.com/) challenges.
Each solution is written in Node. The solutions are organized by year and day.

## Getting started

```bash
pnpm install
pnpm start
```

## Creating a new exercise folder

To create a new exercise folder, run one of the following commands:
```bash
pnpm new # defaults to the current year and day
pnpm new <day> # specific day, defaults to the current year
pnpm new <day> --year <year> # specific day and year
```

## Running a specific exercise

Instead of going through the menu, you can run a specific exercise directly.
```bash
pnpm start -t # runs the exercise for today
pnpm start --day <day> # runs the exercise for a specific day in the current year
pnpm start --year <year> --day <day> # runs the exercise for a specific year and day
```

## Flags

- `-h, --help`: Displays help text
- `-v, --verbose`: Enables verbose logging
- `-w, --watch`: Enables watch mode
