import mongoose from "mongoose";
const { Schema } = mongoose;

const BarterSchema = new Schema(
  {
    skillId1: {
      type: String,
      required: true,
    },
    skillId2: {
        type: String,
        required: true,
      },
    img: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    priceSkill1: {
      type: Number,
      required: true,
    },
    priceSkill2: {
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    skillValue1: {
        type: Number,
        required: true,
      },
    skillValue2: {
        type: Number,
        required: true,
      },
    skillRating1: {
        type: Number,
        required: true,
      },
    skillRating2: {
        type: Number,
        required: true,
      },
    equivalency: {
        type: Number,
        required: true,
      },  
    discount: {
        type: Number,
        required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    datesBooked: {
      type: Date,
      default: null,
    },
    status: {
    type: String,
    default: "Pending",
},

},
  {
    timestamps: true,
  }
);

export default mongoose.model("Barter", BarterSchema);