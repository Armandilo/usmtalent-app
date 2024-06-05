import createError from "../utils/createError.js";
import UserReview from "../models/userreview.model.js";
import User from "../models/user.model.js";



export const createReview = async (req, res, next) => {
  

  const newReview = new UserReview({
    bossId: req.body.bossId,
    userId: req.userId,
    desc: req.body.desc,
    star: req.body.star,
  });

  if (req.body.bossId === req.userId) {
    return next(
      createError(403, "You can't review yourself!")
    );
  }


  try {
    const review = await UserReview.findOne({
      bossId: req.body.bossId,
      userId: req.userId,
    });

    if (review)
      return next(
        createError(403, "You have already created a review for this user!")
      );

    // Check if the user is trying to review themselves
   

    //TODO: check if the user purchased the gig.

    const savedReview = await newReview.save();

    await User.findByIdAndUpdate(req.body.bossId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });
    res.status(201).send(savedReview);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await UserReview.find({ bossId: req.params.bossId });
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