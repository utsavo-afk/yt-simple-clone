import { Router } from 'express';
import { processRequestBody } from 'zod-express-middleware';
import { loginHandler } from './auth.controller';
import { loginSchema } from './auth.schema';

const router = Router();

router.route('/').post(processRequestBody(loginSchema.body), loginHandler);

export default router;
