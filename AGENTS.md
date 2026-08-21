# Agent Instructions

## Browser and Visual Verification

- Do not invoke Playwright, Browser MCP tools, screenshot capture, pixel checks, or automated visual QA by default.
- Use Playwright or Browser MCP only when the user explicitly asks for it in the current thread, or when the user grants permission after being asked.
- For frontend work that benefits from visual verification, prefer starting or identifying the local dev server URL and hand that URL to the user for inspection.
- When visual verification is skipped because the user did not request browser automation, state that the visual pass is left for user review.
- Non-visual checks such as type checking, linting, unit tests, and production builds remain appropriate unless the user asks otherwise.
