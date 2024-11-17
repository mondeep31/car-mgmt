import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { getApiDocs } from '../controllers/docsController';

const router = express.Router();

// Get the API documentation JSON
const apiDocs = getApiDocs(null, null);
if (!apiDocs) {
  throw new Error('Failed to generate API documentation');
}

// Serve Swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(apiDocs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Spyne Car Management API Documentation",
  swaggerOptions: {
    persistAuthorization: true,
  }
}));

// JSON endpoint for raw documentation
router.get('/json', (req: Request, res: Response) => {
  const docs = getApiDocs(req, res);
  if (!docs) return;
  res.json(docs);
});

export default router;
