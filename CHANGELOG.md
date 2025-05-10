# 📦 Changelog

All notable changes to this project will be documented in this file.

---

## [1.0.0] - 2025-05-11 (04:29 AM)

🎉 First public release of `node-api-maker` on npm!

### ✨ Added

- `index.js` CLI tool with:
  - Model generator using Mongoose
  - Controller generator with full CRUD
  - Joi-based validator generator
  - Express-compatible route generator
  - Swagger-compatible route documentation
- Automatic injection into `app.js`
- Auto-creates `utils/swagger.js` if missing
- Supports `--fields` for dynamic field typing
- Supports `npx` without global installation

### ✅ Requirements

- Node.js v14 or higher
- Express project setup
- Joi (auto-installed via dependencies)

---

## Next Up (Planned 🚀)

- `--append--fields` to merge fields
- `--preset=name` support for shared schemas
- Relationship (ref) support in Mongoose
- Unit tests and optional `--test` file generation
