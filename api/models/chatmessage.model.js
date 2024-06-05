import mongoose from "mongoose";
const { Schema } = mongoose;

const ChatMessageSchema = new Schema({
  chatId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
},{
  timestamps:true
});

export default mongoose.model("ChatMessage", ChatMessageSchema)