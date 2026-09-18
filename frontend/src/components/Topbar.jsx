import { Menu, Search } from "lucide-react";

export default function Topbar({ title, search, setSearch, openMenu }) {
  return (
    <div className="topbar">
      <button className="mobile-menu" onClick={openMenu} aria-label="Open menu"><Menu size={22}/></button>
      <h2>{title}</h2>
      <div className="search">
        <Search size={18}/>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patients, doctors, appointments..."
          aria-label="Global search"
        />
      </div>
    </div>
  );
}