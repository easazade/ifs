// Shared prompt options keep czg choices and commitlint validation synchronized.
const types = [
  { value: "repo", name: "repo: Repository-wide change" },
  { value: "build", name: "build: Build system or dependencies" },
  { value: "chore", name: "chore: Maintenance" },
  { value: "ci", name: "ci: CI configuration" },
  { value: "docs", name: "docs: Documentation" },
  { value: "feat", name: "feat: New feature" },
  { value: "fix", name: "fix: Bug fix" },
  { value: "perf", name: "perf: Performance improvement" },
  { value: "refactor", name: "refactor: Code restructuring" },
  { value: "revert", name: "revert: Revert a previous change" },
  { value: "style", name: "style: Formatting only" },
  { value: "test", name: "test: Tests" },
  { value: "agent", name: "agent: Agent configuration" },
];

const scopes = [
  "ifs-standards",
  "prototype",
  "prototype-api",
  "prototype-client",
  "prototype-puppeteer",
];

export default {
  parserPreset: "conventional-changelog-conventionalcommits",
  defaultIgnores: false,
  // Scopes are optional; when provided, use a workspace package name.
  rules: {
    "type-empty": [2, "never"],
    "type-enum": [2, "always", types.map(({ value }) => value)],
    "scope-enum": [2, "always", scopes],
    "subject-empty": [2, "never"],
  },
  prompt: {
    types,
    scopes,
  },
};
