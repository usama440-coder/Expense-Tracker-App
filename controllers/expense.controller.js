const Expense = require("../models/expense.model");
const asyncHandler = require("express-async-handler");

// Desc     =>  Get the expenses
// Access   =>  Private
// Method   =>  GET
// Route    =>  /api/expense
const getExpenses = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const expenses = await Expense.find({ user });
  const stats = await Expense.aggregate([
    { $match: { user: user } },
    {
      $group: {
        _id: "$reason",
        total: { $sum: "$amount" },
      },
    },
  ]);
  res.status(201).json({ success: "true", stats, data: expenses });
});

// Desc     =>  Add an expense
// Access   =>  Private
// Method   =>  POST
// Route    =>  /api/expense
const addExpense = asyncHandler(async (req, res) => {
  const { description, reason, amount } = req.body;
  const id = req.user._id.toString();

  //   check if all the fields are given
  if (!description || !reason || !amount) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  //   check if correct reason is given (enum)
  if (!(reason === "saving" || reason === "expense")) {
    res.status(400);
    throw new Error("Please provide the correct reason");
  }

  //   create an expense
  const expense = await Expense.create({
    description,
    reason,
    amount,
    user: id,
  });

  res.status(200).json({ success: true, data: expense });
});

// Desc     =>  Delete the expense
// Access   =>  Private
// Method   =>  DELETE
// Route    =>  /api/expense
const deleteExpense = asyncHandler(async (req, res) => {
  const record = await Expense.findById(req.params.id);

  //   check if record in params is availiable in DB
  if (!record) {
    res.status(400);
    throw new Error("Record not found");
  }

  await record.deleteOne();
  res
    .status(200)
    .json({ success: true, message: `Record Deleted with id ${record._id}` });
});

module.exports = {
  getExpenses,
  addExpense,
  deleteExpense,
};
