// User.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },  // 添加的用户余额字段
});

UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  };
	this.balance = parseFloat((this.balance).toFixed(6));
  next();
});

const User = mongoose.model('User', UserSchema);

export default User;
