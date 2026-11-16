# Maintainer Policy

This file records repository administration policy. Runtime and release
behavior lives in the maintained documents under `docs/`.

## Repository Metadata

- Maintainer: `@AoHanBei`.
- Description: `Rust LLM gateway with protocol adaptation, resilient routing, idempotency, budget accounting, and streaming lifecycle management.`
- Topics: `rust`, `axum`, `llm-gateway`, `anthropic`, `openai-compatible`,
  `claude-code`, `postgresql`, `idempotency`, `streaming`.
- License: MIT.

README workflow badges must target `AoHanBei/ModelPort`. Add a public Scorecard
badge only after this repository has a corresponding published result. Project
ownership and development context are documented in [LICENSE](../LICENSE) and
[Project background](../docs/PROJECT_BACKGROUND.md).

Do not claim Provider verification without dated evidence produced by the
[Provider procedure](../docs/PROVIDERS.md#discovery-and-verification).

## Branch Protection

Protect `main` with:

- pull requests before merge;
- Repository checks, PostgreSQL dashboard E2E, dependency review, and CodeQL as
  required statuses;
- up-to-date branches and resolved review conversations;
- maintainer review for security, persistence, and deployment changes;
- restricted force pushes and branch deletion;
- signed commits and tags where the signing setup is available.

Routine CI uses the pinned Rust and Node versions, locked dependencies,
fmt/test/clippy, dashboard checks, shell syntax, examples, and documentation
links through `scripts/check-all.sh`. Paid Provider tests require an explicit,
budget-capped workflow and must not run for forks.

## Issues And Pull Requests

Issue forms and reviews must not request a complete `.env`, Provider key,
session/client token, database backup, raw prompt/response, or unreviewed log.
Security reports follow [SECURITY.md](../SECURITY.md), not a public issue.

## Repository Controls

Enable private vulnerability reporting, Dependabot alerts and security updates,
immutable releases where available, tag protection, and artifact attestations.
Workflow files cannot enable these external repository settings.

Follow [Releasing](../docs/RELEASING.md) for versioning, evidence, artifacts,
and rollback.
