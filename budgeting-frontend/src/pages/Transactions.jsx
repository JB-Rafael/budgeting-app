import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Transactions(){

const [transactions,setTransactions] = useState([]);
const [loading,setLoading] = useState(true);

const [editing,setEditing] = useState(null);
const [description,setDescription] = useState("");
const [amount,setAmount] = useState("");

const [deleteId,setDeleteId] = useState(null);

const fetchTransactions = () => {

const email = localStorage.getItem("email");

fetch("https://budgeting-app-1-8977.onrender.com/transactions/list?email="+email)
.then(res=>res.json())
.then(data=>{
setTransactions(Array.isArray(data)?data:[]);
setLoading(false);
})
.catch(()=>{
setTransactions([]);
setLoading(false);
});

};

useEffect(()=>{
fetchTransactions();
},[]);


const openEdit = (t)=>{
setEditing(t);
setDescription(t.description);
setAmount(t.amount);
};

const saveEdit = async ()=>{

if(description.trim()===""){
alert("Description cannot be empty");
return;
}

if(description.length>30){
alert("Description must be 30 characters or less");
return;
}

const numAmount = Number(amount);

if(isNaN(numAmount) || numAmount<=0 || numAmount>1000000){
alert("Amount must be between 1 and 1,000,000");
return;
}

await fetch(`https://budgeting-app-1-8977.onrender.com/transactions/${editing.id}`,{
method:"PUT",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
...editing,
description:description,
amount:numAmount
})
});

setEditing(null);
fetchTransactions();

};


const confirmDelete = async ()=>{

if(!deleteId) return;

await fetch(`https://budgeting-app-1-8977.onrender.com/transactions/${deleteId}`,{
method:"DELETE"
});

setDeleteId(null);
fetchTransactions();

};


return(

<Layout>

<h1 className="text-5xl font-bold mb-10">
Transactions
</h1>

<div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8">

<table className="w-full text-left text-xl">

<thead className="border-b text-2xl font-semibold">
<tr>
<th className="py-4">Date</th>
<th>Description</th>
<th>Amount</th>
<th>Type</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

{loading ? (
<tr>
<td colSpan="5" className="py-10 text-center text-xl">
Loading...
</td>
</tr>

) : transactions.length===0 ? (

<tr>
<td colSpan="5" className="py-10 text-center text-xl">
No transactions found
</td>
</tr>

) : (

transactions.map((t)=>(
<tr key={t.id} className="border-b hover:bg-gray-50 transition">

<td className="py-5">{t.date}</td>
<td>{t.description}</td>
<td className="font-semibold">{t.amount}</td>
<td className="capitalize">{t.type}</td>

<td className="flex gap-3 py-5">

<button
className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
onClick={()=>openEdit(t)}
>
Edit
</button>

<button
className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
onClick={(e)=>{
e.stopPropagation();
setDeleteId(t.id);
}}
>
Delete
</button>

</td>

</tr>
))

)}

</tbody>

</table>

</div>


{editing && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white p-8 rounded-xl w-96 space-y-4">

<h2 className="text-2xl font-bold">Edit Transaction</h2>

<input
className="w-full border p-2 rounded"
value={description}
maxLength={30}
onChange={e=>setDescription(e.target.value)}
placeholder="Description (max 30 chars)"
/>

<input
className="w-full border p-2 rounded"
type="number"
min="1"
max="1000000"
value={amount}
onChange={e=>setAmount(e.target.value)}
placeholder="Amount"
/>

<div className="flex gap-3 justify-end">

<button
className="px-4 py-2 bg-gray-400 text-white rounded"
onClick={()=>setEditing(null)}
>
Cancel
</button>

<button
className="px-4 py-2 bg-blue-500 text-white rounded"
onClick={saveEdit}
>
Save
</button>

</div>

</div>

</div>

)}


{deleteId && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white p-8 rounded-xl w-80 text-center space-y-4">

<h2 className="text-xl font-bold">
Delete this transaction?
</h2>

<div className="flex justify-center gap-4">

<button
className="px-4 py-2 bg-gray-400 text-white rounded"
onClick={()=>setDeleteId(null)}
>
Cancel
</button>

<button
className="px-4 py-2 bg-red-500 text-white rounded"
onClick={confirmDelete}
>
Delete
</button>

</div>

</div>

</div>

)}

</Layout>

);

}

export default Transactions;