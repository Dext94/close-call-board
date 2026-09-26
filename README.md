# Close Call Live Board

An open-source, read-only community interface for FLOP Labs' Close Call challenge.

Built for the FLOP community by [@fuegonchain 🔥](https://x.com/fuegonchain), in response to the request attributed to Arthur Hayes in [this post](https://x.com/CryptoHayes/status/2103974307806564467). No endorsement by FLOP Labs or Arthur Hayes is implied. The post itself was not independently verified in this audit.

**Live URL:** Pages deployment pending. **Repository URL:** https://github.com/Dext94/close-call-board

## Features

- Explicitly labelled **Referee Published PnL — Top 25**, not a complete owner ranking.
- Exact decimal comparison of published scores, provisional equal-score place spans and open-ended cutoff groups. No fabricated prize allocation.
- Search exact or partial, case-sensitive DIDs in records actually observed during the session, with source and sweep provenance. No inference from absence.
- Largest published positions and long/short **owner counts**, separate from open interest. PnL/position joins require matching sweep and file hash.
- Public flow counts, omitted counts, visible void reasons, missed ranges and raw records.
- Per-room timestamps, hashes, signature-check status and LIVE / STALE / PARTIAL / ERROR states.
- Refresh every 60 seconds in a visible tab, manual throttle, HTTP timeout, malformed-data detection and explicit retained/stale data.
- Responsive dark interface, keyboard controls and no runtime dependencies/CDNs.

## Methodology and data sources

The browser makes only GET requests to these five public endpoints:

- https://technocore.chat/r/d-close1-pnl?format=json&limit=5
- https://technocore.chat/r/d-close1-positions?format=json&limit=5
- https://technocore.chat/r/d-close1-price?format=json&limit=5
- https://technocore.chat/r/d-close1-flow?format=json&limit=5
- https://technocore.chat/r/d-close1-state?format=json&limit=5

The small structured JSON window was selected after testing normal text, JSON and NDJSON export forms. Exports are useful for auditing, but downloading the entire history each minute would waste bandwidth. Up to 200 observed sweeps per room are retained in memory; this is not a historical archive. No wallet, account or search data is sent to a server.

The interface separates **published**, **derived** and **unknown**. “Published” does not mean the full ledger has been verified. The known referee DID is pinned and each envelope is checked with WebCrypto Ed25519 where supported. The launch record has not been independently authenticated, and a matching signature alone does not establish that record. Unsupported signature verification is displayed explicitly.

[Canonical rules](https://github.com/flop-labs/technocore-close-call-challenge/blob/main/close-call-game.md) state a 1,000,000 FLOP total pool across three prize places, with ties sharing the places they span. They do not specify a 500k / 300k / 200k weighting. This dashboard does not calculate payouts.

**Equal published scores are not proof of exact underlying ties:** observed PnL scores have two decimal places. Visible spans describe groups in the published ordering, not definitive final prize ranks. A last group has an unknown full population, even if only one row of that group is visible.

The canonical live score uses the referee's global traded price (`mark`), not the NVDA reference price. Reference and permitted next-sweep limits are displayed as published. Final settlement uses the canonical closing price.

[Issue #6](https://github.com/flop-labs/technocore-close-call-challenge/issues/6), [#7](https://github.com/flop-labs/technocore-close-call-challenge/issues/7), [#8](https://github.com/flop-labs/technocore-close-call-challenge/issues/8) and [#10](https://github.com/flop-labs/technocore-close-call-challenge/issues/10) document reporting limits and corrections. Read the comments as well as the initial issue bodies. Missing array entries cannot establish that a mint/trade did not happen.

## Limitations

This dashboard does not reconstruct hidden referee state and does not estimate missing balances.

- No complete ranking, per-DID balance lookup or full cutoff tie population was exposed in the audited feeds.
- Hashes are displayed, not treated as proof of inaccessible file contents or a recomputed state root.
- The repository labels the package draft until its signed launch. A seed exists in the price export; the external launch record and pinned manifest were not independently verified here.
- Twelve minutes is an interface freshness threshold, not an official service guarantee. Feed age and market trade age are different.
- A source omission field that is absent is labelled “Not published”, not silently set to zero.
- Search covers this session's observed public payloads. Historical presence does not prove current position or balance.
- No locally fabricated rankings, sample live data or fallback snapshots are served to users. Test fixtures are clearly isolated in the clearly named fixture/test files.
- Browser/mobile layout, browser refresh, console and actual GitHub Pages cross-origin checks remain outstanding because this environment's cloud browser blocks Technocore and localhost. HTTP tests with the intended GitHub Pages Origin succeeded and returned `Access-Control-Allow-Origin: *`; that is not an end-to-end Pages browser test.

See [the audit](AUDIT.md) and [release checklist](RELEASE.md).

## Local development

No build or installation is required. With Python 3 and Node.js 20+:

```sh
python3 -m http.server 8000
# Open http://localhost:8000
node --test *.test.mjs
```

To reopen the project after cloning:

```sh
cd close-call-board && code .
```

## Publication

Do not publish before completing `RELEASE.md`, especially the live data and browser checks. The source repository has been created. Pages publication and browser validation are being completed. No private credentials belong in this repository.

After the checklist passes, create and push a public repository using the authenticated account:

```sh
git status
gh auth status
gh repo create close-call-board --public --source=. --remote=origin --push
```

Then, on GitHub: **Settings → Pages → Deploy from a branch → main / (root) → Save**. GitHub will show the actual published URL; verify it before announcing the site. Update the two URL fields above and the Methodology source link after the repository exists. `.nojekyll` enables direct static asset serving.

If browser access fails due to CORS, stop. Do not add an undocumented proxy. A possible Plan B is a GET-only serverless endpoint with a hardcoded five-room allowlist, a 60-second cache, timeouts, response-size limits, preserved timestamps/hashes, and a documented upstream provenance field. It must never accept arbitrary upstream URLs or trading/signing operations. No proxy is included or deployed.

## Security

Strictly read-only: no seed phrases, private keys, wallet connections, trades, message signing, analytics or backend. The public DID is sufficient for search. All variable UI text uses `textContent`; no user-controlled HTML is inserted. Content Security Policy restricts scripts/styles to this origin and network requests to Technocore. Signature **verification** uses public keys only.

## License

Original dashboard code: MIT, copyright 2026 @fuegonchain. The upstream rules are linked, not copied. Public referee records in test fixtures retain their upstream provenance and are included solely as audit/test evidence; no ownership of those records is claimed.

## Privacy

Only public referee DIDs are displayed. No private DID list, private keys, personal email, local user paths, browser credentials or conversation attachments are included. Search input remains in browser memory and is never included in a network request. GitHub and Technocore necessarily receive normal HTTP connection metadata such as IP address when visited; this project adds no analytics. The public repository intentionally associates GitHub account Dext94 with the requested public attribution @fuegonchain.
