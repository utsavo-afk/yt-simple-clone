import mongoose from 'mongoose';
import config from '@src/config';
import logger from './logger';

export async function connectToDb() {
	try {
		await mongoose.connect(config.mongoUri);
		logger.info('Connected to Db');
	} catch (err) {
		logger.error(err, 'Failed to connect to Db');
		process.exit(1);
	}
}

export async function disconnectFromDb() {
	await mongoose.connection.close();
	logger.info('Disconnected from Db');
}
