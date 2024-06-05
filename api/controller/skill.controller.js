import Skill from "../models/skill.model.js";
import createError from "../utils/createError.js";

export const createSkill = async (req, res, next) => {
 

  const newSkill = new Skill({
    
    ...req.body,
    userId: req.userId,
  });

  try {
    const savedSkill = await newSkill.save();
    res.status(201).json(savedSkill);
  } catch (err) {
    next(err);
  }
};
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (skill.userId !== req.userId)
      return next(createError(403, "You can delete only your skill!"));

    await Skill.findByIdAndDelete(req.params.id);
    res.status(200).send("Skill has been deleted!");
  } catch (err) {
    next(err);
  }
};
export const getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return next(createError(404, "Skill not found!"));
    res.status(200).send(skill);
  } catch (err) {
    next(err);
  }
};
export const getSkills = async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.category && { category: q.category }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  try {
    const skills = await Skill.find(filters).sort({ [q.sort]: -1 });
    res.status(200).send(skills);
  } catch (err) {
    next(err);
  }
};

export const updateSkill = async (req, res, next) => {
  const updates = {
    ...req.body,
    userId: req.userId,
  };

  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return next(createError(404, "Skill not found!"));
    }

    if (skill.userId.toString() !== req.userId.toString()) {
      return next(createError(403, "You can only update your own skill!"));
    }

    const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json(updatedSkill);
  } catch (err) {
    next(err);
  }
};


