import { getModelForClass, prop, pre } from '@typegoose/typegoose';
import { hash, verify } from 'argon2';

@pre<User>('save', async function (next) {
	if (this.isModified('password') || this.isNew) {
		// no need to salt, argon handles it
		const _hash = await hash(this.password);
		this.password = _hash;
		return next();
	}
})
export class User {
	@prop({ required: true, unique: true })
	public username: string;

	@prop({ required: true, unique: true })
	public email: string;

	@prop({ required: true })
	public password: string;

	public async comparePassword(text: string): Promise<boolean> {
		return verify(this.password, text);
	}
}

export const UserModel = getModelForClass(User, {
	schemaOptions: {
		timestamps: true,
	},
});
