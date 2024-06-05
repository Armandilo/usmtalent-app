import createError from "../utils/createError.js";
import ChatMessage from "../models/chatmessage.model.js";
import Chat from "../models/chat.model.js";

export const createChatMessage = async (req, res, next) => {
  const newChatMessage = new ChatMessage({
    chatId: req.body.chatId,
    userId: req.userId,
    desc: req.body.desc,
  });
  try {
    const savedChatMessage = await newChatMessage.save();
    await Chat.findOneAndUpdate(
      { id: req.body.chatId },
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          lastMessage: req.body.desc,
        },
      },
      { new: true }
    );

    res.status(201).send(savedChatMessage);
  } catch (err) {
    next(err);
  }
};
export const getChatMessages = async (req, res, next) => {
  try {
    const chatmessages = await ChatMessage.find({ chatId: req.params.id });
    res.status(200).send(chatmessages);
  } catch (err) {
    next(err);
  }
};