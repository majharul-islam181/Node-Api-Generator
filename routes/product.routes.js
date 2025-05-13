import express from 'express';
import {
  getAllProducts, getProduct, createProduct, updateProduct, deleteProduct
} from '../controllers/product.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { productSchema } from '../validators/product.validator.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Manage Products
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all Products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of Products
 */
router.get('/', verifyToken, getAllProducts);
router.get('/:id', verifyToken, getProduct);
router.post('/', verifyToken, isAdmin, validate(productSchema), createProduct);
router.put('/:id', verifyToken, isAdmin, validate(productSchema), updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;
