import createError from "../utils/createError.js";
import Review from "../models/review.model.js";
import Skill from "../models/skill.model.js";
import Order from "../models/order.model.js";

export const createReview = async (req, res, next) => {
  

  const newReview = new Review({
    userId: req.userId,
    skillId: req.body.skillId,
    desc: req.body.desc,
    star: req.body.star,
  });

  try {
    const review = await Review.findOne({
      skillId: req.body.skillId,
      userId: req.userId,
    });

    if (review)
      return next(
        createError(403, "You have already created a review for this gig!")
      );

      const skill = await Skill.findById(req.body.skillId);

      if(skill.userId.toString() === req.userId)
        return next(
          createError(403, "You can't review your own skill!")
      );
  

    //TODO: check if the user purchased the gig.
    const order = await Order.findOne({
      buyerId: req.userId,
      skillId: req.body.skillId, // Replace with the actual seller ID
      isCompleted: true,
    });

    if (!order)
    return next(
      createError(403, "You can't review a skill that you haven't purchased!")
    );

    
    const savedReview = await newReview.save();

    await Skill.findByIdAndUpdate(req.body.skillId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });
    res.status(201).send(savedReview);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ skillId: req.params.skillId });
    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};
export const deleteReview = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};