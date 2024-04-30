import User from './user';
import UserRecord from './userRecord';
import GptModel from 'src/chatgpt/gptmodel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// 处理tokens的函数
import {
	encode,
	encodeChat,
} from 'gpt-tokenizer'
import { startOfMonth, endOfMonth } from 'date-fns';



export const registerUser = async (username: string, password: string, invite: string) => {
	const invite_code = process.env.INVITE_CODE
	if (invite_code) {
		if (invite != invite_code) {
			throw new Error('邀请码错误');
		}
	}
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


export const generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.AUTH_SECRET_KEY);
	return token;
};

export const getUserBalance = async function (id) {
	// 查找用户
	try {
		const user = await User.findById(id);
		if (!user) {
			throw new Error('用户不存在');
		}
		return user.balance;
	} catch (e) {
		console.log(e);
		return -1;
	}

};


// 处理余额函数
export const saveRecordAndUpdateBalance = async function (id, message, response, model) {
	if (!response) {
		return;
	}
	try {
		const chatTokens = encodeChat(message, "gpt-3.5-turbo");//提问token
		const responseTokens = encode(response);//回答token
		// 查找模型费用
		var gptmodel = model;
		if (gptmodel.startsWith("gpt-4-gizmo-"))
			gptmodel = "gpt-4-gizmo-*";
		var modelInfo = await GptModel.findOne({ modelName: gptmodel });
		if (!modelInfo) {
			// 创造一个这个模型
			const newModel = new GptModel({ modelName: gptmodel, modelInputCost: 0.12, modelOutputCost: 0.12, isChargedPerUse: false });
			modelInfo = newModel;
			newModel.save();
		}


		// 计算费用
		var cost = (chatTokens.length - message.length) * modelInfo.modelInputCost / 1000 + responseTokens.length * modelInfo.modelOutputCost / 1000;
		cost = Number(cost.toFixed(6));
		jwt.verify(id, process.env.AUTH_SECRET_KEY, async (err, decoded: any) => {
			// 创建新的UserRecord实例
			const userRecord = new UserRecord({
				userId: decoded._id,
				model: model,
				inputTokens: (chatTokens.length - message.length), // 假设每个字符是一个token
				outputTokens: responseTokens.length, // 假设每个字符是一个token
				consumedBalance: cost, // 假设每个token消耗1单位的余额
				timestamp: new Date(),
				inputField: message[message.length - 1].content,
				outputField: response,
			})

			// 保存UserRecord实例
			userRecord.save()

			// 更新用户余额
			const user = await User.findById(decoded._id)
			if (user) {
				user.balance -= userRecord.consumedBalance
				await user.save()
			}
		});
		return cost;
	} catch (e) {
		console.log(e);
		return {
			status: 'Failed',
			cost: null
		};
	}
}

export const getBalanceAndUsage = async function (id) {
	const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY;
	if (!AUTH_SECRET_KEY) {
		return {
			status: 'Success',
			user: "user",
			totalUsage: "99999999"
		};
	}

	try {
		// console.log(id);
		const decoded: any = await verifyToken(id, AUTH_SECRET_KEY); // 使用Promise来处理jwt.verify
		const user = await User.findById(decoded._id);
		if (!user) {
			throw new Error('用户不存在');
		}
		const start = startOfMonth(new Date());
		const end = endOfMonth(new Date());
		const userRecords = await UserRecord.find({
			userId: decoded._id,
			timestamp: { $gte: start, $lte: end }
		});
		var totalUsage = userRecords.reduce((total, record) => total + record.consumedBalance, 0);
		totalUsage = Number(totalUsage.toFixed(6));
		return {
			status: 'Success',
			user: user,
			totalUsage: totalUsage
		};
	} catch (e) {
		console.log(e);
		return {
			status: 'Failed',
			message: '查询失败'
		};
	}
};

function verifyToken(id, secret) {
	return new Promise((resolve, reject) => {
		jwt.verify(id, secret, (err, decoded) => {
			if (err) {
				reject(new Error('无效的token'));
			} else {
				resolve(decoded);
			}
		});
	});
}
