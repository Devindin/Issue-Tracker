import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Issues from "./Pages/Issues";
import ViewIssue from "./Pages/ViewIssue";
import EditIssue from "./Pages/EditIssue";
import CreateIssue from "./Pages/CreateIssue";
import Reports from "./Pages/Reports";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/issues/:id" element={<ViewIssue />} />
        <Route path="/issues/:id/edit" element={<EditIssue />} />
        <Route path="/issues/new" element={<CreateIssue />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
