import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import MyComplaints from "./pages/MyComplaints";
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaint";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/submit-complaint" element={<SubmitComplaint />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
         <Route path="/admin/complaints" element={<AdminComplaints />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;