import mongoose, { Document, Schema } from 'mongoose';



const GptModelSchema = new mongoose.Schema({
  modelName: {
    type: String,
    required: true,
		unique: true,
  },
  modelInputCost: {
    type: Number,
    required: true,
  },
	modelOutputCost: {
    type: Number,
    required: true,
  },
  isChargedPerUse: {
    type: Boolean,
    required: true,
  },
});



const GptModel = mongoose.model('GptModel', GptModelSchema);

export default GptModel;
