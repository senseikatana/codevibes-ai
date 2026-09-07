```html
<!DOCTYPE html>
<html lang="ca">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Empresa Plana · Transport Públic de Catalunya</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
<style>
  :root {
    --primary: #0066cc;
    --primary-dark: #004a99;
    --success: #00b359;
    --warning: #ff9500;
    --danger: #ff3b30;
    --bg: #f5f7fa;
    --card: #ffffff;
    --text: #1a1a2e;
    --text-secondary: #6b7280;
    --border: #e5e7eb;
    --sidebar: #0f172a;
    --sidebar-hover: #1e293b;
    --sidebar-active: #0066cc;
    --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
    --shadow-lg: 0 10px 25px rgba(0,0,0,0.1);
  }
  * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
  body { background: var(--bg); color: var(--text); overflow: hidden; height: 100vh; }
  
  .app { display: flex; height: 100vh; }
  
  /* SIDEBAR */
  .sidebar {
    width: 260px;
    background: var(--sidebar);
    color: white;
    display: flex;
    flex-direction: column;
    transition: width 0.3s;
    flex-shrink: 0;
  }
  .sidebar.collapsed { width: 72px; }
  .sidebar.collapsed .logo-text,
  .sidebar.collapsed .nav-label,
  .sidebar.collapsed .section-title { display: none; }
  
  .logo {
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .logo-icon {
    width: 40px; height: 40px;
    background: var(--primary);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }
  .logo-text h2 { font-size: 15px; font-weight: 700; }
  .logo-text p { font-size: 11px; opacity: 0.6; margin-top: 2px; }
  
  .nav { flex: 1; overflow-y: auto; padding: 12px 0; }
  .nav::-webkit-scrollbar { width: 4px; }
  .nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
  
  .section-title {
    padding: 12px 20px 6px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.5;
    font-weight: 600;
  }
  
  .nav-item {
    padding: 11px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.2s;
    border-left: 3px solid transparent;
    font-size: 14px;
  }
  .nav-item:hover { background: var(--sidebar-hover); }
  .nav-item.active {
    background: var(--sidebar-hover);
    border-left-color: var(--primary);
  }
  .nav-item i { width: 20px; text-align: center; font-size: 15px; opacity: 0.8; }
  .nav-item.active i { opacity: 1; color: var(--primary); }
  .nav-label { flex: 1; }
  .nav-badge {
    background: var(--danger);
    color: white;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: 600;
  }
  
  .sidebar-footer {
    padding: 16px 20px;
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .avatar {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
  }
  
  /* MAIN */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  
  .topbar {
    background: var(--card);
    padding: 16px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow);
  }
  .topbar-left { display: flex; align-items: center; gap: 16px; }
  .toggle-btn {
    background: none; border: none;
    cursor: pointer; font-size: 18px; color: var(--text);
    padding: 6px;
  }
  .page-title h1 { font-size: 20px; font-weight: 700; }
  .page-title p { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
  
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .search-box {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 12px;
    display: flex; align-items: center; gap: 8px;
    width: 280px;
  }
  .search-box input { border: none; background: none; outline: none; flex: 1; font-size: 13px; }
  
  .icon-btn {
    width: 38px; height: 38px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--card);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    transition: all 0.2s;
  }
  .icon-btn:hover { background: var(--bg); }
  .icon-btn .badge {
    position: absolute;
    top: -4px; right: -4px;
    background: var(--danger);
    color: white;
    font-size: 9px;
    padding: 2px 5px;
    border-radius: 10px;
    font-weight: 600;
  }
  
  .content { flex: 1; overflow-y: auto; padding: 24px 28px; }
  .content::-webkit-scrollbar { width: 8px; }
  .content::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
  
  /* VIEWS */
  .view { display: none; animation: fadeIn 0.3s; }
  .view.active { display: block; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  
  /* DASHBOARD */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  .stat-card {
    background: var(--card);
    padding: 20px;
    border-radius: 12px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
  }
  .stat-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .stat-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .stat-icon.blue { background: #dbeafe; color: var(--primary); }
  .stat-icon.green { background: #d1fae5; color: var(--success); }
  .stat-icon.orange { background: #fed7aa; color: var(--warning); }
  .stat-icon.red { background: #fee2e2; color: var(--danger); }
  .stat-change { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 10px; }
  .stat-change.up { background: #d1fae5; color: var(--success); }
  .stat-change.down { background: #fee2e2; color: var(--danger); }
  .stat-value { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
  .stat-label { font-size: 12px; color: var(--text-secondary); }
  
  .dashboard-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
  }
  @media (max-width: 1200px) { .dashboard-grid { grid-template-columns: 1fr; } }
  
  .panel {
    background: var(--card);
    border-radius: 12px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
    overflow: hidden;
  }
  .panel-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .panel-header h3 { font-size: 15px; font-weight: 600; }
  .panel-body { padding: 16px 20px; }
  
  /* TABLE */
  .table-container { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th {
    text-align: left;
    padding: 12px 16px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-secondary);
    font-weight: 600;
    border-bottom: 1px solid var(--border);
    background: #fafbfc;
  }
  td {
    padding: 14px 16px;
    font-size: 13px;
    border-bottom: 1px solid var(--border);
  }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafbfc; }
  
  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
  }
  .status-pill.active { background: #d1fae5; color: #065f46; }
  .status-pill.inactive { background: #f3f4f6; color: #6b7280; }
  .status-pill.delayed { background: #fed7aa; color: #92400e; }
  .status-pill.stopped { background: #fee2e2; color: #991b1b; }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  
  .action-btns { display: flex; gap: 6px; }
  .btn-sm {
    padding: 6px 10px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s;
  }
  .btn-edit { background: #dbeafe; color: var(--primary); }
  .btn-edit:hover { background: var(--primary); color: white; }
  .btn-delete { background: #fee2e2; color: var(--danger); }
  .btn-delete:hover { background: var(--danger); color: white; }
  .btn-toggle { background: #d1fae5; color: var(--success); }
  .btn-toggle:hover { background: var(--success); color: white; }
  
  /* BUTTONS */
  .btn {
    padding: 10px 18px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
  }
  .btn-primary { background: var(--primary); color: white; }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,102,204,0.3); }
  .btn-secondary { background: var(--bg); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { background: #e5e7eb; }
  .btn-success { background: var(--success); color: white; }
  .btn-success:hover { background: #00994d; }
  .btn-danger { background: var(--danger); color: white; }
  .btn-danger:hover { background: #d63026; }
  
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .toolbar-left { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  
  .filter-select {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--card);
    font-size: 13px;
    outline: none;
  }
  
  /* MODAL */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 2000;
    display: none;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s;
  }
  .modal-overlay.show { display: flex; }
  .modal {
    background: var(--card);
    border-radius: 14px;
    width: 90%;
    max-width: 560px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.3s;
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .modal-header h3 { font-size: 17px; }
  .modal-close {
    background: none; border: none;
    font-size: 20px; cursor: pointer;
    color: var(--text-secondary);
    padding: 4px;
  }
  .modal-body { padding: 24px; overflow-y: auto; max-height: 60vh; }
  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  
  .form-group { margin-bottom: 16px; }
  .form-group label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 6px;
    color: var(--text-secondary);
  }
  .form-control {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 13px;
    outline: none;
    transition: border 0.2s;
    font-family: inherit;
  }
  .form-control:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(0,102,204,0.1); }
  textarea.form-control { resize: vertical; min-height: 80px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  
  /* MAP */
  .map-container {
    height: calc(100vh - 180px);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
  }
  #map { width: 100%; height: 100%; }
  
  .map-toolbar {
    position: absolute;
    top: 16px; left: 16px; right: 16px;
    z-index: 1000;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    pointer-events: none;
  }
  .map-toolbar > * { pointer-events: auto; }
  
  .map-search {
    background: white;
    border-radius: 10px;
    padding: 10px 14px;
    box-shadow: var(--shadow-lg);
    flex: 1;
    max-width: 400px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .map-search input { flex: 1; border: none; outline: none; font-size: 14px; }
  
  .map-legend {
    position: absolute;
    bottom: 20px; left: 16px;
    background: white;
    padding: 12px 16px;
    border-radius: 10px;
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    font-size: 12px;
  }
  .legend-item { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .legend-item:last-child { margin-bottom: 0; }
  .legend-color { width: 14px; height: 14px; border-radius: 3px; }
  
  /* NOTIFICATIONS */
  .notif-list { display: flex; flex-direction: column; gap: 10px; }
  .notif-item {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    transition: all 0.2s;
  }
  .notif-item:hover { box-shadow: var(--shadow); }
  .notif-item.unread { border-left: 4px solid var(--primary); background: #f0f7ff; }
  .notif-icon {
    width: 38px; height: 38px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .notif-icon.delay { background: #fed7aa; color: var(--warning); }
  .notif-icon.accident { background: #fee2e2; color: var(--danger); }
  .notif-icon.detour { background: #dbeafe; color: var(--primary); }
  .notif-icon.info { background: #e0e7ff; color: #6366f1; }
  .notif-content { flex: 1; }
  .notif-title { font-size: 13px; font-weight: 600; margin-bottom: 3px; }
  .notif-desc { font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; }
  .notif-meta { font-size: 11px; color: var(--text-secondary); }
  .notif-actions { display: flex; gap: 6px; }
  
  /* REPORTS */
  .chart-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }
  .chart-container {
    background: var(--card);
    border-radius: 12px;
    padding: 20px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
  }
  .chart-container h4 { font-size: 14px; margin-bottom: 16px; font-weight: 600; }
  .bar-chart { display: flex; align-items: flex-end; gap: 12px; height: 200px; padding-top: 10px; }
  .bar {
    flex: 1;
    background: linear-gradient(180deg, var(--primary), var(--primary-dark));
    border-radius: 6px 6px 0 0;
    position: relative;
    transition: all 0.3s;
    cursor: pointer;
  }
  .bar:hover { opacity: 0.8; }
  .bar-label {
    position: absolute;
    bottom: -22px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: var(--text-secondary);
    white-space: nowrap;
  }
  .bar-value {
    position: absolute;
    top: -18px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    font-weight: 600;
  }
  
  .progress-list { display: flex; flex-direction: column; gap: 14px; }
  .progress-item label {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 6px;
  }
  .progress-bar {
    height: 8px;
    background: var(--bg);
    border-radius: 4px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary), #00a3ff);
    border-radius: 4px;
    transition: width 0.5s;
  }
  
  /* USER APP PREVIEW */
  .phone-frame {
    width: 360px;
    height: 720px;
    background: #1a1a2e;
    border-radius: 40px;
    padding: 12px;
    margin: 0 auto;
    box-shadow: var(--shadow-lg);
    border: 8px solid #2a2a3e;
  }
  .phone-screen {
    background: white;
    border-radius: 30px;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  .phone-notch {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 120px; height: 24px;
    background: #1a1a2e;
    border-radius: 0 0 14px 14px;
    z-index: 10;
  }
  .phone-content { padding: 36px 16px 16px; height: 100%; overflow-y: auto; }
  .phone-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .phone-header h3 { font-size: 18px; }
  .phone-search {
    background: var(--bg);
    border-radius: 10px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  .phone-search input { border: none; background: none; outline: none; flex: 1; font-size: 13px; }
  
  .quick-actions {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }
  .quick-action {
    text-align: center;
    cursor: pointer;
  }
  .quick-action-icon {
    width: 50px; height: 50px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 6px;
    font-size: 20px;
    color: white;
  }
  .quick-action span { font-size: 10px; color: var(--text-secondary); }
  
  .phone-bus-card {
    background: var(--bg);
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 10px;
    border-left: 4px solid var(--primary);
  }
  .phone-bus-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  .phone-bus-card-header strong { font-size: 14px; }
  .phone-bus-route { font-size: 11px; color: var(--text-secondary); margin-bottom: 8px; }
  .phone-bus-meta {
    display: flex;
    gap: 12px;
    font-size: 11px;
    color: var(--text-secondary);
  }
  
  .phone-bottom-nav {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: white;
    border-top: 1px solid var(--border);
    padding: 10px 0 16px;
    display: flex;
    justify-content: space-around;
  }
  .phone-nav-item {
    text-align: center;
    font-size: 10px;
    color: var(--text-secondary);
    cursor: pointer;
  }
  .phone-nav-item.active { color: var(--primary); }
  .phone-nav-item i { font-size: 18px; display: block; margin-bottom: 2px; }
  
  .user-app-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 1000px) { .user-app-container { grid-template-columns: 1fr; } }
  
  .user-features {
    background: var(--card);
    border-radius: 12px;
    padding: 24px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
  }
  .feature-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s;
    margin-bottom: 6px;
  }
  .feature-item:hover { background: var(--bg); }
  .feature-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    color: white;
    flex-shrink: 0;
  }
  .feature-text h4 { font-size: 14px; margin-bottom: 2px; }
  .feature-text p { font-size: 11px; color: var(--text-secondary); }
  
  /* ADMIN INTEGRATIONS */
  .integrations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  .integration-card {
    background: var(--card);
    border-radius: 12px;
    padding: 24px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
    text-align: center;
    transition: all 0.2s;
  }
  .integration-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .integration-logo {
    width: 70px; height: 70px;
    border-radius: 16px;
    margin: 0 auto 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 32px;
    color: white;
  }
  .integration-card h3 { font-size: 16px; margin-bottom: 6px; }
  .integration-card p { font-size: 12px; color: var(--text-secondary); margin-bottom: 16px; }
  .integration-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  .integration-status.connected { background: #d1fae5; color: var(--success); }
  .integration-status.disconnected { background: #fee2e2; color: var(--danger); }
  
  /* TOAST */
  .toast-container {
    position: fixed;
    top: 20px; right: 20px;
    z-index: 3000;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .toast {
    background: var(--card);
    border-radius: 10px;
    padding: 12px 16px;
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 280px;
    animation: slideIn 0.3s;
    border-left: 4px solid var(--primary);
  }
  .toast.success { border-left-color: var(--success); }
  .toast.error { border-left-color: var(--danger); }
  .toast.warning { border-left-color: var(--warning); }
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .toast-icon { font-size: 18px; }
  .toast.success .toast-icon { color: var(--success); }
  .toast.error .toast-icon { color: var(--danger); }
  .toast.warning .toast-icon { color: var(--warning); }
  .toast-content { flex: 1; }
  .toast-title { font-size: 13px; font-weight: 600; }
  .toast-message { font-size: 11px; color: var(--text-secondary); }
  
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
  }
  .empty-state i { font-size: 48px; opacity: 0.3; margin-bottom: 12px; }
  .empty-state h4 { font-size: 16px; margin-bottom: 6px; color: var(--text); }
  .empty-state p { font-size: 13px; }
  
  .sync-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--success);
    font-weight: 600;
    background: #d1fae5;
    padding: 4px 10px;
    border-radius: 12px;
  }
  .sync-dot {
    width: 6px; height: 6px;
    background: var(--success);
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  
  .gps-live {
    position: absolute;
    top: 16px; right: 16px;
    background: rgba(255,255,255,0.95);
    padding: 8px 14px;
    border-radius: 10px;
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
  }
</style>
</head>
<body>

<div class="app">
  <!-- SIDEBAR -->
  <aside class="sidebar" id="sidebar">
    <div class="logo">
      <div class="logo-icon"><i class="fas fa-bus"></i></div>
      <div class="logo-text">
        <h2>Empresa Plana</h2>
        <p>Transport Públic CAT</p>
      </div>
    </div>
    
    <nav class="nav">
      <div class="section-title">Principal</div>
      <div class="nav-item active" data-view="dashboard">
        <i class="fas fa-chart-pie"></i>
        <span class="nav-label">Dashboard</span>
      </div>
      <div class="nav-item" data-view="map">
        <i class="fas fa-map-marked-alt"></i>
        <span class="nav-label">Mapa en viu</span>
        <span class="nav-badge">LIVE</span>
      </div>
      
      <div class="section-title">Gestió</div>
      <div class="nav-item" data-view="routes">
        <i class="fas fa-route"></i>
        <span class="nav-label">Rutes</span>
      </div>
      <div class="nav-item" data-view="buses">
        <i class="fas fa-bus-alt"></i>
        <span class="nav-label">Autobusos</span>
      </div>
      <div class="nav-item" data-view="stops">
        <i class="fas fa-map-pin"></i>
        <span class="nav-label">Parades</span>
      </div>
      <div class="nav-item" data-view="schedules">
        <i class="fas fa-clock"></i>
        <span class="nav-label">Horaris</span>
      </div>
      <div class="nav-item" data-view="drivers">
        <i class="fas fa-id-card"></i>
        <span class="nav-label">Conductors</span>
      </div>
      
      <div class="section-title">Comunicació</div>
      <div class="nav-item" data-view="notifications">
        <i class="fas fa-bell"></i>
        <span class="nav-label">Notificacions</span>
        <span class="nav-badge" id="notifCount">4</span>
      </div>
      <div class="nav-item" data-view="reports">
        <i class="fas fa-chart-bar"></i>
        <span class="nav-label">Reportes</span>
      </div>
      
      <div class="section-title">Aplicacions</div>
      <div class="nav-item" data-view="userapp">
        <i class="fas fa-mobile-alt"></i>
        <span class="nav-label">App Usuari</span>
      </div>
      <div class="nav-item" data-view="admin">
        <i class="fas fa-cogs"></i>
        <span class="nav-label">Administrador</span>
      </div>
    </nav>
    
    <div class="sidebar-footer">
      <div class="avatar">EP</div>
      <div class="logo-text">
        <div style="font-size:13px;font-weight:600;">Admin</div>
        <div style="font-size:11px;opacity:0.6;">admin@empresaplana.cat</div>
      </div>
    </div>
  </aside>
  
  <!-- MAIN -->
  <main class="main">
    <div class="topbar">
      <div class="topbar-left">
        <button class="toggle-btn" id="toggleSidebar"><i class="fas fa-bars"></i></button>
        <div class="page-title">
          <h1 id="pageTitle">Dashboard</h1>
          <p id="pageSubtitle">Vista general del sistema</p>
        </div>
      </div>
      <div class="topbar-right">
        <div class="sync-indicator">
          <span class="sync-dot"></span>
          <span>Sincronitzat</span>
        </div>
        <div class="search-box">
          <i class="fas fa-search" style="color:#9ca3af;"></i>
          <input type="text" placeholder="Cerca global..." />
        </div>
        <button class="icon-btn"><i class="fas fa-bell"></i><span class="badge">4</span></button>
        <button class="icon-btn"><i class="fas fa-cog"></i></button>
      </div>
    </div>
    
    <div class="content">
      
      <!-- DASHBOARD -->
      <div class="view active" id="view-dashboard">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon blue"><i class="fas fa-bus"></i></div>
              <span class="stat-change up">+2</span>
            </div>
            <div class="stat-value" id="statBuses">5</div>
            <div class="stat-label">Autobusos actius</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon green"><i class="fas fa-route"></i></div>
              <span class="stat-change up">+1</span>
            </div>
            <div class="stat-value" id="statRoutes">5</div>
            <div class="stat-label">Rutes operatives</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon orange"><i class="fas fa-users"></i></div>
              <span class="stat-change up">+12%</span>
            </div>
            <div class="stat-value" id="statPassengers">1.284</div>
            <div class="stat-label">Passatgers avui</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon red"><i class="fas fa-exclamation-triangle"></i></div>
              <span class="stat-change down">-3</span>
            </div>
            <div class="stat-value" id="statAlerts">4</div>
            <div class="stat-label">Alertes actives</div>
          </div>
        </div>
        
        <div class="dashboard-grid">
          <div class="panel">
            <div class="panel-header">
              <h3><i class="fas fa-map-marked-alt" style="color:var(--primary);margin-right:8px;"></i>Mapa en viu</h3>
              <button class="btn btn-secondary btn-sm" onclick="switchView('map')">Obrir mapa complet <i class="fas fa-external-link-alt"></i></button>
            </div>
            <div style="height:360px;position:relative;">
              <div id="dashboardMap" style="width:100%;height:100%;"></div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-header">
              <h3><i class="fas fa-clock" style="color:var(--warning);margin-right:8px;"></i>Pròximes sortides</h3>
            </div>
            <div class="panel-body" id="upcomingDepartures"></div>
          </div>
        </div>
        
        <div class="panel" style="margin-top:20px;">
          <div class="panel-header">
            <h3><i class="fas fa-bell" style="color:var(--danger);margin-right:8px;"></i>Últimes notificacions</h3>
            <button class="btn btn-secondary btn-sm" onclick="switchView('notifications')">Veure totes</button>
          </div>
          <div class="panel-body">
            <div class="notif-list" id="dashboardNotifs"></div>
          </div>
        </div>
      </div>
      
      <!-- RUTES -->
      <div class="view" id="view-routes">
        <div class="toolbar">
          <div class="toolbar-left">
            <button class="btn btn-primary" onclick="openModal('route')"><i class="fas fa-plus"></i> Nova ruta</button>
            <select class="filter-select" id="filterRouteStatus" onchange="renderRoutes()">
              <option value="all">Tots els estats</option>
              <option value="active">Actives</option>
              <option value="inactive">Inactives</option>
            </select>
          </div>
          <div class="toolbar-left">
            <input type="text" class="form-control" placeholder="Cerca ruta..." style="width:220px;" oninput="renderRoutes()" id="searchRoute" />
          </div>
        </div>
        <div class="panel">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Codi</th>
                  <th>Nom</th>
                  <th>Origen → Destí</th>
                  <th>Conductor</th>
                  <th>Estat</th>
                  <th>Accions</th>
                </tr>
              </thead>
              <tbody id="routesTable"></tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- BUSES -->
      <div class="view" id="view-buses">
        <div class="toolbar">
          <div class="toolbar-left">
            <button class="btn btn-primary" onclick="openModal('bus')"><i class="fas fa-plus"></i> Nou autobús</button>
            <select class="filter-select" id="filterBusStatus" onchange="renderBuses()">
              <option value="all">Tots els estats</option>
              <option value="active">Actiu</option>
              <option value="maintenance">Taller</option>
              <option value="inactive">Inactiu</option>
            </select>
          </div>
        </div>
        <div class="panel">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Placa</th>
                  <th>Empresa</th>
                  <th>Capacitat</th>
                  <th>Ruta assignada</th>
                  <th>Estat</th>
                  <th>Accions</th>
                </tr>
              </thead>
              <tbody id="busesTable"></tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- PARADES -->
      <div class="view" id="view-stops">
        <div class="toolbar">
          <div class="toolbar-left">
            <button class="btn btn-primary" onclick="openModal('stop')"><i class="fas fa-plus"></i> Nova parada</button>
          </div>
        </div>
        <div class="panel">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Adreça</th>
                  <th>GPS</th>
                  <th>Rutes</th>
                  <th>Fotos</th>
                  <th>Accions</th>
                </tr>
              </thead>
              <tbody id="stopsTable"></tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- HORARIS -->
      <div class="view" id="view-schedules">
        <div class="toolbar">
          <div class="toolbar-left">
            <button class="btn btn-primary" onclick="openModal('schedule')"><i class="fas fa-plus"></i> Nou horari</button>
          </div>
        </div>
        <div class="panel">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Ruta</th>
                  <th>H. sortida</th>
                  <th>H. arribada</th>
                  <th>Freqüència</th>
                  <th>Dies</th>
                  <th>Estat</th>
                  <th>Accions</th>
                </tr>
              </thead>
              <tbody id="schedulesTable"></tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- CONDUCTORS -->
      <div class="view" id="view-drivers">
        <div class="toolbar">
          <div class="toolbar-left">
            <button class="btn btn-primary" onclick="openModal('driver')"><i class="fas fa-plus"></i> Nou conductor</button>
          </div>
        </div>
        <div class="panel">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Telèfon</th>
                  <th>Llicència</th>
                  <th>Bus assignat</th>
                  <th>Estat</th>
                  <th>Accions</th>
                </tr>
              </thead>
              <tbody id="driversTable"></tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- MAPA -->
      <div class="view" id="view-map">
        <div class="map-container" style="position:relative;">
          <div id="map"></div>
          <div class="map-toolbar">
            <div class="map-search">
              <i class="fas fa-search" style="color:#9ca3af;"></i>
              <input type="text" id="mapSearch" placeholder="Cerca localitat o adreça..." />
              <i class="fas fa-microphone" style="color:#9ca3af;cursor:pointer;"></i>
            </div>
            <button class="btn-icon" style="background:white;border-radius:10px;width:42px;height:42px;border:none;cursor:pointer;box-shadow:var(--shadow-lg);display:flex;align-items:center;justify-content:center;" onclick="locateMe()">
              <i class="fas fa-crosshairs" style="color:#333;"></i>
            </button>
          </div>
          <div class="gps-live">
            <span class="sync-dot"></span>
            <span>GPS en viu · <span id="activeBusesCount">5</span> autobusos</span>
          </div>
          <div class="map-legend">
            <div class="legend-item"><div class="legend-color" style="background:#0066cc;"></div> Ruta activa</div>
            <div class="legend-item"><div class="legend-color" style="background:#ff9500;"></div> Amb retard</div>
            <div class="legend-item"><div class="legend-color" style="background:#ff3b30;"></div> Aturat</div>
            <div class="legend-item"><div class="legend-color" style="background:#00b359;border-radius:50%;"></div> Parada</div>
          </div>
        </div>
      </div>
      
      <!-- NOTIFICACIONS -->
      <div class="view" id="view-notifications">
        <div class="toolbar">
          <div class="toolbar-left">
            <button class="btn btn-primary" onclick="openModal('notification')"><i class="fas fa-plus"></i> Nova notificació</button>
            <select class="filter-select" id="filterNotifType" onchange="renderNotifications()">
              <option value="all">Tots els tipus</option>
              <option value="delay">Retards</option>
              <option value="accident">Accidents</option>
              <option value="detour">Desviaments</option>
              <option value="info">Avisos</option>
            </select>
          </div>
          <button class="btn btn-secondary" onclick="markAllRead()"><i class="fas fa-check-double"></i> Marcar totes com a llegides</button>
        </div>
        <div class="notif-list" id="notificationsList"></div>
      </div>
      
      <!-- REPORTES -->
      <div class="view" id="view-reports">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon blue"><i class="fas fa-users"></i></div>
            </div>
            <div class="stat-value">12.847</div>
            <div class="stat-label">Passatgers aquest mes</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
            </div>
            <div class="stat-value">94.2%</div>
            <div class="stat-label">Puntualitat</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon orange"><i class="fas fa-road"></i></div>
            </div>
            <div class="stat-value">48.520</div>
            <div class="stat-label">Km recorreguts</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon red"><i class="fas fa-gas-pump"></i></div>
            </div>
            <div class="stat-value">3.240 L</div>
            <div class="stat-label">Consum combustible</div>
          </div>
        </div>
        
        <div class="chart-grid">
          <div class="chart-container">
            <h4><i class="fas fa-chart-bar" style="color:var(--primary);margin-right:8px;"></i>Passatgers per ruta (aquest mes)</h4>
            <div class="bar-chart" id="passengersChart"></div>
          </div>
          <div class="chart-container">
            <h4><i class="fas fa-chart-line" style="color:var(--success);margin-right:8px;"></i>Ocupació per ruta</h4>
            <div class="progress-list" id="occupancyChart"></div>
          </div>
        </div>
        
        <div class="chart-grid">
          <div class="chart-container">
            <h4><i class="fas fa-clock" style="color:var(--warning);margin-right:8px;"></i>Puntualitat setmanal</h4>
            <div class="bar-chart" id="punctualityChart"></div>
          </div>
          <div class="chart-container">
            <h4><i class="fas fa-star" style="color:var(--danger);margin-right:8px;"></i>Satisfacció usuaris</h4>
            <div class="progress-list" id="satisfactionChart"></div>
          </div>
        </div>
      </div>
      
      <!-- APP USUARI -->
      <div class="view" id="view-userapp">
        <div class="user-app-container">
          <div class="user-features">
            <h3 style="margin-bottom:16px;"><i class="fas fa-mobile-alt" style="color:var(--primary);margin-right:8px;"></i>Funcionalitats App Usuari</h3>
            <div class="feature-item" onclick="showToast('success','Cerca de rutes','Sistema de cerca per origen i destí actiu')">
              <div class="feature-icon" style="background:linear-gradient(135deg,#0066cc,#00a3ff);"><i class="fas fa-search-location"></i></div>
              <div class="feature-text"><h4>Cercar ruta</h4><p>Troba la millor ruta entre dos punts</p></div>
            </div>
            <div class="feature-item" onclick="showToast('success','Cerca de parades','Mapa interactiu de parades properes')">
              <div class="feature-icon" style="background:linear-gradient(135deg,#00b359,#00e676);"><i class="fas fa-map-pin"></i></div>
              <div class="feature-text"><h4>Cercar parada</h4><p>Localitza parades properes amb GPS</p></div>
            </div>
            <div class="feature-item" onclick="showToast('success','Horaris','Consulta horaris actualitzats en temps real')">
              <div class="feature-icon" style="background:linear-gradient(135deg,#ff9500,#ffb347);"><i class="fas fa-clock"></i></div>
              <div class="feature-text"><h4>Veure horaris</h4><p>Horaris en temps real de cada línia</p></div>
            </div>
            <div class="feature-item" onclick="showToast('success','Bus en viu','Seguiment GPS del teu autobús')">
              <div class="feature-icon" style="background:linear-gradient(135deg,#ff3b30,#ff6b6b);"><i class="fas fa-bus"></i></div>
              <div class="feature-text"><h4>Bus en temps real</h4><p>Segueix el teu autobús al mapa</p></div>
            </div>
            <div class="feature-item" onclick="showToast('success','Calculadora de rutes','Optimització de trajectes activa')">
              <div class="feature-icon" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);"><i class="fas fa-route"></i></div>
              <div class="feature-text"><h4>Calcular recorregut</h4><p>Planifica el teu viatge pas a pas</p></div>
            </div>
            <div class="feature-item" onclick="showToast('success','Favorits','Rutes guardades correctament')">
              <div class="feature-icon" style="background:linear-gradient(135deg,#ec4899,#f472b6);"><i class="fas fa-star"></i></div>
              <div class="feature-text"><h4>Guardar favorits</h4><p>Desa les teves rutes habituals</p></div>
            </div>
            <div class="feature-item" onclick="showToast('success','Alertes','Sistema de notificacions push actiu')">
              <div class="feature-icon" style="background:linear-gradient(135deg,#14b8a6,#2dd4bf);"><i class="fas fa-bell"></i></div>
              <div class="feature-text"><h4>Rebre alertes</h4><p>Notificacions de retards i incidències</p></div>
            </div>
          </div>
          
          <div class="phone-frame">
            <div class="phone-screen">
              <div class="phone-notch"></div>
              <div class="phone-content">
                <div class="phone-header">
                  <div>
                    <div style="font-size:11px;color:var(--text-secondary);">Bon dia,</div>
                    <h3>Marta 👋</h3>
                  </div>
                  <div style="width:36px;height:36px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;">M</div>
                </div>
                
                <div class="phone-search">
                  <i class="fas fa-search" style="color:#9ca3af;"></i>
                  <input type="text" placeholder="On vols anar?" />
                </div>
                
                <div class="quick-actions">
                  <div class="quick-action">
                    <div class="quick-action-icon" style="background:linear-gradient(135deg,#0066cc,#00a3ff);"><i class="fas fa-route"></i></div>
                    <span>Rutes</span>
                  </div>
                  <div class="quick-action">
                    <div class="quick-action-icon" style="background:linear-gradient(135deg,#00b359,#00e676);"><i class="fas fa-map-pin"></i></div>
                    <span>Parades</span>
                  </div>
                  <div class="quick-action">
                    <div class="quick-action-icon" style="background:linear-gradient(135deg,#ff9500,#ffb347);"><i class="fas fa-clock"></i></div>
                    <span>Horaris</span>
                  </div>
                  <div class="quick-action">
                    <div class="quick-action-icon" style="background:linear-gradient(135deg,#ec4899,#f472b6);"><i class="fas fa-star"></i></div>
                    <span>Favorits</span>
                  </div>
                </div>
                
                <h4 style="font-size:14px;margin-bottom:12px;">Autobusos propers</h4>
                <div id="phoneBusList"></div>
                
                <h4 style="font-size:14px;margin:16px 0 12px;">Alertes actives</h4>
                <div style="background:#fee2e2;border-radius:10px;padding:12px;display:flex;gap:10px;align-items:center;">
                  <div style="width:32px;height:32px;background:var(--danger);border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;"><i class="fas fa-exclamation-triangle"></i></div>
                  <div style="flex:1;">
                    <div style="font-size:12px;font-weight:600;">Retard L-42</div>
                    <div style="font-size:10px;color:#991b1b;">+5 min · Accident C-25</div>
                  </div>
                </div>
              </div>
              <div class="phone-bottom-nav">
                <div class="phone-nav-item active"><i class="fas fa-home"></i>Inici</div>
                <div class="phone-nav-item"><i class="fas fa-map"></i>Mapa</div>
                <div class="phone-nav-item"><i class="fas fa-clock"></i>Horaris</div>
                <div class="phone-nav-item"><i class="fas fa-user"></i>Perfil</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- ADMIN -->
      <div class="view" id="view-admin">
        <div class="toolbar">
          <div class="toolbar-left">
            <h3 style="font-size:18px;">Panel Administrador</h3>
          </div>
          <div class="toolbar-left">
            <button class="btn btn-primary" onclick="exportData()"><i class="fas fa-download"></i> Exportar dades</button>
            <button class="btn btn-secondary" onclick="importData()"><i class="fas fa-upload"></i> Importar</button>
          </div>
        </div>
        
        <div class="integrations-grid">
          <div class="integration-card">
            <div class="integration-logo" style="background:linear-gradient(135deg,#217346,#33a06f);"><i class="fas fa-file-excel"></i></div>
            <h3>Microsoft Excel</h3>
            <p>Importa i exporta dades de rutes, horaris i passatgers en format .xlsx</p>
            <div class="integration-status connected"><span class="sync-dot"></span>Connectat</div>
            <br>
            <button class="btn btn-primary btn-sm" onclick="showToast('success','Excel','Dades exportades correctament a Excel')"><i class="fas fa-sync"></i> Sincronitzar</button>
          </div>
          
          <div class="integration-card">
            <div class="integration-logo" style="background:linear-gradient(135deg,#000000,#333333);"><i class="fab fa-notion"></i></div>
            <h3>Notion</h3>
            <p>Sincronitza documentació, incidències i reportes amb la teva base de dades Notion</p>
            <div class="integration-status connected"><span class="sync-dot"></span>Connectat</div>
            <br>
            <button class="btn btn-primary btn-sm" onclick="showToast('success','Notion','Sincronització amb Notion completada')"><i class="fas fa-sync"></i> Sincronitzar</button>
          </div>
          
          <div class="integration-card">
            <div class="integration-logo" style="background:linear-gradient(135deg,#4285f4,#34a853);"><i class="fas fa-database"></i></div>
            <h3>Base de dades</h3>
            <p>PostgreSQL amb extensions PostGIS per a dades geoespacials</p>
            <div class="integration-status connected"><span class="sync-dot"></span>Connectat</div>
            <br>
            <button class="btn btn-secondary btn-sm"><i class="fas fa-cog"></i> Configurar</button>
          </div>
          
          <div class="integration-card">
            <div class="integration-logo" style="background:linear-gradient(135deg,#ff6c37,#ff9500);"><i class="fas fa-satellite"></i></div>
            <h3>GPS Telemetria</h3>
            <p>Recepció de senyals GPS dels autobusos en temps real via MQTT</p>
            <div class="integration-status connected"><span class="sync-dot"></span>Actiu</div>
            <br>
            <button class="btn btn-secondary btn-sm"><i class="fas fa-chart-line"></i> Monitoritzar</button>
          </div>
          
          <div class="integration-card">
            <div class="integration-logo" style="background:linear-gradient(135deg,#0088cc,#00a8e8);"><i class="fas fa-paper-plane"></i></div>
            <h3>Notificacions Push</h3>
            <p>Envia alertes als usuaris via Firebase Cloud Messaging</p>
            <div class="integration-status connected"><span class="sync-dot"></span>Actiu</div>
            <br>
            <button class="btn btn-secondary btn-sm"><i class="fas fa-bell"></i> Gestionar</button>
          </div>
          
          <div class="integration-card">
            <div class="integration-logo" style="background:linear-gradient(135deg,#7c3aed,#a78bfa);"><i class="fas fa-shield-alt"></i></div>
            <h3>Seguretat</h3>
            <p>Autenticació OAuth2, xifrat SSL/TLS i còpies de seguretat automàtiques</p>
            <div class="integration-status connected"><span class="sync-dot"></span>Protegit</div>
            <br>
            <button class="btn btn-secondary btn-sm"><i class="fas fa-lock"></i> Configurar</button>
          </div>
        </div>
        
        <div class="panel" style="margin-top:20px;">
          <div class="panel-header">
            <h3><i class="fas fa-history" style="color:var(--primary);margin-right:8px;"></i>Registre d'activitat</h3>
          </div>
          <div class="panel-body">
            <div class="notif-list" id="activityLog"></div>
          </div>
        </div>
      </div>
      
    </div>
  </main>
</div>

<!-- MODAL -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal">
    <div class="modal-header">
      <h3 id="modalTitle">Títol</h3>
      <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
    </div>
    <div class="modal-body" id="modalBody"></div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel·lar</button>
      <button class="btn btn-primary" id="modalSave">Guardar</button>
    </div>
  </div>
</div>

<!-- TOAST CONTAINER -->
<div class="toast-container" id="toastContainer"></div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
// ============ DADES ============
const defaultData = {
  routes: [
    { id: 'L-42', name: 'Barcelona – Girona', origin: 'Barcelona', destination: 'Girona', driver: 'Joan García', status: 'active', color: '#0066cc', path: [[41.3851,2.1734],[41.5,2.25],[41.65,2.4],[41.8,2.6],[41.9,2.75],[41.98,2.82]] },
    { id: 'L-15', name: 'Tarragona – Reus', origin: 'Tarragona', destination: 'Reus', driver: 'Maria López', status: 'active', color: '#cc6600', path: [[41.1189,1.2445],[41.13,1.2],[41.12,1.15],[41.10,1.10]] },
    { id: 'L-08', name: 'Lleida – Balaguer', origin: 'Lleida', destination: 'Balaguer', driver: 'Pere Martí', status: 'delayed', color: '#6633cc', path: [[41.6175,0.63],[41.65,0.68],[41.70,0.75],[41.75,0.82]] },
    { id: 'L-23', name: 'Girona – Figueres', origin: 'Girona', destination: 'Figueres', driver: 'Anna Puig', status: 'active', color: '#009966', path: [[41.98,2.82],[42.1,2.85],[42.2,2.9],[42.27,2.96]] },
    { id: 'L-05', name: 'Manresa – Vic', origin: 'Manresa', destination: 'Vic', driver: 'Jordi Vila', status: 'inactive', color: '#cc3366', path: [[41.7275,1.8275],[41.8,2.0],[41.85,2.15],[41.87,2.25]] }
  ],
  buses: [
    { id: 1, number: 'BUS-001', plate: '1234 ABC', company: 'Empresa Plana', capacity: 55, route: 'L-42', status: 'active' },
    { id: 2, number: 'BUS-002', plate: '5678 DEF', company: 'Empresa Plana', capacity: 40, route: 'L-15', status: 'active' },
    { id: 3, number: 'BUS-003', plate: '9012 GHI', company: 'TransCAT', capacity: 50, route: 'L-08', status: 'active' },
    { id: 4, number: 'BUS-004', plate: '3456 JKL', company: 'Empresa Plana', capacity: 45, route: 'L-23', status: 'active' },
    { id: 5, number: 'BUS-005', plate: '7890 MNO', company: 'Empresa Plana', capacity: 35, route: 'L-05', status: 'maintenance' }
  ],
  stops: [
    { id: 1, name: 'Barcelona - Estació Nord', address: 'Carrer d\'Ali Bei, 80', lat: 41.3915, lng: 2.1810, routes: 'L-42', photos: 3 },
    { id: 2, name: 'Granollers', address: 'Plaça de la Constitució', lat: 41.6077, lng: 2.2871, routes: 'L-42', photos: 2 },
    { id: 3, name: 'Girona - Estació', address: 'Plaça de l\'Estació, 1', lat: 41.9794, lng: 2.8214, routes: 'L-42, L-23', photos: 5 },
    { id: 4, name: 'Tarragona - Rambla', address: 'Rambla Nova, 45', lat: 41.1189, lng: 1.2445, routes: 'L-15', photos: 4 },
    { id: 5, name: 'Reus - Centre', address: 'Plaça del Mercadal', lat: 41.1557, lng: 1.1070, routes: 'L-15', photos: 2 },
    { id: 6, name: 'Lleida - Estació', address: 'Plaça de l\'Estació', lat: 41.6175, lng: 0.6300, routes: 'L-08', photos: 3 },
    { id: 7, name: 'Figueres', address: 'Rambla, 12', lat: 42.2677, lng: 2.9600, routes: 'L-23', photos: 4 }
  ],
  schedules: [
    { id: 1, route: 'L-42', departure: '07:00', arrival: '09:15', frequency: '30 min', days: 'Dl-Dv', status: 'active' },
    { id: 2, route: 'L-42', departure: '17:30', arrival: '19:45', frequency: '30 min', days: 'Dl-Dv', status: 'active' },
    { id: 3, route: 'L-15', departure: '08:00', arrival: '08:45', frequency: '45 min', days: 'Dl-Ds', status: 'active' },
    { id: 4, route: 'L-08', departure: '09:30', arrival: '10:15', frequency: '60 min', days: 'Dl-Dv', status: 'active' },
    { id: 5, route: 'L-23', departure: '10:00', arrival: '10:40', frequency: '40 min', days: 'Dl-Dg', status: 'active' },
    { id: 6, route: 'L-05', departure: '07:45', arrival: '08:30', frequency: '45 min', days: 'Dl-Dv', status: 'inactive' }
  ],
  drivers: [
    { id: 1, name: 'Joan García', phone: '+34 612 345 678', license: 'D12345678', bus: 'BUS-001', status: 'active' },
    { id: 2, name: 'Maria López', phone: '+34 623 456 789', license: 'D23456789', bus: 'BUS-002', status: 'active' },
    { id: 3, name: 'Pere Martí', phone: '+34 634 567 890', license: 'D34567890', bus: 'BUS-003', status: 'active' },
    { id: 4, name: 'Anna Puig', phone: '+34 645 678 901', license: 'D45678901', bus: 'BUS-004', status: 'active' },
    { id: 5, name: 'Jordi Vila', phone: '+34 656 789 012', license: 'D56789012', bus: 'BUS-005', status: 'inactive' }
  ],
  notifications: [
    { id: 1, type: 'delay', title: 'Retard L-42', desc: 'La ruta L-42 té un retard de 5 minuts per accident a la C-25', time: 'Fa 10 min', read: false, route: 'L-42' },
    { id: 2, type: 'accident', title: 'Accident C-25', desc: 'Accident múltiple a l\'altura de Granollers. Circulació lenta.', time: 'Fa 25 min', read: false, route: 'L-42' },
    { id: 3, type: 'detour', title: 'Desviament L-08', desc: 'Desviament per obres a la carretera entre Lleida i Almacelles', time: 'Fa 1 hora', read: false, route: 'L-08' },
    { id: 4, type: 'info', title: 'Nou horari L-23', desc: 'A partir de dilluns la freqüència serà de 30 minuts', time: 'Fa 2 hores', read: true, route: 'L-23' }
  ],
  activity: [
    { time: '14:32', action: 'Ruta L-42 actualitzada', user: 'Admin', type: 'route' },
    { time: '14:15', action: 'Nou conductor afegit: Jordi Vila', user: 'Admin', type: 'driver' },
    { time: '13:48', action: 'Parada "Granollers" editada', user: 'Admin', type: 'stop' },
    { time: '12:30', action: 'Exportació Excel completada', user: 'Sistema', type: 'export' },
    { time: '11:20', action: 'Sincronització Notion', user: 'Sistema', type: 'sync' }
  ]
};

let data = JSON.parse(localStorage.getItem('empresaPlanaData')) || JSON.parse(JSON.stringify(defaultData));
function saveData() { localStorage.setItem('empresaPlanaData', JSON.stringify(data)); }

// ============ NAVIGACIÓ ============
const viewTitles = {
  dashboard: ['Dashboard', 'Vista general del sistema'],
  routes: ['Rutes', 'Gestió de rutes d\'autobús'],
  buses: ['Autobusos', 'Flota d\'autobusos'],
  stops: ['Parades', 'Parades i estacions'],
  schedules: ['Horaris', 'Programació d\'horaris'],
  drivers: ['Conductors', 'Equip de conductors'],
  map: ['Mapa en viu', 'Seguiment GPS en temps real'],
  notifications: ['Notificacions', 'Alertes i comunicacions'],
  reports: ['Reportes', 'Estadístiques i anàlisi'],
  userapp: ['App Usuari', 'Vista prèvia de l\'aplicació mòbil'],
  admin: ['Administrador', 'Configuració i integracions']
};

function switchView(viewName) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('view-' + viewName).classList.add('active');
  document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');
  const [title, subtitle] = viewTitles[viewName] || [viewName, ''];
  document.getElementById('pageTitle').textContent = title;
  document.getElementById('pageSubtitle').textContent = subtitle;
  
  if (viewName === 'map') setTimeout(initMainMap, 100);
  if (viewName === 'dashboard') setTimeout(initDashboardMap, 100);
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.onclick = () => switchView(item.dataset.view);
});

document.getElementById('toggleSidebar').onclick = () => {
  document.getElementById('sidebar').classList.toggle('collapsed');
};

// ============ MODALS ============
let currentModalType = null;
let editingId = null;

function openModal(type, id = null) {
  currentModalType = type;
  editingId = id;
  const overlay = document.getElementById('modalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  
  const forms = {
    route: {
      title: id ? 'Editar ruta' : 'Nova ruta',
      fields: [
        { name: 'id', label: 'Codi', type: 'text', placeholder: 'Ex: L-42' },
        { name: 'name', label: 'Nom', type: 'text', placeholder: 'Barcelona – Girona' },
        { name: 'origin', label: 'Origen', type: 'text', placeholder: 'Barcelona' },
        { name: 'destination', label: 'Destí', type: 'text', placeholder: 'Girona' },
        { name: 'driver', label: 'Conductor', type: 'text', placeholder: 'Nom del conductor' }
      ]
    },
    bus: {
      title: id ? 'Editar autobús' : 'Nou autobús',
      fields: [
        { name: 'number', label: 'Número', type: 'text', placeholder: 'BUS-001' },
        { name: 'plate', label: 'Placa', type: 'text', placeholder: '1234 ABC' },
        { name: 'company', label: 'Empresa', type: 'text', placeholder: 'Empresa Plana' },
        { name: 'capacity', label: 'Capacitat', type: 'number', placeholder: '55' },
        { name: 'route', label: 'Ruta assignada', type: 'select', options: data.routes.map(r => r.id) }
      ]
    },
    stop: {
      title: id ? 'Editar parada' : 'Nova parada',
      fields: [
        { name: 'name', label: 'Nom', type: 'text', placeholder: 'Nom de la parada' },
        { name: 'address', label: 'Adreça', type: 'text', placeholder: 'Adreça completa' },
        { name: 'lat', label: 'Latitud GPS', type: 'number', step: '0.0001', placeholder: '41.3851' },
        { name: 'lng', label: 'Longitud GPS', type: 'number', step: '0.0001', placeholder: '2.1734' },
        { name: 'routes', label: 'Rutes', type: 'text', placeholder: 'L-42, L-23' }
      ]
    },
    schedule: {
      title: id ? 'Editar horari' : 'Nou horari',
      fields: [
        { name: 'route', label: 'Ruta', type: 'select', options: data.routes.map(r => r.id) },
        { name: 'departure', label: 'Hora sortida', type: 'time' },
        { name: 'arrival', label: 'Hora arribada', type: 'time' },
        { name: 'frequency', label: 'Freqüència', type: 'text', placeholder: '30 min' },
        { name: 'days', label: 'Dies', type: 'text', placeholder: 'Dl-Dv' }
      ]
    },
    driver: {
      title: id ? 'Editar conductor' : 'Nou conductor',
      fields: [
        { name: 'name', label: 'Nom', type: 'text', placeholder: 'Nom complet' },
        { name: 'phone', label: 'Telèfon', type: 'tel', placeholder: '+34 612 345 678' },
        { name: 'license', label: 'Llicència', type: 'text', placeholder: 'D12345678' },
        { name: 'bus', label: 'Bus assignat', type: 'select', options: data.buses.map(b => b.number) }
      ]
    },
    notification: {
      title: 'Nova notificació',
      fields: [
        { name: 'type', label: 'Tipus', type: 'select', options: ['delay','accident','detour','info'] },
        { name: 'title', label: 'Títol', type: 'text', placeholder: 'Títol de la notificació' },
        { name: 'desc', label: 'Descripció', type: 'textarea', placeholder: 'Descripció detallada' },
        { name: 'route', label: 'Ruta afectada', type: 'select', options: data.routes.map(r => r.id) }
      ]
    }
  };
  
  const form = forms[type];
  title.textContent = form.title;
  
  let html = '';
  form.fields.forEach(field => {
    const value = id ? getFieldValue(type, id, field.name) : '';
    html += `<div class="form-group"><label>${field.label}</label>`;
    if (field.type === 'select') {
      html += `<select class="form-control" id="field-${field.name}">`;
      field.options.forEach(opt => {
        html += `<option value="${opt}" ${opt === value ? 'selected' : ''}>${opt}</option>`;
      });
      html += `</select>`;
    } else if (field.type === 'textarea') {
      html += `<textarea class="form-control" id="field-${field.name}" placeholder="${field.placeholder || ''}">${value}</textarea>`;
    } else {
      html += `<input type="${field.type}" class="form-control" id="field-${field.name}" placeholder="${field.placeholder || ''}" value="${value}" ${field.step ? `step="${field.step}"` : ''} />`;
    }
    html += `</div>`;
  });
  
  body.innerHTML = html;
  overlay.classList.add('show');
  
  document.getElementById('modalSave').onclick = saveModal;
}

function getFieldValue(type, id, fieldName) {
  const collections = { route: 'routes', bus: 'buses', stop: 'stops', schedule: 'schedules', driver: 'drivers', notification: 'notifications' };
  const collection = data[collections[type]];
  const item = collection.find(i => i.id === id);
  return item ? (item[fieldName] || '') : '';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
  currentModalType = null;
  editingId = null;
}

function saveModal() {
  const fields = {
    route: ['id','name','origin','destination','driver'],
    bus: ['number','plate','company','capacity','route'],
    stop: ['name','address','lat','lng','routes'],
    schedule: ['route','departure','arrival','frequency','days'],
    driver: ['name','phone','license','bus'],
    notification: ['type','title','desc','route']
  };
  
  const values = {};
  fields[currentModalType].forEach(f => {
    const el = document.getElementById('field-' + f);
    values[f] = el.value;
  });
  
  const collections = { route: 'routes', bus: 'buses', stop: 'stops', schedule: 'schedules', driver: 'drivers', notification: 'notifications' };
  const collection = data[collections[currentModalType]];
  
  if (editingId) {
    const idx = collection.findIndex(i => i.id === editingId);
    if (idx !== -1) {
      collection[idx] = { ...collection[idx], ...values };
      showToast('success', 'Actualitzat', 'Registre actualitzat correctament');
    }
  } else {
    if (currentModalType === 'notification') {
      values.id = Date.now();
      values.time = 'Ara mateix';
      values.read = false;
    } else {
      values.id = collection.length > 0 ? Math.max(...collection.map(i => typeof i.id === 'number' ? i.id : 0)) + 1 : 1;
      if (currentModalType === 'route') { values.status = 'active'; values.color = '#0066cc'; values.path = [[41.4,2.1],[41.5,2.2]]; }
      if (currentModalType === 'bus') { values.status = 'active'; }
      if (currentModalType === 'stop') { values.photos = 0; values.lat = parseFloat(values.lat); values.lng = parseFloat(values.lng); }
      if (currentModalType === 'schedule') { values.status = 'active'; }
      if (currentModalType === 'driver') { values.status = 'active'; }
    }
    collection.push(values);
    showToast('success', 'Creat', 'Nou registre afegit correctament');
  }
  
  saveData();
  closeModal();
  renderAll();
}

// ============ RENDERITZAT ============
function renderRoutes() {
  const filter = document.getElementById('filterRouteStatus')?.value || 'all';
  const search = (document.getElementById('searchRoute')?.value || '').toLowerCase();
  const tbody = document.getElementById('routesTable');
  if (!tbody) return;
  
  const filtered = data.routes.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search && !r.id.toLowerCase().includes(search) && !r.name.toLowerCase().includes(search)) return false;
    return true;
  });
  
  tbody.innerHTML = filtered.length === 0 
    ? `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-route"></i><h4>Cap ruta trobada</h4><p>Crea la teva primera ruta</p></div></td></tr>`
    : filtered.map(r => `
      <tr>
        <td><strong style="color:${r.color};">${r.id}</strong></td>
        <td>${r.name}</td>
        <td>${r.origin} → ${r.destination}</td>
        <td>${r.driver}</td>
        <td><span class="status-pill ${r.status}"><span class="status-dot"></span>${r.status === 'active' ? 'Activa' : r.status === 'delayed' ? 'Amb retard' : 'Inactiva'}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-sm btn-toggle" onclick="toggleRoute('${r.id}')"><i class="fas fa-power-off"></i></button>
            <button class="btn-sm btn-edit" onclick="openModal('route','${r.id}')"><i class="fas fa-edit"></i></button>
            <button class="btn-sm btn-delete" onclick="deleteItem('routes','${r.id}')"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
}

function renderBuses() {
  const filter = document.getElementById('filterBusStatus')?.value || 'all';
  const tbody = document.getElementById('busesTable');
  if (!tbody) return;
  
  const filtered = data.buses.filter(b => filter === 'all' || b.status === filter);
  tbody.innerHTML = filtered.length === 0
    ? `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-bus"></i><h4>Cap autobús</h4></div></td></tr>`
    : filtered.map(b => `
      <tr>
        <td><strong>${b.number}</strong></td>
        <td>${b.plate}</td>
        <td>${b.company}</td>
        <td>${b.capacity} places</td>
        <td>${b.route}</td>
        <td><span class="status-pill ${b.status}"><span class="status-dot"></span>${b.status === 'active' ? 'Actiu' : b.status === 'maintenance' ? 'Taller' : 'Inactiu'}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-sm btn-edit" onclick="openModal('bus',${b.id})"><i class="fas fa-edit"></i></button>
            <button class="btn-sm btn-delete" onclick="deleteItem('buses',${b.id})"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
}

function renderStops() {
  const tbody = document.getElementById('stopsTable');
  if (!tbody) return;
  tbody.innerHTML = data.stops.map(s => `
    <tr>
      <td><strong>${s.name}</strong></td>
      <td>${s.address}</td>
      <td><code style="font-size:11px;">${s.lat.toFixed(4)}, ${s.lng.toFixed(4)}</code></td>
      <td>${s.routes}</td>
      <td><i class="fas fa-image" style="color:var(--primary);"></i> ${s.photos}</td>
      <td>
        <div class="action-btns">
          <button class="btn-sm btn-edit" onclick="openModal('stop',${s.id})"><i class="fas fa-edit"></i></button>
          <button class="btn-sm btn-delete" onclick="deleteItem('stops',${s.id})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderSchedules() {
  const tbody = document.getElementById('schedulesTable');
  if (!tbody) return;
  tbody.innerHTML = data.schedules.map(s => `
    <tr>
      <td><strong>${s.route}</strong></td>
      <td>${s.departure}</td>
      <td>${s.arrival}</td>
      <td>${s.frequency}</td>
      <td>${s.days}</td>
      <td><span class="status-pill ${s.status}"><span class="status-dot"></span>${s.status === 'active' ? 'Actiu' : 'Inactiu'}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-sm btn-edit" onclick="openModal('schedule',${s.id})"><i class="fas fa-edit"></i></button>
          <button class="btn-sm btn-delete" onclick="deleteItem('schedules',${s.id})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderDrivers() {
  const tbody = document.getElementById('driversTable');
  if (!tbody) return;
  tbody.innerHTML = data.drivers.map(d => `
    <tr>
      <td><strong>${d.name}</strong></td>
      <td>${d.phone}</td>
      <td><code style="font-size:11px;">${d.license}</code></td>
      <td>${d.bus}</td>
      <td><span class="status-pill ${d.status}"><span class="status-dot"></span>${d.status === 'active' ? 'Actiu' : 'Inactiu'}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-sm btn-edit" onclick="openModal('driver',${d.id})"><i class="fas fa-edit"></i></button>
          <button class="btn-sm btn-delete" onclick="deleteItem('drivers',${d.id})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderNotifications() {
  const filter = document.getElementById('filterNotifType')?.value || 'all';
  const list = document.getElementById('notificationsList');
  if (!list) return;
  
  const filtered = data.notifications.filter(n => filter === 'all' || n.type === filter);
  list.innerHTML = filtered.length === 0
    ? `<div class="empty-state"><i class="fas fa-bell-slash"></i><h4>Cap notificació</h4></div>`
    : filtered.map(n => {
      const icons = { delay: 'fa-clock', accident: 'fa-exclamation-triangle', detour: 'fa-route', info: 'fa-info-circle' };
      return `
        <div class="notif-item ${n.read ? '' : 'unread'}">
          <div class="notif-icon ${n.type}"><i class="fas ${icons[n.type]}"></i></div>
          <div class="notif-content">
            <div class="notif-title">${n.title}</div>
            <div class="notif-desc">${n.desc}</div>
            <div class="notif-meta"><i class="fas fa-clock"></i> ${n.time} · Ruta ${n.route}</div>
          </div>
          <div class="notif-actions">
            ${!n.read ? `<button class="btn-sm btn-edit" onclick="markNotifRead(${n.id})"><i class="fas fa-check"></i></button>` : ''}
            <button class="btn-sm btn-delete" onclick="deleteNotif(${n.id})"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `;
    }).join('');
  
  document.getElementById('notifCount').textContent = data.notifications.filter(n => !n.read).length;
}

function renderDashboardNotifs() {
  const list = document.getElementById('dashboardNotifs');
  if (!list) return;
  const icons = { delay: 'fa-clock', accident: 'fa-exclamation-triangle', detour: 'fa-route', info: 'fa-info-circle' };
  list.innerHTML = data.notifications.slice(0, 3).map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}">
      <div class="notif-icon ${n.type}"><i class="fas ${icons[n.type]}"></i></div>
      <div class="notif-content">
        <div class="notif-title">${n.title}</div>
        <div class="notif-desc">${n.desc}</div>
        <div class="notif-meta">${n.time}</div>
      </div>
    </div>
  `).join('');
}

function renderUpcomingDepartures() {
  const container = document.getElementById('upcomingDepartures');
  if (!container) return;
  container.innerHTML = data.schedules.filter(s => s.status === 'active').slice(0, 5).map(s => {
    const route = data.routes.find(r => r.id === s.route);
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);">
        <div>
          <div style="font-weight:600;font-size:13px;color:${route?.color || 'var(--primary)'};">${s.route}</div>
          <div style="font-size:11px;color:var(--text-secondary);">${route?.name || ''}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:700;font-size:14px;">${s.departure}</div>
          <div style="font-size:11px;color:var(--text-secondary);">${s.days}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderActivityLog() {
  const list = document.getElementById('activityLog');
  if (!list) return;
  const icons = { route: 'fa-route', driver: 'fa-id-card', stop: 'fa-map-pin', export: 'fa-file-excel', sync: 'fa-sync' };
  list.innerHTML = data.activity.map(a => `
    <div class="notif-item">
      <div class="notif-icon info"><i class="fas ${icons[a.type] || 'fa-info-circle'}"></i></div>
      <div class="notif-content">
        <div class="notif-title">${a.action}</div>
        <div class="notif-meta">${a.time} · ${a.user}</div>
      </div>
    </div>
  `).join('');
}

function renderPhoneBuses() {
  const list = document.getElementById('phoneBusList');
  if (!list) return;
  list.innerHTML = data.routes.filter(r => r.status === 'active').slice(0, 3).map(r => `
    <div class="phone-bus-card" style="border-left-color:${r.color};">
      <div class="phone-bus-card-header">
        <strong style="color:${r.color};">${r.id}</strong>
        <span class="status-pill active" style="font-size:9px;padding:2px 6px;">En marxa</span>
      </div>
      <div class="phone-bus-route">${r.name}</div>
      <div class="phone-bus-meta">
        <span><i class="fas fa-clock"></i> 5 min</span>
        <span><i class="fas fa-map-marker-alt"></i> 2 parades</span>
      </div>
    </div>
  `).join('');
}

function renderCharts() {
  // Passengers chart
  const pChart = document.getElementById('passengersChart');
  if (pChart) {
    const max = Math.max(...data.routes.map(r => Math.floor(Math.random() * 3000) + 1000));
    pChart.innerHTML = data.routes.map(r => {
      const val = Math.floor(Math.random() * 3000) + 1000;
      const h = (val / max) * 100;
      return `<div class="bar" style="height:${h}%;background:linear-gradient(180deg,${r.color},${r.color}dd);"><span class="bar-value">${val}</span><span class="bar-label">${r.id}</span></div>`;
    }).join('');
  }
  
  // Occupancy chart
  const oChart = document.getElementById('occupancyChart');
  if (oChart) {
    oChart.innerHTML = data.routes.map(r => {
      const occ = Math.floor(Math.random() * 40) + 50;
      return `<div class="progress-item"><label><span>${r.id} · ${r.name}</span><span>${occ}%</span></label><div class="progress-bar"><div class="progress-fill" style="width:${occ}%;background:${r.color};"></div></div></div>`;
    }).join('');
  }
  
  // Punctuality chart
  const puChart = document.getElementById('punctualityChart');
  if (puChart) {
    const days = ['Dl','Dt','Dc','Dj','Dv','Ds','Dg'];
    puChart.innerHTML = days.map(d => {
      const val = Math.floor(Math.random() * 15) + 85;
      return `<div class="bar" style="height:${val}%;background:linear-gradient(180deg,#00b359,#00994d);"><span class="bar-value">${val}%</span><span class="bar-label">${d}</span></div>`;
    }).join('');
  }
  
  // Satisfaction chart
  const sChart = document.getElementById('satisfactionChart');
  if (sChart) {
    const metrics = [
      { name: 'Puntualitat', val: 94 },
      { name: 'Neteja', val: 87 },
      { name: 'Comfort', val: 82 },
      { name: 'Informació', val: 91 },
      { name: 'Atenció', val: 89 }
    ];
    sChart.innerHTML = metrics.map(m => `
      <div class="progress-item"><label><span>${m.name}</span><span>${m.val}%</span></label><div class="progress-bar"><div class="progress-fill" style="width:${m.val}%;"></div></div></div>
    `).join('');
  }
}

// ============ ACCIONS ============
function deleteItem(collection, id) {
  if (!confirm('Segur que vols eliminar aquest registre?')) return;
  data[collection] = data[collection].filter(i => i.id != id);
  saveData();
  renderAll();
  showToast('success', 'Eliminat', 'Registre eliminat correctament');
}

function toggleRoute(id) {
  const route = data.routes.find(r => r.id === id);
  if (route) {
    route.status = route.status === 'active' ? 'inactive' : 'active';
    saveData();
    renderAll();
    showToast('success', 'Estat actualitzat', `Ruta ${id} ${route.status === 'active' ? 'activada' : 'desactivada'}`);
  }
}

function markNotifRead(id) {
  const n = data.notifications.find(x => x.id === id);
  if (n) { n.read = true; saveData(); renderNotifications(); renderDashboardNotifs(); }
}

function markAllRead() {
  data.notifications.forEach(n => n.read = true);
  saveData();
  renderNotifications();
  renderDashboardNotifs();
  showToast('success', 'Notificacions', 'Totes marcades com a llegides');
}

function deleteNotif(id) {
  data.notifications = data.notifications.filter(n => n.id !== id);
  saveData();
  renderNotifications();
  renderDashboardNotifs();
}

function exportData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'empresa-plana-backup.json';
  a.click();
  showToast('success', 'Exportació', 'Dades exportades correctament');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        data = JSON.parse(ev.target.result);
        saveData();
        renderAll();
        showToast('success', 'Importació', 'Dades importades correctament');
      } catch(err) {
        showToast('error', 'Error', 'Fitxer no vàlid');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// ============ TOAST ============
function showToast(type, title, message) {
  const container = document.getElementById('toastContainer');
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-circle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${icons[type]} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ============ MAPES ============
let mainMap = null;
let dashboardMap = null;
let busMarkers = {};
let routeLines = {};

function createBusIcon(bus) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:38px;height:38px;background:${bus.color};border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:16px;box-shadow:0 2px 10px rgba(0,0,0,0.3);"><i class="fas fa-bus"></i></div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
}

function createStopIcon() {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:22px;height:22px;background:#00b359;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
}

function initMainMap() {
  if (mainMap) return;
  mainMap = L.map('map', { center: [41.5, 2.1], zoom: 8, zoomControl: false });
  L.control.zoom({ position: 'bottomright' }).addTo(mainMap);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap · Empresa Plana',
    maxZoom: 19
  }).addTo(mainMap);
  
  data.routes.forEach(route => {
    if (route.path && route.path.length > 1) {
      const line = L.polyline(route.path, { color: route.color, weight: 4, opacity: 0.7 }).addTo(mainMap);
      routeLines[route.id] = line;
    }
    const startPos = route.path ? route.path[0] : [41.4, 2.1];
    const marker = L.marker(startPos, { icon: createBusIcon(route) }).addTo(mainMap);
    marker.bindPopup(`<strong style="color:${route.color};">${route.id}</strong> ${route.name}<br><small>Conductor: ${route.driver}</small>`);
    busMarkers[route.id] = { marker, pos: 0, dir: 1 };
  });
  
  data.stops.forEach(stop => {
    L.marker([stop.lat, stop.lng], { icon: createStopIcon() }).addTo(mainMap)
      .bindPopup(`<strong>${stop.name}</strong><br><small>${stop.address}</small><br><small>Rutes: ${stop.routes}</small>`);
  });
  
  // Simulació GPS
  setInterval(() => {
    data.routes.forEach(route => {
      if (route.status !== 'active' || !route.path || route.path.length < 2) return;
      const bm = busMarkers[route.id];
      if (!bm) return;
      bm.pos += 0.003 * bm.dir;
      if (bm.pos >= 1) { bm.pos = 1; bm.dir = -1; }
      if (bm.pos <= 0) { bm.pos = 0; bm.dir = 1; }
      const idx = Math.floor(bm.pos * (route.path.length - 1));
      const nextIdx = Math.min(idx + 1, route.path.length - 1);
      const frac = (bm.pos * (route.path.length - 1)) - idx;
      const lat = route.path[idx][0] + (route.path[nextIdx][0] - route.path[idx][0]) * frac;
      const lng = route.path[idx][1] + (route.path[nextIdx][1] - route.path[idx][1]) * frac;
      bm.marker.setLatLng([lat, lng]);
    });
  }, 1000);
  
  // Cerca
  document.getElementById('mapSearch')?.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(e.target.value)}&countrycodes=es&limit=1`);
        const d = await res.json();
        if (d.length > 0) {
          mainMap.flyTo([parseFloat(d[0].lat), parseFloat(d[0].lon)], 13);
          showToast('success', 'Localitzat', d[0].display_name.split(',')[0]);
        }
      } catch(err) {}
    }
  });
}

function initDashboardMap() {
  if (dashboardMap) return;
  dashboardMap = L.map('dashboardMap', { center: [41.5, 2.1], zoom: 8, zoomControl: false, dragging: false, scrollWheelZoom: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(dashboardMap);
  
  data.routes.forEach(route => {
    if (route.path && route.path.length > 1) {
      L.polyline(route.path, { color: route.color, weight: 3, opacity: 0.7 }).addTo(dashboardMap);
    }
  });
  data.stops.forEach(stop => {
    L.marker([stop.lat, stop.lng], { icon: createStopIcon() }).addTo(dashboardMap);
  });
}

function locateMe() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      mainMap.flyTo([pos.coords.latitude, pos.coords.longitude], 14);
      L.marker([pos.coords.latitude, pos.coords.longitude], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="width:20px;height:20px;background:#3388ff;border:3px solid white;border-radius:50%;box-shadow:0 0 0 10px rgba(51,136,255,0.3);"></div>',
          iconSize: [20, 20]
        })
      }).addTo(mainMap).bindPopup('La teva ubicació').openPopup();
    }, () => {
      mainMap.flyTo([41.3851, 2.1734], 12);
      showToast('warning', 'Geolocalització', 'No s\'ha pogut obtenir la ubicació');
    });
  }
}

// ============ INICIALITZACIÓ ============
function renderAll() {
  renderRoutes();
  renderBuses();
  renderStops();
  renderSchedules();
  renderDrivers();
  renderNotifications();
  renderDashboardNotifs();
  renderUpcomingDepartures();
  renderActivityLog();
  renderPhoneBuses();
  renderCharts();
  document.getElementById('statBuses').textContent = data.buses.filter(b => b.status === 'active').length;
  document.getElementById('statRoutes').textContent = data.routes.filter(r => r.status === 'active').length;
  document.getElementById('statAlerts').textContent = data.notifications.filter(n => !n.read).length;
}

renderAll();

// Tancar modal amb clic fora
document.getElementById('modalOverlay').onclick = (e) => {
  if (e.target.id === 'modalOverlay') closeModal();
};

showToast('success', 'Benvingut', 'Sistema Empresa Plana carregat correctament');
</script>
</body>
</html>
```