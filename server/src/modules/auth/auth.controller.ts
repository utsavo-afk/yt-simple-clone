import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { findUserByEmail } from '../user/user.service';
import { signJWT } from './auth.utils';
import config from '@src/config';
import omitHelper from '@src/helpers/omit.helper';
import { LoginBody } from './auth.schema';

const ONE_YEAR = 3.154e10;

export async function loginHandler(req: Request<unknown, unknown, LoginBody>, res: Response) {
	const { email, password } = req.body;
	try {
		// find user by mail
		const user = await findUserByEmail(email);
		if (!user || !(await user.comparePassword(password))) {
			return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Invalid email or password' });
		}
		const payload = omitHelper(user.toJSON(), ['password', '__v', 'comparePassword']);

		const jwt = signJWT(payload);

		res.cookie('accessToken', jwt, {
			maxAge: ONE_YEAR,
			httpOnly: true,
			domain: config.domain,
			path: '/',
			sameSite: 'strict',
			secure: false,
		});

		return res.status(StatusCodes.OK).send({ token: jwt });
	} catch (err) {
		return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Failed to login' });
	}
}
