export default {
  parserPreset: "conventional-changelog-conventionalcommits",
  defaultIgnores: false,
  // Enforce the format only; scopes are optional and unrestricted.
  rules: {
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test"],
    ],
    "subject-empty": [2, "never"],
  },
};
