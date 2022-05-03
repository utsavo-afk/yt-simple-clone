// eslint-disable-next-line import/no-named-as-default
import pino from 'pino';

export default pino({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
});
