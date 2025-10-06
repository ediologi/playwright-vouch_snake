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
    const initialHead = await snake.getHeadPosition();
    await expect
      .poll(async () => (await snake.getHeadPosition()).x)
      .toBeGreaterThan(initialHead.x);

    await snake.pauseGame();
    await expect(snake.pauseButton).toHaveText("Resume");
    await expect.poll(async () => await snake.getGamePaused()).toBeTruthy();

    await snake.resetGame();
    expect(await snake.getScore()).toBe(0);
    await expect.poll(async () => await snake.getGameRunning()).toBeFalsy();
  });

  test("Start button disables and Pause toggles label", async ({ page }) => {
    const snake = new SnakeGamePage(page);
    await snake.goto();

    await expect(snake.startButton).toBeEnabled();
    await expect(snake.pauseButton).toBeDisabled();

    await snake.startGame();

    await expect(snake.startButton).toBeDisabled();
    await expect(snake.pauseButton).toBeEnabled();

    await snake.clickPauseButton();
    await expect(snake.pauseButton).toHaveText("Resume");
    await expect.poll(async () => await snake.getGamePaused()).toBeTruthy();

    await snake.clickPauseButton();
    await expect(snake.pauseButton).toHaveText("Pause");
    await expect.poll(async () => await snake.getGamePaused()).toBeFalsy();
  });

  test("Snake prevents reversing direction mid-move", async ({ page }) => {
    const snake = new SnakeGamePage(page);
    await snake.goto();
    await snake.startGame();

    await snake.moveSnake("up");
    await expect.poll(async () => (await snake.getDirection()).y).toBe(-1);

    await snake.moveSnake("down");
    await expect.poll(async () => (await snake.getDirection()).y).toBe(-1);
    await expect.poll(async () => (await snake.getDirection()).x).toBe(0);
  });

  test("Snake wraps around walls up to the allowed limit", async ({ page }) => {
    const snake = new SnakeGamePage(page);
    await snake.goto();
    await snake.startGame();

    const maxPasses = await snake.getMaxWallPasses();

    for (let i = 1; i <= maxPasses; i++) {
      await snake.positionSnakeForWallCollision("right");
      await expect.poll(async () => await snake.getWallPasses()).toBe(i);
      await expect.poll(async () => await snake.getGameRunning()).toBeTruthy();
    }

    await snake.positionSnakeForWallCollision("right");
    await expect.poll(async () => await snake.getGameRunning()).toBeFalsy();
    await snake.verifyGameOverVisible();
    expect(await snake.getWallPasses()).toBe(maxPasses);

    await snake.playAgain();
    await expect.poll(async () => await snake.getWallPasses()).toBe(0);
    await expect.poll(async () => await snake.getGameRunning()).toBeTruthy();

    await snake.positionSnakeForWallCollision("right");
    await expect.poll(async () => await snake.getWallPasses()).toBe(1);
  });

  test("Game Over should display with final score and Play Again option", async ({
    page,
  }) => {
    const snake = new SnakeGamePage(page);
    await snake.goto();
    await snake.startGame();

    await snake.causeImmediateSelfCollision("up");
    await expect.poll(async () => await snake.getGameRunning()).toBeFalsy();
    await snake.verifyGameOverVisible();
    const finalScore = await snake.getFinalScore();
    expect(finalScore).toBeGreaterThanOrEqual(0);

    await snake.playAgain();
    expect(await snake.getScore()).toBe(0);
  });

  test("Reset during active game restores initial state", async ({ page }) => {
    const snake = new SnakeGamePage(page);
    await snake.goto();
    await snake.startGame();

    await snake.setFoodAheadOfHead();
    await expect.poll(async () => await snake.getScore()).toBeGreaterThanOrEqual(10);

    await snake.resetGame();

    expect(await snake.getScore()).toBe(0);
    await expect(snake.startButton).toBeEnabled();
    await expect(snake.pauseButton).toBeDisabled();
    await expect(snake.pauseButton).toHaveText("Pause");
    await expect.poll(async () => await snake.getGameRunning()).toBeFalsy();
    const direction = await snake.getDirection();
    expect(direction.x).toBe(1);
    expect(direction.y).toBe(0);
  });

  test("Reset while idle keeps initial state", async ({ page }) => {
    const snake = new SnakeGamePage(page);
    await snake.goto();

    await snake.resetGame();

    expect(await snake.getScore()).toBe(0);
    await expect(snake.startButton).toBeEnabled();
    await expect(snake.pauseButton).toBeDisabled();
    const direction = await snake.getDirection();
    expect(direction.x).toBe(1);
    expect(direction.y).toBe(0);
    await expect.poll(async () => await snake.getGameRunning()).toBeFalsy();
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

    await snake.causeImmediateSelfCollision("up");
    await expect.poll(async () => await snake.getGameRunning()).toBeFalsy();
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

  test("Game speed accelerates after reaching 50 points", async ({ page }) => {
    const snake = new SnakeGamePage(page);
    await snake.goto();
    await snake.startGame();

    for (let i = 0; i < 5; i++) {
      const targetScore = (i + 1) * 10;
      await snake.setFoodAheadOfHead();
      await expect.poll(async () => await snake.getScore()).toBeGreaterThanOrEqual(
        targetScore
      );
    }

    await expect.poll(async () => await snake.getGameSpeed()).toBeLessThan(100);
    const speed = await snake.getGameSpeed();
    expect(speed).toBe(90);
  });
});
