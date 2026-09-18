import { useEffect, useState } from "react";
import { api } from "../services/api";
import Message from "../components/Message";

const empty = { id: "", name: "", phone: "", age: "", gender: "" };

export default function Patients({ search, refreshDashboard }) {
  const [form, setForm] = useState(empty);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  async function load() {
    try { setItems(await api.patients.list(search)); }
    catch (e) { setMessage(e.message); }
  }
  useEffect(() => { load(); }, [search]);

  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function submit(e) {
    e.preventDefault();
    try {
      if (form.id) await api.patients.update(form.id, form);
      else await api.patients.create(form);
      setForm(empty); setMessage("Patient saved successfully."); await load(); refreshDashboard();
    } catch (e) { setMessage(e.message); }
  }

  async function remove(id) {
    if (!confirm("Delete patient?")) return;
    try { await api.patients.remove(id); setMessage("Patient deleted."); await load(); refreshDashboard(); }
    catch (e) { setMessage(e.message); }
  }

  return <div className="card">
    <div className="section-heading"><h3>Patients</h3><Message>{message}</Message></div>
    <form onSubmit={submit} className="form-grid">
      <input type="hidden" value={form.id}/>
      <div><label>Name</label><input name="name" value={form.name} onChange={change} required /></div>
      <div><label>Phone</label><input name="phone" value={form.phone} onChange={change} /></div>
      <div><label>Age</label><input name="age" type="number" min="0" value={form.age} onChange={change} /></div>
      <div><label>Gender</label><select name="gender" value={form.gender} onChange={change}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></select></div>
      <div className="form-actions"><button className="btn primary">Save Patient</button><button type="button" className="btn ghost" onClick={() => setForm(empty)}>Reset</button></div>
    </form>
    <div className="list table-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Age</th><th>Gender</th><th>Actions</th></tr></thead>
      <tbody>{items.map(p => <tr key={p._id}><td>{p.name}</td><td>{p.phone || ""}</td><td>{p.age ?? ""}</td><td>{p.gender || ""}</td><td className="actions"><button className="btn ghost" onClick={() => setForm({...p, id:p._id})}>Edit</button><button className="btn danger" onClick={() => remove(p._id)}>Delete</button></td></tr>)}</tbody>
    </table></div>
  </div>;
}