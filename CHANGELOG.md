# 📦 Changelog

All notable changes to this project will be documented in this file.

---

## [1.1.0] - 2025-05-13

🎉 **Release v1.1.0** of `node-api-maker` with improvements and new features!

### ✨ Added

- **Automatic `package.json` generation**: Now automatically creates `package.json` if it doesn't exist, including the required dependencies and scripts (`express`, `mongoose`, `joi`, `cors`, `dotenv`, `swagger-jsdoc`, `swagger-ui-express`, and `nodemon`).
  
- **Database Connection**: Added `db/db.js` to handle MongoDB connection logic using `mongoose` and `dotenv`.

- **`server.js`**: Entry point that connects to MongoDB and starts the server.

- **Middleware Support**:
  - **Auth Middleware**: Created `middlewares/auth.middleware.js` for token verification and admin checks.
  - **Validation Middleware**: Created `middlewares/validate.middleware.js` for validating incoming requests based on `Joi` schemas.

- **`app.js` Generation**: Now properly generates `app.js` for routing and Swagger documentation. Includes automatic injection of routes.

- **Swagger Documentation**: Automatically generated and added `utils/swagger.js` with OpenAPI specs for routes.

- **Field Parsing**: 
  - Supports `--append--fields` to merge fields with previously generated models.
  - Supports the `--preset=name` flag for reusable field definitions across multiple CLI commands.
  
- **Environment File**: Automatically generates a `.env` example file with `PORT` and `MONGO_URI`.

### ✅ Requirements

- Node.js v14 or higher
- Express project setup
- Joi (auto-installed via dependencies)
- `dotenv` for environment variable management

---

## [1.0.0] - 2025-05-11

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

- Relationship (ref) support in Mongoose
- Unit tests and optional `--test` file generation
