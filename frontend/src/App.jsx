import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import { api } from "./services/api";

const titles={dashboard:"Dashboard",patients:"Patients",doctors:"Doctors",appointments:"Appointments",billing:"Billing",settings:"Settings"};

export default function App(){
  const [view,setView]=useState("dashboard"),[search,setSearch]=useState(""),[menu,setMenu]=useState(false);
  const [stats,setStats]=useState({patients:0,doctors:0,appointments:0,revenue:0});
  const [selectedAppointment,setSelectedAppointment]=useState(null);

  async function refreshDashboard(){
    try{setStats(await api.dashboard());}catch(e){console.error(e);}
  }
  useEffect(()=>{refreshDashboard();},[]);
  function bill(a){setSelectedAppointment(a);setView("billing");setSearch("");}

  let content;
  if(view==="dashboard") content=<Dashboard stats={stats}/>;
  if(view==="patients") content=<Patients search={search} refreshDashboard={refreshDashboard}/>;
  if(view==="doctors") content=<Doctors search={search} refreshDashboard={refreshDashboard}/>;
  if(view==="appointments") content=<Appointments search={search} refreshDashboard={refreshDashboard} onBill={bill}/>;
  if(view==="billing") content=<Billing selectedAppointment={selectedAppointment} setSelectedAppointment={setSelectedAppointment} refreshDashboard={refreshDashboard}/>;
  if(view==="settings") content=<Settings/>;

  return <div className="app">
    <Sidebar view={view} setView={setView} open={menu} close={()=>setMenu(false)}/>
    <main className="main">
      <Topbar title={titles[view]} search={search} setSearch={setSearch} openMenu={()=>setMenu(true)}/>
      <div className="view-container">{content}</div>
    </main>
  </div>;
}