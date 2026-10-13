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
Deploying to Studio sends the source to the public GenLayer service and records contracts publicly. Automatic approval review rejected source submission without specific user approval. Do not attempt schema submission or deployment until it is granted. Use only test accounts/test tokens for validation.

Before a real pilot, execute retained-warning, removed-warning, allowed-paraphrase, missing-context and adversarial-transcript cases with multiple validators and two identities. Validate wallet UI and actual receipt shape. Contract/source compatibility must be checked against the running network.
