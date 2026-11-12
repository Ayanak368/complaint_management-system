
import { Link } from "react-router-dom";

function StudentDashboard() {
  return (
    <div className="min-h-screen bg-purple-50">

      {/* Navbar */}
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-700">
          Complaint Portal
        </h1>

        <button className="text-red-500 font-semibold">
          Logout
        </button>
      </nav>

      {/* Dashboard */}
      <div className="p-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, Student!
        </h1>

        <p className="text-gray-500 mt-2">
          Manage and track your college complaints.
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Complaints</p>
            <h2 className="text-3xl font-bold mt-2">0</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Pending Complaints</p>
            <h2 className="text-3xl font-bold text-yellow-600 mt-2">0</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Resolved Complaints</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">0</h2>
          </div>

        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-8">

          <Link
            to="/submit-complaint"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Submit Complaint
          </Link>

          <Link
            to="/my-complaints"
            className="bg-white text-purple-700 border border-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50"
          >
            My Complaints
          </Link>

        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;
