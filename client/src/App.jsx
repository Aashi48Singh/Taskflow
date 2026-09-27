import {
  // BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PendingTasks from "./pages/PendingTasks.jsx";
import CompletedTasks from "./pages/CompletedTasks.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    // <BrowserRouter>

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
          path="/completed"
          element={<CompletedTasks />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Routes>

    // </BrowserRouter>
  );
}

export default App;