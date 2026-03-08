import { useEffect, useState } from "react";
import { PieChart,Pie,Cell,Tooltip,Legend,BarChart,Bar,XAxis,YAxis,CartesianGrid } from "recharts";
import Layout from "../components/Layout";

const COLORS = ["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444"];

function Categories(){

const [categoryData,setCategoryData] = useState([]);
const [weeklyData,setWeeklyData] = useState([]);
const [loading,setLoading] = useState(true);

useEffect(()=>{

const email = localStorage.getItem("email");

if(!email) return;

/* CATEGORY BREAKDOWN */

fetch("https://budgeting-app-1-8977.onrender.com/transactions/category-breakdown?email=" + email)
.then(res=>res.json())
.then(data=>{

if(data && typeof data === "object"){

const formatted = Object.keys(data).map(key => ({
category: key,
amount: data[key]
}));

setCategoryData(formatted);

}else{

setCategoryData([]);

}

});

/* WEEKLY EXPENSES */

fetch("https://budgeting-app-1-8977.onrender.com/transactions/weekly-expenses?email=" + email)
.then(res=>res.json())
.then(data=>{

if(Array.isArray(data)){
setWeeklyData(data);
}else{
setWeeklyData([]);
}

setLoading(false);

})
.catch(()=>{
setWeeklyData([]);
setLoading(false);
});

},[]);


/* CALCULATE PERCENTAGES */

const total = categoryData.reduce((sum,item)=>sum + item.amount,0);

const percentages = categoryData
.map(item => ({
...item,
percent: total ? Math.round((item.amount / total) * 100) : 0
}))
.sort((a,b)=>b.percent-a.percent);


return(

<Layout>

<h1 className="text-4xl font-bold mb-8">
Categories
</h1>


{/* TOP CHARTS */}

<div className="grid grid-cols-2 gap-8">

<div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-center">

<h2 className="text-xl font-semibold mb-4">
Expense Categories
</h2>

{categoryData.length === 0 ? (

<p className="text-gray-500">No category data yet</p>

) : (

<PieChart width={400} height={300}>

<Pie
data={categoryData}
dataKey="amount"
nameKey="category"
cx="50%"
cy="50%"
outerRadius={110}
label
>

{categoryData.map((entry,index)=>(
<Cell key={index} fill={COLORS[index % COLORS.length]}/>
))}

</Pie>

<Tooltip/>
<Legend/>

</PieChart>

)}

</div>


<div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6">

<h2 className="text-xl font-semibold mb-4">
Expenses Last 7 Days
</h2>

{loading ? (

<p>Loading...</p>

) : weeklyData.length === 0 ? (

<p className="text-gray-500">No weekly data</p>

) : (

<BarChart width={500} height={300} data={weeklyData}>

<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="day"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="amount" fill="#6366f1"/>

</BarChart>

)}

</div>

</div>


{/* FULL WIDTH PERCENTAGE CARD */}

<div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 mt-8">

<h2 className="text-xl font-semibold mb-6">
Category Percentages
</h2>

<div className="space-y-4">

{percentages.map((item,index)=>(
  
<div key={index}>

<div className="flex justify-between mb-1 font-medium">

<span className="capitalize">{item.category}</span>

<span>{item.percent}%</span>

</div>

<div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">

<div
className="h-full"
style={{
width: item.percent + "%",
backgroundColor: COLORS[index % COLORS.length]
}}
/>

</div>

</div>

))}

</div>

</div>


</Layout>

);

}

export default Categories;