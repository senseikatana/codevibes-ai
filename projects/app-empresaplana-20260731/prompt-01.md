```html
<!DOCTYPE html>
<html lang="ca">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Empresa Plana - Transport Públic de Catalunya</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', system-ui, sans-serif; }
  
  body { overflow: hidden; background: #0a0e27; }
  
  #map {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 1;
  }
  
  .top-bar {
    position: absolute;
    top: 16px; left: 16px; right: 16px;
    z-index: 1000;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    pointer-events: none;
  }
  
  .top-bar > * { pointer-events: auto; }
  
  .search-panel {
    background: white;
    border-radius: 16px;
    padding: 12px 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    flex: 1;
    max-width: 480px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .search-panel input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    color: #333;
  }
  
  .search-panel i { color: #666; font-size: 18px; }
  
  .btn-icon {
    background: white;
    border: none;
    width: 48px; height: 48px;
    border-radius: 14px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #333;
    transition: all 0.2s;
  }
  
  .btn-icon:hover { transform: scale(1.05); background: #f5f5f5; }
  .btn-icon.active { background: #0066cc; color: white; }
  
  .role-switcher {
    position: absolute;
    bottom: 16px; left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    background: white;
    border-radius: 16px;
    padding: 6px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    display: flex;
    gap: 4px;
  }
  
  .role-btn {
    padding: 10px 20px;
    border: none;
    background: transparent;
    border-radius: 12px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: #666;
    transition: all 0.2s;
  }
  
  .role-btn.active { background: #0066cc; color: white; }
  
  .side-panel {
    position: absolute;
    top: 80px; right: 16px;
    width: 340px;
    max-height: calc(100vh - 160px);
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    z-index: 1000;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .panel-header {
    padding: 16px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .panel-header h3 { font-size: 16px; color: #222; }
  
  .panel-content {
    overflow-y: auto;
    padding: 12px;
    flex: 1;
  }
  
  .bus-card {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s;
    border-left: 4px solid #0066cc;
  }
  
  .bus-card:hover { background: #eef4ff; transform: translateX(-2px); }
  .bus-card.active { background: #eef4ff; border-left-color: #00cc66; }
  
  .bus-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  
  .bus-number {
    font-weight: 700;
    color: #0066cc;
    font-size: 15px;
  }
  
  .status-badge {
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
  }
  
  .status-active { background: #d4f5e2; color: #0a8f4a; }
  .status-delayed { background: #ffe0d4; color: #c94a2a; }
  .status-stopped { background: #f0f0f0; color: #666; }
  
  .bus-route { font-size: 12px; color: #666; margin-bottom: 4px; }
  
  .bus-meta {
    display: flex;
    gap: 12px;
    font-size: 11px;
    color: #888;
  }
  
  .driver-panel {
    position: absolute;
    bottom: 90px; left: 16px;
    width: 360px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    z-index: 1000;
    overflow: hidden;
  }
  
  .driver-header {
    background: linear-gradient(135deg, #0066cc, #004a99);
    color: white;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .driver-header h3 { font-size: 15px; }
  
  .driver-body { padding: 16px; }
  
  .route-info {
    background: #f0f7ff;
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 12px;
  }
  
  .route-info-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    margin-bottom: 4px;
  }
  
  .route-info-row:last-child { margin-bottom: 0; }
  
  .route-info-label { color: #666; }
  .route-info-value { font-weight: 600; color: #222; }
  
  .action-btn {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
  }
  
  .btn-primary { background: #0066cc; color: white; }
  .btn-primary:hover { background: #004a99; }
  .btn-success { background: #00cc66; color: white; }
  .btn-success:hover { background: #00a852; }
  .btn-danger { background: #ff4444; color: white; }
  .btn-danger:hover { background: #cc2222; }
  .btn-secondary { background: #f0f0f0; color: #333; }
  .btn-secondary:hover { background: #e0e0e0; }
  
  .alert-panel {
    position: absolute;
    bottom: 90px; right: 16px;
    width: 320px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    z-index: 1000;
    padding: 16px;
  }
  
  .alert-panel h3 {
    font-size: 15px;
    margin-bottom: 4px;
    color: #222;
  }
  
  .alert-panel p {
    font-size: 12px;
    color: #666;
    margin-bottom: 12px;
  }
  
  .alert-options { display: flex; flex-direction: column; gap: 8px; }
  
  .alert-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .alert-option:hover { background: #f5f5f5; }
  
  .alert-option-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
  
  .alert-option-icon.camera { background: #e0f0ff; color: #0066cc; }
  .alert-option-icon.danger { background: #ffe0d4; color: #ff6633; }
  .alert-option-icon.toll { background: #f0f0f0; color: #666; }
  
  .alert-option-label { font-size: 13px; font-weight: 600; color: #333; }
  
  .alert-toggle {
    margin-left: auto;
    width: 40px; height: 22px;
    background: #ddd;
    border-radius: 11px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .alert-toggle.on { background: #00cc66; }
  
  .alert-toggle::after {
    content: '';
    position: absolute;
    top: 2px; left: 2px;
    width: 18px; height: 18px;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s;
  }
  
  .alert-toggle.on::after { transform: translateX(18px); }
  
  .live-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #00cc66;
    font-weight: 600;
  }
  
  .live-dot {
    width: 8px; height: 8px;
    background: #00cc66;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.3); }
  }
  
  .custom-marker {
    background: none;
    border: none;
  }
  
  .bus-marker {
    width: 40px; height: 40px;
    background: #0066cc;
    border: 3px solid white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    transition: all 0.3s;
  }
  
  .bus-marker.user-following {
    background: #00cc66;
    animation: markerPulse 2s infinite;
  }
  
  @keyframes markerPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0,204,102,0.5); }
    50% { box-shadow: 0 0 0 15px rgba(0,204,102,0); }
  }
  
  .hidden { display: none !important; }
  
  .notification {
    position: absolute;
    top: 80px; left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 13px;
    z-index: 2000;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: slideDown 0.3s;
  }
  
  @keyframes slideDown {
    from { opacity: 0; transform: translate(-50%, -20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  
  .sync-status {
    position: absolute;
    top: 80px; left: 16px;
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 11px;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  @media (max-width: 768px) {
    .side-panel { width: calc(100% - 32px); right: 16px; top: auto; bottom: 90px; max-height: 40vh; }
    .driver-panel { width: calc(100% - 32px); bottom: 90px; }
    .alert-panel { width: calc(100% - 32px); bottom: 90px; }
  }
</style>
</head>
<body>

<div id="map"></div>

<div class="top-bar">
  <div class="search-panel">
    <i class="fas fa-search"></i>
    <input type="text" id="searchInput" placeholder="Cercar localitat o adreça..." />
    <i class="fas fa-microphone"></i>
  </div>
  <button class="btn-icon" id="btnFilter" title="Filtres">
    <i class="fas fa-filter"></i>
  </button>
  <button class="btn-icon" id="btnLocate" title="La meva ubicació">
    <i class="fas fa-crosshairs"></i>
  </button>
</div>

<div class="sync-status">
  <span class="live-dot"></span>
  <span id="syncText">Sincronització en temps real · Activa</span>
</div>

<!-- Panel de llistat d'autobusos (vista usuari) -->
<div class="side-panel" id="userPanel">
  <div class="panel-header">
    <h3><i class="fas fa-bus" style="color:#0066cc;margin-right:8px;"></i>Línia d'autobusos</h3>
    <span class="live-indicator"><span class="live-dot"></span>EN VIU</span>
  </div>
  <div class="panel-content" id="busList"></div>
</div>

<!-- Panell del conductor -->
<div class="driver-panel hidden" id="driverPanel">
  <div class="driver-header">
    <div>
      <h3><i class="fas fa-id-card" style="margin-right:8px;"></i>Mode Conductor</h3>
      <div style="font-size:11px;opacity:0.8;margin-top:2px;">Joan García · L-42</div>
    </div>
    <span class="live-indicator"><span class="live-dot"></span>EMETENT</span>
  </div>
  <div class="driver-body">
    <div class="route-info">
      <div class="route-info-row">
        <span class="route-info-label">Línia</span>
        <span class="route-info-value">L-42 Barcelona–Girona</span>
      </div>
      <div class="route-info-row">
        <span class="route-info-label">Pròxima parada</span>
        <span class="route-info-value" id="nextStop">Granollers</span>
      </div>
      <div class="route-info-row">
        <span class="route-info-label">Velocitat</span>
        <span class="route-info-value" id="currentSpeed">72 km/h</span>
      </div>
      <div class="route-info-row">
        <span class="route-info-label">Retard</span>
        <span class="route-info-value" style="color:#00cc66;" id="delay">En horari</span>
      </div>
    </div>
    <button class="action-btn btn-success" id="btnStartRoute">
      <i class="fas fa-play"></i> Iniciar ruta
    </button>
    <button class="action-btn btn-secondary" id="btnAddStop">
      <i class="fas fa-map-marker-alt"></i> Marcar parada
    </button>
    <button class="action-btn btn-secondary" id="btnReportIncident">
      <i class="fas fa-exclamation-triangle"></i> Reportar incidència
    </button>
    <button class="action-btn btn-danger" id="btnStopRoute">
      <i class="fas fa-stop"></i> Aturar ruta
    </button>
  </div>
</div>

<!-- Panell d'alertes -->
<div class="alert-panel hidden" id="alertPanel">
  <h3>Alertes al mapa</h3>
  <p>Mostra o oculta càmeres, perills i peatges.</p>
  <div class="alert-options">
    <div class="alert-option" data-type="camera">
      <div class="alert-option-icon camera"><i class="fas fa-camera"></i></div>
      <span class="alert-option-label">Mostrar càmeres</span>
      <div class="alert-toggle on" id="toggleCamera"></div>
    </div>
    <div class="alert-option" data-type="danger">
      <div class="alert-option-icon danger"><i class="fas fa-exclamation-triangle"></i></div>
      <span class="alert-option-label">Mostrar perills</span>
      <div class="alert-toggle on" id="toggleDanger"></div>
    </div>
    <div class="alert-option" data-type="toll">
      <div class="alert-option-icon toll"><i class="fas fa-road"></i></div>
      <span class="alert-option-label">Mostrar peatges</span>
      <div class="alert-toggle on" id="toggleToll"></div>
    </div>
  </div>
</div>

<!-- Selector de rol -->
<div class="role-switcher">
  <button class="role-btn active" data-role="user"><i class="fas fa-user"></i> Usuari</button>
  <button class="role-btn" data-role="driver"><i class="fas fa-steering-wheel"></i> Conductor</button>
  <button class="role-btn" data-role="alerts"><i class="fas fa-bell"></i> Alertes</button>
</div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
// ============ INICIALITZACIÓ DEL MAPA ============
const map = L.map('map', {
  center: [41.5, 2.1],
  zoom: 8,
  zoomControl: false
});

L.control.zoom({ position: 'bottomright' }).addTo(map);

// Capa OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap · Empresa Plana',
  maxZoom: 19
}).addTo(map);

// Capa de transport públic
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  opacity: 0
}).addTo(map);

// ============ DADES SIMULADES ============
const busRoutes = [
  {
    id: 'L-42',
    name: 'Barcelona – Girona',
    color: '#0066cc',
    driver: 'Joan García',
    status: 'active',
    delay: 0,
    speed: 72,
    passengers: 28,
    capacity: 55,
    nextStop: 'Granollers',
    eta: '14:32',
    path: [
      [41.3851, 2.1734], [41.45, 2.2], [41.6, 2.3], [41.75, 2.5], [41.9, 2.7], [41.98, 2.82]
    ]
  },
  {
    id: 'L-15',
    name: 'Tarragona – Reus',
    color: '#cc6600',
    driver: 'Maria López',
    status: 'active',
    delay: 3,
    speed: 58,
    passengers: 15,
    capacity: 40,
    nextStop: 'Vila-seca',
    eta: '15:10',
    path: [
      [41.1189, 1.2445], [41.15, 1.22], [41.12, 1.15], [41.10, 1.10]
    ]
  },
  {
    id: 'L-08',
    name: 'Lleida – Balaguer',
    color: '#6633cc',
    driver: 'Pere Martí',
    status: 'delayed',
    delay: 12,
    speed: 45,
    passengers: 22,
    capacity: 50,
    nextStop: 'Almacelles',
    eta: '16:45',
    path: [
      [41.6175, 0.6300], [41.65, 0.68], [41.70, 0.75], [41.75, 0.82]
    ]
  },
  {
    id: 'L-23',
    name: 'Girona – Figueres',
    color: '#009966',
    driver: 'Anna Puig',
    status: 'active',
    delay: 0,
    speed: 65,
    passengers: 18,
    capacity: 45,
    nextStop: 'Banyoles',
    eta: '14:58',
    path: [
      [41.98, 2.82], [42.1, 2.85], [42.2, 2.9], [42.27, 2.96]
    ]
  },
  {
    id: 'L-05',
    name: 'Manresa – Vic',
    color: '#cc3366',
    driver: 'Jordi Vila',
    status: 'stopped',
    delay: 0,
    speed: 0,
    passengers: 12,
    capacity: 35,
    nextStop: 'Manresa (estació)',
    eta: '--:--',
    path: [
      [41.7275, 1.8275], [41.8, 2.0], [41.85, 2.15], [41.87, 2.25]
    ]
  }
];

// Alertes al mapa
const alerts = {
  camera: [
    { pos: [41.5, 2.2], label: 'Càmera AP-7 km 142' },
    { pos: [41.8, 2.6], label: 'Càmera C-35' },
    { pos: [41.2, 1.3], label: 'Càmera AP-2' }
  ],
  danger: [
    { pos: [41.65, 2.4], label: 'Accident C-25' },
    { pos: [41.3, 2.0], label: 'Obres A-2' }
  ],
  toll: [
    { pos: [41.55, 2.35], label: 'Peatge AP-7 Granollers' },
    { pos: [41.85, 2.7], label: 'Peatge AP-7 Girona' }
  ]
};

// ============ MARCADORS I RUTES ============
const busMarkers = {};
const routeLines = {};
let selectedBus = null;
let currentRole = 'user';

// Icona personalitzada per autobusos
function createBusIcon(bus, isFollowing = false) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="bus-marker ${isFollowing ? 'user-following' : ''}" style="background:${bus.color};">
             <i class="fas fa-bus"></i>
           </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
}

// Icones d'alertes
function createAlertIcon(type) {
  const colors = { camera: '#0066cc', danger: '#ff6633', toll: '#666' };
  const icons = { camera: 'fa-camera', danger: 'fa-exclamation-triangle', toll: 'fa-road' };
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:32px;height:32px;background:${colors[type]};border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">
             <i class="fas ${icons[type]}" style="font-size:14px;"></i>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

// Dibuixar rutes i marcadors
busRoutes.forEach(bus => {
  const line = L.polyline(bus.path, {
    color: bus.color,
    weight: 4,
    opacity: 0.7,
    dashArray: bus.status === 'stopped' ? '5,10' : null
  }).addTo(map);
  routeLines[bus.id] = line;

  const startPos = bus.path[0];
  const marker = L.marker(startPos, { icon: createBusIcon(bus) }).addTo(map);
  marker.bindPopup(`
    <div style="min-width:200px;">
      <strong style="color:${bus.color};font-size:15px;">${bus.id}</strong> ${bus.name}<br>
      <div style="margin-top:6px;font-size:12px;color:#666;">
        Conductor: ${bus.driver}<br>
        Estat: ${bus.status === 'active' ? ' En marxa' : bus.status === 'delayed' ? '🟡 Amb retard' : '⚪ Aturat'}<br>
        Passatgers: ${bus.passengers}/${bus.capacity}<br>
        Velocitat: ${bus.speed} km/h
      </div>
    </div>
  `);
  marker.on('click', () => selectBus(bus.id));
  busMarkers[bus.id] = { marker, currentPos: 0, direction: 1 };
});

// Dibuixar alertes
const alertMarkers = { camera: [], danger: [], toll: [] };
Object.keys(alerts).forEach(type => {
  alerts[type].forEach(a => {
    const m = L.marker(a.pos, { icon: createAlertIcon(type) }).addTo(map);
    m.bindPopup(`<strong>${a.label}</strong>`);
    alertMarkers[type].push(m);
  });
});

// ============ LLISTA D'AUTOBUSOS ============
function renderBusList() {
  const list = document.getElementById('busList');
  list.innerHTML = '';
  busRoutes.forEach(bus => {
    const statusClass = bus.status === 'active' ? 'status-active' : bus.status === 'delayed' ? 'status-delayed' : 'status-stopped';
    const statusText = bus.status === 'active' ? 'En marxa' : bus.status === 'delayed' ? 'Amb retard' : 'Aturat';
    const card = document.createElement('div');
    card.className = `bus-card ${selectedBus === bus.id ? 'active' : ''}`;
    card.innerHTML = `
      <div class="bus-card-header">
        <span class="bus-number" style="color:${bus.color};">${bus.id}</span>
        <span class="status-badge ${statusClass}">${statusText}</span>
      </div>
      <div class="bus-route">${bus.name}</div>
      <div class="bus-meta">
        <span><i class="fas fa-user"></i> ${bus.driver}</span>
        <span><i class="fas fa-users"></i> ${bus.passengers}/${bus.capacity}</span>
      </div>
      <div class="bus-meta" style="margin-top:4px;">
        <span><i class="fas fa-map-marker-alt"></i> ${bus.nextStop}</span>
        <span><i class="fas fa-clock"></i> ${bus.eta}</span>
      </div>
    `;
    card.onclick = () => selectBus(bus.id);
    list.appendChild(card);
  });
}

function selectBus(id) {
  selectedBus = id;
  const bus = busRoutes.find(b => b.id === id);
  if (bus) {
    map.flyTo(bus.path[Math.floor(bus.path.length / 2)], 11, { duration: 1 });
  }
  renderBusList();
  showNotification(`Seguint ${id} · ${bus.name}`);
}

renderBusList();

// ============ SIMULACIÓ EN TEMPS REAL ============
setInterval(() => {
  busRoutes.forEach(bus => {
    if (bus.status === 'stopped') return;
    const bm = busMarkers[bus.id];
    if (!bm) return;
    
    // Moure al llarg de la ruta
    bm.currentPos += 0.005 * bm.direction;
    if (bm.currentPos >= 1) { bm.currentPos = 1; bm.direction = -1; }
    if (bm.currentPos <= 0) { bm.currentPos = 0; bm.direction = 1; }
    
    const idx = Math.floor(bm.currentPos * (bus.path.length - 1));
    const nextIdx = Math.min(idx + 1, bus.path.length - 1);
    const frac = (bm.currentPos * (bus.path.length - 1)) - idx;
    
    const lat = bus.path[idx][0] + (bus.path[nextIdx][0] - bus.path[idx][0]) * frac;
    const lng = bus.path[idx][1] + (bus.path[nextIdx][1] - bus.path[idx][1]) * frac;
    
    bm.marker.setLatLng([lat, lng]);
    
    // Actualitzar velocitat simulada
    bus.speed = Math.max(0, 60 + Math.random() * 30);
    if (bus.status === 'delayed') bus.speed *= 0.7;
    
    // Actualitzar popup
    bm.marker.setPopupContent(`
      <div style="min-width:200px;">
        <strong style="color:${bus.color};font-size:15px;">${bus.id}</strong> ${bus.name}<br>
        <div style="margin-top:6px;font-size:12px;color:#666;">
          Conductor: ${bus.driver}<br>
          Estat: ${bus.status === 'active' ? '🟢 En marxa' : bus.status === 'delayed' ? '🟡 Amb retard' : '⚪ Aturat'}<br>
          Passatgers: ${bus.passengers}/${bus.capacity}<br>
          Velocitat: ${Math.round(bus.speed)} km/h<br>
          Pròxima parada: ${bus.nextStop}
        </div>
      </div>
    `);
  });
  
  // Actualitzar panell conductor si està actiu
  if (currentRole === 'driver') {
    const driverBus = busRoutes[0];
    document.getElementById('currentSpeed').textContent = Math.round(driverBus.speed) + ' km/h';
  }
  
  // Actualitzar indicador de sincronització
  const now = new Date();
  document.getElementById('syncText').textContent = 
    `Sincronitzat fa ${now.getSeconds() % 3}s · ${busRoutes.filter(b=>b.status==='active').length} autobusos actius`;
}, 1000);

// ============ CANVI DE ROL ============
document.querySelectorAll('.role-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentRole = btn.dataset.role;
    
    document.getElementById('userPanel').classList.toggle('hidden', currentRole !== 'user');
    document.getElementById('driverPanel').classList.toggle('hidden', currentRole !== 'driver');
    document.getElementById('alertPanel').classList.toggle('hidden', currentRole !== 'alerts');
    
    if (currentRole === 'driver') {
      map.flyTo([41.5, 2.3], 10);
      showNotification('Mode conductor activat · Emetent posició GPS');
    } else if (currentRole === 'user') {
      map.flyTo([41.5, 2.1], 8);
    }
  };
});

// ============ ALERTES TOGGLES ============
document.querySelectorAll('.alert-toggle').forEach(toggle => {
  toggle.onclick = (e) => {
    e.stopPropagation();
    toggle.classList.toggle('on');
    const type = toggle.parentElement.parentElement.dataset.type;
    const isOn = toggle.classList.contains('on');
    alertMarkers[type].forEach(m => {
      if (isOn) m.addTo(map);
      else map.removeLayer(m);
    });
    showNotification(isOn ? `${type} visibles al mapa` : `${type} ocultes`);
  };
});

// ============ BOTONS DEL CONDUCTOR ============
let routeActive = false;
document.getElementById('btnStartRoute').onclick = () => {
  routeActive = true;
  busRoutes[0].status = 'active';
  showNotification('✅ Ruta iniciada · Posició GPS emetent-se');
  document.getElementById('btnStartRoute').innerHTML = '<i class="fas fa-check"></i> Ruta activa';
};

document.getElementById('btnStopRoute').onclick = () => {
  routeActive = false;
  busRoutes[0].status = 'stopped';
  showNotification('⏹ Ruta aturada');
  document.getElementById('btnStartRoute').innerHTML = '<i class="fas fa-play"></i> Iniciar ruta';
};

document.getElementById('btnAddStop').onclick = () => {
  const center = map.getCenter();
  L.marker(center, {
    icon: L.divIcon({
      className: 'custom-marker',
      html: '<div style="width:24px;height:24px;background:#00cc66;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',
      iconSize: [24, 24]
    })
  }).addTo(map).bindPopup('Nova parada afegida').openPopup();
  showNotification('📍 Parada marcada a la ruta');
};

document.getElementById('btnReportIncident').onclick = () => {
  const center = map.getCenter();
  L.marker(center, { icon: createAlertIcon('danger') }).addTo(map)
    .bindPopup('Incidència reportada pel conductor').openPopup();
  showNotification('⚠️ Incidència reportada · Notificada als usuaris');
};

// ============ BOTONS SUPERIORS ============
document.getElementById('btnLocate').onclick = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      map.flyTo([pos.coords.latitude, pos.coords.longitude], 14);
      L.marker([pos.coords.latitude, pos.coords.longitude], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="width:20px;height:20px;background:#3388ff;border:3px solid white;border-radius:50%;box-shadow:0 0 0 10px rgba(51,136,255,0.3);"></div>',
          iconSize: [20, 20]
        })
      }).addTo(map).bindPopup('La teva ubicació').openPopup();
    }, () => {
      map.flyTo([41.3851, 2.1734], 12);
      showNotification(' Centrat a Barcelona (geolocalització no disponible)');
    });
  }
};

document.getElementById('btnFilter').onclick = () => {
  const alertsVisible = !document.getElementById('alertPanel').classList.contains('hidden');
  document.getElementById('alertPanel').classList.toggle('hidden');
  document.getElementById('userPanel').classList.add('hidden');
  document.getElementById('driverPanel').classList.add('hidden');
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-role="alerts"]').classList.add('active');
  currentRole = 'alerts';
};

// ============ CERCA ============
document.getElementById('searchInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = e.target.value.toLowerCase();
    const locations = {
      'barcelona': [41.3851, 2.1734],
      'girona': [41.98, 2.82],
      'tarragona': [41.1189, 1.2445],
      'lleida': [41.6175, 0.6300],
      'manresa': [41.7275, 1.8275],
      'vic': [41.87, 2.25],
      'figueres': [42.27, 2.96],
      'granollers': [41.6, 2.3],
      'reus': [41.15, 1.10],
      'sitges': [41.237, 1.811]
    };
    let found = false;
    for (const [name, coords] of Object.entries(locations)) {
      if (name.includes(query) || query.includes(name)) {
        map.flyTo(coords, 13, { duration: 1.5 });
        showNotification(`📍 ${name.charAt(0).toUpperCase() + name.slice(1)}`);
        found = true;
        break;
      }
    }
    if (!found) showNotification('Localitat no trobada');
  }
});

// ============ NOTIFICACIONS ============
function showNotification(text) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  const n = document.createElement('div');
  n.className = 'notification';
  n.textContent = text;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 2500);
}

// ============ CERCA GEOCODIFICACIÓ (Nominatim OSM) ============
document.getElementById('searchInput').addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const query = e.target.value;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=es&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        map.flyTo([parseFloat(data[0].lat), parseFloat(data[0].lon)], 13);
        showNotification(`📍 ${data[0].display_name.split(',')[0]}`);
      }
    } catch(err) {
      // fallback ja gestionat
    }
  }
});

showNotification('🚌 Benvingut a Empresa Plana · Transport Públic de Catalunya');
</script>
</body>
</html>
```