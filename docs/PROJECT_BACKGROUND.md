# Project Background

## Public Project

[AoHanBei/ModelPort](https://github.com/AoHanBei/ModelPort) is maintained by
[@AoHanBei](https://github.com/AoHanBei). It applies experience from an internal
internship gateway to a public implementation with business-specific material
removed. Company source code is not published by this repository.

The technical focus is protocol adaptation, routing/fallback, concurrent
idempotency, budget accounting, and streaming lifecycle handling. The current
repository also contains dashboard and operational features. A feature's
presence in the repository establishes its implementation, while individual
authorship is determined separately from contribution history.

## Internship And Public-Version Boundaries

During the internship, the team already had the Axum service, basic forwarding,
the Messages entry point, ingress authentication, single-Provider forwarding,
and a dashboard foundation. The maintainer's responsibilities concentrated on
the five mechanisms above, with architecture and Rust review from a mentor.
Colleagues handled the internship dashboard frontend and deployment.

The public dashboard was rebuilt with AI assistance. Optional public-version
extensions, such as smart routing and dashboard OIDC, should be assessed from
this repository's code and documentation rather than treated as internship
deliverables. Deployment support describes the repository's supported scope;
it is not a claim of measured production scale.

## AI-Assisted Development

AI tools assist implementation, tests, review, and documentation. Engineering
responsibility includes defining the problem, choosing tradeoffs, reviewing
diffs, and checking acceptance evidence. Implementation and verification claims
should be traceable to source, tests, or dated execution results.

For the runtime mechanisms and representative evidence, see
[Request lifecycle](REQUEST_LIFECYCLE.md).
