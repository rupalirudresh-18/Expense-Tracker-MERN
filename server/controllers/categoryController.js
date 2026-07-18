const Category = require("../models/Category");
const Expense = require("../models/Expense");

// GET /api/categories
const getCategories = async (req, res) => {
  const categories = await Category.find({ user: req.user._id }).sort("name");
  res.json(categories);
};

// POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const category = await Category.create({
      name,
      color,
      user: req.user._id,
    });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/categories/:id
const updateCategory = async (req, res) => {
  const category = await Category.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!category) return res.status(404).json({ message: "Category not found" });

  category.name = req.body.name ?? category.name;
  category.color = req.body.color ?? category.color;
  await category.save();
  res.json(category);
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  const category = await Category.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!category) return res.status(404).json({ message: "Category not found" });

  const expenseCount = await Expense.countDocuments({ category: category._id });
  if (expenseCount > 0) {
    return res.status(400).json({
      message: `Cannot delete: ${expenseCount} expense(s) use this category`,
    });
  }

  await category.deleteOne();
  res.json({ message: "Category deleted" });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
