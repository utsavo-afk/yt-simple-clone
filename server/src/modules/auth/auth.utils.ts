import { sign, verify } from 'jsonwebtoken';
import config from '@src/config';

export function signJWT(payload: string | Buffer | object) {
	return sign(payload, config.jwtSecret, { expiresIn: config.expiresIn });
}

export function verifyJWT(token: string) {
	try {
		const decoded = verify(token, config.jwtSecret);
		return decoded;
	} catch (err) {
		return null;
	}
}
