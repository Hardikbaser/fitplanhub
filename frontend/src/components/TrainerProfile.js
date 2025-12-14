import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const TrainerProfile = () => {
  const [trainer, setTrainer] = useState(null);
  const [plans, setPlans] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    fetchTrainer();
    fetchPlans();
    if (userRole === 'user') checkFollowStatus();
  }, [id]);

  const fetchTrainer = async () => {
    try {
      // Assuming we have a route to get trainer by ID, or fetch from plans
      const res = await axios.get('http://localhost:8000/api/plans');
      const trainerData = res.data.find(p => p.trainer._id === id)?.trainer;
      setTrainer(trainerData);
    } catch (err) {
      console.error('Error fetching trainer:', err);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/plans');
      setPlans(res.data.filter(p => p.trainer._id === id));
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/follows', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsFollowing(res.data.some(f => f.following._id === id));
    } catch (err) {
      console.error('Error checking follow status:', err);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`http://localhost:8000/api/follows/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(false);
      } else {
        await axios.post(`http://localhost:8000/api/follows/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFollowing(true);
      }
    } catch (err) {
      alert('Follow action failed');
    }
  };

  if (!trainer) return <div>Loading...</div>;

  return (
    <div>
      <h1>{trainer.name}'s Profile</h1>
      {userRole === 'user' && (
        <button onClick={handleFollow}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}
      <h2>Plans by {trainer.name}</h2>
      {plans.map(plan => (
        <div key={plan._id}>
          <h3>{plan.title}</h3>
          <p>Price: ${plan.price}</p>
          <Link to={`/plan/${plan._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default TrainerProfile;