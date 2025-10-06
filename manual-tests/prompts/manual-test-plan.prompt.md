---
tools: ["playwright"]
mode: "agent"
---

# Test Plan Creation Instructions

## Objective

Create a comprehensive test plan on existing test reports or manual testing findings. The test plan should be systematic, prioritized, and executable.

## Instructions

### 1. Analysis Phase

- **Review Existing Test Reports** or conduct initial manual testing using Playwright MCP.
- **Identify Key User Flows** and critical functionalities of the application.
- **Document Current Functionality** including features, components, and user interactions.
- **Note any existing issues** or areas that require special attention.

### 2. Test Plan Structure

Create a structured test plan document with the following sections:

#### Test Plan Overview

- **Feature/Application**: Descriptive name of the test plan.
- **Objective**: Clear statement of what the test plan aims to achieve.
- **Scope**: Define what is included and excluded in the testing.
- **Assumptions**: Any assumptions made during the planning phase.
- **Dependencies**: List any dependencies such as environments, data, or tools.
- **Risks**: Identify potential risks that could impact testing.

### 3. Test Case Format

For each test case, include the following details:

- **Test Case X.Y**: [Clear, Descriptive Title].
- **Priority**: [High, Medium, Low].
- **Category**: [Navigation, Functionality, Performance, Security, Usability, etc.].
- **Description**: Detailed explanation of what the test case will validate.
- **Preconditions**: Any setup required before executing the test case.
- **Test Steps**:
  1. [Detailed step-by-step instructions to execute the test].
  2. [Expected Result for each step.]
- **Expected Outcome**: [Final expected result of the test case].

### 4. Risk Assessment

- **High-Risk Areas**: Identify and prioritize areas that are critical to the application's functionality or have a history of issues.
- **Dependencies**: List any dependencies between test cases or external factors that could impact testing.
- **Mitigation Strategies**: Outline strategies to mitigate risks during testing.

### 5. Success Metrics

- **Pass/Fail Criteria**: Define clear criteria for what constitutes a pass or fail for each test case.
- **Defect Tracking**: Outline how defects will be logged, tracked, and resolved.
- **Completion Criteria**: Define when the test plan can be considered complete (e.g., all high-priority test cases passed, critical defects resolved).

### 6. Test Plan Output

Create a comprehensive document that includes:

- Executive Summary with key findings and recommendations.
- Complete test case inventory.
- Priority-based execution order.
- Risk assessment and mitigation strategies.
- Success metrics and completion criteria.
- Recommendations for automation of high-priority test cases using Playwright.

## Best Practices

1. **Be Specific**: Use clear, actionable language in test steps.
2. **Think User-First**: Focus on real user scenarios, workflows, and behaviors.
3. **Include Edge Cases**: Test boundary conditions and error scenarios.
4. **Consider Accessibility**: Include WCAG compliance checks where applicable.
5. **Document Everything**: Clear prerequisites, steps, and expected outcomes.
6. **Prioritize Ruthlessly**: Focus on high-impact areas first.

## Deliverables

** Test Plan Document **: A comprehensive test plan in .md format saved in the manual-tests-directory.

Close the browser after completing the test plan creation.
