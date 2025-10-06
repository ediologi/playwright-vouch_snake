---
Feature/Application: Snake Game at http://localhost:3456/
Objective: Validate core gameplay, UI state transitions, scoring, and persistence.
Scope: Browser-based single-player snake experience; includes gameplay loop, controls, overlays, scoring, persistence. Excludes multiplayer, audio, advanced mobile responsiveness.
Assumptions: Desktop browser with keyboard support and available localStorage; static assets served without authentication.
Dependencies: Browser, localStorage access, ability to clear storage between runs, running server at http://localhost:3456/.
Risks: Timing-sensitive pause/resume and speed changes, limited wall-wrap counter accuracy, collision detection, localStorage read/write failures.
---

Executive Summary
- Snake game exposes start/pause/reset controls, limited wall-wrap passes, dynamic scoring, and localStorage high-score tracking; plan targets consistent gameplay across controls.
- Highest risks involve gameplay state transitions (pause, game over), wall-wrap limit enforcement, and persistence (speed ramp, high score).
- Manual execution relies on local instance; automation opportunities exist for deterministic UI flows via Playwright.

Test Plan Overview
- Feature/Application: Snake game single-page app (`public/game.js`).
- Objective: Ensure gameplay, controls, UI overlays, scoring, and persistence work as designed.
- Scope: Includes gameplay loop, control inputs, overlays, scoring, persistence; excludes non-existent multiplayer and advanced mobile layouts.
- Assumptions: Modern desktop browser with keyboard and localStorage; server serves static assets.
- Dependencies: Browser, keyboard input, localStorage availability, ability to reset storage.
- Risks: Pause/resume race conditions, speed ramp timing, wall-wrap counter enforcement, collision detection, localStorage contamination.

Test Cases

Test Case 1.1 – Launch & Layout
- Priority: High | Category: Navigation
- Description: Initial load shows canvas, scoreboard, and correct button states.
- Preconditions: Fresh tab with cleared `snakeHighScore`.
- Test Steps:
  1. Navigate to `http://localhost:3456/`.
  2. Observe layout and controls.
- Expected Outcome: Canvas displays, Start enabled, Pause disabled, Reset enabled, High Score 0, Game Over overlay hidden.

Test Case 1.2 – Start Game & Initial Movement
- Priority: High | Category: Functionality
- Description: Start begins movement to the right with snake length 3.
- Preconditions: Game idle.
- Test Steps:
  1. Click Start.
  2. Watch snake movement.
- Expected Outcome: Game runs, Pause enabled, snake moves right at default speed.

Test Case 1.3 – Keyboard Direction Changes
- Priority: High | Category: Functionality
- Description: Arrow/WASD inputs change direction without allowing 180° turns.
- Preconditions: Game running, snake moving right.
- Test Steps:
  1. Press ArrowUp; verify upward movement.
  2. While moving up, press ArrowDown; observe rejection.
  3. Repeat for opposite horizontal direction.
- Expected Outcome: Direction changes only to perpendicular axis; opposite inputs ignored.

Test Case 1.4 – Pause/Resume via Button and Spacebar
- Priority: High | Category: Usability
- Description: Pause toggles overlay and halts movement; resume restores play.
- Preconditions: Game running.
- Test Steps:
  1. Click Pause.
  2. Observe overlay and button text.
  3. Press Spacebar to resume.
- Expected Outcome: Movement stops, overlay displays "PAUSED" with instructions, button text swaps to Resume; Spacebar resumes play and hides overlay.

Test Case 1.5 – Food Consumption & Score Increment
- Priority: High | Category: Functionality
- Description: Eating food increases score by 10 and grows snake.
- Preconditions: Game running near food.
- Test Steps:
  1. Move head onto food.
  2. Observe score and snake length.
- Expected Outcome: Score += 10, snake length +1, new food spawns off-snake.

Test Case 1.6 – Speed Ramp at Score Milestones
- Priority: Medium | Category: Performance
- Description: Game speed increases each 50 points until minimum threshold.
- Preconditions: Score accumulation to ≥100.
- Test Steps:
  1. Note game pace at score 40.
  2. Continue scoring to 50 and 100.
- Expected Outcome: Noticeable speed increase at 50, 100; no change once `gameSpeed` reaches 50.

Test Case 1.7 – Limited Wall Wrap Behaviour
- Priority: High | Category: Functionality
- Description: Snake may wrap across the board edge up to three times; the fourth wall impact ends the game.
- Preconditions: Game running.
- Test Steps:
  1. Drive snake into any wall and observe it reappear from the opposite side.
  2. Repeat wall impacts three times, noting score and position continuity.
  3. Hit a wall a fourth time without eating food in between.
  4. Restart the game (Reset + Start or Play Again) and hit a wall once more.
- Expected Outcome: First three wall impacts wrap seamlessly with no game over; fourth impact triggers Game Over overlay with controls reset; after restarting, the first wall impact wraps again, confirming the counter cleared.

Test Case 1.8 – Self-Collision Detection
- Priority: High | Category: Functionality
- Description: Snake colliding with itself ends game.
- Preconditions: Snake length ≥5.
- Test Steps:
  1. Arrange snake to collide with body.
- Expected Outcome: Game Over triggered with same UI behaviour as wall collision.

Test Case 1.9 – Play Again Flow
- Priority: Medium | Category: Navigation
- Description: Play Again hides overlay and restarts game automatically.
- Preconditions: Game Over overlay visible.
- Test Steps:
  1. Click Play Again.
- Expected Outcome: Overlay removed, snake reset, Start disabled while game resumes, score 0.

Test Case 1.10 – Reset During Idle and Active States
- Priority: Medium | Category: Functionality
- Description: Reset restores initial state whether idle or running.
- Preconditions: (a) Idle state; (b) Active game.
- Test Steps:
  1. Click Reset while idle.
  2. Start game, click Reset mid-run.
- Expected Outcome: Both scenarios return to initial setup, Start enabled, Pause disabled.

Test Case 1.11 – High Score Persistence
- Priority: Medium | Category: Persistence
- Description: High score stored in localStorage and persists across reloads.
- Preconditions: Clear `snakeHighScore` before start.
- Test Steps:
  1. Score ≥30 then collide.
  2. Reload page.
  3. Replay and finish with score below high score.
- Expected Outcome: High Score shows 30 after reload; remains 30 when lower score achieved.

Test Case 1.12 – Button Disable States
- Priority: Low | Category: Usability
- Description: Start disabled during play; Pause disabled when not running.
- Preconditions: Observe before, during, and after game.
- Test Steps:
  1. Click Start and attempt to click again.
  2. After Game Over, check Pause state.
- Expected Outcome: Start cannot be reactivated mid-game; Pause disabled when game stopped.

Test Case 1.13 – LocalStorage Absence Edge Case
- Priority: Low | Category: Resilience
- Description: Behaviour when localStorage unavailable.
- Preconditions: Browser privacy mode or dev tools overriding storage access.
- Test Steps:
  1. Load page with storage error.
  2. Monitor console and UI.
- Expected Outcome: App stays functional with high score defaulting to 0; log errors if failure occurs.

Test Case 1.14 – Pause Overlay Instructions
- Priority: Low | Category: Accessibility
- Description: Overlay text legible and properly positioned.
- Preconditions: Game paused.
- Test Steps:
  1. Observe overlay text.
  2. Check for contrast/clipping.
- Expected Outcome: Text centered, readable, no visual defects.

Risk Assessment
- High-Risk Areas: Pause/resume timing, wall-wrap limit tracking, speed adjustments, collision detection loops, storage persistence.
- Dependencies: Browser event handling, localStorage availability, consistent canvas rendering and window focus.
- Mitigation Strategies: Execute tests in multiple browsers, clear storage between sessions, review console logs, capture repro evidence.

Success Metrics
- Pass/Fail Criteria: Test passes when observed outcomes match expectations without console errors; deviations logged as defects.
- Defect Tracking: Document issues with reproduction steps, environment, screenshots/GIFs, console logs.
- Completion Criteria: All high-priority cases pass; medium risks triaged or fixed; low-priority findings documented; no unresolved high-severity issues.
- Automation Candidates: Launch layout validation, control enablement, game-over flow, and high score persistence via Playwright.

Recommendations
- Execute high-priority tests first, then medium, finally low.
- Consider scripting deterministic paths with Playwright for regression coverage.
