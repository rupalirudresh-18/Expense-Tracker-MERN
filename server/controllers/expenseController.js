const Expense = require("../models/Expense");

// GET /api/expenses?category=&startDate=&endDate=&page=&limit=
const getExpenses = async (req, res) => {
  const { category, startDate, endDate, page = 1, limit = 20 } = req.query;

  const filter = { user: req.user._id };
  if (category) filter.category = category;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .populate("category", "name color")
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Expense.countDocuments(filter),
  ]);

  res.json({ expenses, total, page: Number(page), pages: Math.ceil(total / limit) });
};

// POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const { title, amount, date, notes, category } = req.body;
    if (!title || amount == null || !category) {
      return res.status(400).json({ message: "title, amount, and category are required" });
    }

    const expense = await Expense.create({
      title,
      amount,
      date,
      notes,
      category,
      user: req.user._id,
    });
    const populated = await expense.populate("category", "name color");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/expenses/:id
const updateExpense = async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
  if (!expense) return res.status(404).json({ message: "Expense not found" });

  ["title", "amount", "date", "notes", "category"].forEach((field) => {
    if (req.body[field] !== undefined) expense[field] = req.body[field];
  });

  await expense.save();
  const populated = await expense.populate("category", "name color");
  res.json(populated);
};

// DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!expense) return res.status(404).json({ message: "Expense not found" });
  res.json({ message: "Expense deleted" });
};

// GET /api/expenses/summary?month=YYYY-MM
// Returns total spend + breakdown by category, for dashboard charts
const getSummary = async (req, res) => {
  const { month } = req.query; // e.g. "2026-07"
  const filter = { user: req.user._id };

  if (month) {
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    filter.date = { $gte: start, $lt: end };
  }

  const breakdown = await Expense.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    { $unwind: "$categoryInfo" },
    {
      $group: {
        _id: "$categoryInfo._id",
        name: { $first: "$categoryInfo.name" },
        color: { $first: "$categoryInfo.color" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);

  const total = breakdown.reduce((sum, c) => sum + c.total, 0);

  res.json({ total, breakdown });
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense, getSummary };
