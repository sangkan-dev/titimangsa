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

## npm Package

The npm package version must match its Git tag. Package-only fixes should use a
new patch release instead of moving an existing tag.

The first publish creates the package and requires an authenticated npm
maintainer:

```sh
npm login
corepack pnpm --filter @sangkan-dev/titimangsa build
corepack pnpm --filter @sangkan-dev/titimangsa lint:package
cd packages/core
npm publish --access public
```

After the first publish, configure npm Trusted Publishing for:

- package: `@sangkan-dev/titimangsa`
- repository: `sangkan-dev/titimangsa`
- workflow: `publish-npm.yml`
- environment: `npm`

Then create the matching tagged GitHub release. The workflow recognizes that the
first manually published version already exists and does not publish it again.

For future versions, create the tagged GitHub release after merging the version
change. The `Publish npm Package` workflow validates, packs, and publishes the
package through `npm publish` with automatic provenance. It can also be run
manually for an existing unpublished tag.
