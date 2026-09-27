# educk-front

EduTrack host shell for the satellite portals running on ports `3001`, `3002`, `3003`, and `3005`.
The React 18 + Vite application runs on port `3000` and provides unified navigation without a
full-page reload. Project governance and architecture live in
[`educk-docs`](https://github.com/code-corhuila/educk-docs).

## Branching

Three permanent branches. **None of them accepts a direct commit** — you enter through a child
branch and leave through a Pull Request.

```
develop  <--PR--  feat/... fix/... chore/...
qa       <--PR--  qa/...
main     <--PR--  release/...  hotfix/...
```

Promotion happens **by re-application** (`git cherry-pick -x`), never by merging one permanent
branch into another: `merge develop -> qa` and `merge qa -> main` do not exist in this model.

`main` requires **1 approval from `ariel5253`**. On `develop` and `qa` the team sets its own review
rule.

Full policy: `00-governance/branching-policy.md` in `library-docs`.
