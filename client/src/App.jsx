import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PendingTasks from "./pages/PendingTasks.jsx";
import InProgressTasks from "./pages/InProgressTasks.jsx";
import CompletedTasks from "./pages/CompletedTasks.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/pending"
        element={<PendingTasks />}
      />

      <Route
        path="/in-progress"
        element={<InProgressTasks />}
      />

      <Route
        path="/completed"
        element={<CompletedTasks />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

    </Routes>
  );
}

export default App;