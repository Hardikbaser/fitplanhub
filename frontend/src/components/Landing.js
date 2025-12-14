import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Landing = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/plans")
      .then((res) => setPlans(res.data));
  }, []);

  return (
    <div>
      <h1>FitPlanHub</h1>
      <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
      <div>
        {plans.map((plan) => (
          <div key={plan._id}>
            <h3>{plan.title}</h3>
            <p>Trainer: {plan.trainer.name}</p>
            <p>Price: ${plan.price}</p>
            <Link to={`/plan/${plan._id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
