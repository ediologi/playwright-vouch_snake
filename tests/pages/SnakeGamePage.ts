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
