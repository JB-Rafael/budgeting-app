import { Link } from "react-router-dom";
import { FaChartPie, FaExchangeAlt, FaTags, FaSignOutAlt, FaWallet } from "react-icons/fa";

function Layout({ children }) {

return (

<div className="flex min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-blue-200 font-sans p-6">

  {/* Sidebar */}

  <div className="w-72 bg-white/70 backdrop-blur-lg border border-white/40 shadow-xl rounded-2xl p-8">

    {/* Logo */}

    <div className="flex items-center gap-3 mb-12">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl shadow-md">
        <FaWallet />
      </div>
      <h2 className="text-4xl font-bold text-gray-800 tracking-wide">
        Budget
      </h2>
    </div>

    {/* Navigation */}

    <nav className="flex flex-col gap-4 text-xl font-medium">

      <Link
        to="/dashboard"
        className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-indigo-200/70 transition transform hover:translate-x-1"
      >
        <FaChartPie className="text-indigo-600"/>
        Dashboard
      </Link>

      <Link
        to="/transactions"
        className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-indigo-200/70 transition transform hover:translate-x-1"
      >
        <FaExchangeAlt className="text-indigo-600"/>
        Transactions
      </Link>

      <Link
        to="/categories"
        className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-indigo-200/70 transition transform hover:translate-x-1"
      >
        <FaTags className="text-indigo-600"/>
        Categories
      </Link>

      <Link
        to="/"
        className="flex items-center gap-3 px-5 py-3 rounded-xl text-red-500 hover:bg-red-100 transition mt-6"
      >
        <FaSignOutAlt />
        Logout
      </Link>

    </nav>

  </div>


  {/* Main Content */}

  <div className="flex-1 pl-8">

    <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-12 min-h-full">

      {/* Greeting */}

      <div className="mb-12">

        <h1 className="text-6xl font-extrabold text-gray-800 tracking-tight">
          Hello there!
        </h1>

        <p className="text-2xl text-gray-600 mt-4">
          Welcome back. Here is your financial overview.
        </p>

      </div>

      {children}

    </div>

  </div>

</div>

);

}

export default Layout;