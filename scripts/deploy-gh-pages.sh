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
# Always tear the worktree down, including on failure, so a botched run does
# not leave a half-populated checkout behind.
cleanup() {
  cd "$ROOT"
  git worktree remove "$WORKTREE" --force 2>/dev/null || true
}
trap cleanup EXIT

git worktree remove "$WORKTREE" --force 2>/dev/null || true

# Reaching the remote is not optional. Swallowing this is how a deploy once
# "succeeded" without ever leaving the machine: the fetch failed, the push
# failed after it, and the exit status was lost down a pipe.
if ! git ls-remote origin >/dev/null 2>&1; then
  echo "✗ cannot reach origin — nothing was deployed" >&2
  exit 1
fi
git fetch origin gh-pages --quiet
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

# Pushing the branch is not the same as the site serving it: Pages builds on
# its own schedule and can sit on a commit for a quarter of an hour. Wait for
# the build this deploy produced to actually answer, and say so plainly if it
# never does — a deploy nobody can see is a deploy that did not happen.
PAGE="dist/40-hadisov-an-navavi/hadis-1-dela-ocenivayutsya-po-namereniyam/index.html"
ASSET="$(grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' "$PAGE" | head -1)"
if [[ -n "$ASSET" ]]; then
  echo "→ waiting for Pages to serve ${ASSET}"
  for _ in $(seq 1 40); do
    if [[ "$(curl -s -o /dev/null -w '%{http_code}' "https://${CNAME}/${ASSET}")" == "200" ]]; then
      echo "✓ live at https://${CNAME}/"
      echo "  announce the changed URLs with: npm run indexnow:changed -- HEAD~1"
      exit 0
    fi
    sleep 30
  done
  echo "✗ pushed, but https://${CNAME}/${ASSET} is still not served after 20 minutes." >&2
  echo "  The branch is updated; GitHub Pages has not published it." >&2
  exit 1
fi
echo "✓ deployed to https://${CNAME}/"
echo "  announce the changed URLs with: npm run indexnow:changed -- HEAD~1"
