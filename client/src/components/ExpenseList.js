export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (!expenses.length) return <p>No expenses yet — add your first one above.</p>;

  return (
    <table className="expense-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Title</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((exp) => (
          <tr key={exp._id}>
            <td>{new Date(exp.date).toLocaleDateString()}</td>
            <td>{exp.title}</td>
            <td>
              <span className="swatch" style={{ background: exp.category?.color }} />
              {exp.category?.name}
            </td>
            <td>₹{exp.amount.toFixed(2)}</td>
            <td>
              <button onClick={() => onEdit(exp)}>Edit</button>
              <button onClick={() => onDelete(exp._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
