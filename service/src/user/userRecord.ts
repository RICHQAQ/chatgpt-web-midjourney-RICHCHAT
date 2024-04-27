// UserRecord.ts
import mongoose from 'mongoose';

const UserRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  model: { type: String, required: true },
  inputTokens: { type: Number, required: true },
  outputTokens: { type: Number, required: true },
  consumedBalance: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const UserRecord = mongoose.model('UserRecord', UserRecordSchema);

export default UserRecord;