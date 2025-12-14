import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserFeed = () => {
  const [feed, setFeed] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchFeed();
    fetchSubscriptions();
  }, []);

  const fetchFeed = async () => {
    try {
      // Get followed trainers
      const followsRes = await axios.get('http://localhost8000/api/follows', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const followedTrainerIds = followsRes.data.map(f => f.following._id);

      // Get plans from followed trainers
      const plansRes = await axios.get('http://localhost:8000/api/plans');
      const followedPlans = plansRes.data.filter(p => followedTrainerIds.includes(p.trainer._id));

      setFeed(followedPlans);
    } catch (err) {
      console.error('Error fetching feed:', err);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/subscriptions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscriptions(res.data);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    }
  };

  return (
    <div>
      <h1>Your Feed</h1>
      <h2>Plans from Trainers You Follow</h2>
      {feed.map(plan => (
        <div key={plan._id}>
          <h3>{plan.title}</h3>
          <p>Trainer: {plan.trainer.name}</p>
          <p>Price: ${plan.price}</p>
          <Link to={`/plan/${plan._id}`}>View Details</Link>
        </div>
      ))}
      <h2>Your Subscriptions</h2>
      {subscriptions.map(sub => (
        <div key={sub._id}>
          <h3>{sub.plan.title}</h3>
          <p>Trainer: {sub.plan.trainer.name}</p>
          <p>Purchased: {new Date(sub.purchasedAt).toLocaleDateString()}</p>
          <Link to={`/plan/${sub.plan._id}`}>View Full Plan</Link>
        </div>
      ))}
    </div>
  );
};

export default UserFeed;