import { useState, useEffect } from "react";
import api from "../api/axios";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);

  const loadExpenses = async () => {
    const { data } = await api.get("/expenses", {
      params: filterCategory ? { category: filterCategory } : {},
    });
    setExpenses(data.expenses);
  };

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [filterCategory]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await api.delete(`/expenses/${id}`);
    loadExpenses();
  };

  return (
    <div className="page">
      <h2>Expenses</h2>
      <ExpenseForm
        onSaved={loadExpenses}
        editingExpense={editingExpense}
        clearEditing={() => setEditingExpense(null)}
      />

      <div className="filter-row">
        <label>Filter by category: </label>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <ExpenseList
        expenses={expenses}
        onEdit={setEditingExpense}
        onDelete={handleDelete}
      />
    </div>
  );
}
