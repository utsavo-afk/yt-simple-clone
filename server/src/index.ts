import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import { connectToDb, disconnectFromDb } from './utils/database';
import logger from './utils/logger';
import userRouter from '@src/modules/user/user.route';
import authRouter from '@src/modules/auth/auth.route';
import videoRouter from '@src/modules/video/video.route';
import deserializeUser from './middleware/deserializeUser';

const app = express();
app.use(cookieParser());
app.use(json());
app.use(
	cors({
		origin: config.cors_origin,
		credentials: true,
	})
);
app.use(helmet());
app.use(morgan('dev'));
app.use(deserializeUser);

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/videos', videoRouter);

const server = app.listen(config.port, async () => {
	await connectToDb();
	logger.info(`Server running @ http://localhost:${config.port}`);
});

const SIGNALS = ['SIGTERM', 'SIGINT'];

function gracefulShutdown(signal: string) {
	process.on(signal, async () => {
		server.close();
		await disconnectFromDb();
		process.exit(0);
	});
}

SIGNALS.forEach(signal => gracefulShutdown(signal));
