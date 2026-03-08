import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Transactions() {

const [transactions,setTransactions] = useState([]);
const [loading,setLoading] = useState(true);

const fetchTransactions = () => {

const email = localStorage.getItem("email");

fetch("http://localhost:8080/transactions/list?email=" + email)
.then(res=>res.json())
.then(data=>{

if(Array.isArray(data)){
setTransactions(data);
}else{
setTransactions([]);
}

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


const deleteTransaction = async (id) => {

await fetch(`http://localhost:8080/transactions/${id}`,{
method:"DELETE"
});

fetchTransactions();

};


const editTransaction = async (transaction) => {

const newDescription = prompt("Edit description",transaction.description);
const newAmount = prompt("Edit amount",transaction.amount);

await fetch(`http://localhost:8080/transactions/${transaction.id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
...transaction,
description:newDescription,
amount:newAmount
})
});

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

) : transactions.length === 0 ? (

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
className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-base font-medium"
onClick={()=>editTransaction(t)}
>
Edit
</button>

<button
className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-base font-medium"
onClick={()=>deleteTransaction(t.id)}
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

</Layout>

);

}

export default Transactions;