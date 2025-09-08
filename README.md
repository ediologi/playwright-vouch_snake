## Automated Testing with Playwright

This repository includes an automated test suite for the Snake Game using **Playwright** with a Page Object Model (POM).
The test coverage ensures key aspects of the game work as expected:

- UI load & controls visibility
- Start / Pause / Reset flows
- Game Over screen (score + replay functionality)
- High score persistence across resets (via localStorage)
- Deterministic food‑eating test (injects food in front of snake, requires one small change to game.js: window.\_\_snakeGame = game;)

# Running the Test

Install Playwright Browsers

```bash
npx playwright install
```

Run Tests Headless

```bash
npx playwright test
```

Run Tests Headed

```bash
npx playwright test
```

View Report

```bash
npx playwright testshow-report
```

# Snake Game 🐍

A classic Snake game built with Node.js and HTML5 Canvas, featuring modern web technologies and a clean, responsive design.

## Features

- **Classic Gameplay**: Grid-based movement with smooth controls
- **Responsive Controls**: Use arrow keys or WASD to control the snake
- **Progressive Difficulty**: Speed increases every 50 points
- **Score System**: Track your current score and persistent high score
- **Pause/Resume**: Space bar or button to pause anytime
- **Visual Feedback**: Snake with directional eyes that follow movement
- **Modern UI**: Gradient backgrounds, smooth animations, and clean design
- **Responsive Design**: Works on both desktop and mobile screens

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ediologi/playwright-vouch_snake.git
cd playwright-vouch_snake
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

4. Open your browser and navigate to:

```
http://localhost:3456
```

## How to Play

- **Start**: Click the "Start Game" button
- **Move**: Use arrow keys (↑ ↓ ← →) or WASD keys
- **Pause**: Press Space bar or click "Pause" button
- **Objective**: Eat the red food to grow and increase your score
- **Avoid**: Don't hit the walls or your own tail!

## Game Controls

| Key   | Action       |
| ----- | ------------ |
| ↑ / W | Move Up      |
| ↓ / S | Move Down    |
| ← / A | Move Left    |
| → / D | Move Right   |
| Space | Pause/Resume |

## Technical Stack

- **Backend**: Node.js with Express.js
- **Frontend**: Vanilla JavaScript with HTML5 Canvas
- **Styling**: Pure CSS with modern gradients and animations
- **Storage**: LocalStorage for high score persistence

## Project Structure

```
snake/
├── public/
│   ├── index.html     # Game HTML structure
│   ├── styles.css     # Game styling
│   └── game.js        # Game logic and mechanics
├── tests/
│   ├── e2e/
│   │   └── snake_game.spec.ts   # main test suite
│   ├── pages/
│   │   └── SnakeGamePage.ts     # Page Object
│   └── types/
│       └── global.d.ts          # (optional window typings)
├── server.js           # Express server
├── package.json        # Node dependencies
└── README.md           # This file
```

## Game Mechanics

- **Snake Movement**: Continuous movement in the current direction
- **Growth System**: Snake grows by one segment when eating food
- **Collision Detection**: Game ends on wall or self-collision
- **Food Spawning**: Random placement on empty grid cells
- **Speed Scaling**: Increases progressively with score
- **180° Turn Prevention**: Cannot immediately reverse direction

## Development

To modify the game:

1. **Game Logic**: Edit `public/game.js`
2. **Styling**: Modify `public/styles.css`
3. **Server**: Update `server.js` for backend changes

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with Canvas support

## License

MIT License - Feel free to use and modify as needed.

## Attribution

- Original Snake Game project authored by: josephvouch/vouch_snake
- Playwright test suite, Page Object Model, and test enhancements for automation created by ediologi for the Vouch automation assessment.

## Author

Created with Node.js and vanilla JavaScript

---

Enjoy the game! 🎮
