import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    skillId1: {
      type: String,
      required: true,
    },
    skillId2: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      default: "Online Payment",
    },
    barterId: {
      type: String,
      default: null,
    },

    img: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
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
    isCompleted: {
      type: Boolean,
      default: false,
    },
    payment_intent: {
      type: String,
      required: false,
    },
    datesBooked: {
      type: Date,
      default: null,
  },
    desc1: {
      type: String,
      default: null,
  },
    desc2: {
      type: String,
      default: null,
  },
    status: {
    type: String,
    default: "Pending",
},
  files: [{
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);