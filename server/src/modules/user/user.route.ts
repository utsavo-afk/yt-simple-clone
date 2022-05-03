import { Router } from 'express';
import { processRequestBody } from 'zod-express-middleware';
import requireUser from '@src/middleware/requireUser';
import { registerUserHandler } from './user.controller';
import { registerUserSchema } from './user.schema';

const router = Router();

router
	.route('/')
	.post(processRequestBody(registerUserSchema.body), registerUserHandler)
	.get(requireUser, (req, res) => {
		return res.send(res.locals.user);
	});

export default router;
