import User from "../models/user.model.js";
import createError from "../utils/createError.js";

export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (req.userId !== user._id.toString()) {
    return next(createError(403, "You can delete only your account!"));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("deleted.");
};
export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).send(user);
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { desc, img, datesBooked} = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { desc, img, datesBooked },
      { new: true }
    );

    if (!updatedUser) {
      return next(createError(404, "User not found!"));
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};