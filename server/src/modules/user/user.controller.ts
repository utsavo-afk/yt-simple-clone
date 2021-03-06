import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RegisterUserBody } from './user.schema';
import { createUser } from './user.service';

export async function registerUserHandler(req: Request<unknown, unknown, RegisterUserBody>, res: Response) {
	const { username, email, password } = req.body;
	try {
		await createUser({ username, email, password });

		return res.status(StatusCodes.CREATED).send({ message: 'User created successfully' });
	} catch (err: any) {
		if (err.code === 11000) {
			return res.status(StatusCodes.CONFLICT).send({ message: 'User already exists' });
		}
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err.message });
	}
}
