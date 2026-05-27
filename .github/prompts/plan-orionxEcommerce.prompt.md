## Plan: Incremental Prisma Crash Fix

Resolve startup failure by removing Mongoose dependencies from routes loaded at boot, migrating the currently active crash-causing controllers to Prisma-backed data access, and deferring non-startup domains (orders, legacy quotation flows) to a later phase. This delivers immediate stability while reducing ORM drift.

**Steps**

1. Baseline and dependency audit
1. Confirm current startup import chain from server to routes/controllers and identify every boot-time Mongoose dependency (chatbot, contact, subscription).
1. Capture exact API behaviors for those endpoints (fields, filtering, pagination/search) to preserve response contracts.

1. Phase 1: Prisma data-model readiness (_blocks Phase 2_)
1. Extend Prisma schema with entities needed by boot-time endpoints that are not yet modeled (at minimum ContactMessage and Subscriber; Product already exists but validate required fields used by controllers).
1. Generate/apply migration and Prisma client update.
1. Verify relation/index requirements for existing queries (email uniqueness for subscribers, createdAt ordering for admin/contact listings).

1. Phase 2: Controller migration for startup-critical paths (_depends on Phase 1_)
1. Refactor chatbot product retrieval to Prisma product queries while preserving query semantics (search/category/limit behavior).
1. Refactor contact message create/list logic to Prisma.
1. Refactor subscription create/list/unsubscribe logic to Prisma and align duplicate-email behavior with prior API responses.
1. Remove imports from Mongoose model files in these migrated controllers.

1. Phase 3: Route/runtime stabilization (_parallel with late Phase 2 verification_)
1. Ensure server bootstrap no longer needs Mongoose for boot-time route graph.
1. Remove or isolate unused Mongoose connection bootstrap so it is not required for startup success.
1. Keep untouched legacy domains explicitly out of boot path if they still rely on Mongoose.

1. Phase 4: Incremental cleanup (_after crash is fixed_)
1. Remove now-unused Mongoose model files for migrated domains (Product, ContactMessage, Subscriber) if no remaining imports.
1. Remove mongoose package dependency only when global usage search confirms no runtime imports remain for active features.
1. Document remaining legacy Mongoose areas (orders/quotation/user/document/emailOtp) for next migration slice.

1. Verification (_parallelizable where noted_)
1. Static checks: search for remaining mongoose imports in startup path files.
1. Boot check: run backend dev server and confirm no ERR_MODULE_NOT_FOUND and healthy startup.
1. API smoke tests (parallel): chatbot products endpoint, contact submit/list endpoint, subscription subscribe/list/unsubscribe endpoint.
1. Regression check: auth and product admin paths still function with Prisma client.
1. Optional DB validation: inspect created rows for contact/subscriber and uniqueness constraints.

**Relevant files**

- /Users/matheeshaweerawansha/Documents/orionx-ecommerce/backend/prisma/schema.prisma — add/adjust Prisma models for boot-time migrated endpoints.
- /Users/matheeshaweerawansha/Documents/orionx-ecommerce/backend/src/lib/prisma.js — reuse Prisma singleton pattern; ensure migrated controllers import this consistently.
- /Users/matheeshaweerawansha/Documents/orionx-ecommerce/backend/src/controllers/chatbotController.js — replace Product Mongoose access with Prisma queries.
- /Users/matheeshaweerawansha/Documents/orionx-ecommerce/backend/src/controllers/contactController.js — replace ContactMessage Mongoose operations with Prisma.
- /Users/matheeshaweerawansha/Documents/orionx-ecommerce/backend/src/controllers/subscriptionController.js — replace Subscriber/Product Mongoose operations with Prisma.
- /Users/matheeshaweerawansha/Documents/orionx-ecommerce/backend/src/server.js — verify startup route graph does not require Mongoose initialization.
- /Users/matheeshaweerawansha/Documents/orionx-ecommerce/backend/src/models/Product.js — remove when unused.
- /Users/matheeshaweerawansha/Documents/orionx-ecommerce/backend/src/models/ContactMessage.js — remove when unused.
- /Users/matheeshaweerawansha/Documents/orionx-ecommerce/backend/src/models/Subscriber.js — remove when unused.
- /Users/matheeshaweerawansha/Documents/orionx-ecommerce/backend/src/config/db.js — isolate or remove if no longer part of startup path.

**Verification**

1. Install deps and regenerate Prisma artifacts after schema changes.
1. Start backend with dev command and confirm server boots without module resolution errors.
1. Exercise startup-critical endpoints via Postman/curl and compare response shapes to current frontend expectations.
1. Run project test/lint commands available in backend package and resolve any migration-related failures.
1. Run a final workspace search for mongoose imports and classify any leftovers as intentionally deferred scope.

**Decisions**

- Included scope: startup crash resolution via Prisma migration of chatbot/contact/subscription flows plus limited cleanup directly tied to those flows.
- Excluded scope: full migration of orders, quotation advanced document handling, and other legacy Mongoose models not required for current startup crash.
- Approach: incremental Prisma-first migration rather than reinstalling mongoose, to reduce long-term architecture split.

**Further Considerations**

1. Product query parity: preserve existing text-search semantics exactly or accept a slightly stricter Prisma contains-mode match; recommendation is preserve behavior to avoid frontend regressions.
2. Migration strategy: one combined DB migration for ContactMessage+Subscriber vs separate small migrations; recommendation is one combined migration for simpler rollout.
3. Cleanup timing: immediate deletion of migrated model files vs one-release deprecation window; recommendation is immediate deletion after import search confirms zero references.
