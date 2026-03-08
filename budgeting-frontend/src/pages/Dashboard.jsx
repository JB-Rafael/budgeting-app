import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Layout from "../components/Layout";


const COLORS = ["#0088FE","#00C49F","#FFBB28","#FF8042","#A28BFF","#FF6699"];

function Dashboard() {

  const email = localStorage.getItem("email");

  const [summary, setSummary] = useState(null);
  const [breakdown, setBreakdown] = useState({});
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    const summaryResponse = await fetch(
      `https://budgeting-app-1-8977.onrender.com/transactions/monthly-summary?email=${email}&year=${year}&month=${month}`
    );

    const summaryData = await summaryResponse.json();
    setSummary(summaryData);

    const breakdownResponse = await fetch(
      `https://budgeting-app-1-8977.onrender.com/transactions/category-breakdown?email=${email}`
    );

    const breakdownData = await breakdownResponse.json();
    setBreakdown(breakdownData);

    const categoriesResponse = await fetch(
      "https://budgeting-app-1-8977.onrender.com/categories/list"
    );

    const categoriesData = await categoriesResponse.json();
    setCategories(categoriesData);

    const transactionsResponse = await fetch(
      `https://budgeting-app-1-8977.onrender.com/transactions/list?email=${email}`
    );

    const transactionsData = await transactionsResponse.json();
    setTransactions(transactionsData);
  };

  const addTransaction = async () => {

    const params = new URLSearchParams();
    params.append("email", email);
    params.append("amount", amount);
    params.append("categoryId", categoryId);
    params.append("description", description);

    const response = await fetch("https://budgeting-app-1-8977.onrender.com/transactions/add", {
      method: "POST",
      body: params
    });

    const data = await response.json();
    alert(data.message);

    loadDashboard();
  };

  const chartData = Object.entries(breakdown).map(([name, value]) => ({
    name,
    value
  }));

  return (

    <Layout>

      <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-blue-200 p-10 space-y-10 rounded-3xl">

        <h1 className="text-6xl font-bold">Dashboard</h1>


        {/* STAT CARDS */}

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl p-6 shadow-xl">
            <p className="opacity-80 text-sm">Income</p>
            <p className="text-3xl font-bold">{summary?.income}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl p-6 shadow-xl">
            <p className="opacity-80 text-sm">Expense</p>
            <p className="text-3xl font-bold">{summary?.expense}</p>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-6 shadow-xl">
            <p className="opacity-80 text-sm">Balance</p>
            <p className="text-3xl font-bold">{summary?.balance}</p>
          </div>

        </div>


        {/* FORM + CHART */}

        <div className="grid grid-cols-2 gap-10">


          {/* ADD TRANSACTION */}

          <div className="bg-white/90 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl p-8 space-y-4">

            <h2 className="text-3xl font-semibold">Add Transaction</h2>

            <label className="text-lg font-medium">Amount</label>

            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border rounded-md"
            />

            <label className="text-lg font-medium">Category</label>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-3 border rounded-md"
            >
              <option value="">Select Category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <label className="text-lg font-medium">Description</label>

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-md"
            />

            <button
              onClick={addTransaction}
              className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Add Transaction
            </button>

          </div>


          {/* PIE CHART */}

          <div className="bg-white/90 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl p-8 flex flex-col items-center">

            <h2 className="text-3xl font-semibold mb-6">
              Category Breakdown
            </h2>

            <PieChart width={500} height={360}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />

            </PieChart>

          </div>

        </div>


        {/* TRANSACTION TABLE */}

        <div className="bg-white/90 backdrop-blur-md border border-white/40 rounded-2xl shadow-xl p-8">

          <h2 className="text-3xl font-semibold mb-6">
            Transaction History
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Type</th>
              </tr>
            </thead>

            <tbody>

              {transactions.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">

                  <td className="p-4">{t.date}</td>
                  <td className="p-4">{t.description}</td>
                  <td className="p-4">{t.amount}</td>
                  <td className="p-4">{t.type}</td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </Layout>

  );

}

export default Dashboard;