#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory of the script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get model name from CLI
const name = process.argv[2];
if (!name) {
  console.error("❌ Please provide a model name.\nUsage: npx node-api-generator User");
  process.exit(1);
}

const modelName = name.charAt(0).toUpperCase() + name.slice(1);
const varName = name.toLowerCase();
const pluralName = varName + 's';

// // === Parse optional --fields argument ===
// const args = process.argv.slice(2);
// const fieldsArg = args.find(arg => arg.startsWith('--fields='));
// const fieldsRaw = fieldsArg?.split('=')[1]; // e.g. name:string,price:number

// // Parse fields into key/type object
// const parsedFields = {};
// if (fieldsRaw) {
//   fieldsRaw.split(',').forEach(pair => {
//     const [key, type] = pair.split(':');
//     parsedFields[key] = type;
//   });
// }
const args = process.argv.slice(2);
const fieldsArg = args.find(arg => arg.startsWith('--fields='));
const presetArg = args.find(arg => arg.startsWith('--preset='));
let parsedFields = {};

// === Load fields from preset ===
if (presetArg) {
  const presetName = presetArg.split('=')[1];
  const presetPath = path.join('presets', `${presetName}.json`);
  if (fs.existsSync(presetPath)) {
    const raw = fs.readFileSync(presetPath, 'utf-8');
    parsedFields = JSON.parse(raw);
    console.log(`📦 Loaded fields from preset: ${presetName}`);
  } else {
    console.error(`❌ Preset file not found: ${presetPath}`);
    process.exit(1);
  }
}
// === Or parse from --fields ===
else if (fieldsArg) {
  const fieldsRaw = fieldsArg.split('=')[1];
  fieldsRaw.split(',').forEach(pair => {
    const [key, type] = pair.split(':');
    parsedFields[key] = type;
  });
}

// === 1. Mongoose Model ===
let mongooseFields = '';
if (Object.keys(parsedFields).length > 0) {
  for (const [key, type] of Object.entries(parsedFields)) {
    const jsType = type === 'number' ? 'Number' :
                   type === 'boolean' ? 'Boolean' :
                   'String';
    mongooseFields += `  ${key}: { type: ${jsType}, required: true },\n`;
  }
} else {
  mongooseFields = `  name: { type: String, required: true },\n  status: { type: String, enum: ['active', 'inactive'], default: 'active' }`;
}

const modelContent = `import mongoose from 'mongoose';

const ${varName}Schema = new mongoose.Schema({
${mongooseFields}}, { timestamps: true });

export default mongoose.model('${modelName}', ${varName}Schema);
`;

fs.mkdirSync('models', { recursive: true });
fs.writeFileSync(`models/${varName}.model.js`, modelContent);

// === 2. Controller ===
const controllerContent = `import ${modelName} from '../models/${varName}.model.js';

export const getAll${modelName}s = async (req, res) => {
  const data = await ${modelName}.find();
  res.json(data);
};

export const get${modelName} = async (req, res) => {
  const data = await ${modelName}.findById(req.params.id);
  if (!data) return res.status(404).json({ message: '${modelName} not found' });
  res.json(data);
};

export const create${modelName} = async (req, res) => {
  const data = await ${modelName}.create(req.body);
  res.status(201).json(data);
};

export const update${modelName} = async (req, res) => {
  const data = await ${modelName}.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(data);
};

export const delete${modelName} = async (req, res) => {
  await ${modelName}.findByIdAndDelete(req.params.id);
  res.json({ message: '${modelName} deleted' });
};
`;
fs.mkdirSync('controllers', { recursive: true });
fs.writeFileSync(`controllers/${varName}.controller.js`, controllerContent);

// === 3. Joi Validator ===
let joiFields = '';
if (Object.keys(parsedFields).length > 0) {
  for (const [key, type] of Object.entries(parsedFields)) {
    const joiType = type === 'number' ? 'Joi.number()' :
                    type === 'boolean' ? 'Joi.boolean()' :
                    'Joi.string()';
    joiFields += `  ${key}: ${joiType}.required(),\n`;
  }
} else {
  joiFields = `  name: Joi.string().required(),\n  status: Joi.string().valid('active', 'inactive').optional()`;
}

const validatorContent = `import Joi from 'joi';

export const ${varName}Schema = Joi.object({
${joiFields}});
`;

fs.mkdirSync('validators', { recursive: true });
fs.writeFileSync(`validators/${varName}.validator.js`, validatorContent);

// === 4. Route with Swagger ===
const routeContent = `import express from 'express';
import {
  getAll${modelName}s, get${modelName}, create${modelName}, update${modelName}, delete${modelName}
} from '../controllers/${varName}.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { ${varName}Schema } from '../validators/${varName}.validator.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ${modelName}s
 *   description: Manage ${modelName}s
 */

/**
 * @swagger
 * /api/${pluralName}:
 *   get:
 *     summary: Get all ${modelName}s
 *     tags: [${modelName}s]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of ${modelName}s
 */
router.get('/', verifyToken, getAll${modelName}s);
router.get('/:id', verifyToken, get${modelName});
router.post('/', verifyToken, isAdmin, validate(${varName}Schema), create${modelName});
router.put('/:id', verifyToken, isAdmin, validate(${varName}Schema), update${modelName});
router.delete('/:id', verifyToken, isAdmin, delete${modelName});

export default router;
`;
fs.mkdirSync('routes', { recursive: true });
fs.writeFileSync(`routes/${varName}.routes.js`, routeContent);

// === 5. Generate utils/swagger.js if it doesn't exist ===
const utilsDir = 'utils';
const swaggerPath = path.join(utilsDir, 'swagger.js');

if (!fs.existsSync(swaggerPath)) {
  fs.mkdirSync(utilsDir, { recursive: true });

  const swaggerTemplate = `import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Generated API',
      version: '1.0.0',
      description: 'Auto-generated Swagger docs'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
`;

  fs.writeFileSync(swaggerPath, swaggerTemplate);
  console.log('📄 Created utils/swagger.js for Swagger support');
}

console.log(`✅ Successfully generated REST API for "${modelName}"`);
console.log(`📁 Files created:
- models/${varName}.model.js
- controllers/${varName}.controller.js
- validators/${varName}.validator.js
- routes/${varName}.routes.js`);

// === 6. Create or update app.js ===
const appJsPath = 'app.js';

const importLine = `import ${varName}Routes from './routes/${varName}.routes.js';`;
const useLine = `app.use('/api/${pluralName}', ${varName}Routes);`;

if (!fs.existsSync(appJsPath)) {
  const appTemplate = `import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// AUTO-GENERATED-ROUTE-IMPORTS
// AUTO-GENERATED-ROUTE-USE

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});
`;
  fs.writeFileSync(appJsPath, appTemplate);
  console.log('📄 Created default app.js with Swagger and placeholders');
}

// If app.js exists, inject route if not already present
let appJsContent = fs.readFileSync(appJsPath, 'utf-8');

// Inject import line
if (!appJsContent.includes(importLine)) {
  appJsContent = appJsContent.replace(
    '// AUTO-GENERATED-ROUTE-IMPORTS',
    `${importLine}\n// AUTO-GENERATED-ROUTE-IMPORTS`
  );
}

// Inject use() line
if (!appJsContent.includes(useLine)) {
  appJsContent = appJsContent.replace(
    '// AUTO-GENERATED-ROUTE-USE',
    `${useLine}\n// AUTO-GENERATED-ROUTE-USE`
  );
}

fs.writeFileSync(appJsPath, appJsContent);
console.log('🔌 Route successfully registered in app.js ✅');
console.log('Free Palestine 🙏 Love From 🇧🇩');
