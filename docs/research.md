# ContextSeal — research and first-build notes

Research date: 13 October 2026. Working name; not trademark-cleared.

## Decision
Build a focused creator/sponsor edit-review workflow. Compare whether a sponsor's cut or reuse changes a creator's message under bilateral, immutable editing rules. First MVP scope is public text/transcript evidence, not automatic video identification.

## Closest projects checked
- RoyaltyCircuit: https://github.com/tanawo3/royaltycircuit — registered rights splits and usage statement reconciliation before payout authorization. Adjacent creator-rights space; does not establish uniqueness for ContextSeal.
- ClauseFlow: https://github.com/tanphung/ClauseFlow — work delivery against explicit obligations. Our decision concerns a proposed reuse/edit after delivery.
- Verdict: https://github.com/bars26/genlayer-verdict — agent dispute reputation. Our initial scope has no generalized reputation score.
- BugBond: https://github.com/Ifem1/BugBond — reproducibility and severity adjudication. Removed earlier BugVerdict suggestion.
- Semantic Drift Oracle: https://github.com/MeowStlanik/semantic-drift-oracle — document meaning changes. Adjacent semantic comparison; our case applies jointly accepted editing rules to an original and edited advertisement.
- LocalizeOS: https://github.com/Ifem1/localizeOS — translation review. Not pursuing localization.

Directories reviewed: GenLayer's ecosystem partners page, Bradbury hackathon winner summary and the first Python GenLayer GitHub topic page. These are not exhaustive. Targeted searches used creator rights, content licensing, sponsor usage, out-of-context edits, misrepresentation and endorsements. No direct narrow match surfaced. Unindexed/private projects remain outside this review. Do not claim first-of-its-kind.

## First build, actual capabilities
- Responsive agreement workspace with explicit channel, duration and editing rules.
- Browser-local unsigned drafts; both parties have not signed them.
- Original/edited transcript evidence packets; transcripts are user assertions, not independently proven.
- SHA-256 digest of JSON packet payload and JSON exports.
- Draft single-case GenLayer Python contract, syntax checked only.
- No deployed contract, wallet integration, network verdict, payments or automated takedown.

## Contract draft
Creator deploys a case identifying the brand, editing rules and SHA-256-pinned original public UTF-8 source. Brand accepts the exact rules and submits a pinned edited source. The contract fetches evidence inside a non-deterministic input function and asks validators to evaluate the leader's proposed result. Allowed outcomes: WITHIN_RULES, OUTSIDE_RULES, INSUFFICIENT_EVIDENCE. Sources that are unavailable or changed must yield insufficient evidence.

The UI packet digest is NOT the source-body digest expected by the contract. Source hosting/export and bilateral wallet integration are pending. The UI is not wired to the draft contract. Hashes protect against later alteration; they do not authenticate a transcript against a real video. For initial pilots, both parties must explicitly approve the original transcript as the evidence baseline.

## Next integration gates
1. GenVM SDK lint and direct tests for permissions, immutability, unavailable evidence, injection resistance and output validation.
2. Define the transcript attestation and public source publishing protocol. A submitted transcript alone must never prove a video violation.
3. Deploy and exercise a Studio/testnet case with two wallet identities.
4. Connect wallet writes and reads using genlayer-js. Verify finality AND execution success, then refresh canonical state.
5. Run real consensus cases: retained warning, removed warning, permitted paraphrase, ambiguous context, unavailable evidence, changed hash.
6. Keep INSUFFICIENT_EVIDENCE cases retryable through a new evidence revision/case; draft currently records one outcome per case.
7. Only after this, consider a contract-controlled approval/reuse gate and funds. No fees or escrow in the first build.

Technical sources:
https://docs.genlayer.com/developers/intelligent-contracts/when-to-use-genlayer
https://docs.genlayer.com/developers/intelligent-contracts/features/web-access
https://docs.genlayer.com/developers/intelligent-contracts/examples/llm-hello-world

## Integration update
Wallet support, source verification, onchain case registration/actions, finalized-success checks and pending transaction recovery are implemented in v0.2.0. The revised contract uses immutable, bilaterally agreed text instead of external transcript URLs. No contract has been deployed; earlier source-pinning architecture remains historical research only. Current architecture is in integration.md.
