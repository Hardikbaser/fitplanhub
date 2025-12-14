import React, { useEffect, useState } from "react";
import axios from "axios";

const TrainerDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
  });
  const [editing, setEditing] = useState(null); // ID of plan being edited
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/plans/my-plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(res.data);
    } catch (err) {
      alert("Error fetching plans");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/plans", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ title: "", description: "", price: "", duration: "" });
      fetchPlans(); // Refresh list
    } catch (err) {
      alert("Error creating plan");
    }
  };

  const handleEdit = (plan) => {
    setEditing(plan._id);
    setForm({
      title: plan.title,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/plans/${editing}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditing(null);
      setForm({ title: "", description: "", price: "", duration: "" });
      fetchPlans(); // Refresh list
    } catch (err) {
      alert("Error updating plan");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await axios.delete(`http://localhost:5000/api/plans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchPlans(); // Refresh list
      } catch (err) {
        alert("Error deleting plan");
      }
    }
  };

  return (
    <div>
      <h1>Trainer Dashboard</h1>

      <h2>Create New Plan</h2>
      <form onSubmit={editing ? handleUpdate : handleCreate}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Duration (days)"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          required
        />
        <button type="submit">{editing ? "Update Plan" : "Create Plan"}</button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({ title: "", description: "", price: "", duration: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Your Plans</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {plans.map((plan) => (
            <li key={plan._id}>
              <h3>{plan.title}</h3>
              <p>{plan.description}</p>
              <p>Price: ${plan.price}</p>
              <p>Duration: {plan.duration} days</p>
              <button onClick={() => handleEdit(plan)}>Edit</button>
              <button onClick={() => handleDelete(plan._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrainerDashboard;
