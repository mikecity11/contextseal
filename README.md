# ContextSeal
Creator-approved editing agreements and GenLayer review of proposed sponsor edits.

## What it does
A creator registers immutable editing rules, original text and a named brand wallet. The brand accepts the original baseline and rules, then submits a proposed edit. GenLayer validators independently reason over the exact stored texts. They must agree on WITHIN_RULES, OUTSIDE_RULES or INSUFFICIENT_EVIDENCE; an approved review updates the contract's case state and records the edited revision and supporting quotes.

This reviews text approved by both parties. It does not independently authenticate a video, enforce a takedown, settle legal liability, or transfer funds.

## Run
Node.js 22+:
```
npm ci
npm test
npm run build
```
Serve `dist/` over HTTPS. Vercel builds it with the included `vercel.json`.

## GenLayer connection
- `genlayer-js` 1.1.8, StudioNet chain 61999.
- Injected EVM wallet only; no backend signer or stored private key.
- Contract address must be loaded and its source compared with the bundled source before writes.
- Creator registers an agreement, brand accepts and submits an edit, anyone can request review.
- Wallet signs every write. No leader-only shortcut.
- Transactions are tracked through FINALIZED and explicit FINISHED_WITH_RETURN. The finalized case is then read from the contract.
- Pending hashes survive refresh and can be resumed without resubmitting.

## Deployment status
Contract deployment is pending explicit source-disclosure approval for https://studio.genlayer.com/api. There is no configured live contract address and no claim of completed network validation. Wallet integration is implemented, but live writes require a deployed, verified contract.

`contracts/contextseal.py` is the contract source. Deploy its zero-argument constructor in GenLayer Studio or via SDK after approval, then load its address in the app. Validate SDK lint and direct tests before treating it as release-ready.

## Checks
- Browser-local workspace functional harness passes.
- Network lifecycle, failed execution, finality, roles and malformed-response tests pass.
- `npm run build` passes.
- Python syntax parses.
- All 10 official GenVM direct tests pass using pinned SDK release v0.2.16. They cover wallet roles, immutable baselines, consensus agreement/disagreement, quotes, revisions and abstention.
- Live consensus, wallet UI and contract deployment have not yet been verified.

See `docs/research.md` and `docs/integration.md` for scope and remaining gates.
