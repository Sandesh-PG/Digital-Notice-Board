import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateNotice from "./pages/CreateNotice";
import SettingsPage from "./pages/Settings";
import Timetables from "./pages/Timetables";
import CreateTimetable from "./pages/CreateTimetable";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="create-notice" element={<CreateNotice />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="timetables" element={<Timetables />} />
        <Route path="create-timetable" element={<CreateTimetable />} />  

      </Route>
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard/settings" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-notice"
        element={
          <ProtectedRoute allowedRoles={["teacher", "admin"]}>
            <CreateNotice />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;