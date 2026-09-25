export default {
  parserPreset: "conventional-changelog-conventionalcommits",
  defaultIgnores: false,
  // Scopes are optional; when provided, use a workspace package name.
  rules: {
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
        "agent",
      ],
    ],
    "scope-enum": [
      2,
      "always",
      [
        "ifs-standards",
        "prototype",
        "prototype-api",
        "prototype-client",
        "prototype-puppeteer",
      ],
    ],
    "subject-empty": [2, "never"],
  },
};
