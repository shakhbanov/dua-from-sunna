#!/usr/bin/env bash
# Manual deploy to GitHub Pages — the fallback for when the Actions workflow
# (.github/workflows/deploy.yml) cannot run.
#
# Builds dist/ and publishes it to the gh-pages branch as a single commit,
# mirroring what peaceiris/actions-gh-pages does in CI (force_orphan: true).
#
#   ./scripts/deploy-gh-pages.sh              # build + deploy
#   ./scripts/deploy-gh-pages.sh --no-build   # deploy the existing dist/
#
# Requires push access to origin. Check with:
#   git ls-remote origin >/dev/null && echo ok

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKTREE="${ROOT}/.gh-pages-deploy"
CNAME="dua.shakhbanov.org"

cd "$ROOT"

if [[ "${1:-}" != "--no-build" ]]; then
  echo "→ building"
  npm run build
fi

if [[ ! -f "dist/index.html" ]]; then
  echo "✗ dist/index.html missing — build first" >&2
  exit 1
fi

# Same sanity checks the CI workflow runs: the prerendered HTML must actually
# contain the Arabic text and the hreflang alternates.
echo "→ sanity check"
test -f "dist/slova-pominaniya-pri-probuzhdenii-oto-sna/index.html"
test -f "dist/en/supplications-upon-waking-up/index.html"
test -f "dist/dua-iz-korana/index.html"
test -f "dist/en/quran-duas/index.html"
grep -q "اَلْحَمْدُ\|الْحَمْدُ" "dist/slova-pominaniya-pri-probuzhdenii-oto-sna/index.html"
grep -q 'hreflang="en"' "dist/slova-pominaniya-pri-probuzhdenii-oto-sna/index.html"
echo "  ✓ prerender looks good"

echo "→ preparing worktree"
git worktree remove "$WORKTREE" --force 2>/dev/null || true
git fetch origin gh-pages --quiet || true
git worktree add -B gh-pages "$WORKTREE" origin/gh-pages --quiet

# Wipe everything except .git, then lay down the fresh build. Note that
# dist/ already ships its own 404.html (the SPA redirect shim from public/)
# and CNAME — do NOT overwrite 404.html with index.html.
find "$WORKTREE" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R dist/. "$WORKTREE"/
echo "$CNAME" > "$WORKTREE/CNAME"
touch "$WORKTREE/.nojekyll"   # keep Pages from running Jekyll over the build

cd "$WORKTREE"
git add -A
if git diff --cached --quiet; then
  echo "→ nothing changed; skipping commit"
else
  git commit -q -m "deploy: $(cd "$ROOT" && git log -1 --pretty=%s)"
  echo "→ pushing gh-pages"
  git push --force origin gh-pages
fi

cd "$ROOT"
git worktree remove "$WORKTREE" --force
echo "✓ deployed to https://${CNAME}/"
echo "  announce the changed URLs with: npm run indexnow:changed -- HEAD~1"
