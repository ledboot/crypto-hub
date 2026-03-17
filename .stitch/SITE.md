# Project Vision & Constitution

> **AGENT INSTRUCTION:** Read this file before every iteration. It serves as the project's long-term memory.

## 1. Core Identity
- **Project Name:** Crypto Hub
- **Stitch Project ID:** 1177597800619792348
- **Mission:** Build a practical, high-clarity Web3 operations hub for multi-chain data lookup and trader workflows.
- **Target Audience:** On-chain traders, analysts, and Web3 power users.
- **Voice:** Precise, fast, no-fluff, utility-first.

## 2. Visual Language
- **The "Vibe" (Adjectives):**
- *Primary:* Operational
- *Secondary:* Data-dense
- *Tertiary:* Modern

## 3. Architecture & File Structure
- **Root:** `src/app/` (Next.js App Router)
- **Asset Flow:** Stitch outputs are reviewed, then mapped into app routes/components.
- **Navigation Strategy:** Top-level by domain: `polymarket`, `binance-alpha`, `tools`.

## 4. Live Sitemap (Current State)
- [x] `/` - Home/Landing Page
- [x] `/polymarket` - Polymarket overview
- [x] `/polymarket/markets` - Market list and discovery
- [x] `/polymarket/traders` - Trader-centric view
- [x] `/binance-alpha/trading-statistics` - Trading stats dashboard
- [x] `/binance-alpha/wallet-query` - Wallet query tool
- [x] `/tools/batch-query` - Batch query utilities
- [x] `/tools/cross-chain-bridge` - Bridge lookup utilities
- [x] `/tools/hd-wallet` - HD wallet utilities

## 5. The Roadmap (Backlog)
### High Priority
- [ ] Unify global navigation and route-level breadcrumbs across all modules.
- [ ] Standardize table/card/filter interactions for data-heavy pages.
- [ ] Add empty/loading/error states for every core page.

### Medium Priority
- [ ] Add a shared page shell layout with reusable section headers/actions.
- [ ] Improve mobile breakpoints for dense tables and statistics views.
- [ ] Introduce a consistent design token layer (spacing, radius, shadows, colors).

## 6. Creative Freedom Guidelines
1. **Stay on domain:** New pages must support trading research, wallet analysis, or multi-chain operations.
2. **Prioritize utility:** Prefer clear information architecture over decorative complexity.
3. **Naming convention:** Use route names that are short, lowercase, and purpose-driven.

### Ideas to Explore
- [ ] `/portfolio` - Unified wallet and PnL summary
- [ ] `/alerts` - Price/on-chain alert management
- [ ] `/gas-tracker` - Multi-chain gas and fee monitor

## 7. Rules of Engagement
1. Do not recreate pages already listed in Section 4.
2. Keep Section 4 and Section 5 updated after each accepted change.
3. Every new page must map back to the mission in Section 1.
