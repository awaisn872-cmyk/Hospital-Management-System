import { useEffect, useState } from "react";
import { api } from "../services/api";
import Message from "../components/Message";

const empty = { id: "", name: "", spec: "", fee: "" };

export default function Doctors({ search, refreshDashboard }) {
  const [form, setForm] = useState(empty);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  async function load() { try { setItems(await api.doctors.list(search)); } catch(e){setMessage(e.message);} }
  useEffect(()=>{load();},[search]);
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  async function submit(e){e.preventDefault();try{if(form.id)await api.doctors.update(form.id,form);else await api.doctors.create(form);setForm(empty);setMessage("Doctor saved successfully.");await load();refreshDashboard();}catch(e){setMessage(e.message);}}
  async function remove(id){if(!confirm("Delete doctor?"))return;try{await api.doctors.remove(id);setMessage("Doctor deleted.");await load();refreshDashboard();}catch(e){setMessage(e.message);}}
  return <div className="card">
    <div className="section-heading"><h3>Doctors</h3><Message>{message}</Message></div>
    <form onSubmit={submit} className="form-grid">
      <div><label>Name</label><input name="name" value={form.name} onChange={change} required /></div>
      <div><label>Specialization</label><input name="spec" value={form.spec} onChange={change} /></div>
      <div><label>Fee</label><input name="fee" type="number" min="0" value={form.fee} onChange={change} /></div>
      <div className="form-actions"><button className="btn primary">Save Doctor</button><button type="button" className="btn ghost" onClick={()=>setForm(empty)}>Reset</button></div>
    </form>
    <div className="list table-wrap"><table><thead><tr><th>Name</th><th>Specialization</th><th>Fee</th><th>Actions</th></tr></thead>
      <tbody>{items.map(d=><tr key={d._id}><td>{d.name}</td><td>{d.spec||""}</td><td>Rs. {Number(d.fee||0).toLocaleString()}</td><td className="actions"><button className="btn ghost" onClick={()=>setForm({...d,id:d._id})}>Edit</button><button className="btn danger" onClick={()=>remove(d._id)}>Delete</button></td></tr>)}</tbody>
    </table></div>
  </div>;
}