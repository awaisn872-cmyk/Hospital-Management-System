    // Simple single-file web HMS using localStorage
    const STORE_KEY = 'webhms_v1';

    function loadStore(){
      try{ return JSON.parse(localStorage.getItem(STORE_KEY)) || {patients:[], doctors:[], appointments:[], invoices:[], revenue:0}}catch(e){return {patients:[], doctors:[], appointments:[], invoices:[], revenue:0}}
    }
    function saveStore(s){ localStorage.setItem(STORE_KEY, JSON.stringify(s)); }
    let store = loadStore();

    // Helpers
    const uid = ()=> Date.now().toString(36)+Math.random().toString(36).slice(2,6);

    // Views and navigation
    const navButtons = document.querySelectorAll('.nav button');
    const viewTitle = document.getElementById('view-title');
    const viewContainer = document.getElementById('view-container');
    const templates = {};
    document.querySelectorAll('template').forEach(t=>templates[t.id.replace('tpl-','')]=t);

    function setActiveView(view){
      navButtons.forEach(b=>b.classList.toggle('active', b.dataset.view===view));
      viewTitle.textContent = view.charAt(0).toUpperCase()+view.slice(1);
      renderView(view);
    }

    navButtons.forEach(b=>b.addEventListener('click', ()=> setActiveView(b.dataset.view)));
    document.getElementById('globalSearch').addEventListener('input', e=> renderView(getCurrentView()));

    function getCurrentView(){return document.querySelector('.nav button.active').dataset.view}

    // Render functions
    function renderView(view){
      viewContainer.innerHTML = '';
      const tpl = templates[view];
      if(!tpl) return viewContainer.textContent = 'Not available';
      viewContainer.appendChild(tpl.content.cloneNode(true));

      // after insert, bind behavior
      if(view==='dashboard') return renderDashboard();
      if(view==='patients') return bindPatients();
      if(view==='doctors') return bindDoctors();
      if(view==='appointments') return bindAppointments();
      if(view==='billing') return bindBilling();
    }

    function renderDashboard(){
      document.getElementById('stat-patients').textContent = store.patients.length;
      document.getElementById('stat-doctors').textContent = store.doctors.length;
      document.getElementById('stat-appointments').textContent = store.appointments.length;
      document.getElementById('stat-revenue').textContent = store.revenue || 0;
    }

    // PATIENTS
    function bindPatients(){
      const form = document.getElementById('patientForm');
      const tableBody = document.querySelector('#patientsTable tbody');
      const resetBtn = document.getElementById('patientReset');

      function renderList(){
        tableBody.innerHTML = '';
        const q = document.getElementById('globalSearch').value.toLowerCase();
        store.patients.filter(p=> (p.name||'').toLowerCase().includes(q) || (p.phone||'').includes(q)).forEach(p=>{
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${escapeHtml(p.name)}</td><td>${escapeHtml(p.phone||'')}</td><td>${p.age||''}</td><td>${p.gender||''}</td><td class="actions"></td>`;
          const actions = tr.querySelector('.actions');
          const edit = document.createElement('button'); edit.className='btn ghost'; edit.textContent='Edit'; edit.addEventListener('click', ()=> fill(p));
          const del = document.createElement('button'); del.className='btn'; del.textContent='Delete'; del.addEventListener('click', ()=>{ if(confirm('Delete patient?')){ store.patients = store.patients.filter(x=>x.id!==p.id); saveStore(store); renderList(); } });
          actions.appendChild(edit); actions.appendChild(del);
          tableBody.appendChild(tr);
        })
      }

      function fill(p){
        form.id.value = p.id; form.name.value = p.name; form.phone.value = p.phone; form.age.value = p.age; form.gender.value = p.gender;
      }

      form.addEventListener('submit', e=>{
        e.preventDefault();
        const data = {id: form.id.value || uid(), name: form.name.value.trim(), phone: form.phone.value.trim(), age: form.age.value, gender: form.gender.value};
        const exists = store.patients.find(x=>x.id===data.id);
        if(exists){ Object.assign(exists, data);} else store.patients.push(data);
        saveStore(store); form.reset(); renderList();
      })

      resetBtn.addEventListener('click', ()=> form.reset());
      renderList();
    }

    // DOCTORS
    function bindDoctors(){
      const form = document.getElementById('doctorForm');
      const tableBody = document.querySelector('#doctorsTable tbody');
      const resetBtn = document.getElementById('doctorReset');

      function renderList(){
        tableBody.innerHTML = '';
        const q = document.getElementById('globalSearch').value.toLowerCase();
        store.doctors.filter(d=> (d.name||'').toLowerCase().includes(q) || (d.spec||'').toLowerCase().includes(q)).forEach(d=>{
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${escapeHtml(d.name)}</td><td>${escapeHtml(d.spec||'')}</td><td>${d.fee||''}</td><td class="actions"></td>`;
          const actions = tr.querySelector('.actions');
          const edit = document.createElement('button'); edit.className='btn ghost'; edit.textContent='Edit'; edit.addEventListener('click', ()=> fill(d));
          const del = document.createElement('button'); del.className='btn'; del.textContent='Delete'; del.addEventListener('click', ()=>{ if(confirm('Delete doctor?')){ store.doctors = store.doctors.filter(x=>x.id!==d.id); saveStore(store); renderList(); } });
          actions.appendChild(edit); actions.appendChild(del);
          tableBody.appendChild(tr);
        })
      }

      function fill(d){
        form.id.value = d.id; form.name.value = d.name; form.spec.value = d.spec; form.fee.value = d.fee;
      }

      form.addEventListener('submit', e=>{
        e.preventDefault();
        const data = {id: form.id.value || uid(), name: form.name.value.trim(), spec: form.spec.value.trim(), fee: parseFloat(form.fee.value)||0};
        const exists = store.doctors.find(x=>x.id===data.id);
        if(exists){ Object.assign(exists, data);} else store.doctors.push(data);
        saveStore(store); form.reset(); renderList();
      })

      resetBtn.addEventListener('click', ()=> form.reset());
      renderList();
    }

    // APPOINTMENTS
    function bindAppointments(){
      const form = document.getElementById('appointmentForm');
      const tableBody = document.querySelector('#appointmentsTable tbody');
      const resetBtn = document.getElementById('appointmentReset');

      function populateSelects(){
        const psel = form.patientId; const dsel = form.doctorId;
        psel.innerHTML = '<option value=""></option>' + store.patients.map(p=>`<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('');
        dsel.innerHTML = '<option value=""></option>' + store.doctors.map(d=>`<option value="${d.id}">${escapeHtml(d.name)} (${escapeHtml(d.spec||'')})</option>`).join('');
      }

      function renderList(){
        tableBody.innerHTML = '';
        const q = document.getElementById('globalSearch').value.toLowerCase();
        store.appointments.sort((a,b)=> new Date(a.datetime)-new Date(b.datetime)).filter(ap=>{
          const p = store.patients.find(x=>x.id===ap.patientId)||{}; const d = store.doctors.find(x=>x.id===ap.doctorId)||{};
          return (p.name||'').toLowerCase().includes(q) || (d.name||'').toLowerCase().includes(q) || (ap.datetime||'').includes(q);
        }).forEach(ap=>{
          const p = store.patients.find(x=>x.id===ap.patientId)||{}; const d = store.doctors.find(x=>x.id===ap.doctorId)||{};
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${formatDate(ap.datetime)}</td><td>${escapeHtml(p.name||'')}</td><td>${escapeHtml(d.name||'')}</td><td>${d.fee||''}</td><td class="actions"></td>`;
          const actions = tr.querySelector('.actions');
          const bill = document.createElement('button'); bill.className='btn primary'; bill.textContent='Bill'; bill.addEventListener('click', ()=> generateInvoice(ap));
          const del = document.createElement('button'); del.className='btn'; del.textContent='Cancel'; del.addEventListener('click', ()=>{ if(confirm('Cancel appointment?')){ store.appointments = store.appointments.filter(x=>x.id!==ap.id); saveStore(store); renderList(); } });
          actions.appendChild(bill); actions.appendChild(del);
          tableBody.appendChild(tr);
        })
      }

      form.addEventListener('submit', e=>{
        e.preventDefault();
        const data = {id: form.id.value || uid(), patientId: form.patientId.value, doctorId: form.doctorId.value, datetime: form.datetime.value};
        const exists = store.appointments.find(x=>x.id===data.id);
        if(exists){ Object.assign(exists, data);} else store.appointments.push(data);
        saveStore(store); form.reset(); populateSelects(); renderList();
      })

      resetBtn.addEventListener('click', ()=>{ form.reset(); populateSelects(); });
      populateSelects(); renderList();
    }

    // BILLING
    function bindBilling(){
      const tbody = document.querySelector('#billingAppointments tbody');
      const billPreview = document.getElementById('billPreview');
      const printBtn = document.getElementById('printBill');
      const savePayment = document.getElementById('savePayment');

      function renderList(){
        tbody.innerHTML = '';
        store.appointments.sort((a,b)=> new Date(a.datetime)-new Date(b.datetime)).forEach(ap=>{
          const p = store.patients.find(x=>x.id===ap.patientId)||{}; const d = store.doctors.find(x=>x.id===ap.doctorId)||{};
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${formatDate(ap.datetime)}</td><td>${escapeHtml(p.name||'')}</td><td>${escapeHtml(d.name||'')}</td><td class="actions"></td>`;
          const actions = tr.querySelector('.actions');
          const gen = document.createElement('button'); gen.className='btn primary'; gen.textContent='Generate'; gen.addEventListener('click', ()=> showBill(ap));
          actions.appendChild(gen);
          tbody.appendChild(tr);
        })
      }

      function showBill(ap){
        const p = store.patients.find(x=>x.id===ap.patientId)||{}; const d = store.doctors.find(x=>x.id===ap.doctorId)||{};
        const invoice = {id: uid(), appointmentId: ap.id, patient: p, doctor: d, datetime: ap.datetime, doctorFee: d.fee||0, others:0, total: (d.fee||0)};
        billPreview.innerHTML = billHtml(invoice);
        printBtn.onclick = ()=> window.print();
        savePayment.onclick = ()=>{ store.invoices.push(invoice); store.revenue = (store.revenue||0) + invoice.total; saveStore(store); alert('Payment saved'); renderDashboard(); }
      }

      function generateInvoice(ap){ showBill(ap); setActiveView('billing'); }

      renderList();
    }

    // Utilities
    function escapeHtml(str){ if(!str) return ''; return String(str).replace(/[&<>"']/g, s=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s])); }
    function formatDate(dt){ if(!dt) return ''; try{ const d=new Date(dt); return d.toLocaleString(); }catch(e){return dt} }
    function billHtml(inv){
      return `<div><strong>Invoice</strong><div class="muted">When: ${formatDate(inv.datetime)}</div><hr><div><b>Patient:</b> ${escapeHtml(inv.patient.name||'')}</div><div><b>Doctor:</b> ${escapeHtml(inv.doctor.name||'')}</div><div style="margin-top:8px"><b>Doctor Fee:</b> ${inv.doctorFee}</div><div><b>Other Charges:</b> ${inv.others}</div><div style="margin-top:10px; font-size:18px"><b>Total:</b> ${inv.total}</div></div>`;
    }

    // initialize
    setActiveView('dashboard');

    // expose small helper to console for debugging
    window._webhms = {store, saveStore, loadStore};
  