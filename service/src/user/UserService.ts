import User from './user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


export const registerUser = async (username: string, password: string) => {
    // 使用 User 模型来执行注册逻辑
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new Error('用户名已存在');
    }

    // 创建新用户
    const user = new User({ username, password });
    await user.save();
    return user;
};


export const loginUser = async (username: string, password: string) => {
    // 使用 User 模型来执行登录逻辑
    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('用户不存在');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('密码错误');
    }

    return user;
};


export const generateAuthToken = function (){
    const token = jwt.sign({ _id: this._id }, process.env.AUTH_SECRET_KEY);
    return token;
};
