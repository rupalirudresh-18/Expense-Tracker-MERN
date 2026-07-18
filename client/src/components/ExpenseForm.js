import { useState, useEffect } from "react";
import api from "../api/axios";

export default function ExpenseForm({ onSaved, editingExpense, clearEditing }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    category: "",
    notes: "",
  });

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: editingExpense.amount,
        date: editingExpense.date.slice(0, 10),
        category: editingExpense.category._id,
        notes: editingExpense.notes || "",
      });
    }
  }, [editingExpense]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingExpense) {
      await api.put(`/expenses/${editingExpense._id}`, form);
      clearEditing();
    } else {
      await api.post("/expenses", form);
    }
    setForm({
      title: "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      category: "",
      notes: "",
    });
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <input
        name="title"
        placeholder="Title (e.g. Groceries)"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        name="amount"
        type="number"
        step="0.01"
        min="0"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />
      <input name="date" type="date" value={form.date} onChange={handleChange} required />
      <select name="category" value={form.category} onChange={handleChange} required>
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
      <input
        name="notes"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={handleChange}
      />
      <button type="submit">{editingExpense ? "Update" : "Add"} Expense</button>
      {editingExpense && (
        <button type="button" onClick={clearEditing}>
          Cancel
        </button>
      )}
    </form>
  );
}
