// tests/pages/SnakeGamePage.ts
import { Page, Locator, expect } from "@playwright/test";

export class SnakeGamePage {
  readonly page: Page;

  // Controls
  readonly startButton: Locator;
  readonly pauseButton: Locator;
  readonly resetButton: Locator;
  readonly playAgainButton: Locator;

  // Score info
  readonly scoreValue: Locator;
  readonly highScoreValue: Locator;

  // Game Area
  readonly canvas: Locator;

  // Game Over menu
  readonly gameOverOverlay: Locator;
  readonly finalScore: Locator;

  constructor(page: Page) {
    this.page = page;

    // Buttons
    this.startButton = page.locator("#startBtn");
    this.pauseButton = page.locator("#pauseBtn");
    this.resetButton = page.locator("#resetBtn");
    this.playAgainButton = page.locator("#playAgainBtn");

    // Score / High Score
    this.scoreValue = page.locator("#score");
    this.highScoreValue = page.locator("#highScore");

    // Canvas
    this.canvas = page.locator("#gameCanvas");

    // Game Over
    this.gameOverOverlay = page.locator("#gameOver");
    this.finalScore = page.locator("#finalScore");
  }

  // Navigation
  async goto() {
    await this.page.goto("/");
  }

  // Actions
  async startGame() {
    await this.startButton.click();
  }

  async pauseGame() {
    await this.page.keyboard.press("Space");
  }

  async clickPauseButton() {
    await this.pauseButton.click();
  }

  async resetGame() {
    await this.resetButton.click();
  }

  async playAgain() {
    await this.playAgainButton.click();
  }

  async moveSnake(direction: "up" | "down" | "left" | "right") {
    const key = {
      up: "ArrowUp",
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight",
    }[direction];
    await this.page.keyboard.press(key);
  }

  async setFoodAheadOfHead(distance = 1) {
    await this.page.evaluate((step) => {
      const game = (window as any).__snakeGame;
      if (!game) return;

      const head = game.snake[0];
      const currentX = game.direction.x !== 0 ? game.direction.x : game.nextDirection.x || 0;
      const currentY = game.direction.y !== 0 ? game.direction.y : game.nextDirection.y || 0;

      const offsetX = currentX === 0 && currentY === 0 ? step : currentX * step;
      const offsetY = currentX === 0 && currentY === 0 ? 0 : currentY * step;

      game.food = {
        x: head.x + offsetX,
        y: head.y + offsetY,
      };
    }, distance);
  }

  async positionSnakeForWallCollision(
    direction: "up" | "down" | "left" | "right"
  ) {
    await this.page.evaluate((dir) => {
      const game = (window as any).__snakeGame;
      if (!game) return;

      const vectors = {
        right: { x: 1, y: 0 },
        left: { x: -1, y: 0 },
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
      } as const;

      const tileCount = game.tileCount;
      const center = Math.floor(tileCount / 2);
      const length = game.snake.length;
      let segments;

      if (dir === "right") {
        const y = center;
        segments = Array.from({ length }, (_, index) => ({
          x: tileCount - 1 - index,
          y,
        }));
      } else if (dir === "left") {
        const y = center;
        segments = Array.from({ length }, (_, index) => ({
          x: index,
          y,
        }));
      } else if (dir === "up") {
        const x = center;
        segments = Array.from({ length }, (_, index) => ({
          x,
          y: index,
        }));
      } else {
        const x = center;
        segments = Array.from({ length }, (_, index) => ({
          x,
          y: tileCount - 1 - index,
        }));
      }

      game.snake = segments;
      game.direction = { ...vectors[dir] };
      game.nextDirection = { ...vectors[dir] };
      game.draw();
    }, direction);
  }

  async causeImmediateSelfCollision(
    direction: "up" | "down" | "left" | "right"
  ) {
    await this.page.evaluate((dir) => {
      const game = (window as any).__snakeGame;
      if (!game) return;

      const vectors = {
        right: { x: 1, y: 0 },
        left: { x: -1, y: 0 },
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
      } as const;

      const vector = vectors[dir];
      const tileCount = game.tileCount;
      const safeMargin = 2;
      const base = Math.max(
        safeMargin,
        Math.min(tileCount - safeMargin - 1, Math.floor(tileCount / 2))
      );

      const head = { x: base, y: base };
      const second = {
        x: base + vector.x,
        y: base + vector.y,
      };
      const third = {
        x: base + vector.x * 2,
        y: base + vector.y * 2,
      };

      game.snake = [head, second, third];
      game.direction = { ...vector };
      game.nextDirection = { ...vector };
      game.draw();
    }, direction);
  }

  // Getters
  async getScore(): Promise<number> {
    return parseInt(await this.scoreValue.innerText(), 10);
  }

  async getHighScore(): Promise<number> {
    return parseInt(await this.highScoreValue.innerText(), 10);
  }

  async getFinalScore(): Promise<number> {
    return parseInt(await this.finalScore.innerText(), 10);
  }

  async getHeadPosition(): Promise<{ x: number; y: number }> {
    return this.page.evaluate(() => {
      const game = (window as any).__snakeGame;
      const head = game.snake[0];
      return { x: head.x, y: head.y };
    });
  }

  async getDirection(): Promise<{ x: number; y: number }> {
    return this.page.evaluate(() => {
      const game = (window as any).__snakeGame;
      return { ...game.direction };
    });
  }

  async getGamePaused(): Promise<boolean> {
    return this.page.evaluate(() => {
      const game = (window as any).__snakeGame;
      return game.gamePaused;
    });
  }

  async getGameRunning(): Promise<boolean> {
    return this.page.evaluate(() => {
      const game = (window as any).__snakeGame;
      return game.gameRunning;
    });
  }

  async getGameSpeed(): Promise<number> {
    return this.page.evaluate(() => {
      const game = (window as any).__snakeGame;
      return game.gameSpeed;
    });
  }

  async getPauseButtonLabel(): Promise<string> {
    return (await this.pauseButton.innerText()).trim();
  }

  async getWallPasses(): Promise<number> {
    return this.page.evaluate(() => {
      const game = (window as any).__snakeGame;
      return game.wallPasses;
    });
  }

  async getMaxWallPasses(): Promise<number> {
    return this.page.evaluate(() => {
      const game = (window as any).__snakeGame;
      return game.maxWallPasses;
    });
  }

  // ✅ LocalStorage Helpers (fixed to match game.js key)
  async preloadHighScore(value: number) {
    await this.page.addInitScript((val) => {
      localStorage.setItem("snakeHighScore", String(val));
    }, value);
  }

  async clearHighScore() {
    await this.page.addInitScript(() => {
      localStorage.removeItem("snakeHighScore");
    });
  }

  async getStoredHighScore(): Promise<number> {
    const val = await this.page.evaluate(() =>
      localStorage.getItem("snakeHighScore")
    );
    return val ? parseInt(val, 10) : 0;
  }

  // Verifications
  async verifyUIVisible() {
    await expect(this.startButton).toBeVisible();
    await expect(this.pauseButton).toBeVisible();
    await expect(this.resetButton).toBeVisible();
    await expect(this.canvas).toBeVisible();
    await expect(this.scoreValue).toBeVisible();
    await expect(this.highScoreValue).toBeVisible();
  }

  async verifyGameOverVisible() {
    await expect(this.gameOverOverlay).toHaveClass(/show/);
    await expect(this.finalScore).toBeVisible();
    await expect(this.playAgainButton).toBeVisible();
  }
}
