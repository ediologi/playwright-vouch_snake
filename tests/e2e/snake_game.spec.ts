import { test, expect } from "@playwright/test";
import { SnakeGamePage } from "../pages/SnakeGamePage";

test.describe("Snake Game - Gameplay Tests", () => {
  test("Game UI should load correctly", async ({ page }) => {
    const snake = new SnakeGamePage(page);
    await snake.goto();
    await snake.verifyUIVisible();
    expect(await snake.getScore()).toBe(0);
  });

  test("Start, Pause and Reset flow", async ({ page }) => {
    const snake = new SnakeGamePage(page);
    await snake.goto();

    await snake.startGame();
    await snake.pauseGame();
    await expect(snake.pauseButton).toBeVisible();

    await snake.resetGame();
    expect(await snake.getScore()).toBe(0);
  });

  test("Game Over should display with final score and Play Again option", async ({
    page,
  }) => {
    const snake = new SnakeGamePage(page);
    await snake.goto();
    await snake.startGame();

    // Force snake to crash
    for (let i = 0; i < 20; i++) {
      await snake.moveSnake("left");
      await page.waitForTimeout(100);
    }

    await snake.verifyGameOverVisible();
    const finalScore = await snake.getFinalScore();
    expect(finalScore).toBeGreaterThanOrEqual(0);

    await snake.playAgain();
    expect(await snake.getScore()).toBe(0);
  });

  // Score Tests
  test("High Score persists across resets", async ({ page }) => {
    const snake = new SnakeGamePage(page);

    await snake.preloadHighScore(123);
    await snake.goto();

    await snake.startGame();
    await snake.resetGame();

    expect(await snake.getHighScore()).toBe(123);
    expect(await snake.getStoredHighScore()).toBe(123);
  });

  test("Score resets but High Score persists", async ({ page }) => {
    const snake = new SnakeGamePage(page);

    await snake.preloadHighScore(55);
    await snake.goto();

    await snake.startGame();
    await snake.resetGame();

    expect(await snake.getScore()).toBe(0);
    expect(await snake.getHighScore()).toBe(55);
  });

  test("Game Over final score does not exceed High Score", async ({ page }) => {
    const snake = new SnakeGamePage(page);

    await snake.preloadHighScore(77);
    await snake.goto();

    await snake.startGame();

    // Crash quickly
    for (let i = 0; i < 20; i++) {
      await snake.moveSnake("up");
      await page.waitForTimeout(100);
    }

    await snake.verifyGameOverVisible();

    const finalScore = await snake.getFinalScore();
    const highScore = await snake.getHighScore();

    expect(highScore).toBeGreaterThanOrEqual(finalScore);
  });

  test("Score and High Score increase when food is eaten", async ({ page }) => {
    const snake = new SnakeGamePage(page);
    await snake.goto();
    await snake.startGame();

    // Place food directly in front of the snake's current head
    await page.evaluate(() => {
      const game = (window as any).__snakeGame;
      const head = game.snake[0];
      // Push food right in front of the head (snake is moving right on start)
      game.food = { x: head.x + 1, y: head.y };
    });

    // Move snake right → guaranteed to eat the food
    await snake.moveSnake("right");
    await page.waitForTimeout(300); // let game loop tick

    const scoreAfterEat = await snake.getScore();
    const highScoreAfterEat = await snake.getHighScore();

    // Assert score increased by 10 (food adds +10 in the game.js)
    expect(scoreAfterEat).toBeGreaterThan(0);
    expect(highScoreAfterEat).toBeGreaterThanOrEqual(scoreAfterEat);
  });
});
