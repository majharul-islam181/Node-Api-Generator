import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

import productRoutes from './routes/product.routes.js';
// AUTO-GENERATED-ROUTE-IMPORTS
app.use('/api/products', productRoutes);
// AUTO-GENERATED-ROUTE-USE

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
