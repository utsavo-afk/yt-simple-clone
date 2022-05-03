import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '@src/modules/auth/auth.utils';

export default function (req: Request, res: Response, next: NextFunction) {
	const accessToken = (req.headers.authorization || req.cookies.accessToken || '').replace(/^Bearer\s/, '');
	if (!accessToken) {
		return next();
	}
	const decoded = verifyJWT(accessToken);
	if (decoded) {
		res.locals.user = decoded;
	}
	return next();
}
