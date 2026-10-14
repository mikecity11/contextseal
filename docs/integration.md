# Integration specification
The MVP uses bilaterally agreed onchain text as evidence. URLs from local drafts are reference metadata. They are not fetched or relied upon to authenticate a video. A named brand accepts the immutable original baseline and editing rules before submitting an edit. No backend can submit a verdict.

## Contract state
AWAITING_BRAND -> AWAITING_EDIT -> READY_FOR_REVIEW -> WITHIN_RULES / OUTSIDE_RULES / INSUFFICIENT_EVIDENCE.

After a completed review the brand can submit a new edit. Every revision retains the reviewed edited text, verdict, reason and supporting quotes. A pending revision cannot be replaced. Maximum 20 revisions per case; new cases can be created for different agreed baselines.

## Consensus
Each validator runs the same evidence evaluation from immutable contract state and uses its LLM independently. It agrees only when the verdict matches and all leader quotes are bounded substrings of the original/edited text. Reason wording is not compared exactly. This is probabilistic judgment, not guaranteed truth or proof of ownership. Both parties can examine the inputs and public record.

## UI lifecycle
Connect wallet -> verify exact contract source -> register -> accept -> submit -> request review -> wait for finalized successful execution -> read canonical state. An RPC or execution error never substitutes a canned verdict. A still-pending hash is saved; resubmission is blocked until tracking is resumed or explicitly forgotten. Forgetting tracking does not cancel a transaction.

## Remaining gates
The user approved public source submission and StudioNet deployment on 14 October 2026. Contract `0x83E2Faf2d733E4B32d8eFC017398CD9e1832D505` is deployed with finalized successful execution. Use only test accounts/test tokens for validation. The frontend verifies its exact source before writes.

Before a real pilot, execute retained-warning, removed-warning, allowed-paraphrase, missing-context and adversarial-transcript cases with multiple validators and two identities. Validate wallet UI and actual receipt shape. Contract/source compatibility must be checked against the running network.

## Live validation — 14 October 2026
Separate disposable creator and brand test accounts completed registration, acceptance and edit submission. Review transaction `0xe1d9974ee7716899c36989ac0e7d5bb70dbddb895ce5915e3796755d33df2cac` finalized successfully. Case `live-warning-1791966620598` records OUTSIDE_RULES, with exact supporting quotes identifying removed risk warnings and added guaranteed returns. Other scenario gates above and user-wallet signing remain unverified.
