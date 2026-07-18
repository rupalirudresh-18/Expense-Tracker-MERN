const express = require("express");
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
} = require("../controllers/expenseController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/summary", getSummary);
router.route("/").get(getExpenses).post(createExpense);
router.route("/:id").put(updateExpense).delete(deleteExpense);

module.exports = router;
