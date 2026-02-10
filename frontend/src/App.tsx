import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import Dashboard from "./Pages/Dashboard";
import Issues from "./Pages/Issues";
import ViewIssue from "./Pages/ViewIssue";
import EditIssue from "./Pages/EditIssue";
import CreateIssue from "./Pages/CreateIssue";
import ProjectsPage from "./Pages/ProjectsPage";
import CreateProject from "./Pages/CreateProject";
import EditProject from "./Pages/EditProject";
import ViewProject from "./Pages/ViewProject";
import Settings from "./Pages/Settings";
import ProtectedRoute from "./Components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/issues" element={<ProtectedRoute><Issues /></ProtectedRoute>} />
        <Route path="/issues/new" element={<ProtectedRoute><CreateIssue /></ProtectedRoute>} />
        <Route path="/issues/:id/edit" element={<ProtectedRoute><EditIssue /></ProtectedRoute>} />
        <Route path="/issues/:id" element={<ProtectedRoute><ViewIssue /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
        <Route path="/projects/new" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
        <Route path="/projects/:id/edit" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ViewProject /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
