import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';

const UserSchema: Schema = new Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        // confirmPassword: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>('User', UserSchema);