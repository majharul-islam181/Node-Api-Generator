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
