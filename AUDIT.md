# Source audit — 26 September 2026 UTC

Status: source and live-schema audit completed; publication/browser validation incomplete.

## Canonical sources inspected

- Official `README.md`, Git blob `4f7813ed8bc1c9a55aa9f68b4ba37c6154055894`.
- Official `close-call-game.md`, blob `4e3ed2e7a4efaf47b8e8fbfa43b2955fd2964145`.
- Official `contest.json`, blob `4a520638168e41764630dd19112decf9fe4bfa0c`.
- Issues #6, #7, #8 and #10, including all returned current comments.
- Technocore README endpoint documentation.
- Existing community `JudeOlowu/flop-technocore-leaderboard/index.html`, blob `89ec85115f36f3aa7be2c99f0ac9175ed7b18856`. Inspected for comparison only; no source copied into this application.

Rules/configuration confirm lock 2026-10-04 09:00 UTC, settlement reference time 10:00 UTC, 1,000,000 FLOP pool, three places, and tied owners sharing spanned places. There is no 500k/300k/200k allocation in those sources. The fold groups exact Decimal scores before output rounding. This makes rounded equal-score groups provisional for prize purposes.

The price export begins with a seed specifying season close-1, five rooms, and package hash `bae09812e25eb6f1369c611f24964f7ea0acafddfc45301a16f33f941296dafa`. The separately published launch record and matching manifest bytes were not verified. Do not call this a full cryptographic state audit.

## Comparison findings

The inspected existing leaderboard:

1. Assigns `rank = idx + 1` and 500k/300k/200k awards to indices 0/1/2 (lines 605–622). This mishandles ties and invents an unsupported allocation.
2. Defaults an absent position record to `Active (< 44.87 Size)` (line 625). Missing from Top 10 does not establish an open position, and 44.87 is a hardcoded cutoff.
3. Calls an absent search result `Rank > #25` and `Active Contender` (lines 790–795). A DID may not be an owner at all; the claim is unsupported.
4. Gives an absent DID a score bound and position bound and says it needs to exceed the cutoff. This does not account for unknown ownership, ties or omitted records.
5. Interpolates raw search query text into `innerHTML` and an inline `onclick` handler (lines 796–803). This creates a DOM injection risk.
6. Partial searches overwrite matches and leave only the last matching entry. The new board returns all observed matches, with a visible display cap.

## Live snapshot (not a current-data promise)

All five full exports returned HTTP 200 with structured NDJSON. At the observed sweep 418, source timestamps were approximately 2026-09-26 22:50:27 UTC:

| Item | Published value |
|---|---|
| PnL rows | 25 |
| First DID | did:key:z6MkgTDg3hEz4pwiFcJCDjRvR3hZbVWwy23oGuqFbFxu7Hne |
| First score | 98.71 POLF |
| Remaining visible score group | 24 rows at 90.86 POLF, reaches cutoff; full population unknown |
| PnL mark | 224.28 POLF |
| Reference | 224.44 POLF, trade timestamp 22:49:23.771 UTC |
| Limits for sweep 419 | 213.22–235.66 |
| Owners | 2,515,813 |
| Registered rooms | 15 |
| Long owners / short owners | 267,966 / 275,567 |
| Open interest, published `open` | 11,503,908.55 |
| Position Top list | 10 entries, each -44.87 |
| Visible mints / settlements / voids | 0 / 0 / 138 |
| Omitted mints / settlements / voids | 3,055 / 923 / 51 |
| Missed ranges in this sweep | [] |

All five published the same file hash:
`d38a12b4e1bb8e438b4357c0cc471a59827388eac5789dae8604249e7f178054`.

State root: `2c1979ad448f9d0559654a63be5f9038f2b36c951c4c05daeba34634138a6bf9`.

The referee author observed across exports was `did:key:z6MkowHQwsx9xr84WbWN3YCnKutyBnBXkT1ChKY4uEAAMzte`. Public-key signature verification of real envelopes succeeds. No secret keys were requested or accessed.

## Endpoint selection and CORS

- `/r/d-close1-pnl/json`: HTTP 404 (not a supported route).
- Normal `/r/d-close1-pnl`: HTTP 200 text, 50 latest messages.
- `/r/d-close1-pnl/export`: HTTP 200 full retained NDJSON.
- Documented `/r/d-close1-pnl?format=json&limit=5`: HTTP 200 structured object with room, count, sequence bounds, generation and messages. Chosen for small reads.
- The chosen JSON form was then fetched successfully for **all five rooms** with Origin `https://dext94.github.io`. Each returned HTTP 200 and `Access-Control-Allow-Origin: *`.

The cloud browser returns `net::ERR_BLOCKED_BY_CLIENT` when opening Technocore and localhost. This is **not evidence of a Technocore CORS rejection**, and no proxy was introduced. A real browser test from the deployed Pages origin is still required.

## Issue interpretation

Issue #6's original missing-mint framing was corrected: the `omitted.mints` field explains totals. Issue #7 comments correct the claim that missed ranges are always empty. Issue #10 comments demonstrate that zero listed mints/settlements can coexist with thousands of omitted events. These are community investigations, not authority to infer a specific DID's unseen state. The dashboard reports the actual current fields, not categorical claims from issue titles.

## Tests

`node --test *.test.mjs` checks exact decimals, visible tie spans, unknown cutoff population, malformed data, wrong signer, duplicate DIDs, unsorted feeds, stale status, failed reads, sweep/hash mismatches, three real PnL DIDs, unknown DID, case-sensitive matching, genuine envelope verification and tamper rejection.

Browser layout, mobile appearance, clipboard, real browser refresh/console and final public URL checks remain release blockers. HTTP success and core tests do not substitute for those checks.
