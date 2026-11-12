
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-purple-50">

      {/* Navbar */}
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-purple-700">
          Admin Portal
        </h1>

        <button className="text-red-500 font-semibold">
          Logout
        </button>
      </nav>

      {/* Dashboard */}
      <div className="p-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage student complaints and responses.
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Complaints</p>
            <h2 className="text-3xl font-bold mt-2">0</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Pending</p>
            <h2 className="text-3xl font-bold text-yellow-600 mt-2">0</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">In Progress</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-2">0</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Resolved</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">0</h2>
          </div>

        </div>

        {/* Actions */}
        <div className="mt-8">
          <Link
            to="/admin/complaints"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            View All Complaints
          </Link>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
