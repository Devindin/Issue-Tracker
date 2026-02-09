import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";
import Dashboard from "./Pages/Dashboard";
import Issues from "./Pages/Issues";
import ViewIssue from "./Pages/ViewIssue";
import EditIssue from "./Pages/EditIssue";
import CreateIssue from "./Pages/CreateIssue";
import Reports from "./Pages/Reports";
import Settings from "./Pages/Settings";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/issues/:id" element={<ViewIssue />} />
        <Route path="/issues/:id/edit" element={<EditIssue />} />
        <Route path="/issues/new" element={<CreateIssue />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
