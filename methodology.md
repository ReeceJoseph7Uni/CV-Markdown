---
layout: default
title: Methodology | EveryRandSA
description: Methodology for data normalization, assumptions management, and comparison scoring.
---

# Methodology

## Data model (normalized)

EveryRandSA comparison architecture uses the following entities:

1. Institutions
2. Products
3. Product types
4. Rate tiers (balance ranges, nominal and effective rates, compounding rules)
5. Fee schedules (monthly, transaction, channel-specific fees)
6. Liquidity rules (notice periods, access windows)
7. Penalty rules (early withdrawal and other charges)
8. Eligibility criteria
9. Reward triggers (salary deposit, transaction count, app-only, loyalty status)
10. Tax attributes (TFSA and other relevant tax treatment flags)

## Assumptions framework

- Central assumptions include:
  - Policy and benchmark context (repo/prime/Zaronia where relevant)
  - CPI and inflation assumptions
  - Tax thresholds and exemptions
  - TFSA limits and penalties
- Assumptions are versioned by date.
- Calculations link to the assumption version used at run time.

## Scoring and ranking

Default ranking emphasizes **net effective yield** while preserving transparency:

- Headline yield
- Fee impact
- Friction and conditionality impact
- Liquidity and penalty impact

Users can switch between objective metrics and profile-aligned views.

## Reproducibility commitment

Historical comparisons remain reproducible by retaining product snapshots and assumptions by effective date.
