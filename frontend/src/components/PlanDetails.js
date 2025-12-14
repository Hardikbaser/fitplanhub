import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PlanDetails = () => {
  const [plan, setPlan] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { id } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlan(res.data);
      // Check if user is subscribed (if full plan is returned)
      setIsSubscribed(res.data.description ? true : false);
    } catch (err) {
      console.error('Error fetching plan:', err);
    }
  };

  const handleSubscribe = async () => {
    try {
      await axios.post(`http://localhost:8000/api/subscriptions/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Subscribed successfully!');
      fetchPlan(); // Refresh to show full details
    } catch (err) {
      alert('Subscription failed');
    }
  };

  if (!plan) return <div>Loading...</div>;

  return (
    <div>
      <h1>{plan.title}</h1>
      <p>Trainer: {plan.trainer?.name}</p>
      <p>Price: ${plan.price}</p>
      {isSubscribed ? (
        <div>
          <p>Description: {plan.description}</p>
          <p>Duration: {plan.duration} days</p>
        </div>
      ) : (
        <div>
          <p>This is a preview. Subscribe to access full details.</p>
          <button onClick={handleSubscribe}>Subscribe</button>
        </div>
      )}
    </div>
  );
};

export default PlanDetails;