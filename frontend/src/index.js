import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TrainerDashboard from "./components/TrainerDashboard";
import PlanDetails from "./components/PlanDetails";
import UserFeed from "./components/UserFeed";
import TrainerProfile from "./components/TrainerProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
        <Route path="/plan/:id" element={<PlanDetails />} />
        <Route path="/feed" element={<UserFeed />} />
        <Route path="/trainer/:id" element={<TrainerProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
