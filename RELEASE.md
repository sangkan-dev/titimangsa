# Release Checklist

Use this checklist for the first public release after the launch commits are
pushed to `main`.

## v0.1.0

1. Push the launch commits to `main`.
2. Confirm the `Validate` workflow passes on GitHub.
3. Confirm the API deployment workflow passes.
4. Confirm the docs deployment workflow passes.
5. Confirm these public URLs:

```sh
curl -I "https://titimangsa.sangkan.dev/v1/health"
curl -I "https://docs.titimangsa.sangkan.dev/"
```

6. Create and push the tag:

```sh
git tag -a v0.1.0 -m "v0.1.0"
git push origin v0.1.0
```

7. Create the GitHub release:

```sh
gh release create v0.1.0 \
  --title "Titimangsa v0.1.0" \
  --notes-file CHANGELOG.md
```

8. Announce the release using `ANNOUNCEMENT.md`.
