import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Skill from "../models/skill.model.js";
import Barter from "../models/barter.model.js";
import User from "../models/user.model.js";
import Stripe from "stripe";
export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);

  const skill = await Skill.findById(req.params.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: skill.price * 100,
    currency: "myr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = new Order({
    skillId1: skill._id,
    img: skill.cover,
    title: skill.title,
    buyerId: req.userId,
    sellerId: skill.userId,
    price: skill.price,
    payment_intent: paymentIntent.id,
    datesBooked: req.body.datesBooked || null,
    desc: "",
  });

  await newOrder.save();

  if(req.body.datesBooked){
    await User.findByIdAndUpdate(skill.userId, {
      $addToSet: { datesBooked: req.body.datesBooked },
    });
  }

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,

  });
};

export const intentbarter = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);

  const barter = await Barter.findById(req.params.id);
  const amount = Math.round((barter.finalPrice - barter.discount)*100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "myr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = new Order({
    skillId1: barter.skillId1,
    skillId2: barter.skillId2,
    barterId: barter._id,
    type : "Barter",
    img: barter.cover,
    title: barter.title,
    buyerId: barter.buyerId,
    sellerId: barter.sellerId,
    price: barter.finalPrice - barter.discount,
    payment_intent: paymentIntent.id,
    datesBooked: req.body.datesBooked,
    desc1: "",
    desc2: "",
  });

  await newOrder.save();

  barter.status = "Completed";
  await barter.save();

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,

  });
};




export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [{ sellerId: req.userId }, { buyerId: req.userId }],
      isCompleted: true,
    });

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};
export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(createError(404, "Order not found!"));
    }

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const getOrderDetails = async (req, res, next) => {
  const { paymentIntentId } = req.params;

  const order = await Order.findOne({ payment_intent: paymentIntentId,isCompleted:true });

  if (!order) {
    return res.status(404).send({ message: 'Order not found' });
  }

  res.status(200).send(order);
};

export const updateOrderDesc = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(createError(404, "Order not found!"));
    }

    // Check if the current user is the buyer
   // if (req.userId !== order.buyerId.toString()) {
    //  return next(createError(403, "You are not authorized to update this order!"));
   // }

    // Update the desc field
    order.desc1 = req.body.desc1;

    // Save the order
    await order.save();

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const updateOrderDesc2 = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(createError(404, "Order not found!"));
    }

    // Check if the current user is the buyer
   // if (req.userId !== order.buyerId.toString()) {
    //  return next(createError(403, "You are not authorized to update this order!"));
   // }

    // Update the desc field
    order.desc2 = req.body.desc2;

    // Save the order
    await order.save();

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(createError(404, "Order not found!"));
    }

    // Check if the current user is the buyer
   // if (req.userId !== order.buyerId.toString()) {
    //  return next(createError(403, "You are not authorized to update this order!"));
   // }

    // Update the desc field
    order.status = req.body.status;

    // Save the order
    await order.save();

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const updateOrderFiles = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(createError(404, "Order not found!"));
    }

    // Concatenate the new files with the existing ones
    order.files = order.files.concat(req.body.files.map(file => ({ url: file.url, name: file.name })));

    // Save the order
    await order.save();

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const getSingleBarterOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ barterId: req.params.id });
    if (!order) {
      return next(createError(404, "Order not found!"));
    }

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const barter = await Barter.findById(req.params.id);

    const newOrder = new Order({
      skillId1: barter.skillId1,
      skillId2: barter.skillId2,
      barterId: barter._id,
      type : "Barter",
      img: barter.cover,
      title: barter.title,
      buyerId: barter.buyerId,
      sellerId: barter.sellerId,
      price: barter.finalPrice - barter.discount,
      datesBooked: req.body.datesBooked,
      desc1: "",
      desc2: "",
      isCompleted: true,
    });

    await newOrder.save();

    barter.status = "Completed";
    await barter.save();

    res.status(200).send(newOrder);
  } catch (err) {
    next(err);
  }
};