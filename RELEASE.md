# Publication gate

Unchecked items below are remaining browser QA. Do not describe the release as fully verified until they are resolved.

- [x] Read official README, rules and configuration.
- [x] Read issues #6/#7/#8/#10 including corrections in comments.
- [x] Inspect the comparison project and document defects before implementation.
- [x] Read all five live public exports and JSON room forms.
- [x] Verify cross-origin response headers for the intended Pages origin.
- [x] Confirm three real PnL DIDs, an absent DID, equal-score rendering model and boundary uncertainty in automated tests.
- [x] Verify real envelope signatures and tamper rejection using public keys only.
- [x] Test exact decimals, stale/error paths and sweep/hash mismatch joins.
- [ ] Load the UI in an unrestricted desktop browser; compare first three scores, timestamps, sweep and hashes against current raw rooms.
- [ ] Test search, copy, all navigation views, empty/error states and manual/automatic refresh in the browser.
- [ ] Inspect 390px mobile layout and 200% text enlargement.
- [ ] Confirm no browser console errors and that network traffic contains only five GET reads per minute.
- [x] Create the public repository under the authenticated account and push the committed source.
- [x] Enable Pages, update actual live/source links and verify the published URL.
- [x] Verify five cross-origin reads in the published page's browser session; all five public rooms populated.

GitHub Pages: `https://dext94.github.io/close-call-board/` — deployed from `main` / `(root)` with HTTPS enforced.
