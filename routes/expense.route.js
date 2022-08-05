const express = require("express");
const expenseRouter = express.Router();
const {
  getExpenses,
  addExpense,
  deleteExpense,
} = require("../controllers/expense.controller");
const { protect } = require("../middleware/auth.middleware");

expenseRouter.route("/").get(protect, getExpenses).post(protect, addExpense);
expenseRouter.route("/:id").delete(protect, deleteExpense);

module.exports = { expenseRouter };
