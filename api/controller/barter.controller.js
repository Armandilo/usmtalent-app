import Barter from "../models/barter.model.js";
import createError from "../utils/createError.js";



export const createBarter = async (req, res, next) => {
  const newBarter = new Barter(req.body);

  try {
    const savedBarter = await newBarter.save();
    res.status(201).json(savedBarter);
  } catch (err) {
    next(err);
  }
};

export const deleteBarter = async (req, res, next) => {
  try {
    const barter = await Barter.findById(req.params.id);
    if (barter.sellerId !== req.userId)
      return next(createError(403, "You can delete only your barter!"));

    await Barter.findByIdAndDelete(req.params.id);
    res.status(200).send("Barter has been deleted!");
  } catch (err) {
    next(err);
  }
};

export const getBarter = async (req, res, next) => {
  try {
    const barter = await Barter.findById(req.params.id);
    if (!barter) next(createError(404, "Barter not found!"));
    res.status(200).send(barter);
  } catch (err) {
    next(err);
  }
};

export const getBarters = async (req, res, next) => {
    try {
      const barters = await Barter.find({
        $or: [{ sellerId: req.userId }, { buyerId: req.userId }],
        
      });
  
      res.status(200).send(barters);
    } catch (err) {
      next(err);
    }
  };

export const updateBarter = async (req, res, next) => {
  const updates = {
    ...req.body,
    sellerId: req.userId,
  };

  try {
    const barter = await Barter.findById(req.params.id);
    if (!barter) {
      return next(createError(404, "Barter not found!"));
    }

    if (barter.sellerId.toString() !== req.userId.toString()) {
      return next(createError(403, "You can only update your own barter!"));
    }

    const updatedBarter = await Barter.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json(updatedBarter);
  } catch (err) {
    next(err);
  }
};

export const updateBarterStatus = async (req, res, next) => {
  try {
    const barter = await Barter.findById(req.params.id);
    if (!barter) {
      return next(createError(404, "Barter not found!"));
    }

    barter.status = req.body.status; // update the status
    const updatedBarter = await barter.save(); // save the updated barter

    res.status(200).json(updatedBarter);
  } catch (err) {
    next(err);
  }
};
