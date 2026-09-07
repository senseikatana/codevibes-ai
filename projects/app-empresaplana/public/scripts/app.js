(function(){
  "use strict";

  // DATA
  var busRoutes = [
    { id:'L-42', name:'Barcelona – Girona', color:'#0066cc', driver:'Joan García', status:'active', delay:0, speed:72, passengers:28, capacity:55, nextStop:'Granollers', path:[[41.3851,2.1734],[41.45,2.2],[41.6,2.3],[41.75,2.5],[41.9,2.7],[41.98,2.82]] },
    { id:'L-15', name:'Tarragona – Reus', color:'#cc6600', driver:'Maria López', status:'active', delay:3, speed:58, passengers:15, capacity:40, nextStop:'Vila-seca', path:[[41.1189,1.2445],[41.15,1.22],[41.12,1.15],[41.10,1.10]] },
    { id:'L-08', name:'Lleida – Balaguer', color:'#6633cc', driver:'Pere Martí', status:'delayed', delay:12, speed:45, passengers:22, capacity:50, nextStop:'Almacelles', path:[[41.6175,0.6300],[41.65,0.68],[41.70,0.75],[41.75,0.82]] },
    { id:'L-23', name:'Girona – Figueres', color:'#009966', driver:'Anna Puig', status:'active', delay:0, speed:65, passengers:18, capacity:45, nextStop:'Banyoles', path:[[41.98,2.82],[42.1,2.85],[42.2,2.9],[42.27,2.96]] },
    { id:'L-05', name:'Manresa – Vic', color:'#cc3366', driver:'Jordi Vila', status:'stopped', delay:0, speed:0, passengers:12, capacity:35, nextStop:'Manresa (estació)', path:[[41.7275,1.8275],[41.8,2.0],[41.85,2.15],[41.87,2.25]] }
  ];

  var notifications = [
    { type:'delay', title:'Retard L-42', desc:'Accident C-25 · +5 minuts', time:'Fa 3 min', unread:true },
    { type:'accident', title:'Accident C-35', desc:'Tall de carril direcció Girona', time:'Fa 12 min', unread:true },
    { type:'detour', title:'Desviament L-08', desc:'Obres a la N-II · Ruta alternativa activa', time:'Fa 25 min', unread:true },
    { type:'info', title:'Inici de servei', desc:'Totes les línies actives · Bon dia!', time:'Fa 1h', unread:false }
  ];

  var routes = busRoutes.map(function(b){ return { id:b.id, name:b.name, driver:b.driver, status:b.status, color:b.color }; });
  var stops = [
    { name:'Granollers', address:'Av. Catalunya 42', routes:'L-42' },
    { name:'Vila-seca', address:'C. Major 15', routes:'L-15' },
    { name:'Almacelles', address:'Pl. de l\'Església', routes:'L-08' },
    { name:'Banyoles', address:'C. de la Indústria 8', routes:'L-23' },
    { name:'Manresa (estació)', address:'Pl. de les Palmeres 1', routes:'L-05' }
  ];
  var schedules = [
    { route:'L-42', dep:'06:30', arr:'08:15', freq:'Cada 30min', days:'Ll-X' },
    { route:'L-15', dep:'07:00', arr:'07:45', freq:'Cada 45min', days:'Ll-D' },
    { route:'L-08', dep:'06:00', arr:'07:30', freq:'Cada 60min', days:'Ll-V' },
    { route:'L-23', dep:'08:00', arr:'09:00', freq:'Cada 45min', days:'Ll-X' },
    { route:'L-05', dep:'07:30', arr:'08:15', freq:'Cada 60min', days:'Ll-V' }
  ];
  var drivers = [
    { name:'Joan García', phone:'612 345 678', license:'D', bus:'L-42', status:'Actiu' },
    { name:'Maria López', phone:'623 456 789', license:'D', bus:'L-15', status:'Actiu' },
    { name:'Pere Martí', phone:'634 567 890', license:'D', bus:'L-08', status:'Retard' },
    { name:'Anna Puig', phone:'645 678 901', license:'D', bus:'L-23', status:'Actiu' },
    { name:'Jordi Vila', phone:'656 789 012', license:'D', bus:'L-05', status:'Aturat' }
  ];

  // NAV
  var currentView = 'dashboard';
  var titles = { dashboard:'Dashboard', map:'Mapa en viu', routes:'Rutes', buses:'Autobusos', stops:'Parades', schedules:'Horaris', drivers:'Conductors', notifications:'Notificacions', reports:'Reportes' };

  function switchView(v){
    currentView = v;
    document.querySelectorAll('.view').forEach(function(el){ el.classList.remove('active'); });
    document.getElementById('view-'+v).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(function(el){ el.classList.toggle('active', el.dataset.view === v); });
    document.getElementById('pageTitle').textContent = titles[v] || v;
    if (v === 'map') setTimeout(function(){ if (window.mainMap) window.mainMap.invalidateSize(); }, 100);
  }
  window.switchView = switchView;

  document.querySelectorAll('.nav-item').forEach(function(item){
    item.addEventListener('click', function(){ switchView(item.dataset.view); });
  });

  // SIDEBAR TOGGLE
  document.getElementById('toggleSidebar').addEventListener('click', function(){
    document.getElementById('sidebar').classList.toggle('collapsed');
  });

  // RENDER TABLES
  function renderRoutes(){
    var tbody = document.getElementById('routesTable');
    tbody.innerHTML = routes.map(function(r){
      var sc = r.status==='active'?'active':r.status==='delayed'?'delayed':'stopped';
      var st = r.status==='active'?'Activa':r.status==='delayed'?'Amb retard':'Aturada';
      return '<tr><td><strong style="color:'+r.color+'">'+r.id+'</strong></td><td>'+r.name+'</td><td>'+r.driver+'</td><td><span class="status-pill '+sc+'"><span class="status-dot"></span>'+st+'</span></td><td><button class="btn btn-secondary btn-sm" onclick="showToast(\'info\',\'Editar\',\'Editant '+r.id+'\')"><i class="fas fa-edit"></i></button></td></tr>';
    }).join('');
  }

  function renderBuses(){
    var tbody = document.getElementById('busesTable');
    tbody.innerHTML = busRoutes.map(function(b){
      var sc = b.status==='active'?'active':b.status==='delayed'?'delayed':'stopped';
      var st = b.status==='active'?'Actiu':b.status==='delayed'?'Retard':'Aturat';
      return '<tr><td><strong>'+b.id+'</strong></td><td>'+b.name+'</td><td>'+b.driver+'</td><td>'+b.passengers+'/'+b.capacity+'</td><td><span class="status-pill '+sc+'"><span class="status-dot"></span>'+st+'</span></td><td><button class="btn btn-secondary btn-sm"><i class="fas fa-edit"></i></button></td></tr>';
    }).join('');
  }

  function renderStops(){
    var tbody = document.getElementById('stopsTable');
    tbody.innerHTML = stops.map(function(s){
      return '<tr><td><strong>'+s.name+'</strong></td><td>'+s.address+'</td><td>'+s.routes+'</td><td><button class="btn btn-secondary btn-sm"><i class="fas fa-edit"></i></button></td></tr>';
    }).join('');
  }

  function renderSchedules(){
    var tbody = document.getElementById('schedulesTable');
    tbody.innerHTML = schedules.map(function(s){
      return '<tr><td><strong>'+s.route+'</strong></td><td>'+s.dep+'</td><td>'+s.arr+'</td><td>'+s.freq+'</td><td>'+s.days+'</td><td><button class="btn btn-secondary btn-sm"><i class="fas fa-edit"></i></button></td></tr>';
    }).join('');
  }

  function renderDrivers(){
    var tbody = document.getElementById('driversTable');
    tbody.innerHTML = drivers.map(function(d){
      var sc = d.status==='Actiu'?'active':d.status==='Retard'?'delayed':'stopped';
      return '<tr><td><strong>'+d.name+'</strong></td><td>'+d.phone+'</td><td>'+d.license+'</td><td>'+d.bus+'</td><td><span class="status-pill '+sc+'"><span class="status-dot"></span>'+d.status+'</span></td><td><button class="btn btn-secondary btn-sm"><i class="fas fa-edit"></i></button></td></tr>';
    }).join('');
  }

  function renderNotifications(){
    var list = document.getElementById('notificationsList');
    list.innerHTML = notifications.map(function(n){
      return '<div class="notif-item'+(n.unread?' unread':'')+'"><div class="notif-icon '+n.type+'"><i class="fas fa-'+(n.type==='delay'?'clock':n.type==='accident'?'exclamation-triangle':n.type==='detour'?'road':'info-circle')+'"></i></div><div class="notif-content"><div class="notif-title">'+n.title+'</div><div class="notif-desc">'+n.desc+'</div><div class="notif-meta">'+n.time+'</div></div></div>';
    }).join('');
  }

  function renderDashboardNotifs(){
    var list = document.getElementById('dashboardNotifs');
    list.innerHTML = notifications.slice(0,3).map(function(n){
      return '<div class="notif-item'+(n.unread?' unread':'')+'"><div class="notif-icon '+n.type+'"><i class="fas fa-'+(n.type==='delay'?'clock':n.type==='accident'?'exclamation-triangle':'info-circle')+'"></i></div><div class="notif-content"><div class="notif-title">'+n.title+'</div><div class="notif-desc">'+n.desc+'</div></div></div>';
    }).join('');
  }

  function renderUpcoming(){
    var el = document.getElementById('upcomingDepartures');
    el.innerHTML = busRoutes.filter(function(b){return b.status!=='stopped'}).map(function(b){
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)"><div><strong style="color:'+b.color+'">'+b.id+'</strong> <span style="font-size:12px;color:var(--text-secondary)">'+b.name+'</span></div><div style="font-size:12px;color:var(--text-secondary)">'+b.nextStop+'</div></div>';
    }).join('');
  }

  function renderCharts(){
    var pChart = document.getElementById('passengersChart');
    var maxP = Math.max.apply(null, busRoutes.map(function(b){return b.passengers}));
    pChart.innerHTML = busRoutes.map(function(b){
      var h = (b.passengers/maxP*100);
      return '<div class="bar" style="height:'+h+'%"><div class="bar-value">'+b.passengers+'</div><div class="bar-label">'+b.id+'</div></div>';
    }).join('');

    var oChart = document.getElementById('occupancyChart');
    oChart.innerHTML = busRoutes.map(function(b){
      var pct = Math.round(b.passengers/b.capacity*100);
      return '<div class="progress-item"><label><span>'+b.id+'</span><span>'+pct+'%</span></label><div class="progress-bar"><div class="progress-fill" style="width:'+pct+'%"></div></div></div>';
    }).join('');
  }

  // TOAST
  function showToast(type, title, msg){
    var c = document.getElementById('toastContainer');
    var t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = '<i class="fas fa-'+(type==='success'?'check-circle':type==='error'?'times-circle':'info-circle')+' toast-icon" style="color:var(--'+(type==='success'?'success':type==='error'?'danger':'primary')+')"></i><div class="toast-content"><div class="toast-title">'+title+'</div><div class="toast-message">'+msg+'</div></div>';
    c.appendChild(t);
    setTimeout(function(){ t.remove(); }, 3000);
  }
  window.showToast = showToast;

  // MODAL
  function openModal(type){
    document.getElementById('modalOverlay').classList.add('show');
    document.getElementById('modalTitle').textContent = 'Nou ' + type;
  }
  window.openModal = openModal;

  // MAP
  var map, busMarkers = {};

  function initMap(){
    map = L.map('map', { center:[41.5,2.1], zoom:8, zoomControl:false });
    window.mainMap = map;
    L.control.zoom({ position:'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OpenStreetMap', maxZoom:19 }).addTo(map);

    busRoutes.forEach(function(bus){
      var line = L.polyline(bus.path, { color:bus.color, weight:4, opacity:.7, dashArray:bus.status==='stopped'?'5,10':null }).addTo(map);
      var marker = L.marker(bus.path[0], {
        icon: L.divIcon({ className:'', html:'<div style="width:40px;height:40px;background:'+bus.color+';border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;box-shadow:0 2px 10px rgba(0,0,0,.3)"><i class="fas fa-bus"></i></div>', iconSize:[40,40], iconAnchor:[20,20] })
      }).addTo(map);
      marker.bindPopup('<strong style="color:'+bus.color+'">'+bus.id+'</strong> '+bus.name+'<br><small>'+bus.driver+' · '+bus.passengers+'/'+bus.capacity+'</small>');
      busMarkers[bus.id] = { marker:marker, currentPos:0, direction:1 };
    });

    // Dashboard mini-map
    if (document.getElementById('dashboardMap')){
      var dmap = L.map('dashboardMap', { center:[41.5,2.1], zoom:7, zoomControl:false, attributionControl:false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19 }).addTo(dmap);
      busRoutes.forEach(function(bus){
        L.circleMarker(bus.path[0], { radius:6, fillColor:bus.color, color:'white', weight:2, fillOpacity:1 }).addTo(dmap).bindPopup(bus.id);
      });
    }
  }

  // SIMULATION
  setInterval(function(){
    if (currentView !== 'map') return;
    busRoutes.forEach(function(bus){
      if (bus.status === 'stopped') return;
      var bm = busMarkers[bus.id];
      if (!bm) return;
      bm.currentPos += 0.005 * bm.direction;
      if (bm.currentPos >= 1){ bm.currentPos = 1; bm.direction = -1; }
      if (bm.currentPos <= 0){ bm.currentPos = 0; bm.direction = 1; }
      var idx = Math.floor(bm.currentPos * (bus.path.length - 1));
      var nextIdx = Math.min(idx + 1, bus.path.length - 1);
      var frac = (bm.currentPos * (bus.path.length - 1)) - idx;
      var lat = bus.path[idx][0] + (bus.path[nextIdx][0] - bus.path[idx][0]) * frac;
      var lng = bus.path[idx][1] + (bus.path[nextIdx][1] - bus.path[idx][1]) * frac;
      bm.marker.setLatLng([lat, lng]);
      bus.speed = Math.max(0, 60 + Math.random() * 30);
      if (bus.status === 'delayed') bus.speed *= 0.7;
    });
  }, 1000);

  // INIT
  renderRoutes(); renderBuses(); renderStops(); renderSchedules(); renderDrivers();
  renderNotifications(); renderDashboardNotifs(); renderUpcoming(); renderCharts();
  if (document.getElementById('map')) initMap();
})();
