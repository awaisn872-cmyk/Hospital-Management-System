import { useEffect, useState } from "react";
import { api } from "../services/api";
import Message from "../components/Message";

const empty={id:"",patientId:"",doctorId:"",datetime:""};

export default function Appointments({search, refreshDashboard, onBill}) {
  const [form,setForm]=useState(empty),[items,setItems]=useState([]),[patients,setPatients]=useState([]),[doctors,setDoctors]=useState([]),[message,setMessage]=useState("");
  async function load(){try{const [a,p,d]=await Promise.all([api.appointments.list(search),api.patients.list(),api.doctors.list()]);setItems(a);setPatients(p);setDoctors(d);}catch(e){setMessage(e.message);}}
  useEffect(()=>{load();},[search]);
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  async function submit(e){e.preventDefault();try{if(form.id)await api.appointments.update(form.id,form);else await api.appointments.create(form);setForm(empty);setMessage("Appointment saved successfully.");await load();refreshDashboard();}catch(e){setMessage(e.message);}}
  async function remove(id){if(!confirm("Cancel appointment?"))return;try{await api.appointments.remove(id);setMessage("Appointment cancelled.");await load();refreshDashboard();}catch(e){setMessage(e.message);}}
  return <div className="card">
    <div className="section-heading"><h3>Appointments</h3><Message>{message}</Message></div>
    <form onSubmit={submit} className="form-grid">
      <div><label>Patient</label><select name="patientId" value={form.patientId} onChange={change} required><option value="">Select patient</option>{patients.map(p=><option key={p._id} value={p._id}>{p.name}</option>)}</select></div>
      <div><label>Doctor</label><select name="doctorId" value={form.doctorId} onChange={change} required><option value="">Select doctor</option>{doctors.map(d=><option key={d._id} value={d._id}>{d.name} ({d.spec||"General"})</option>)}</select></div>
      <div><label>Date & Time</label><input name="datetime" type="datetime-local" value={form.datetime} onChange={change} required /></div>
      <div className="form-actions"><button className="btn primary">Book Appointment</button><button type="button" className="btn ghost" onClick={()=>setForm(empty)}>Reset</button></div>
    </form>
    <div className="list table-wrap"><table><thead><tr><th>When</th><th>Patient</th><th>Doctor</th><th>Fee</th><th>Actions</th></tr></thead>
      <tbody>{items.map(a=><tr key={a._id}><td>{new Date(a.datetime).toLocaleString()}</td><td>{a.patient?.name||"Deleted patient"}</td><td>{a.doctor?.name||"Deleted doctor"}</td><td>Rs. {Number(a.doctor?.fee||0).toLocaleString()}</td><td className="actions"><button className="btn primary" onClick={()=>onBill(a)}>Bill</button><button className="btn danger" onClick={()=>remove(a._id)}>Cancel</button></td></tr>)}</tbody>
    </table></div>
  </div>;
}