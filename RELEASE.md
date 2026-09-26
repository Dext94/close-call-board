# Publication gate

Do not announce or mark this release verified until every unchecked item is resolved.

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
- [ ] Create the public repository under the authenticated account and push the committed source.
- [ ] Enable Pages, update actual live/source links and verify the published URL.
- [ ] Verify five cross-origin reads in that published page's browser session. If CORS fails, stop and document the exact error before considering a proxy.

GitHub Pages manual settings: Settings → Pages → Deploy from a branch → main / (root) → Save.

No publication occurred in the initial environment: `gh` was unavailable, the connector cannot create repositories or administer Pages, and GitHub's browser session required sign-in.
