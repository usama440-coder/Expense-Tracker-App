const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      enum: ["expense", "saving"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
