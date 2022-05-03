import { config } from 'dotenv-safe';
import { Config } from '@src/typings';
config();

export default {
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 3001,
	mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test',
	cors_origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
	jwtSecret: process.env.JWT_SECRET_KEY || 'JWT_SECRET_KEY',
	expiresIn: process.env.JWT_EXPIRES_IN || '7d',
	domain: process.env.DOMAIN || 'localhost',
} as Config;
