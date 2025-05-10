# 📦 node-api-maker

![npm](https://img.shields.io/npm/v/node-api-maker)
![downloads](https://img.shields.io/npm/dt/node-api-maker)
![license](https://img.shields.io/npm/l/node-api-maker)


[![npm](https://nodei.co/npm/node-api-maker.png)](https://www.npmjs.com/package/node-api-maker)

> A powerful CLI tool to generate REST API modules (Model, Controller, Route, Validator) with one command.

---

## 🚀 Features

- 🔧 Generate full CRUD modules in seconds
- 🧩 Supports field definition via `--fields`
- 🧾 Supports reusable presets with `--preset=<filename>` option
- 📁 Auto-generates folders: `models/`, `controllers/`, `routes/`, `validators/`
- ✅ Includes validation using `Joi`
- 🔒 Express-compatible and middleware-ready
- ⚡ Works with `npx`, no global install needed
- 📄 Auto-generates Swagger documentation (`utils/swagger.js`)

---

## 📥 Installation

You can use it directly via `npx`:

```
npx node-api-maker User --fields=name:string,email:string,isActive:boolean
```

Or install globally:
```
npm install -g node-api-maker
```
## 📘 Usage

You can generate REST API modules in **two ways**:

### 1️⃣ Using Inline Fields
Define fields directly in the command using the `--fields` option:

```
npx node-api-maker <ModelName> --fields=field:type,field:type
```
Supported types: string, number, boolean

## 💡 Example
```
npx node-api-maker Product --fields=name:string,price:number,inStock:boolean
```

## 2️⃣ Using a Preset File
For reusability and cleaner commands, you can define fields in a preset JSON file.

1. Create a folder named `presets/` in your project root.
2. Add a file like `product.json` with the field definitions.

Example: `presets/product.json`

```json
{
  "name": "string",
  "price": "number",
  "inStock": "boolean",
  "category": "string"
}
```
Then run:
```
npx node-api-maker Product --preset=product
```
This will generate the same module using the field definitions from **presets/product.json**.
```
📦 Loaded fields from preset: product
📄 Created utils/swagger.js for Swagger support
✅ Successfully generated REST API for "Product"
📁 Files created:
- models/product.model.js
- controllers/product.controller.js
- validators/product.validator.js
- routes/product.routes.js
📄 Created default app.js with Swagger and placeholders
🔌 Route successfully registered in app.js ✅
Free palestine 🙏 Love From 🇧🇩
```



## 📁 What Gets Generated?
Running the above command will create:
````
models/product.model.js
controllers/product.controller.js
validators/product.validator.js
routes/product.routes.js
````

It also auto-injects into:
```
app.js
utils/swagger.js  (created if missing)
```

## 🧪 Sample Output
***✅ models/product.model.js***
```
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, required: true },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
```

***✅ validators/product.validator.js***
```
import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  inStock: Joi.boolean().required(),
});

```

***✅ controllers/product.controller.js***
```
import Product from '../models/product.model.js';

export const getAllProducts = async (req, res) => {
  const data = await Product.find();
  res.json(data);
};

export const getProduct = async (req, res) => {
  const data = await Product.findById(req.params.id);
  if (!data) return res.status(404).json({ message: 'Product not found' });
  res.json(data);
};

export const createProduct = async (req, res) => {
  const data = await Product.create(req.body);
  res.status(201).json(data);
};

export const updateProduct = async (req, res) => {
  const data = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(data);
};

export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
};

```

***✅ routes/product.routes.js***
```
import express from 'express';
import {
  getAllProducts, getProduct, createProduct, updateProduct, deleteProduct
} from '../controllers/product.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { productSchema } from '../validators/product.validator.js';

const router = express.Router();

router.get('/', verifyToken, getAllProducts);
router.get('/:id', verifyToken, getProduct);
router.post('/', verifyToken, isAdmin, validate(productSchema), createProduct);
router.put('/:id', verifyToken, isAdmin, validate(productSchema), updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;

```


## 🛡 Requirements

- Node.js **v14 or higher**
- An existing **Express.js** app with middleware setup
- **Joi** for schema validation (already included as a dependency)

## 🙋‍♂️ Author  
## Md. Majharul Islam

<a href="https://github.com/majharul-islam181" target="_blank">
  <img src="https://img.icons8.com/ios-filled/50/ffffff/github.png" alt="GitHub" width="40" style="border-radius:6px;"/>
</a>
<a href="https://www.linkedin.com/in/majharul-islam181/" target="_blank">
  <img src="https://img.icons8.com/ios-filled/50/0A66C2/linkedin-circled--v1.png" alt="LinkedIn" width="40"/>
</a>

Feel free to contribute, suggest improvements, or report issues.

## 📄 License
This project is licensed under the **MIT License**.













