import createError from "../utils/createError.js";
import Chat from "../models/chat.model.js";

export const createChat = async (req, res, next) => {
  const newChat = new Chat({
    id: [req.body.from, req.body.to].sort().join(""),
    sellerId: req.isSeller ? req.body.from : req.body.to,
    buyerId: req.isSeller ? req.body.to : req.body.from,
    readBySeller: req.isSeller,
    readByBuyer: !req.isSeller,
  });

  try {
    const savedChat = await newChat.save();
    res.status(201).send(savedChat);
  } catch (err) {
    next(err);
  }
};

export const updateChat = async (req, res, next) => {
  try {
    const updatedChat = await Chat.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          // readBySeller: true,
          // readByBuyer: true,
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
        },
      },
      { new: true }
    );

    res.status(200).send(updatedChat);
  } catch (err) {
    next(err);
  }
};

export const getSingleChat = async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ id: [req.params.sellerId, req.params.buyerId].sort().join('') });
    if (!chat) return next(createError(404, "Not found!"));
    res.status(200).send(chat);
  } catch (err) {
    next(err);
  }
};

export const getChat = async (req, res, next) => {
  try {
    const chat = await Chat.find(
      {$or: [ { sellerId: req.userId } , { buyerId: req.userId }]}
    ).sort({ updatedAt: -1 });
    res.status(200).send(chat);
  } catch (err) {
    next(err);
  }
};