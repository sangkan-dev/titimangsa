# Security

## Supported Status

Titimangsa is in early development. Security expectations may evolve before the
first public release.

## Security Model

MVP API is public and read-only.

Expected mitigations:

- no public write endpoints
- no runtime database for MVP
- no user authentication for MVP
- no secrets in client-facing code
- explicit CORS
- cache headers for read-only responses
- small response payloads

## Reporting Issues

Until a formal private security contact is configured, open a GitHub issue for
non-sensitive security concerns.

For sensitive reports, contact the maintainers privately through the
`sangkan-dev` organization channels once available.

Do not include secrets, private credentials, or exploitable production details in
public issues.

## Data Integrity Issues

Incorrect holiday data is usually a data integrity issue, not a security issue.

Report it with:

- affected year
- affected date
- expected correction
- official public source URL

## Abuse Considerations

The API is public. Avoid adding features that create unnecessary abuse surface
for MVP, such as:

- public write endpoints
- dynamic source fetching from arbitrary URLs
- user-submitted scripts
- unauthenticated admin behavior
