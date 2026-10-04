# Kurofuku / nocturne-pos: Agent Operations & Architecture Handbook

This document serves as the operational handbook and architectural contract for all autonomous AI coding agents working on this codebase.

## 1. Project Overview & Mission

**Purpose:** "Kurofuku" (or nocturne-pos) is a headless Point-of-Sale (POS) and floor orchestration system built specifically for the Japanese cabaret (mizu-shobai / kyabakura) domain.

**Core Philosophy:**
- **Low latency & Touch Resilience:** Optimized for floor staff ("black clothes") using iPads in dim, fast-paced environments.
- **Dark-Mode First:** Strict high-contrast dark mode to avoid blinding staff.
- **Defensible Ledgers:** Legally defensible cast ledger attribution and audit trails.

## 2. Architecture & Design Rules (Feature-First)

This project strictly follows a **Feature-First Clean Architecture**.

- **Directory Structure:** All domains must reside in `src/features/<feature-name>`.
- **Strict Encapsulation:** Features can *only* interact via the root `index.ts` barrel file of another feature.
  - ❌ **Forbidden:** Deep relative imports across feature internals (e.g., `import { TableCard } from '../../tables/components/TableCard'`).
  - ✅ **Allowed:** Importing from the public API (e.g., `import { TableCard } from '@/features/tables'`).
- **Shared Kernel:** Cross-cutting concerns and primitives live in `src/shared/{ui, lib, api, types}`.
- **Decoupled API:** UI components must *never* execute direct database or Supabase client calls. All queries, mutations, and real-time subscriptions must live in the feature's `/api/` directory.

## 3. Mizu-Shobai Domain Invariants & Business Logic

Agents must adhere to the specific business rules of the Kyabakura domain:

- **Time Management:** Table sessions are strictly time-based, usually in sets of 60 minutes. Extensions (延長 - Encho) are critical business events that require distinct 10-minute warning states (e.g., Amber UI warnings).
- **Cast Roles:** Cast members are assigned to tables honoring three core roles:
  1. `hon_shime` (Main Nomination / 本指名)
  2. `jonai_shime` (In-house Nomination / 場内指名)
  3. `help` (Rotational Assistance / ヘルプ)
- **Attribution & Splits (折半 - Seppan):** Line items (drinks, bottles) can have percentage or flat commissions ("backs"). These backs can be attributable to one cast member, or split equally among multiple seated cast members.
- **Legal Compliance Guardrail:** Infractions (e.g., tardiness, absence) must *strictly* be modeled as performance adjustment points or withheld attendance bonuses. **NEVER** model them as predetermined wage deductions (to maintain strict compliance with Japanese Labor Standards Act Article 16).

## 4. UI/UX & Hardware Constraints

- **Dark-Mode Default:** The UI must default to a strict high-contrast dark mode (e.g., `#0f172a` or `#121212`) suited for dim nightlife environments.
- **Touch Optimization:** The primary hardware target is a handheld iPad.
  - **Touch Target Minimum:** All interactive elements must be at least 44x44px.
  - Interactions should account for one-handed use while standing.

## 5. Code Quality & Agent Workflow Rules

- **TypeScript:** Strict typing is enforced. **Never** use `any`. Always use explicit schemas, interfaces, and domain entity types.
- **State Management:** Local feature state should reside in feature-specific Zustand slices (`src/features/<name>/store/`). The global store composition cleanly combines them if necessary.
- **Pre-PR Checklist:** Any agent modifying this repository **must** successfully run the following commands before declaring a task complete or submitting a PR:
  - `npm run build` (This includes `tsc -b` to enforce type checks).
  - `npm run lint` (To enforce coding standards).
