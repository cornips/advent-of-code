import fs from "node:fs/promises";
import { verbose } from "../../utils.mjs";
/**
 * https://adventofcode.com/2023/day/2
 * Intro:
 *   Each game is listed with its ID number (like the 11 in Game 11: ...)
 *     followed by a semicolon-separated list of subsets of cubes that were
 *     revealed from the bag (like 3 red, 5 green, 4 blue).
 * Goal:
 *   Part 1:
 *     Determine which games would have been possible if the bag had been
 *     loaded with only 12 red cubes 13 green cubes, and 14 blue cubes. What
 *     is the sum of the IDs of those games?
 *   Part 2:
 *     For each game, find the minimum set of cubes that must have been
 *     present. What is the sum of the power of these sets?
 */

(async () => {
  const input = await fs.readFile("input.txt", "utf8");
  const bag = { red: 12, green: 13, blue: 14 };
  let possibleGames = [];
  let powerOfGames = [];

  input.split("\n").forEach((game) => {
    if (!game) return;
    const [gameIdString, setString] = game.split(": ");
    const gameId = parseInt(gameIdString.split(" ")[1]);
    const sets = setString.split("; ");

    // Part 1 - Find possible sets
    sets.every((set, setIndex) => {
      const cubes = set.split(", ");
      return cubes.every((cube) => {
        const [count, color] = cube.split(" ");
        verbose(
          `Game ${gameId} set ${setIndex + 1}`,
          { count: parseInt(count), color },
          bag[color],
          count > bag[color] ? "not possible" : "possible",
        );

        // Reject game if count is higher than available cubes
        if (count > bag[color]) {
          verbose(`Game ${gameId} is not possible`);
          possibleGames = possibleGames.filter((id) => id !== gameId);
          return false;
        }
        // Add game to possible games if not already in there
        return possibleGames.includes(gameId) || possibleGames.push(gameId);
      });
    });

    // Part 2 - Find minimum set of cubes
    const minimumCubesInGame = {};
    sets.forEach((set) => {
      const cubes = set.split(", ");
      // find highest count per color
      cubes.forEach((cube) => {
        const [count, color] = cube.split(" ");
        if (
          minimumCubesInGame[color] === undefined ||
          parseInt(minimumCubesInGame[color]) < count
        )
          minimumCubesInGame[color] = count;
      });
    });
    const powerOfGame = Object.values(minimumCubesInGame).reduce(
      (a, b) => a * b,
    );
    powerOfGames.push(powerOfGame);
    verbose(
      "minimumCubes for game",
      gameId,
      minimumCubesInGame,
      "power",
      powerOfGame,
    );
  });

  const sumOfPossibleGames = possibleGames.reduce((a, b) => a + b);
  const sumOfPowerOfGames = powerOfGames.reduce((a, b) => a + b);

  verbose("Possible games:", possibleGames);
  console.log("Part 1 - Sum of possible games:", sumOfPossibleGames);

  verbose("Power of games:", powerOfGames);
  console.log("Part 2 - Sum of power of games:", sumOfPowerOfGames);
})();
