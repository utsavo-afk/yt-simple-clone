export type Config = {
	env: string;
	port: number;
	mongoUri: string;
	cors_origin: string;
	jwtSecret: string;
	expiresIn: string;
	domain: string;
};
