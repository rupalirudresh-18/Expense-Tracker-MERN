import { useState, useEffect } from "react";
import api from "../api/axios";

const COLORS = ["#6C63FF", "#FF6B6B", "#4ECDC4", "#FFD93D", "#1A936F", "#F76E11"];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState("");

  const loadCategories = async () => {
    const { data } = await api.get("/categories");
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/categories", { name, color });
      setName("");
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add category");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="page">
      <h2>Categories</h2>
      <form onSubmit={handleAdd} className="inline-form">
        <input
          placeholder="Category name (e.g. Food)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select value={color} onChange={(e) => setColor(e.target.value)}>
          {COLORS.map((c) => (
            <option key={c} value={c} style={{ background: c }}>
              {c}
            </option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>
      {error && <p className="error">{error}</p>}

      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat._id}>
            <span className="swatch" style={{ background: cat.color }} />
            {cat.name}
            <button onClick={() => handleDelete(cat._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
