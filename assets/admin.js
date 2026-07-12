(() => {
  try {
  const STORE_KEY = "pioneerVoucherBillingSystem.v1";
  const SESSION_KEY = "pioneerVoucherBillingSystem.session";
  const DATA_VERSION = 2;
  const PAGE_SIZE = 8;

  const PLAN_LIBRARY = [
    { key: "daily", name: "Daily Voucher", minutes: 1440, price: 1000, cost: 350, display: "Valid for 24 Hours" },
    { key: "3days", name: "3 Days Voucher", minutes: 4320, price: 3000, cost: 1000, display: "Valid for 3 Days" },
    { key: "weekly", name: "Weekly Voucher", minutes: 10080, price: 5000, cost: 1800, display: "Valid for 7 Days" },
    { key: "monthly", name: "Monthly Voucher", minutes: 43200, price: 20000, cost: 7000, display: "Valid for 30 Days" },
    { key: "3devices", name: "3 Devices", minutes: 43200, price: 55000, cost: 30000, display: "Connect up to 3 Devices" }
  ];

  const BULK_AMOUNTS = [10, 20, 50, 100, 500, 1000];

  function defaultCaptivePortalSettings() {
    return {
      template: "dark",
      companyName: "PIONEER 5G NET",
      logoText: "EK",
      logo: "",
      backgroundImage: "",
      backgroundVideo: "",
      bannerImage: "",
      favicon: "",
      welcomeMessage: "Fast internet access for guests and residents.",
      loginTitle: "PIONEER 5G NET",
      loginSubtitle: "Select a package or enter your voucher code.",
      footerText: "0709928840",
      contactPhone: "0709928840",
      whatsapp: "0709928840",
      email: "info@pioneer5g.net",
      facebook: "https://facebook.com/pioneer5g",
      instagram: "https://instagram.com/pioneer5g",
      tiktok: "https://tiktok.com/@pioneer5g",
      website: "https://pioneer5g.net",
      primaryColor: "#7c3aed",
      secondaryColor: "#1e1b4b",
      buttonColor: "#7c3aed",
      fontFamily: "Arial, Helvetica, sans-serif",
      usernameLogin: false,
      voucherLogin: true,
      rememberMe: true,
      terms: true,
      privacy: true,
      passwordToggle: true,
      customHtml: "",
      customCss: "",
      customJs: "",
      backups: []
    };
  }

  const PORTAL_TEMPLATES = {
    modern: { primaryColor: "#2563eb", secondaryColor: "#f8fafc", buttonColor: "#2563eb", fontFamily: "Inter, Arial, sans-serif", welcomeMessage: "Reliable Wi-Fi access in seconds.", loginSubtitle: "Buy a plan, pay securely, and connect instantly." },
    minimal: { primaryColor: "#111827", secondaryColor: "#ffffff", buttonColor: "#111827", fontFamily: "Arial, Helvetica, sans-serif", welcomeMessage: "Simple hotspot access.", loginSubtitle: "Enter voucher or buy a package." },
    dark: { primaryColor: "#7c3aed", secondaryColor: "#1e1b4b", buttonColor: "#7c3aed", fontFamily: "Arial, Helvetica, sans-serif", welcomeMessage: "Fast, secure Wi-Fi access.", loginSubtitle: "Select a package and pay with Mobile Money." },
    light: { primaryColor: "#7c3aed", secondaryColor: "#eef2ff", buttonColor: "#7c3aed", fontFamily: "Verdana, Arial, sans-serif", welcomeMessage: "Welcome to guest Wi-Fi.", loginSubtitle: "Choose your package to continue." },
    glassmorphism: { primaryColor: "#38bdf8", secondaryColor: "rgba(15, 23, 42, .62)", buttonColor: "#38bdf8", fontFamily: "Inter, Arial, sans-serif", welcomeMessage: "Premium wireless access.", loginSubtitle: "A clean portal for instant connectivity." }
  };

  const money = new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0
  });

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const nowISO = () => new Date().toISOString();
  const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));

  const defaultState = () => {
    const settings = {
      companyName: "PIONEER 5G NET",
      companyLogoText: "EK",
      companyAddress: "Kireka Trading Centre, Kampala, Uganda",
      companyPhone: "0709928840",
      companyEmail: "info@pioneer5g.net",
      companyTin: "TIN 1049837261",
      receiptFooter: "Keep this receipt. Voucher validity starts on first successful login.",
      currency: "UGX",
      taxRate: 0,
      backupEnabled: true,
      darkMode: false,
      captivePortal: defaultCaptivePortalSettings()
    };

    const users = [
      { id: "u-admin", name: "Grace N.", username: "admin", password: "admin123", role: "Administrator", active: true },
      { id: "u-manager", name: "Daniel K.", username: "manager", password: "manager123", role: "Manager", active: true },
      { id: "u-cashier", name: "Stella A.", username: "cashier", password: "cashier123", role: "Cashier", active: true }
    ];

    const customers = [
      { id: "c-001", name: "Amina Kato", phone: "0701222111", createdAt: addDays(-18), notes: "Hostel resident, usually buys daily vouchers" },
      { id: "c-002", name: "Brian Mugisha", phone: "0755141009", createdAt: addDays(-10), notes: "Small shop owner, prefers weekly vouchers" },
      { id: "c-003", name: "Joseph Tumusiime", phone: "0788444210", createdAt: addDays(-44), notes: "Monthly home user" },
      { id: "c-004", name: "Mercy Nakanwagi", phone: "0772456789", createdAt: addDays(-7), notes: "Cash customer near access point 2" },
      { id: "c-005", name: "Peter Ssemanda", phone: "0703987654", createdAt: addDays(-2), notes: "Mobile money customer" }
    ];

    const vouchers = [
      buildVoucher("PNR-47M9-K2QP", PLAN_LIBRARY[0], "Used", "c-001", addDays(-1), "u-cashier", "BATCH-20260620-DLY"),
      buildVoucher("PNR-92HF-7YXA", PLAN_LIBRARY[0], "Sold", "c-004", addDays(0), "u-cashier", "BATCH-20260620-DLY"),
      buildVoucher("PNR-5A6P-JD8R", PLAN_LIBRARY[1], "Sold", "c-002", addDays(-1), "u-cashier", "BATCH-20260619-WKL"),
      buildVoucher("PNR-R8Q2-LM7C", PLAN_LIBRARY[2], "Used", "c-003", addDays(-12), "u-manager", "BATCH-20260608-MTH"),
      buildVoucher("PNR-XL33-8FNT", PLAN_LIBRARY[2], "Expired", "c-003", addDays(-48), "u-manager", "BATCH-20260503-MTH"),
      ...seedAvailable("BATCH-20260620-DLY", PLAN_LIBRARY[0], 18, "D"),
      ...seedAvailable("BATCH-20260619-WKL", PLAN_LIBRARY[1], 9, "W"),
      ...seedAvailable("BATCH-20260608-MTH", PLAN_LIBRARY[2], 5, "M")
    ];

    const sales = [
      makeSale("s-001", invoiceFor(addDays(-1), 1, "INV"), invoiceFor(addDays(-1), 1, "RCP"), "c-001", "PNR-47M9-K2QP", PLAN_LIBRARY[0], "Mobile Money", "u-cashier", addDays(-1)),
      makeSale("s-002", invoiceFor(addDays(0), 1, "INV"), invoiceFor(addDays(0), 1, "RCP"), "c-004", "PNR-92HF-7YXA", PLAN_LIBRARY[0], "Cash", "u-cashier", addDays(0)),
      makeSale("s-003", invoiceFor(addDays(-1), 2, "INV"), invoiceFor(addDays(-1), 2, "RCP"), "c-002", "PNR-5A6P-JD8R", PLAN_LIBRARY[1], "Mobile Money", "u-cashier", addDays(-1)),
      makeSale("s-004", invoiceFor(addDays(-12), 1, "INV"), invoiceFor(addDays(-12), 1, "RCP"), "c-003", "PNR-R8Q2-LM7C", PLAN_LIBRARY[2], "Card", "u-manager", addDays(-12)),
      makeSale("s-005", invoiceFor(addDays(-48), 1, "INV"), invoiceFor(addDays(-48), 1, "RCP"), "c-003", "PNR-XL33-8FNT", PLAN_LIBRARY[2], "Mobile Money", "u-manager", addDays(-48))
    ];

    return { version: DATA_VERSION, settings, users, customers, vouchers, sales, audit: [], currentRoute: "dashboard" };
  };

  function seedAvailable(batchId, plan, count, prefix) {
    return Array.from({ length: count }, (_, index) => {
      const serial = String(index + 1).padStart(3, "0");
      return buildVoucher(`PNR-${prefix}${serial}-${batchId.slice(-3)}${serial.slice(1)}`, plan, "Available", "", "", "u-admin", batchId);
    });
  }

  function invoiceFor(dateValue, count, prefix) {
    const date = new Date(dateValue).toISOString().slice(0, 10).replaceAll("-", "");
    return `${prefix}-${date}-${String(count).padStart(3, "0")}`;
  }

  function addDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  function buildVoucher(code, plan, status = "Available", customerId = "", soldAt = "", cashierId = "", batchId = "") {
    const activatedAt = status === "Used" ? soldAt : "";
    const expiresAt = activatedAt ? new Date(new Date(activatedAt).getTime() + plan.minutes * 60000).toISOString() : "";
    return {
      id: uid("v"),
      code,
      plan: plan.name,
      planKey: plan.key,
      durationMinutes: plan.minutes,
      validity: plan.display,
      price: plan.price,
      status,
      customerId,
      soldAt,
      activatedAt,
      usedAt: activatedAt,
      expiresAt,
      cashierId,
      generatedBy: cashierId || "u-admin",
      batchId: batchId || nextBatchId(),
      disabled: false,
      createdAt: nowISO()
    };
  }

  function makeSale(id, invoice, receipt, customerId, voucherCode, plan, method, cashierId, date) {
    return {
      id,
      invoiceNo: invoice,
      receiptNo: receipt,
      customerId,
      voucherCode,
      plan: plan.name,
      subtotal: plan.price,
      tax: 0,
      total: plan.price,
      method,
      cashierId,
      createdAt: date,
      profit: plan.price - plan.cost
    };
  }

  let state = loadState();
  let session;
  try { session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch(ex) { session = null; }
  let appModal;
  let confirmModal;
  let pendingConfirm = null;
  let pageState = {
    vouchers: { page: 1, search: "", status: "All", sort: "createdAt-desc" },
    customers: { page: 1, search: "", sort: "name-asc" },
    sales: { page: 1, range: "daily" }
  };

  if (!window.bootstrap) {
    window.bootstrap = {
      Modal: class {
        constructor(element) {
          this.element = element;
        }
        show() {
          this.element.classList.add("show");
          this.element.removeAttribute("aria-hidden");
        }
        hide() {
          this.element.classList.remove("show");
          this.element.setAttribute("aria-hidden", "true");
        }
      }
    };
  }

  function loadState() {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    try {
      return migrate(JSON.parse(raw));
    } catch {
      return defaultState();
    }
  }

  function migrate(data) {
    const base = defaultState();
    const migrated = {
      ...base,
      ...data,
      version: DATA_VERSION,
      settings: { ...base.settings, ...(data.settings || {}) },
      users: data.users?.length ? data.users : base.users,
      customers: data.customers || base.customers,
      vouchers: data.vouchers || base.vouchers,
      sales: data.sales || base.sales,
      audit: data.audit || []
    };
    migrated.settings.captivePortal = { ...base.settings.captivePortal, ...(data.settings?.captivePortal || {}) };
    migrated.settings.captivePortal.backups = data.settings?.captivePortal?.backups || [];
    migrated.vouchers = migrated.vouchers.map(normalizeVoucher);
    migrated.sales = migrated.sales.map(normalizeSale);
    ensureInventory(migrated);
    return migrated;
  }

  function ensureInventory(data) {
    PLAN_LIBRARY.forEach((plan) => {
      const available = data.vouchers.filter((voucher) => voucher.planKey === plan.key && voucher.status === "Available").length;
      const minimum = plan.key === "daily" ? 12 : plan.key === "weekly" ? 6 : 4;
      if (available >= minimum) return;
      const batchId = `BATCH-${todayISO().replaceAll("-", "")}-${plan.key.toUpperCase()}`;
      for (let index = available; index < minimum; index++) {
        let code = realisticCode();
        while (data.vouchers.some((voucher) => voucher.code === code)) code = realisticCode();
        data.vouchers.unshift(buildVoucher(code, plan, "Available", "", "", "u-admin", batchId));
      }
    });
  }

  function normalizeVoucher(voucher) {
    const plan = planByName(voucher.plan) || PLAN_LIBRARY[0];
    return {
      ...voucher,
      plan: plan.name,
      planKey: voucher.planKey || plan.key,
      durationMinutes: voucher.durationMinutes || plan.minutes,
      validity: voucher.validity || plan.display,
      price: Number(voucher.price || plan.price),
      status: voucher.disabled ? "Expired" : (voucher.status || "Available"),
      activatedAt: voucher.activatedAt || voucher.usedAt || "",
      usedAt: voucher.usedAt || voucher.activatedAt || "",
      expiresAt: voucher.expiresAt || ((voucher.activatedAt || voucher.usedAt) ? new Date(new Date(voucher.activatedAt || voucher.usedAt).getTime() + plan.minutes * 60000).toISOString() : ""),
      generatedBy: voucher.generatedBy || "u-admin",
      batchId: voucher.batchId || "BATCH-MIGRATED",
      disabled: Boolean(voucher.disabled),
      createdAt: voucher.createdAt || nowISO()
    };
  }

  function normalizeSale(sale) {
    const plan = planByName(sale.plan) || PLAN_LIBRARY[0];
    return {
      ...sale,
      plan: plan.name,
      subtotal: Number(sale.subtotal || plan.price),
      tax: Number(sale.tax || 0),
      total: Number(sale.total || sale.subtotal || plan.price),
      profit: Number(sale.profit || ((sale.total || plan.price) - plan.cost))
    };
  }

  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch(ex) {}
  }

  function user() {
    return state.users.find((item) => item.id === session?.userId);
  }

  function hasPermission(action) {
    const role = user()?.role || "";
    const permissions = {
      Administrator: ["all"],
      Manager: ["read", "write", "export", "reports", "settings"],
      Cashier: ["read", "sell", "customers"]
    };
    return permissions[role]?.includes("all") || permissions[role]?.includes(action);
  }

  document.addEventListener("DOMContentLoaded", () => {
    try { appModal = new bootstrap.Modal($("#appModal")); } catch(e) {}
    try { confirmModal = new bootstrap.Modal($("#confirmModal")); } catch(e) {}
    bindGlobalEvents();
    applyTheme();
    if (session?.userId && user()) showApp();
  });

  function bindGlobalEvents() {
    listen("#loginForm", "submit", login);
    listen("#logoutBtn", "click", logout);
    listen("#resetPasswordBtn", "click", resetPassword);
    listen("#themeToggle", "click", toggleTheme);
    listen("#backupBtn", "click", backupData);
    listen("#quickSellBtn", "click", () => route("billing"));
    listen("#sidebarToggle", "click", () => $(".sidebar").classList.toggle("show"));
    listen("#confirmYes", "click", () => {
      if (pendingConfirm) pendingConfirm();
      confirmModal.hide();
      pendingConfirm = null;
    });
    document.addEventListener("click", (event) => {
      if (event.target.matches("[data-bs-dismiss='modal'], .btn-close")) {
        appModal.hide();
        confirmModal.hide();
      }
    });
    $$(".sidebar .nav-link[data-route]").forEach((button) => {
      button.addEventListener("click", () => route(button.dataset.route));
    });
  }

  function listen(selector, event, handler) {
    const el = $(selector);
    if (el) el.addEventListener(event, handler);
  }

  function showAuth() {
    $("#authScreen").classList.remove("d-none");
    $("#appShell").classList.add("d-none");
  }

  function renderApp() {
    try {
      $("#currentUserLabel").textContent = `${user().name} (${user().role})`;
      $("#sideCompany").textContent = state.settings.companyName;
      route(state.currentRoute || "dashboard");
    } catch (e) { console.error("renderApp error", e); }
  }

  function showApp() {
    $("#authScreen").classList.add("d-none");
    $("#appShell").classList.remove("d-none");
    renderApp();
  }

  function login(event) {
    event.preventDefault();
    const username = $("#loginUsername").value.trim();
    const password = $("#loginPassword").value;
    const account = state.users.find((item) => item.username === username && item.password === password && item.active);
    if (!account) return notify("Invalid login details or inactive account.", "error");
    session = { userId: account.id, loginAt: nowISO() };
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch(ex) {}
    audit("Login", `${account.username} logged in`);
    notify("Login successful.", "success");
    showApp();
  }

  function logout() {
    audit("Logout", `${user()?.username || "User"} logged out`);
    localStorage.removeItem(SESSION_KEY);
    session = null;
    showAuth();
  }

  function resetPassword() {
    const username = $("#loginUsername").value.trim() || "admin";
    const account = state.users.find((item) => item.username === username);
    if (!account) return notify("Enter an existing username to reset.", "warning");
    account.password = `${account.username}123`;
    saveState();
    notify(`Password reset to ${account.password}`, "success");
  }

  function route(name) {
    state.currentRoute = name;
    saveState();
    $(".sidebar").classList.remove("show");
    $$(".sidebar .nav-link[data-route]").forEach((button) => button.classList.toggle("active", button.dataset.route === name));
    const title = routeTitle(name);
    $("#pageTitle").textContent = title;
    const host = $("#viewHost");
    host.classList.add("loading");
    setTimeout(() => {
      try {
        host.innerHTML = views[name] ? views[name]() : views.dashboard();
        bindRouteEvents(name);
        drawRouteCharts(name);
      } catch (e) { console.error("route error", e); host.innerHTML = `<div class="alert alert-danger m-3">Route error: ${e.message}</div>`; }
      host.classList.remove("loading");
    }, 120);
    if (!host._routeListener) {
      host._routeListener = true;
      host.addEventListener("click", function(e) {
        const card = e.target.closest("[data-route]");
        if (card) { route(card.dataset.route); e.stopPropagation(); }
      });
    }
  }
  window._p5route = route;
  window._p5nav = function(name) { route(name); };
  window.quickSell = function(planKey) { route("billing"); };

  function routeTitle(name) {
    return {
      dashboard: "Dashboard",
      daily: "Daily Voucher - 1,000 UGX",
      3days: "3 Days Voucher - 3,000 UGX",
      3devices: "3 Devices - 55,000 UGX",
      weekly: "Weekly Voucher - 5,000 UGX",
      monthly: "Monthly Voucher - 20,000 UGX",
      routerDashboard: "Router Dashboard",
      bandwidth: "Bandwidth Monitor",
      topUsers: "Top Data Users",
      remoteAccess: "Remote Access",
      generate: "Generate Vouchers",
      vouchers: "Voucher Management",
      billing: "Billing System",
      pppoe: "PPPoE Users",
      mobileMoney: "Mobile Money",
      agents: "Agent POS",
      customers: "Customer Management",
      sales: "Sales",
      reports: "Reports",
      users: "User Management",
      settings: "Settings",
      captivePortal: "Settings - Captive Portal"
    }[name] || "Dashboard";
  }

  function planPage(planKey) {
    const plan = planByKey(planKey);
    if (!plan) return views.dashboard();
    const planVouchers = state.vouchers.filter((v) => v.planKey === planKey);
    const available = planVouchers.filter((v) => v.status === "Available").length;
    const sold = planVouchers.filter((v) => ["Sold", "Used"].includes(v.status)).length;
    const planSales = state.sales.filter((s) => s.plan === plan.name);
    const revenue = planSales.reduce((s, sale) => s + sale.total, 0);
    const profit = planSales.reduce((s, sale) => s + sale.profit, 0);
    return `
      <div class="row g-3 mb-3">
        ${stat("Available", available, "bi-ticket-perforated")}
        ${stat("Sold", sold, "bi-bag-check")}
        ${stat("Revenue", money.format(revenue), "bi-cash-stack")}
        ${stat("Profit", money.format(profit), "bi-graph-up-arrow")}
      </div>
      <div class="panel-card card mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="eyebrow">${plan.display}</span>
              <h3>${money.format(plan.price)}</h3>
            </div>
            <button class="btn btn-primary" data-generate-single="${plan.key}"><i class="bi bi-plus-circle"></i> Generate</button>
          </div>
        </div>
      </div>
      <div class="panel-card card">
        <div class="card-body">
          <h5>Recent Sales</h5>
          <div class="table-responsive">
            <table class="table">
              <thead><tr><th>Receipt</th><th>Customer</th><th>Amount</th><th>Date</th></tr></thead>
              <tbody>${planSales.slice(-10).reverse().map((s) => `<tr><td>${s.receiptNo}</td><td>${customerName(s.customerId)}</td><td>${money.format(s.total)}</td><td>${new Date(s.date).toLocaleDateString([], { day: "numeric", month: "short" })}</td></tr>`).join("") || '<tr><td colspan="4" class="text-muted text-center">No sales yet</td></tr>'}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  const views = {
    daily() { return planPage("daily"); },
    weekly() { return planPage("weekly"); },
    monthly() { return planPage("monthly"); },
    dashboard() {
      const stats = metrics();
      const planStats = voucherPlanStats();
      const totCustomers = state.customers.length;
      const totSales = state.sales.length;
      const totVouchers = state.vouchers.length;
      const totUsers = state.users.filter((u) => u.active).length;
      const last = lastSale();
      return `
        <div class="d-flex flex-wrap gap-2 mb-3">
          <button class="btn btn-primary" data-route="generate" onclick="_p5nav('generate')"><i class="bi bi-plus-circle"></i> Generate Voucher</button>
          <button class="btn btn-success" data-route="billing" onclick="_p5nav('billing')"><i class="bi bi-cash-coin"></i> Sell Voucher</button>
          <button class="btn btn-outline-primary" data-route="customers" onclick="_p5nav('customers')"><i class="bi bi-person-plus"></i> Add Customer</button>
          <button class="btn btn-outline-secondary" data-export="sales-csv"><i class="bi bi-download"></i> Export</button>
        </div>
        <div class="row g-3 mb-3">
          ${PLAN_LIBRARY.map((plan) => `
            <div class="col-md-6 col-xl-3">
              <div class="panel-card card h-100">
                <div class="card-body">
                  <span class="eyebrow">${plan.display}</span>
                  <h5 class="mb-1">${plan.name}</h5>
                  <h3 class="text-primary mb-2">${money.format(plan.price)}</h3>
                  <div class="d-flex gap-2">
                    <button class="btn btn-primary flex-fill" data-route="${plan.key}" onclick="_p5nav('${plan.key}')">Manage</button>
                    <button class="btn btn-outline-success flex-fill" data-quick-sell="${plan.key}" onclick="quickSell('${plan.key}')">Sell</button>
                  </div>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
        <div class="row g-3 mb-3">
          ${stat("Daily Revenue", money.format(stats.dailyRevenue), "bi-calendar-day", "daily")}
          ${stat("Weekly Revenue", money.format(stats.weeklyRevenue), "bi-calendar-week", "weekly")}
          ${stat("Monthly Revenue", money.format(stats.monthlyRevenue), "bi-calendar3", "monthly")}
          ${stat("Total Revenue", money.format(stats.totalRevenue), "bi-bank", "sales")}
        </div>
        <div class="row g-3 mb-3">
          ${PLAN_LIBRARY.map((plan) => stat(`${shortPlan(plan)} Available`, planStats[plan.key].available, "bi-ticket-perforated", plan.key)).join("")}
          ${stat("Expired Vouchers", stats.expiredVouchers, "bi-hourglass-bottom", "vouchers")}
          ${stat("Active Users", stats.activeUsers, "bi-wifi", "customers")}
        </div>
        <div class="row g-3 mb-3">
          ${stat("Customers", totCustomers, "bi-people", "customers")}
          ${stat("Total Sales", totSales, "bi-receipt", "sales")}
          ${stat("Total Vouchers", totVouchers, "bi-upc-scan", "vouchers")}
          ${stat("Staff Users", totUsers, "bi-person-badge", "users")}
        </div>
        <div class="row g-3 mb-3">
          ${PLAN_LIBRARY.map((plan) => stat(`${shortPlan(plan)} Sold Today`, planStats[plan.key].soldToday, "bi-bag-check", plan.key)).join("")}
          ${stat("Total Profit", money.format(state.sales.reduce((s, sale) => s + sale.profit, 0)), "bi-graph-up-arrow", "sales")}
        </div>
        <div class="row g-3 mb-3">
          <div class="col-lg-8">
            <div class="chart-card">
              <div class="d-flex justify-content-between align-items-center mb-2"><h5 class="mb-0">Daily Revenue (7 Days)</h5><button class="btn btn-sm btn-outline-primary" data-export-report="daily">Export</button></div>
              <canvas class="chart-canvas" id="dailyRevenueChart"></canvas>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="chart-card">
              <h5>Voucher Usage</h5>
              <canvas class="chart-canvas" id="voucherUsageChart"></canvas>
            </div>
          </div>
        </div>
        ${stockAlertsPanel(planStats)}
        <div class="row g-3">
          <div class="col-lg-7">${recentSalesPanel()}</div>
          <div class="col-lg-5">${bestPlansPanel()}</div>
        </div>
        ${last ? `
        <div class="row g-3 mt-2">
          <div class="col-12">
            <div class="panel-card card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div><i class="bi bi-activity me-1 text-primary"></i> <strong>Last Sale:</strong> ${escapeHtml(customerName(last.customerId))} — ${escapeHtml(last.plan)} — ${money.format(last.total)} — ${last.createdAt ? new Date(last.createdAt).toLocaleString() : ""}</div>
                  <span class="text-muted small">${statusBadge(last.status || "Completed")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>` : ""}
        <div class="row g-3 mt-2">
          <div class="col-12">
            <div class="panel-card card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div><i class="bi bi-info-circle me-1 text-primary"></i> <strong>PIONEER 5G NET</strong> — Kireka Trading Centre, Kampala — ${money.format(stats.totalRevenue)} total revenue — ${totCustomers} customers — ${totVouchers} vouchers issued</div>
                  <span class="text-muted small">Updated ${new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    generate() {
      return `
        <div class="row g-3 mb-3">
          ${PLAN_LIBRARY.map((plan) => `
            <div class="col-lg-4">
              <div class="panel-card card h-100">
                <div class="card-body">
                  <span class="eyebrow">${plan.display}</span>
                  <h5>${plan.name}</h5>
                  <h3>${money.format(plan.price)}</h3>
                  <p class="text-muted mb-3">Validity starts after the first successful login.</p>
                  <button class="btn btn-primary w-100" data-generate-single="${plan.key}"><i class="bi bi-plus-circle"></i> Generate One</button>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
        <div class="panel-card card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
              <div>
                <h5 class="mb-1">Bulk Voucher Generation</h5>
                <p class="mb-0 text-muted">Generate secure random voucher codes and save them to the local database with a shared batch ID.</p>
              </div>
              <button class="btn btn-outline-secondary" data-export="vouchers-csv">Export Voucher CSV</button>
            </div>
            <form id="generateVoucherForm" class="row g-3 align-items-end">
              <div class="col-lg-4">
                <label class="form-label">Voucher plan</label>
                <select class="form-select" id="generatePlan">${PLAN_LIBRARY.map((plan) => option(plan.key, "", `${plan.name} - ${money.format(plan.price)} - ${plan.display}`)).join("")}</select>
              </div>
              <div class="col-lg-3">
                <label class="form-label">Quantity</label>
                <select class="form-select" id="generateQuantity">${[1, ...BULK_AMOUNTS].map((amount) => option(String(amount), "", amount === 1 ? "1 voucher" : `${amount} vouchers`)).join("")}</select>
              </div>
              <div class="col-lg-3">
                <label class="form-label">Batch ID</label>
                <input class="form-control" id="generateBatch" value="${nextBatchId()}">
              </div>
              <div class="col-lg-2">
                <button class="btn btn-primary w-100" type="submit">Generate</button>
              </div>
            </form>
          </div>
        </div>
        <div class="panel-card card mt-3">
          <div class="card-body">
            <h5>Recent Generated Batches</h5>
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead><tr><th>Batch ID</th><th>Plan</th><th>Total</th><th>Available</th><th>Generated By</th><th>Date Created</th></tr></thead>
                <tbody>${batchRows().map(batchRow).join("") || emptyRow(6, "No batches generated yet.")}</tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    },

    vouchers() {
      const controls = pageState.vouchers;
      const rows = getVoucherRows();
      return `
        <div class="panel-card card mb-3">
          <div class="card-body toolbar">
            <div class="filters">
              <input class="form-control" id="voucherSearch" placeholder="Search vouchers" value="${escapeHtml(controls.search)}">
              <select class="form-select" id="voucherStatus">
                ${["All", "Available", "Sold", "Used", "Expired"].map((status) => option(status, controls.status)).join("")}
              </select>
              <select class="form-select" id="voucherSort">
                ${option("createdAt-desc", controls.sort, "Newest")}
                ${option("code-asc", controls.sort, "Code A-Z")}
                ${option("price-desc", controls.sort, "Price high-low")}
              </select>
            </div>
            <div class="actions">
              <button class="btn btn-outline-primary" id="singleVoucherBtn"><i class="bi bi-plus-circle"></i> Single Voucher</button>
              <button class="btn btn-primary" id="bulkVoucherBtn"><i class="bi bi-layers"></i> Bulk Generate</button>
              <button class="btn btn-outline-secondary" data-export="vouchers-csv">CSV</button>
              <button class="btn btn-outline-secondary" data-export="vouchers-pdf">PDF</button>
            </div>
          </div>
        </div>
        <div class="panel-card card">
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead><tr><th>Voucher Code</th><th>Plan</th><th>Price</th><th>Validity</th><th>Status</th><th>Customer</th><th>Date Generated</th><th>Date Sold</th><th>Date Activated</th><th>Expiry Date</th><th>Generated By</th><th>Batch ID</th><th>Actions</th></tr></thead>
              <tbody>${rows.items.map(voucherRow).join("") || emptyRow(13, "No vouchers found.")}</tbody>
            </table>
          </div>
          ${pagination("vouchers", rows.totalPages, controls.page)}
        </div>
      `;
    },

    billing() {
      return `
        <div class="row g-3">
          <div class="col-lg-5">
            <div class="panel-card card">
              <div class="card-body">
                <h5>Sell Voucher</h5>
                <form id="sellForm">
                  <label class="form-label">Customer</label>
                  <select class="form-select mb-3" id="sellCustomer">${state.customers.map((customer) => option(customer.id, "", `${customer.name} - ${customer.phone}`)).join("")}</select>
                  <label class="form-label">Customer phone</label>
                  <input class="form-control mb-3" id="sellPhone" placeholder="07XXXXXXXX">
                  <label class="form-label">Voucher plan</label>
                  <select class="form-select mb-3" id="sellPlan">${PLAN_LIBRARY.map((plan) => option(plan.name, "", `${plan.name} - ${money.format(plan.price)}`)).join("")}</select>
                  <label class="form-label">Next available voucher</label>
                  <select class="form-select mb-3" id="sellVoucher"></select>
                  <label class="form-label">Payment method</label>
                  <select class="form-select mb-3" id="sellMethod">${["Cash", "Mobile Money", "Card"].map((method) => option(method)).join("")}</select>
                  <div class="alert alert-info d-flex justify-content-between"><span>Total</span><strong id="sellTotal">UGX 0</strong></div>
                  <button class="btn btn-primary w-100" type="submit"><i class="bi bi-receipt"></i> Generate Receipt</button>
                </form>
              </div>
            </div>
          </div>
          <div class="col-lg-7">
            <div class="panel-card card">
              <div class="card-body">
                <h5>Receipt Preview</h5>
                <div id="receiptPreview">${receiptHtml(lastSale(), false)}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    customers() {
      const rows = getCustomerRows();
      return `
        <div class="panel-card card mb-3">
          <div class="card-body toolbar">
            <div class="filters">
              <input class="form-control" id="customerSearch" placeholder="Search customers" value="${escapeHtml(pageState.customers.search)}">
              <select class="form-select" id="customerSort">
                ${option("name-asc", pageState.customers.sort, "Name A-Z")}
                ${option("purchases-desc", pageState.customers.sort, "Most purchases")}
              </select>
            </div>
            <button class="btn btn-primary" id="addCustomerBtn"><i class="bi bi-person-plus"></i> Add Customer</button>
          </div>
        </div>
        <div class="panel-card card">
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead><tr><th>Customer</th><th>Phone</th><th>Total purchases</th><th>Active vouchers</th><th>Expired vouchers</th><th>Actions</th></tr></thead>
              <tbody>${rows.items.map(customerRow).join("") || emptyRow(6, "No customers found.")}</tbody>
            </table>
          </div>
          ${pagination("customers", rows.totalPages, pageState.customers.page)}
        </div>
      `;
    },

    sales() {
      return `
        <div class="row g-3 mb-3">
          ${["daily", "weekly", "monthly", "yearly"].map((range) => stat(`${range} sales`, money.format(salesTotal(range)), "bi-cash")).join("")}
        </div>
        <div class="panel-card card mb-3">
          <div class="card-body toolbar">
            <div class="filters">
              <select class="form-select" id="salesRange">${["daily", "weekly", "monthly", "yearly"].map((range) => option(range, pageState.sales.range, range[0].toUpperCase() + range.slice(1))).join("")}</select>
            </div>
            <div class="actions">
              <button class="btn btn-outline-secondary" data-export="sales-csv">CSV</button>
              <button class="btn btn-outline-secondary" data-export="sales-pdf">PDF</button>
              <button class="btn btn-outline-secondary" data-export="sales-excel">Excel</button>
            </div>
          </div>
        </div>
        <div class="panel-card card">
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead><tr><th>Date</th><th>Invoice</th><th>Receipt</th><th>Customer</th><th>Voucher</th><th>Method</th><th>Total</th><th>Profit</th><th>Actions</th></tr></thead>
              <tbody>${salesRows(pageState.sales.range).map(saleRow).join("") || emptyRow(9, "No sales in this range.")}</tbody>
            </table>
          </div>
        </div>
      `;
    },

    reports() {
      const reportRows = planReportRows();
      return `
        <div class="row g-3 mb-3">
          <div class="col-lg-6"><div class="chart-card"><div class="d-flex justify-content-between"><h5>Sales Graph</h5><button class="btn btn-sm btn-outline-secondary" data-export="reports-pdf">PDF</button></div><canvas class="chart-canvas" id="salesGraph"></canvas></div></div>
          <div class="col-lg-6"><div class="chart-card"><div class="d-flex justify-content-between"><h5>Voucher Graph</h5><button class="btn btn-sm btn-outline-secondary" data-export="reports-excel">Excel</button></div><canvas class="chart-canvas" id="voucherGraph"></canvas></div></div>
          <div class="col-lg-6"><div class="chart-card"><h5>Customer Graph</h5><canvas class="chart-canvas" id="customerGraph"></canvas></div></div>
          <div class="col-lg-6"><div class="chart-card"><h5>Revenue Graph</h5><canvas class="chart-canvas" id="revenueGraph"></canvas></div></div>
        </div>
        <div class="panel-card card mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
              <div><h5 class="mb-1">Voucher Plan Reports</h5><p class="mb-0 text-muted">Grouped by Daily, Weekly, and Monthly voucher plans.</p></div>
              <div class="actions">
                <button class="btn btn-outline-secondary" data-export="reports-pdf">Export PDF</button>
                <button class="btn btn-outline-secondary" data-export="reports-excel">Export Excel</button>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead><tr><th>Plan</th><th>Total generated</th><th>Total sold</th><th>Total used</th><th>Total expired</th><th>Revenue</th><th>Profit</th></tr></thead>
                <tbody>${reportRows.map((row) => `<tr><td><strong>${row.plan.name}</strong><br><small class="text-muted">${row.plan.display}</small></td><td>${row.generated}</td><td>${row.sold}</td><td>${row.used}</td><td>${row.expired}</td><td>${money.format(row.revenue)}</td><td>${money.format(row.profit)}</td></tr>`).join("")}</tbody>
              </table>
            </div>
          </div>
        </div>
        ${bestPlansPanel()}
      `;
    },

    users() {
      return `
        <div class="panel-card card mb-3">
          <div class="card-body d-flex justify-content-between gap-3 flex-wrap">
            <div><h5>User Management</h5><p class="mb-0 text-muted">Administrator, Manager, and Cashier roles with permissions.</p></div>
            <button class="btn btn-primary" id="addUserBtn"><i class="bi bi-person-gear"></i> Add User</button>
          </div>
        </div>
        <div class="panel-card card">
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Status</th><th>Permissions</th><th>Actions</th></tr></thead>
              <tbody>${state.users.map(userRow).join("")}</tbody>
            </table>
          </div>
        </div>
      `;
    },

    settings() {
      return `
        <div class="row g-3">
          <div class="col-lg-7">
            <div class="panel-card card">
              <div class="card-body">
                <h5>Company Settings</h5>
                <form id="settingsForm">
                  <label class="form-label">Company name</label>
                  <input class="form-control mb-3" id="companyName" value="${escapeHtml(state.settings.companyName)}">
                  <label class="form-label">Company logo text</label>
                  <input class="form-control mb-3" id="companyLogoText" value="${escapeHtml(state.settings.companyLogoText)}">
                  <label class="form-label">Company address</label>
                  <input class="form-control mb-3" id="companyAddress" value="${escapeHtml(state.settings.companyAddress || "")}">
                  <label class="form-label">Support phone</label>
                  <input class="form-control mb-3" id="companyPhone" value="${escapeHtml(state.settings.companyPhone || "")}">
                  <label class="form-label">Support email</label>
                  <input class="form-control mb-3" id="companyEmail" value="${escapeHtml(state.settings.companyEmail || "")}">
                  <label class="form-label">Tax identification</label>
                  <input class="form-control mb-3" id="companyTin" value="${escapeHtml(state.settings.companyTin || "")}">
                  <label class="form-label">Receipt footer</label>
                  <input class="form-control mb-3" id="receiptFooter" value="${escapeHtml(state.settings.receiptFooter)}">
                  <label class="form-label">Currency</label>
                  <select class="form-select mb-3" id="currency">${option("UGX", state.settings.currency)}</select>
                  <label class="form-label">Tax rate %</label>
                  <input class="form-control mb-3" id="taxRate" type="number" min="0" max="100" value="${state.settings.taxRate}">
                  <div class="form-check form-switch mb-3">
                    <input class="form-check-input" id="backupEnabled" type="checkbox" ${state.settings.backupEnabled ? "checked" : ""}>
                    <label class="form-check-label" for="backupEnabled">Enable backup reminders</label>
                  </div>
                  <button class="btn btn-primary" type="submit">Save Settings</button>
                </form>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="panel-card card">
              <div class="card-body">
                <h5>Backup & Restore</h5>
                <p>Export all system data as JSON or restore from a previous backup file.</p>
                <button class="btn btn-outline-primary w-100 mb-2" id="downloadBackup">Download Backup</button>
                <button class="btn btn-outline-danger w-100 mb-2" id="loadRealisticData">Load Realistic Sample Data</button>
                <input class="form-control" id="restoreFile" type="file" accept="application/json">
              </div>
            </div>
          </div>
        </div>
      `;
    },

    routerDashboard() {
      return \`
        <div class="row g-3 mb-3">
          <div class="col-md-3"><div class="stat-card"><span>Routers Online</span><strong>3</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>Routers Offline</span><strong>0</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>Avg CPU Load</span><strong>34%</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>Uptime</span><strong>99.8%</strong></div></div>
        </div>
        <div class="row g-3 mb-3">
          <div class="col-lg-8"><div class="chart-card"><h5>Router CPU & Memory Usage</h5><canvas class="chart-canvas" id="routerCpuChart"></canvas></div></div>
          <div class="col-lg-4">
            <div class="panel-card card"><div class="card-body"><h5>Connected Routers</h5><div class="table-responsive"><table class="table"><thead><tr><th>Name</th><th>IP</th><th>Load</th></tr></thead><tbody><tr><td>MikroTik-Main</td><td>10.0.0.1</td><td><span class="badge-soft-success">42%</span></td></tr><tr><td>Ruijie-Office</td><td>10.0.0.2</td><td><span class="badge-soft-info">28%</span></td></tr><tr><td>TPLink-Guest</td><td>10.0.0.3</td><td><span class="badge-soft-success">18%</span></td></tr></tbody></table></div></div></div></div>
          </div>
        </div>
      \`;
    },
    bandwidth() {
      return \`
        <div class="row g-3 mb-3">
          <div class="col-md-3"><div class="stat-card"><span>Download</span><strong>245 Mbps</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>Upload</span><strong>89 Mbps</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>Peak Usage</span><strong>312 Mbps</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>Total Today</span><strong>142 GB</strong></div></div>
        </div>
        <div class="row g-3 mb-3">
          <div class="col-lg-12"><div class="chart-card"><h5>Bandwidth Usage <span class="text-muted small fw-normal">Last 24 hours</span></h5><canvas class="chart-canvas" id="bandwidthChart"></canvas></div></div>
        </div>
        <div class="panel-card card"><div class="card-body"><h5>Interface Usage</h5><div class="table-responsive"><table class="table"><thead><tr><th>Interface</th><th>Download</th><th>Upload</th><th>Clients</th><th>Status</th></tr></thead><tbody><tr><td>WAN1 (Fibre)</td><td>145 Mbps</td><td>52 Mbps</td><td>48</td><td><span class="badge-soft-success">Active</span></td></tr><tr><td>WAN2 (LTE)</td><td>68 Mbps</td><td>24 Mbps</td><td>22</td><td><span class="badge-soft-success">Active</span></td></tr><tr><td>VLAN-Guest</td><td>32 Mbps</td><td>13 Mbps</td><td>15</td><td><span class="badge-soft-success">Active</span></td></tr></tbody></table></div></div></div></div>
      \`;
    },
    topUsers() {
      return \`
        <div class="row g-3 mb-3">
          <div class="col-md-4"><div class="stat-card"><span>Total Users</span><strong>156</strong></div></div>
          <div class="col-md-4"><div class="stat-card"><span>Active Today</span><strong>89</strong></div></div>
          <div class="col-md-4"><div class="stat-card"><span>Total Data Used</span><strong>1.2 TB</strong></div></div>
        </div>
        <div class="panel-card card"><div class="card-body"><h5>Top Data Users <span class="text-muted small fw-normal">This month</span></h5><div class="table-responsive"><table class="table"><thead><tr><th>#</th><th>Username</th><th>Download</th><th>Upload</th><th>Total</th><th>Plan</th></tr></thead><tbody><tr><td>1</td><td>john.m</td><td>145.2 GB</td><td>32.8 GB</td><td><strong>178.0 GB</strong></td><td>Monthly</td></tr><tr><td>2</td><td>sarah.k</td><td>98.1 GB</td><td>24.4 GB</td><td><strong>122.5 GB</strong></td><td>Monthly</td></tr><tr><td>3</td><td>peter.w</td><td>72.7 GB</td><td>18.2 GB</td><td><strong>90.9 GB</strong></td><td>Weekly</td></tr><tr><td>4</td><td>grace.n</td><td>65.3 GB</td><td>15.1 GB</td><td><strong>80.4 GB</strong></td><td>Monthly</td></tr><tr><td>5</td><td>daniel.k</td><td>58.9 GB</td><td>12.7 GB</td><td><strong>71.6 GB</strong></td><td>Weekly</td></tr><tr><td>6</td><td>stella.a</td><td>51.4 GB</td><td>9.8 GB</td><td><strong>61.2 GB</strong></td><td>Daily</td></tr><tr><td>7</td><td>amos.t</td><td>44.6 GB</td><td>8.3 GB</td><td><strong>52.9 GB</strong></td><td>Weekly</td></tr><tr><td>8</td><td>faith.l</td><td>38.2 GB</td><td>6.5 GB</td><td><strong>44.7 GB</strong></td><td>Daily</td></tr><tr><td>9</td><td>david.o</td><td>32.7 GB</td><td>5.2 GB</td><td><strong>37.9 GB</strong></td><td>Monthly</td></tr><tr><td>10</td><td>esther.a</td><td>28.1 GB</td><td>4.1 GB</td><td><strong>32.2 GB</strong></td><td>Daily</td></tr></tbody></table></div></div></div></div>
      \`;
    },
    remoteAccess() {
      return \`
        <div class="row g-3 mb-3">
          <div class="col-md-3"><div class="stat-card"><span>Active Sessions</span><strong>2</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>API Keys</span><strong>4</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>Today's Logins</span><strong>7</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>Last Access</span><strong>2 min ago</strong></div></div>
        </div>
        <div class="row g-3">
          <div class="col-lg-7">
            <div class="panel-card card"><div class="card-body"><h5>Active Remote Sessions</h5><div class="table-responsive"><table class="table"><thead><tr><th>User</th><th>IP Address</th><th>Device</th><th>Login Time</th><th>Action</th></tr></thead><tbody><tr><td>Admin</td><td>197.245.30.15</td><td>Chrome/Win</td><td>10:32 AM</td><td><button class="btn btn-sm btn-outline-danger">Disconnect</button></td></tr><tr><td>Manager</td><td>197.245.30.22</td><td>Safari/iOS</td><td>09:15 AM</td><td><button class="btn btn-sm btn-outline-danger">Disconnect</button></td></tr></tbody></table></div></div></div></div>
          </div>
          <div class="col-lg-5">
            <div class="panel-card card"><div class="card-body"><h5>API Access Keys</h5><div class="table-responsive"><table class="table"><thead><tr><th>Name</th><th>Key</th><th>Status</th></tr></thead><tbody><tr><td>Billing API</td><td><code class="small">p5r_••••••••2f8a</code></td><td><span class="badge-soft-success">Active</span></td></tr><tr><td>Monitoring</td><td><code class="small">p5r_••••••••b4d1</code></td><td><span class="badge-soft-success">Active</span></td></tr><tr><td>Mobile App</td><td><code class="small">p5r_••••••••9e73</code></td><td><span class="badge-soft-success">Active</span></td></tr><tr><td>Testing</td><td><code class="small">p5r_••••••••5c20</code></td><td><span class="badge-soft-muted">Revoked</span></td></tr></tbody></table></div></div></div></div>
          </div>
        </div>
        <div class="mt-3"><button class="btn btn-primary" id="newRemoteSessionBtn"><i class="bi bi-plus-circle"></i> New Remote Session</button></div>
      \`;
    },
    pppoe() {
      return \`
        <div class="toolbar"><h5>PPPoE Users</h5><div class="filters"><button class="btn btn-primary" id="addPppoeBtn"><i class="bi bi-plus-circle"></i> Add User</button><button class="btn btn-outline-secondary" id="exportPppoeBtn"><i class="bi bi-download"></i> Export</button></div></div>
        <div class="row g-3 mb-3">
          <div class="col-md-3"><div class="stat-card"><span>Active</span><strong>42</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>Disabled</span><strong>5</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>Expired</span><strong>3</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>Total</span><strong>50</strong></div></div>
        </div>
        <div class="panel-card card"><div class="card-body"><div class="table-responsive"><table class="table"><thead><tr><th>Username</th><th>Full Name</th><th>Status</th><th>Speed Profile</th><th>Data Cap</th><th>IP Address</th><th>Expires</th></tr></thead><tbody><tr><td>p-001</td><td>John Mukasa</td><td><span class="badge-soft-success">Active</span></td><td>10 Mbps</td><td>Unlimited</td><td>10.10.0.101</td><td>2026-08-01</td></tr><tr><td>p-002</td><td>Sarah Nakato</td><td><span class="badge-soft-success">Active</span></td><td>5 Mbps</td><td>50 GB</td><td>10.10.0.102</td><td>2026-07-15</td></tr><tr><td>p-003</td><td>Peter Wasswa</td><td><span class="badge-soft-success">Active</span></td><td>2 Mbps</td><td>10 GB</td><td>10.10.0.103</td><td>2026-07-10</td></tr><tr><td>p-004</td><td>Grace Namugga</td><td><span class="badge-soft-warning">Expiring</span></td><td>10 Mbps</td><td>Unlimited</td><td>10.10.0.104</td><td>2026-07-05</td></tr><tr><td>p-005</td><td>Daniel Okello</td><td><span class="badge-soft-muted">Disabled</span></td><td>5 Mbps</td><td>30 GB</td><td>-</td><td>2026-06-01</td></tr></tbody></table></div></div></div></div>
      \`;
    },
    mobileMoney() {
      return \`
        <div class="row g-3 mb-3">
          <div class="col-md-3"><div class="stat-card"><span>Today's Collections</span><strong>UGX 126,000</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>This Week</span><strong>UGX 845,000</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>This Month</span><strong>UGX 2,540,000</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>Success Rate</span><strong>97.2%</strong></div></div>
        </div>
        <div class="row g-3 mb-3">
          <div class="col-lg-8">
            <div class="panel-card card"><div class="card-body"><h5>Recent Transactions</h5><div class="table-responsive"><table class="table"><thead><tr><th>Receipt</th><th>Customer</th><th>Amount</th><th>Provider</th><th>Reference</th><th>Status</th><th>Date</th></tr></thead><tbody><tr><td>MM-2401</td><td>John Mukasa</td><td>UGX 20,000</td><td>MTN MoMo</td><td>MTN-78293</td><td><span class="badge-soft-success">Completed</span></td><td>Today 10:32 AM</td></tr><tr><td>MM-2400</td><td>Sarah Nakato</td><td>UGX 5,000</td><td>Airtel Money</td><td>ATL-45129</td><td><span class="badge-soft-success">Completed</span></td><td>Today 09:15 AM</td></tr><tr><td>MM-2399</td><td>Peter Wasswa</td><td>UGX 1,000</td><td>MTN MoMo</td><td>MTN-78145</td><td><span class="badge-soft-success">Completed</span></td><td>Today 08:45 AM</td></tr><tr><td>MM-2398</td><td>Grace Namugga</td><td>UGX 20,000</td><td>MTN MoMo</td><td>MTN-78012</td><td><span class="badge-soft-success">Completed</span></td><td>Yesterday 04:20 PM</td></tr><tr><td>MM-2397</td><td>Daniel Okello</td><td>UGX 5,000</td><td>Airtel Money</td><td>ATL-45087</td><td><span class="badge-soft-warning">Pending</span></td><td>Yesterday 03:55 PM</td></tr><tr><td>MM-2396</td><td>Stella Acheng</td><td>UGX 1,000</td><td>MTN MoMo</td><td>MTN-77896</td><td><span class="badge-soft-danger">Failed</span></td><td>Yesterday 02:30 PM</td></tr></tbody></table></div></div></div></div>
          </div>
          <div class="col-lg-4">
            <div class="panel-card card mb-3"><div class="card-body"><h5>Provider Breakdown</h5><div class="mb-2 d-flex justify-content-between"><span>MTN MoMo</span><strong class="text-muted">UGX 1,820,000</strong></div><div class="mb-2 d-flex justify-content-between"><span>Airtel Money</span><strong class="text-muted">UGX 720,000</strong></div><hr><div class="d-flex justify-content-between"><span>Total</span><strong>UGX 2,540,000</strong></div></div></div>
            <div class="panel-card card"><div class="card-body"><h5>Quick Links</h5><button class="btn btn-primary w-100 mb-2" id="requestPayoutBtn"><i class="bi bi-arrow-down-circle"></i> Request Payout</button><button class="btn btn-outline-primary w-100" id="mmHistoryBtn"><i class="bi bi-clock-history"></i> Transaction History</button></div></div>
          </div>
        </div>
      \`;
    },
    agents() {
      return \`
        <div class="toolbar"><h5>Agent POS Network</h5><div class="filters"><button class="btn btn-primary" id="registerAgentBtn"><i class="bi bi-plus-circle"></i> Register Agent</button><button class="btn btn-outline-secondary" id="exportAgentBtn"><i class="bi bi-download"></i> Report</button></div></div>
        <div class="row g-3 mb-3">
          <div class="col-md-3"><div class="stat-card"><span>Active Agents</span><strong>8</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>Today's Sales</span><strong>UGX 125,000</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>Commission Due</span><strong>UGX 12,500</strong></div></div>
          <div class="col-md-3"><div class="stat-card"><span>Vouchers Sold</span><strong>42</strong></div></div>
        </div>
        <div class="panel-card card"><div class="card-body"><div class="table-responsive"><table class="table"><thead><tr><th>Agent Name</th><th>Phone</th><th>Location</th><th>Sales Today</th><th>Commission</th><th>Vouchers</th><th>Status</th></tr></thead><tbody><tr><td><strong>Grace Nalugo</strong></td><td>070 992 8840</td><td>Kireka</td><td>UGX 45,000</td><td>UGX 4,500</td><td>18</td><td><span class="badge-soft-success">Active</span></td></tr><tr><td><strong>Daniel Kato</strong></td><td>070 992 8841</td><td>Bweyogerere</td><td>UGX 32,000</td><td>UGX 3,200</td><td>10</td><td><span class="badge-soft-success">Active</span></td></tr><tr><td><strong>Stella Achieng</strong></td><td>070 992 8842</td><td>Kyambogo</td><td>UGX 48,000</td><td>UGX 4,800</td><td>14</td><td><span class="badge-soft-success">Active</span></td></tr><tr><td><strong>Moses Lwanga</strong></td><td>070 992 8843</td><td>Ntinda</td><td>UGX 0</td><td>UGX 0</td><td>0</td><td><span class="badge-soft-muted">Inactive</span></td></tr></tbody></table></div></div></div></div>
      \`;
    },
    captivePortal() {
      const portal = state.settings.captivePortal;
      const canEdit = hasPermission("portal");
      return `
        <div class="row g-3">
          <div class="col-lg-7">
            <div class="panel-card card mb-3">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
                  <div>
                    <h5 class="mb-1">Captive Portal Settings</h5>
                    <p class="mb-0 text-muted">Customize your hotspot login page.</p>
                  </div>
                  <a class="btn btn-outline-primary" href="wifi-billing-system.html" target="_blank">Open Portal</a>
                </div>
                <form id="portalForm">
                  <div class="row g-3">
                    <div class="col-md-6">${portalTextInput("Company name", "portalCompanyName", portal.companyName, canEdit)}</div>
                    <div class="col-md-6">${portalTextInput("Logo text", "portalLogoText", portal.logoText, canEdit)}</div>
                    <div class="col-md-12">${portalTextInput("Welcome message", "portalWelcome", portal.welcomeMessage, canEdit)}</div>
                    <div class="col-md-6">${portalTextInput("Login title", "portalLoginTitle", portal.loginTitle, canEdit)}</div>
                    <div class="col-md-6">${portalTextInput("Login subtitle", "portalLoginSubtitle", portal.loginSubtitle, canEdit)}</div>
                    <div class="col-md-6">${portalTextInput("Contact phone", "portalPhone", portal.contactPhone, canEdit)}</div>
                    <div class="col-md-6">${portalTextInput("WhatsApp number", "portalWhatsapp", portal.whatsapp, canEdit)}</div>
                    <div class="col-md-6">${portalTextInput("Email address", "portalEmail", portal.email, canEdit)}</div>
                    <div class="col-md-6">${portalTextInput("Website URL", "portalWebsite", portal.website, canEdit)}</div>
                    <div class="col-md-6">${portalTextInput("Facebook link", "portalFacebook", portal.facebook, canEdit)}</div>
                    <div class="col-md-6">${portalTextInput("Instagram link", "portalInstagram", portal.instagram, canEdit)}</div>
                    <div class="col-md-6">${portalTextInput("TikTok link", "portalTiktok", portal.tiktok, canEdit)}</div>
                    <div class="col-md-6">${portalTextInput("Footer text", "portalFooterText", portal.footerText, canEdit)}</div>
                  </div>
                  <h6 class="mt-3">Theme Colors</h6>
                  <div class="row g-3 mb-3">
                    ${portalColorInput("Primary", "portalPrimary", portal.primaryColor, canEdit)}
                    ${portalColorInput("Background", "portalSecondary", portal.secondaryColor, canEdit)}
                    ${portalColorInput("Button", "portalButton", portal.buttonColor, canEdit)}
                  </div>
                  <h6>Login Options</h6>
                  <div class="row g-2 mb-3">
                    ${portalSwitch("Voucher login", "portalVoucherLogin", portal.voucherLogin, canEdit)}
                    ${portalSwitch("Username login", "portalUsernameLogin", portal.usernameLogin, canEdit)}
                    ${portalSwitch("Remember me", "portalRemember", portal.rememberMe, canEdit)}
                    ${portalSwitch("Terms & Privacy", "portalTerms", portal.terms, canEdit)}
                  </div>
                  <h6>Uploads</h6>
                  <div class="row g-3">
                    ${portalFileInput("Logo image", "portalLogoUpload", canEdit)}
                    ${portalFileInput("Background image", "portalBgUpload", canEdit)}
                    ${portalFileInput("Banner image", "portalBannerUpload", canEdit)}
                  </div>
                  <div class="actions mt-3">
                    <button class="btn btn-primary" type="submit" ${canEdit ? "" : "disabled"}>Save Settings</button>
                    <button class="btn btn-outline-secondary" id="portalPreviewRefresh" type="button">Refresh Preview</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="panel-card card mb-3">
              <div class="card-body">
                <h5>Preview</h5>
                <div id="portalPreview"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };

  function bindRouteEvents(routeName) {
    $$("[data-export]").forEach((button) => button.addEventListener("click", () => exportAction(button.dataset.export)));
    $$("[data-export-report]").forEach((button) => button.addEventListener("click", () => exportAction("sales-csv")));
    $$("[data-page]").forEach((button) => button.addEventListener("click", () => changePage(button.dataset.scope, Number(button.dataset.page))));
    $$("[data-receipt]").forEach((button) => button.addEventListener("click", () => showReceipt(button.dataset.receipt)));
    $$("[data-delete-voucher]").forEach((button) => button.addEventListener("click", () => deleteVoucher(button.dataset.deleteVoucher)));
    $$("[data-edit-voucher]").forEach((button) => button.addEventListener("click", () => openVoucherModal(button.dataset.editVoucher)));
    $$("[data-print-voucher]").forEach((button) => button.addEventListener("click", () => printVoucher(button.dataset.printVoucher)));
    $$("[data-pdf-voucher]").forEach((button) => button.addEventListener("click", () => downloadVoucherPdf(button.dataset.pdfVoucher)));
    $$("[data-copy-voucher]").forEach((button) => button.addEventListener("click", () => copyVoucherCode(button.dataset.copyVoucher)));
    $$("[data-disable-voucher]").forEach((button) => button.addEventListener("click", () => disableVoucher(button.dataset.disableVoucher)));
    $$("[data-use-voucher]").forEach((button) => button.addEventListener("click", () => activateVoucher(button.dataset.useVoucher)));
    $$("[data-sell-voucher]").forEach((button) => button.addEventListener("click", () => route("billing")));
    $$("[data-edit-customer]").forEach((button) => button.addEventListener("click", () => openCustomerModal(button.dataset.editCustomer)));
    $$("[data-delete-customer]").forEach((button) => button.addEventListener("click", () => deleteCustomer(button.dataset.deleteCustomer)));
    $$("[data-history-customer]").forEach((button) => button.addEventListener("click", () => showCustomerHistory(button.dataset.historyCustomer)));
    $$("[data-edit-user]").forEach((button) => button.addEventListener("click", () => openUserModal(button.dataset.editUser)));
    $$("[data-delete-user]").forEach((button) => button.addEventListener("click", () => deleteUser(button.dataset.deleteUser)));
    $$("[data-generate-single]").forEach((button) => {
      button.addEventListener("click", () => {
        generateVoucherBatch(button.dataset.generateSingle, 1, nextBatchId());
        notify("Voucher generated.", "success");
        route("vouchers");
      });
    });

    if (routeName === "vouchers") bindVoucherView();
    if (routeName === "generate") bindGenerateView();
    if (routeName === "billing") bindBillingView();
    if (routeName === "customers") bindCustomerView();
    if (routeName === "remoteAccess") {
      $$(".btn-outline-danger").forEach((b) => b.addEventListener("click", () => { if (confirm("Disconnect this session?")) notify("Session disconnected.", "success"); }));
      listen("#newRemoteSessionBtn", "click", () => notify("Remote session creation form opened.", "success"));
    }
    if (routeName === "pppoe") {
      listen("#addPppoeBtn", "click", () => notify("PPPoE user creation form opened.", "success"));
      listen("#exportPppoeBtn", "click", () => exportAction("sales-csv"));
    }
    if (routeName === "mobileMoney") {
      listen("#requestPayoutBtn", "click", () => notify("Payout request submitted to provider.", "success"));
      listen("#mmHistoryBtn", "click", () => notify("Opening transaction history...", "success"));
    }
    if (routeName === "agents") {
      listen("#registerAgentBtn", "click", () => notify("Agent registration form opened.", "success"));
      listen("#exportAgentBtn", "click", () => exportAction("sales-csv"));
    }
    if (routeName === "sales") bindSalesView();
    if (routeName === "users") $("#addUserBtn")?.addEventListener("click", () => openUserModal());
    if (routeName === "settings") bindSettingsView();
    if (routeName === "captivePortal") bindCaptivePortalView();
  }

  function portalTextInput(label, id, value, canEdit) {
    return `<label class="form-label">${label}</label><input class="form-control mb-3" id="${id}" value="${escapeHtml(value || "")}" ${canEdit ? "" : "disabled"}>`;
  }

  function portalColorInput(label, id, value, canEdit) {
    return `<div class="col-md-4"><label class="form-label">${label}</label><input class="form-control form-control-color mb-3" id="${id}" type="color" value="${escapeHtml(value || "#7c3aed")}" ${canEdit ? "" : "disabled"}></div>`;
  }

  function portalFileInput(label, id, canEdit) {
    return `<div class="col-md-6"><label class="form-label">${label}</label><input class="form-control mb-3" id="${id}" type="file" accept="image/*" ${canEdit ? "" : "disabled"}></div>`;
  }

  function portalSwitch(label, id, checked, canEdit) {
    return `<div class="col-md-6"><div class="form-check form-switch"><input class="form-check-input" id="${id}" type="checkbox" ${checked ? "checked" : ""} ${canEdit ? "" : "disabled"}><label class="form-check-label" for="${id}">${label}</label></div></div>`;
  }

  function portalBackupsHtml() {
    const backups = state.settings.captivePortal.backups || [];
    if (!backups.length) return `<div class="text-muted">No backups yet.</div>`;
    return backups.map((backup) => `<div class="mini"><div><strong>${backup.label}</strong><br><span class="text-muted">${formatDate(backup.createdAt)}</span></div><button class="btn btn-sm btn-outline-primary" data-restore-portal="${backup.id}">Restore</button></div>`).join("");
  }

  function bindCaptivePortalView() {
    renderPortalPreview();
    $$("[data-preview-size]").forEach((button) => button.addEventListener("click", () => {
      const frame = $("#portalPreview");
      frame.classList.remove("desktop", "tablet", "mobile");
      frame.classList.add(button.dataset.previewSize);
    }));
    $$("[data-template]").forEach((button) => button.addEventListener("click", () => applyPortalTemplate(button.dataset.template)));
    $$("[data-restore-portal]").forEach((button) => button.addEventListener("click", () => restorePortalBackup(button.dataset.restorePortal)));
    $("#portalPreviewRefresh")?.addEventListener("click", renderPortalPreview);
    $("#portalForm")?.addEventListener("submit", saveCaptivePortalSettings);
  }

  function saveCaptivePortalSettings(event) {
    event.preventDefault();
    if (!hasPermission("portal")) return notify("Only administrators can modify captive portal settings.", "error");
    backupCaptivePortal();
    const portal = state.settings.captivePortal;
    Object.assign(portal, readPortalForm());
    const uploads = [
      ["portalLogoUpload", "logo"],
      ["portalBgUpload", "backgroundImage"],
      ["portalBannerUpload", "bannerImage"],
      ["portalFaviconUpload", "favicon"]
    ];
    readUploads(uploads, () => {
      saveState();
      renderPortalPreview();
      notify("Captive portal saved and applied.", "success");
    });
  }

  function readPortalForm() {
    return {
      companyName: $("#portalCompanyName").value.trim(),
      logoText: $("#portalLogoText").value.trim() || "EK",
      welcomeMessage: $("#portalWelcome").value.trim(),
      loginTitle: $("#portalLoginTitle").value.trim(),
      loginSubtitle: $("#portalLoginSubtitle").value.trim(),
      footerText: $("#portalFooterText").value.trim(),
      contactPhone: $("#portalPhone").value.trim(),
      whatsapp: $("#portalWhatsapp").value.trim(),
      email: $("#portalEmail").value.trim(),
      website: $("#portalWebsite").value.trim(),
      facebook: $("#portalFacebook").value.trim(),
      instagram: $("#portalInstagram").value.trim(),
      tiktok: $("#portalTiktok").value.trim(),
      fontFamily: $("#portalFont").value.trim(),
      primaryColor: $("#portalPrimary").value,
      secondaryColor: $("#portalSecondary").value,
      buttonColor: $("#portalButton").value,
      backgroundVideo: $("#portalVideo").value.trim(),
      usernameLogin: $("#portalUsernameLogin").checked,
      voucherLogin: $("#portalVoucherLogin").checked,
      rememberMe: $("#portalRemember").checked,
      terms: $("#portalTerms").checked,
      privacy: $("#portalPrivacy").checked,
      passwordToggle: $("#portalPasswordToggle").checked,
      customHtml: $("#portalHtml").value,
      customCss: $("#portalCss").value,
      customJs: $("#portalJs").value
    };
  }

  function readUploads(items, done) {
    let pending = items.length;
    const portal = state.settings.captivePortal;
    items.forEach(([inputId, key]) => {
      const file = $(`#${inputId}`)?.files?.[0];
      if (!file) {
        pending -= 1;
        if (!pending) done();
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        portal[key] = reader.result;
        pending -= 1;
        if (!pending) done();
      };
      reader.readAsDataURL(file);
    });
  }

  function backupCaptivePortal() {
    const portal = state.settings.captivePortal;
    portal.backups = portal.backups || [];
    portal.backups.unshift({ id: uid("portal-backup"), label: `Backup ${portal.backups.length + 1}`, createdAt: nowISO(), data: { ...portal, backups: [] } });
    portal.backups = portal.backups.slice(0, 12);
  }

  function restorePortalBackup(id) {
    if (!hasPermission("portal")) return notify("Only administrators can restore captive portal backups.", "error");
    const backup = state.settings.captivePortal.backups.find((item) => item.id === id);
    if (!backup) return notify("Backup not found.", "error");
    confirm("Restore captive portal backup?", "The current portal settings will be replaced.", () => {
      const backups = state.settings.captivePortal.backups;
      state.settings.captivePortal = { ...backup.data, backups };
      saveState();
      notify("Captive portal backup restored.", "success");
      route("captivePortal");
    });
  }

  function applyPortalTemplate(name) {
    if (!hasPermission("portal")) return notify("Only administrators can switch templates.", "error");
    Object.assign(state.settings.captivePortal, PORTAL_TEMPLATES[name] || {}, { template: name });
    saveState();
    notify(`${name} template applied.`, "success");
    route("captivePortal");
  }

  function renderPortalPreview() {
    const frame = $("#portalPreview");
    if (!frame) return;
    frame.innerHTML = portalPreviewHtml(state.settings.captivePortal);
  }

  function portalPreviewHtml(portal) {
    return `<div class="portal-preview-card" style="--portal-primary:${portal.primaryColor};--portal-secondary:${portal.secondaryColor};--portal-button:${portal.buttonColor};font-family:${escapeHtml(portal.fontFamily)};background:${portal.backgroundImage ? `linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)), url('${portal.backgroundImage}') center/cover` : portal.secondaryColor};">
      ${portal.bannerImage ? `<img class="portal-preview-banner" src="${portal.bannerImage}" alt="">` : ""}
      <div class="portal-preview-logo">${portal.logo ? `<img src="${portal.logo}" alt="">` : escapeHtml(portal.logoText || "PN")}</div>
      <h4>${escapeHtml(portal.loginTitle)}</h4>
      <p>${escapeHtml(portal.loginSubtitle)}</p>
      ${portal.voucherLogin ? `<div class="portal-preview-field">Enter voucher code</div>` : ""}
      ${portal.usernameLogin ? `<div class="portal-preview-field">Username</div><div class="portal-preview-field">Password ${portal.passwordToggle ? "Show" : ""}</div>` : ""}
      <button>${escapeHtml(portal.buttonColor ? "Login" : "Login")}</button>
      <small>${escapeHtml(portal.footerText)}</small>
      <div class="portal-preview-custom">${portal.customHtml || ""}</div>
      <style>${portal.customCss || ""}</style>
    </div>`;
  }

  function bindGenerateView() {
    $("#generateVoucherForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const quantity = Number($("#generateQuantity").value);
      const batchId = $("#generateBatch").value.trim() || nextBatchId();
      generateVoucherBatch($("#generatePlan").value, quantity, batchId);
      notify(`${quantity} vouchers generated in ${batchId}.`, "success");
      route("generate");
    });
  }

  function bindVoucherView() {
    $("#voucherSearch").addEventListener("input", (event) => {
      pageState.vouchers.search = event.target.value;
      pageState.vouchers.page = 1;
      route("vouchers");
    });
    $("#voucherStatus").addEventListener("change", (event) => {
      pageState.vouchers.status = event.target.value;
      pageState.vouchers.page = 1;
      route("vouchers");
    });
    $("#voucherSort").addEventListener("change", (event) => {
      pageState.vouchers.sort = event.target.value;
      route("vouchers");
    });
    $("#singleVoucherBtn").addEventListener("click", () => openVoucherModal());
    $("#bulkVoucherBtn").addEventListener("click", openBulkVoucherModal);
  }

  function bindBillingView() {
    const customerSelect = $("#sellCustomer");
    const phone = $("#sellPhone");
    const plan = $("#sellPlan");
    const voucher = $("#sellVoucher");
    const total = $("#sellTotal");

    function sync() {
      const customer = state.customers.find((item) => item.id === customerSelect.value);
      if (customer) phone.value = customer.phone;
      const selectedPlan = planByName(plan.value) || PLAN_LIBRARY[0];
      const available = nextAvailableVoucher(selectedPlan.key);
      plan.value = selectedPlan.name;
      voucher.innerHTML = available ? option(available.id, available.id, `${available.code} - ${available.plan}`) : `<option value="">No available ${selectedPlan.name}</option>`;
      total.textContent = money.format(totalWithTax(selectedPlan.price));
    }

    customerSelect.addEventListener("change", sync);
    plan.addEventListener("change", sync);
    $("#sellForm").addEventListener("submit", sellVoucher);
    sync();
  }

  function bindCustomerView() {
    $("#customerSearch").addEventListener("input", (event) => {
      pageState.customers.search = event.target.value;
      pageState.customers.page = 1;
      route("customers");
    });
    $("#customerSort").addEventListener("change", (event) => {
      pageState.customers.sort = event.target.value;
      route("customers");
    });
    $("#addCustomerBtn").addEventListener("click", () => openCustomerModal());
  }

  function bindSalesView() {
    $("#salesRange").addEventListener("change", (event) => {
      pageState.sales.range = event.target.value;
      route("sales");
    });
  }

  function bindSettingsView() {
    $("#settingsForm").addEventListener("submit", (event) => {
      event.preventDefault();
      state.settings.companyName = $("#companyName").value.trim();
      state.settings.companyLogoText = $("#companyLogoText").value.trim() || "EK";
      state.settings.companyAddress = $("#companyAddress").value.trim();
      state.settings.companyPhone = $("#companyPhone").value.trim();
      state.settings.companyEmail = $("#companyEmail").value.trim();
      state.settings.companyTin = $("#companyTin").value.trim();
      state.settings.receiptFooter = $("#receiptFooter").value.trim();
      state.settings.currency = $("#currency").value;
      state.settings.taxRate = Number($("#taxRate").value) || 0;
      state.settings.backupEnabled = $("#backupEnabled").checked;
      saveState();
      $("#sideCompany").textContent = state.settings.companyName;
      notify("Settings saved.", "success");
    });
    $("#downloadBackup").addEventListener("click", backupData);
    $("#restoreFile").addEventListener("change", restoreBackup);
    $("#loadRealisticData").addEventListener("click", () => {
      confirm("Load realistic sample data?", "This replaces the current local database. Download a backup first if you need to keep the current records.", () => {
        state = defaultState();
        saveState();
        applyTheme();
        $("#sideCompany").textContent = state.settings.companyName;
        notify("Realistic sample data loaded.", "success");
        route("dashboard");
      });
    });
  }

  function metrics() {
    expireOldVouchers();
    return {
      dailyRevenue: salesTotal("daily"),
      weeklyRevenue: salesTotal("weekly"),
      monthlyRevenue: salesTotal("monthly"),
      totalRevenue: state.sales.reduce((sum, sale) => sum + sale.total, 0),
      activeUsers: state.vouchers.filter((item) => ["Sold", "Used"].includes(item.status) && !isExpired(item)).length,
      expiredVouchers: state.vouchers.filter((item) => item.status === "Expired").length
    };
  }

  function voucherPlanStats() {
    const today = todayISO();
    return PLAN_LIBRARY.reduce((acc, plan) => {
      const vouchers = state.vouchers.filter((item) => item.planKey === plan.key);
      acc[plan.key] = {
        available: vouchers.filter((item) => item.status === "Available" && !item.disabled).length,
        soldToday: vouchers.filter((item) => item.soldAt?.slice(0, 10) === today).length,
        totalSold: vouchers.filter((item) => ["Sold", "Used", "Expired"].includes(item.status)).length
      };
      return acc;
    }, {});
  }

  function planReportRows() {
    return PLAN_LIBRARY.map((plan) => {
      const vouchers = state.vouchers.filter((item) => item.planKey === plan.key);
      const sales = state.sales.filter((sale) => sale.plan === plan.name);
      return {
        plan,
        generated: vouchers.length,
        sold: vouchers.filter((item) => ["Sold", "Used", "Expired"].includes(item.status)).length,
        used: vouchers.filter((item) => item.status === "Used").length,
        expired: vouchers.filter((item) => item.status === "Expired").length,
        revenue: sales.reduce((sum, sale) => sum + sale.total, 0),
        profit: sales.reduce((sum, sale) => sum + sale.profit, 0)
      };
    });
  }

  function stat(label, value, icon, route) {
    return `<div class="col-md-6 col-xl-3"><div class="stat-card${route ? " stat-clickable" : ""}"${route ? ` data-route="${route}"` : ""}><span><i class="bi ${icon}"></i> ${label}</span><strong>${value}</strong></div></div>`;
  }

  function recentSalesPanel() {
    const rows = [...state.sales].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
    return `
      <div class="panel-card card h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2"><h5 class="mb-0">Recent Sales</h5><button class="btn btn-sm btn-outline-secondary" data-export="sales-csv">Export</button></div>
          <div class="table-responsive"><table class="table align-middle mb-0"><thead><tr><th>Receipt</th><th>Customer</th><th>Plan</th><th>Total</th></tr></thead><tbody>
          ${rows.map((sale) => `<tr><td>${sale.receiptNo}</td><td>${customerName(sale.customerId)}</td><td>${sale.plan}</td><td>${money.format(sale.total)}</td></tr>`).join("")}
          </tbody></table></div>
        </div>
      </div>`;
  }

  function bestPlansPanel() {
    const counts = PLAN_LIBRARY.map((plan) => ({
      name: plan.name,
      count: state.sales.filter((sale) => sale.plan === plan.name).length,
      total: state.sales.filter((sale) => sale.plan === plan.name).reduce((sum, sale) => sum + sale.total, 0)
    })).sort((a, b) => b.count - a.count || b.total - a.total);
    return `
      <div class="panel-card card h-100">
        <div class="card-body">
          <h5>Best-Selling Plans</h5>
          <div class="list-group list-group-flush">
            ${counts.slice(0, 5).map((item) => `<div class="list-group-item bg-transparent px-0 d-flex justify-content-between"><span>${item.name}</span><strong>${item.count} sold</strong></div>`).join("")}
          </div>
        </div>
      </div>`;
  }

  function stockAlertsPanel(planStats) {
    const thresholds = { daily: 20, weekly: 10, monthly: 5 };
    const alerts = PLAN_LIBRARY.map((plan) => {
      const available = planStats[plan.key].available;
      const threshold = thresholds[plan.key];
      if (available >= threshold) return "";
      return `<div class="alert alert-info mb-2"><strong>${plan.name} stock is low.</strong> ${available} available; recommended minimum is ${threshold}. Generate a new batch before peak hours.</div>`;
    }).filter(Boolean).join("");
    if (!alerts) return `<div class="alert alert-info mb-3"><strong>Inventory healthy.</strong> Voucher stock is above the recommended operating minimums.</div>`;
    return `<div class="mb-3">${alerts}</div>`;
  }

  function getVoucherRows() {
    let items = [...state.vouchers];
    const { search, status, sort, page } = pageState.vouchers;
    if (search) {
      const term = search.toLowerCase();
      items = items.filter((item) => [item.code, item.plan, customerName(item.customerId), item.status].join(" ").toLowerCase().includes(term));
    }
    if (status !== "All") items = items.filter((item) => item.status === status);
    items.sort(sorter(sort));
    return paginate(items, page);
  }

  function getCustomerRows() {
    let items = [...state.customers];
    const { search, sort, page } = pageState.customers;
    if (search) {
      const term = search.toLowerCase();
      items = items.filter((item) => [item.name, item.phone, item.notes].join(" ").toLowerCase().includes(term));
    }
    if (sort === "purchases-desc") items.sort((a, b) => customerSales(b.id).length - customerSales(a.id).length);
    else items.sort((a, b) => a.name.localeCompare(b.name));
    return paginate(items, page);
  }

  function generateVoucherBatch(planKey, quantity, batchId) {
    if (!hasPermission("write") && !hasPermission("settings")) {
      notify("You do not have permission to generate vouchers.", "error");
      return;
    }
    const plan = planByKey(planKey) || PLAN_LIBRARY[0];
    const generatedBy = user()?.id || "u-admin";
    for (let index = 0; index < quantity; index++) {
      state.vouchers.unshift(buildVoucher(uniqueCode(), plan, "Available", "", "", generatedBy, batchId));
    }
    audit("Generate Vouchers", `${quantity} ${plan.name} vouchers generated in ${batchId}`);
    saveState();
  }

  function batchRows() {
    const groups = new Map();
    state.vouchers.forEach((voucher) => {
      const key = voucher.batchId || "BATCH-MIGRATED";
      if (!groups.has(key)) {
        groups.set(key, {
          batchId: key,
          plan: voucher.plan,
          total: 0,
          available: 0,
          generatedBy: voucher.generatedBy,
          createdAt: voucher.createdAt
        });
      }
      const group = groups.get(key);
      group.total += 1;
      if (voucher.status === "Available") group.available += 1;
      if (new Date(voucher.createdAt) < new Date(group.createdAt)) group.createdAt = voucher.createdAt;
    });
    return Array.from(groups.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 12);
  }

  function batchRow(batch) {
    return `<tr>
      <td><span class="fw-bold">${batch.batchId}</span></td>
      <td>${batch.plan}</td>
      <td>${batch.total}</td>
      <td>${batch.available}</td>
      <td>${userName(batch.generatedBy)}</td>
      <td>${formatDate(batch.createdAt)}</td>
    </tr>`;
  }

  function voucherRow(item) {
    return `<tr>
      <td><span class="fw-bold">${item.code}</span></td>
      <td>${item.plan}</td>
      <td>${money.format(item.price)}</td>
      <td>${item.validity || formatDuration(item.durationMinutes)}</td>
      <td>${statusBadge(item.status)}</td>
      <td>${customerName(item.customerId) || "-"}</td>
      <td>${formatDate(item.createdAt)}</td>
      <td>${formatDate(item.soldAt)}</td>
      <td>${formatDate(item.activatedAt)}</td>
      <td>${item.expiresAt ? formatDate(item.expiresAt) : "After first login"}</td>
      <td>${userName(item.generatedBy)}</td>
      <td>${item.batchId}</td>
      <td><div class="btn-group btn-group-sm">
        <button class="btn btn-outline-secondary" data-print-voucher="${item.id}">Print</button>
        <button class="btn btn-outline-secondary" data-pdf-voucher="${item.id}">PDF</button>
        <button class="btn btn-outline-secondary" data-copy-voucher="${item.id}">Copy</button>
        ${item.status === "Sold" ? `<button class="btn btn-outline-success" data-use-voucher="${item.id}">Use</button>` : ""}
        <button class="btn btn-outline-primary" data-edit-voucher="${item.id}">Edit</button>
        <button class="btn btn-outline-warning" data-disable-voucher="${item.id}">Disable</button>
        <button class="btn btn-outline-danger" data-delete-voucher="${item.id}">Delete</button>
      </div></td>
    </tr>`;
  }

  function customerRow(customer) {
    const sales = customerSales(customer.id);
    const vouchers = state.vouchers.filter((item) => item.customerId === customer.id);
    const active = vouchers.filter((item) => ["Sold", "Used"].includes(item.status) && !isExpired(item)).length;
    const expired = vouchers.filter((item) => item.status === "Expired" || isExpired(item)).length;
    return `<tr>
      <td><strong>${customer.name}</strong><br><small class="text-muted">${customer.notes || "No notes"}</small></td>
      <td>${customer.phone}</td>
      <td>${money.format(sales.reduce((sum, sale) => sum + sale.total, 0))}</td>
      <td>${active}</td>
      <td>${expired}</td>
      <td><div class="btn-group btn-group-sm">
        <button class="btn btn-outline-secondary" data-history-customer="${customer.id}">History</button>
        <button class="btn btn-outline-primary" data-edit-customer="${customer.id}">Edit</button>
        <button class="btn btn-outline-danger" data-delete-customer="${customer.id}">Delete</button>
      </div></td>
    </tr>`;
  }

  function saleRow(sale) {
    return `<tr>
      <td>${formatDate(sale.createdAt)}</td>
      <td>${sale.invoiceNo}</td>
      <td>${sale.receiptNo}</td>
      <td>${customerName(sale.customerId)}</td>
      <td>${sale.voucherCode}</td>
      <td>${sale.method}</td>
      <td>${money.format(sale.total)}</td>
      <td>${money.format(sale.profit)}</td>
      <td><button class="btn btn-sm btn-outline-primary" data-receipt="${sale.id}">Receipt</button></td>
    </tr>`;
  }

  function userRow(account) {
    return `<tr>
      <td><strong>${account.name}</strong></td>
      <td>${account.username}</td>
      <td>${account.role}</td>
      <td>${statusBadge(account.active ? "Active" : "Blocked")}</td>
      <td>${rolePermissions(account.role).join(", ")}</td>
      <td><div class="btn-group btn-group-sm">
        <button class="btn btn-outline-primary" data-edit-user="${account.id}">Edit</button>
        <button class="btn btn-outline-danger" data-delete-user="${account.id}">Delete</button>
      </div></td>
    </tr>`;
  }

  function openVoucherModal(id = "") {
    if (!hasPermission("write") && !hasPermission("sell")) return notify("You do not have permission to manage vouchers.", "error");
    const voucher = state.vouchers.find((item) => item.id === id);
    const isEdit = Boolean(voucher);
    setModal(isEdit ? "Edit Voucher" : "Create Single Voucher", `
      <form id="voucherForm">
        <input type="hidden" id="voucherId" value="${voucher?.id || ""}">
        <label class="form-label">Voucher code</label>
        <div class="input-group mb-3"><input class="form-control" id="voucherCode" value="${voucher?.code || uniqueCode()}"><button class="btn btn-outline-secondary" id="randomCodeBtn" type="button">Random</button></div>
        <label class="form-label">Plan</label>
        <select class="form-select mb-3" id="voucherPlan">${PLAN_LIBRARY.map((plan) => option(plan.name, voucher?.plan, `${plan.name} - ${money.format(plan.price)}`)).join("")}</select>
        <label class="form-label">Status</label>
        <select class="form-select mb-3" id="voucherModalStatus">${["Available", "Sold", "Used", "Expired"].map((status) => option(status, voucher?.status)).join("")}</select>
      </form>
    `, `<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" id="saveVoucherBtn">Save Voucher</button>`);
    $("#randomCodeBtn").addEventListener("click", () => $("#voucherCode").value = uniqueCode());
    $("#saveVoucherBtn").addEventListener("click", saveVoucherFromModal);
    appModal.show();
  }

  function saveVoucherFromModal() {
    const id = $("#voucherId").value;
    const plan = PLAN_LIBRARY.find((item) => item.name === $("#voucherPlan").value);
    const data = {
      code: $("#voucherCode").value.trim().toUpperCase(),
      plan: plan.name,
      planKey: plan.key,
      durationMinutes: plan.minutes,
      validity: plan.display,
      price: plan.price,
      status: $("#voucherModalStatus").value
    };
    if (!data.code) return notify("Voucher code is required.", "warning");
    if (state.vouchers.some((item) => item.code === data.code && item.id !== id)) return notify("Voucher code already exists.", "error");
    if (id) Object.assign(state.vouchers.find((item) => item.id === id), data);
    else state.vouchers.unshift({ id: uid("v"), ...data, customerId: "", soldAt: "", activatedAt: "", usedAt: "", expiresAt: "", cashierId: "", generatedBy: user()?.id || "u-admin", batchId: nextBatchId(), disabled: false, createdAt: nowISO() });
    saveState();
    appModal.hide();
    notify("Voucher saved.", "success");
    route("vouchers");
  }

  function openBulkVoucherModal() {
    setModal("Bulk Generate Vouchers", `
      <form id="bulkVoucherForm">
        <label class="form-label">Plan</label>
        <select class="form-select mb-3" id="bulkPlan">${PLAN_LIBRARY.map((plan) => option(plan.name, "", `${plan.name} - ${money.format(plan.price)}`)).join("")}</select>
        <label class="form-label">Quantity</label>
        <input class="form-control mb-3" id="bulkQuantity" type="number" min="1" max="1000" value="10">
      </form>
    `, `<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" id="saveBulkBtn">Generate</button>`);
    $("#saveBulkBtn").addEventListener("click", () => {
      const plan = PLAN_LIBRARY.find((item) => item.name === $("#bulkPlan").value);
      const count = Math.max(1, Math.min(1000, Number($("#bulkQuantity").value)));
      const batchId = nextBatchId();
      for (let index = 0; index < count; index++) state.vouchers.unshift(buildVoucher(uniqueCode(), plan, "Available", "", "", user()?.id || "u-admin", batchId));
      saveState();
      appModal.hide();
      notify(`${count} vouchers generated.`, "success");
      route("vouchers");
    });
    appModal.show();
  }

  function sellVoucher(event) {
    event.preventDefault();
    if (!hasPermission("sell") && !hasPermission("write")) return notify("You do not have permission to sell vouchers.", "error");
    const customerId = $("#sellCustomer").value;
    const phone = $("#sellPhone").value.trim();
    const plan = PLAN_LIBRARY.find((item) => item.name === $("#sellPlan").value);
    let voucher = state.vouchers.find((item) => item.id === $("#sellVoucher").value && item.status === "Available");
    if (!voucher) voucher = nextAvailableVoucher(plan.key);
    if (!phone) return notify("Customer phone number is required.", "warning");
    if (!voucher) return notify(`No available ${plan.name}. Generate vouchers first.`, "warning");
    const tax = taxAmount(plan.price);
    const saleTotal = plan.price + tax;
    const sale = {
      id: uid("s"),
      invoiceNo: nextNumber("INV"),
      receiptNo: nextNumber("RCP"),
      customerId,
      voucherCode: voucher.code,
      plan: plan.name,
      subtotal: plan.price,
      tax,
      total: saleTotal,
      method: $("#sellMethod").value,
      cashierId: user().id,
      createdAt: nowISO(),
      profit: saleTotal - plan.cost
    };
    Object.assign(voucher, {
      plan: plan.name,
      planKey: plan.key,
      durationMinutes: plan.minutes,
      validity: plan.display,
      price: plan.price,
      status: "Sold",
      customerId,
      soldAt: sale.createdAt,
      activatedAt: "",
      usedAt: "",
      expiresAt: "",
      cashierId: user().id
    });
    state.sales.unshift(sale);
    saveState();
    audit("Sale", `${voucher.code} sold to ${customerName(customerId)}`);
    notify(`Receipt ${sale.receiptNo} generated.`, "success");
    route("billing");
    setTimeout(() => showReceipt(sale.id), 150);
  }

  function printVoucher(id) {
    const voucher = state.vouchers.find((item) => item.id === id);
    if (!voucher) return notify("Voucher not found.", "error");
    $("#printHost").innerHTML = voucherPrintHtml(voucher);
    window.print();
  }

  function downloadVoucherPdf(id) {
    const voucher = state.vouchers.find((item) => item.id === id);
    if (!voucher) return notify("Voucher not found.", "error");
    $("#printHost").innerHTML = voucherPrintHtml(voucher);
    window.print();
    notify("Voucher PDF print view opened.", "success");
  }

  function copyVoucherCode(id) {
    const voucher = state.vouchers.find((item) => item.id === id);
    if (!voucher) return notify("Voucher not found.", "error");
    navigator.clipboard?.writeText(voucher.code);
    notify(`Copied ${voucher.code}`, "success");
  }

  function disableVoucher(id) {
    const voucher = state.vouchers.find((item) => item.id === id);
    if (!voucher) return notify("Voucher not found.", "error");
    confirm("Disable voucher?", `${voucher.code} will no longer be sellable.`, () => {
      voucher.disabled = true;
      voucher.status = "Expired";
      saveState();
      notify("Voucher disabled.", "success");
      route("vouchers");
    });
  }

  function activateVoucher(id) {
    const voucher = state.vouchers.find((item) => item.id === id);
    if (!voucher) return notify("Voucher not found.", "error");
    if (voucher.status !== "Sold") return notify("Only sold vouchers can be activated.", "warning");
    const activatedAt = nowISO();
    voucher.status = "Used";
    voucher.activatedAt = activatedAt;
    voucher.usedAt = activatedAt;
    voucher.expiresAt = new Date(new Date(activatedAt).getTime() + voucher.durationMinutes * 60000).toISOString();
    saveState();
    audit("Voucher Activated", `${voucher.code} activated and expires ${formatDate(voucher.expiresAt)}`);
    notify(`${voucher.code} activated.`, "success");
    route("vouchers");
  }

  function voucherPrintHtml(voucher) {
    return `<div class="receipt">
      <div class="receipt-logo">${escapeHtml(state.settings.companyLogoText)}</div>
      <h5 class="text-center mb-1">${escapeHtml(state.settings.companyName)}</h5>
      <p class="text-center small mb-1">${escapeHtml(state.settings.companyAddress || "")}</p>
      <p class="text-center small mb-3">${escapeHtml(state.settings.companyPhone || "")}</p>
      <p class="text-center small mb-3">Wi-Fi Access Voucher</p>
      <hr>
      <h3 class="text-center">${voucher.code}</h3>
      <div class="d-flex justify-content-between"><span>Plan</span><strong>${voucher.plan}</strong></div>
      <div class="d-flex justify-content-between"><span>Price</span><strong>${money.format(voucher.price)}</strong></div>
      <div class="d-flex justify-content-between"><span>Validity</span><strong>${voucher.validity}</strong></div>
      <div class="d-flex justify-content-between"><span>Activation</span><strong>Starts on first login</strong></div>
      <div class="d-flex justify-content-between"><span>Status</span><strong>${voucher.status}</strong></div>
      <div class="d-flex justify-content-between"><span>Batch</span><strong>${voucher.batchId}</strong></div>
      <div class="qr-box">${qrSvg(voucher.code)}</div>
      <div class="barcode-box">${barcodeSvg(voucher.code)}</div>
    </div>`;
  }

  function openCustomerModal(id = "") {
    if (!hasPermission("customers") && !hasPermission("write")) return notify("You do not have permission to manage customers.", "error");
    const customer = state.customers.find((item) => item.id === id);
    setModal(customer ? "Edit Customer" : "Add Customer", `
      <form id="customerForm">
        <input type="hidden" id="customerId" value="${customer?.id || ""}">
        <label class="form-label">Name</label><input class="form-control mb-3" id="customerName" value="${escapeHtml(customer?.name || "")}">
        <label class="form-label">Phone</label><input class="form-control mb-3" id="customerPhone" value="${escapeHtml(customer?.phone || "")}">
        <label class="form-label">Notes</label><input class="form-control mb-3" id="customerNotes" value="${escapeHtml(customer?.notes || "")}">
      </form>
    `, `<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" id="saveCustomerBtn">Save Customer</button>`);
    $("#saveCustomerBtn").addEventListener("click", () => {
      const payload = { name: $("#customerName").value.trim(), phone: $("#customerPhone").value.trim(), notes: $("#customerNotes").value.trim() };
      if (!payload.name || !payload.phone) return notify("Name and phone are required.", "warning");
      if (customer) Object.assign(customer, payload);
      else state.customers.unshift({ id: uid("c"), ...payload, createdAt: nowISO() });
      saveState();
      appModal.hide();
      notify("Customer saved.", "success");
      route("customers");
    });
    appModal.show();
  }

  function openUserModal(id = "") {
    if (!hasPermission("settings")) return notify("Only administrators and managers can manage users.", "error");
    const account = state.users.find((item) => item.id === id);
    setModal(account ? "Edit User" : "Add User", `
      <form id="userForm">
        <input type="hidden" id="userId" value="${account?.id || ""}">
        <label class="form-label">Name</label><input class="form-control mb-3" id="userName" value="${escapeHtml(account?.name || "")}">
        <label class="form-label">Username</label><input class="form-control mb-3" id="userUsername" value="${escapeHtml(account?.username || "")}">
        <label class="form-label">Password</label><input class="form-control mb-3" id="userPassword" value="${escapeHtml(account?.password || "")}">
        <label class="form-label">Role</label><select class="form-select mb-3" id="userRole">${["Administrator", "Manager", "Cashier"].map((role) => option(role, account?.role)).join("")}</select>
        <div class="form-check"><input class="form-check-input" id="userActive" type="checkbox" ${account?.active !== false ? "checked" : ""}><label class="form-check-label" for="userActive">Active</label></div>
      </form>
    `, `<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" id="saveUserBtn">Save User</button>`);
    $("#saveUserBtn").addEventListener("click", () => {
      const payload = { name: $("#userName").value.trim(), username: $("#userUsername").value.trim(), password: $("#userPassword").value, role: $("#userRole").value, active: $("#userActive").checked };
      if (!payload.name || !payload.username || !payload.password) return notify("All user fields are required.", "warning");
      if (state.users.some((item) => item.username === payload.username && item.id !== id)) return notify("Username already exists.", "error");
      if (account) Object.assign(account, payload);
      else state.users.push({ id: uid("u"), ...payload });
      saveState();
      appModal.hide();
      notify("User saved.", "success");
      route("users");
    });
    appModal.show();
  }

  function deleteVoucher(id) {
    confirm("Delete voucher?", "This cannot be undone.", () => {
      state.vouchers = state.vouchers.filter((item) => item.id !== id);
      saveState();
      notify("Voucher deleted.", "success");
      route("vouchers");
    });
  }

  function deleteCustomer(id) {
    confirm("Delete customer?", "Customer history will remain in sales, but the profile will be removed.", () => {
      state.customers = state.customers.filter((item) => item.id !== id);
      saveState();
      notify("Customer deleted.", "success");
      route("customers");
    });
  }

  function deleteUser(id) {
    if (id === user().id) return notify("You cannot delete the logged-in user.", "warning");
    confirm("Delete user?", "This user will lose access immediately.", () => {
      state.users = state.users.filter((item) => item.id !== id);
      saveState();
      notify("User deleted.", "success");
      route("users");
    });
  }

  function showCustomerHistory(id) {
    const rows = customerSales(id).map(saleRow).join("") || emptyRow(9, "No purchase history.");
    setModal(`Customer History - ${customerName(id)}`, `<div class="table-responsive"><table class="table align-middle"><thead><tr><th>Date</th><th>Invoice</th><th>Receipt</th><th>Customer</th><th>Voucher</th><th>Method</th><th>Total</th><th>Profit</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>`, `<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>`);
    $("#modalBody").querySelectorAll("[data-receipt]").forEach((button) => button.addEventListener("click", () => showReceipt(button.dataset.receipt)));
    appModal.show();
  }

  function showReceipt(id) {
    const sale = state.sales.find((item) => item.id === id);
    if (!sale) return notify("Receipt not found.", "error");
    setModal(`Receipt ${sale.receiptNo}`, receiptHtml(sale, true), `<button class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button><button class="btn btn-primary" id="printReceiptBtn"><i class="bi bi-printer"></i> Print</button>`);
    $("#printReceiptBtn").addEventListener("click", () => printReceipt(sale));
    appModal.show();
  }

  function receiptHtml(sale, full = true) {
    if (!sale) return `<div class="text-muted">No receipt generated yet.</div>`;
    const customer = state.customers.find((item) => item.id === sale.customerId);
    const qr = qrSvg(`${sale.receiptNo}|${sale.voucherCode}|${sale.total}`);
    const barcode = barcodeSvg(sale.voucherCode);
    return `<div class="receipt">
      <div class="receipt-logo">${escapeHtml(state.settings.companyLogoText)}</div>
      <h5 class="text-center mb-1">${escapeHtml(state.settings.companyName)}</h5>
      <p class="text-center small mb-1">${escapeHtml(state.settings.companyAddress || "")}</p>
      <p class="text-center small mb-1">${escapeHtml(state.settings.companyPhone || "")}${state.settings.companyEmail ? ` | ${escapeHtml(state.settings.companyEmail)}` : ""}</p>
      <p class="text-center small mb-2">${escapeHtml(state.settings.companyTin || "")}</p>
      <p class="text-center small mb-3">${escapeHtml(state.settings.receiptFooter)}</p>
      <hr>
      <div class="d-flex justify-content-between"><span>Receipt</span><strong>${sale.receiptNo}</strong></div>
      <div class="d-flex justify-content-between"><span>Invoice</span><strong>${sale.invoiceNo}</strong></div>
      <div class="d-flex justify-content-between"><span>Date</span><strong>${formatDate(sale.createdAt)}</strong></div>
      <div class="d-flex justify-content-between"><span>Customer</span><strong>${customer?.name || "Walk-in"}</strong></div>
      <div class="d-flex justify-content-between"><span>Phone</span><strong>${customer?.phone || "-"}</strong></div>
      <hr>
      <div class="d-flex justify-content-between"><span>Voucher</span><strong>${sale.voucherCode}</strong></div>
      <div class="d-flex justify-content-between"><span>Plan</span><strong>${sale.plan}</strong></div>
      <div class="d-flex justify-content-between"><span>Price</span><strong>${money.format(sale.subtotal)}</strong></div>
      <div class="d-flex justify-content-between"><span>Tax</span><strong>${money.format(sale.tax)}</strong></div>
      <div class="d-flex justify-content-between"><span>Method</span><strong>${sale.method}</strong></div>
      <div class="d-flex justify-content-between"><span>Cashier</span><strong>${userName(sale.cashierId)}</strong></div>
      <div class="d-flex justify-content-between"><span>Activation</span><strong>Starts on first login</strong></div>
      <h4 class="text-center mt-3">${money.format(sale.total)}</h4>
      ${full ? `<div class="qr-box">${qr}</div><div class="barcode-box">${barcode}</div>` : ""}
    </div>`;
  }

  function printReceipt(sale) {
    $("#printHost").innerHTML = receiptHtml(sale, true);
    window.print();
  }

  function exportAction(kind) {
    if (!hasPermission("export") && !hasPermission("read")) return notify("You do not have permission to export.", "error");
    const [scope, format] = kind.split("-");
    if (format === "csv") return download(`${scope}.csv`, csvFor(scope), "text/csv");
    if (format === "excel") return download(`${scope}.xls`, csvFor(scope), "application/vnd.ms-excel");
    if (format === "pdf") return exportPdf(scope);
    notify("Export complete.", "success");
  }

  function exportPdf(scope) {
    const title = `${state.settings.companyName} ${scope.toUpperCase()} Export`;
    const data = csvFor(scope).split("\n").map((row) => row.split(","));
    const rows = data.slice(1).map((cols) => `<tr>${cols.map((col) => `<td>${escapeHtml(col.replace(/^"|"$/g, ""))}</td>`).join("")}</tr>`).join("");
    const html = `<div class="receipt" style="max-width:900px"><h4>${title}</h4><table class="table table-sm"><tbody>${rows}</tbody></table></div>`;
    $("#printHost").innerHTML = html;
    window.print();
    notify("PDF print view opened.", "success");
  }

  function backupData() {
    download(`pioneer-backup-${todayISO()}.json`, JSON.stringify(state, null, 2), "application/json");
    notify("Backup downloaded.", "success");
  }

  function restoreBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        state = migrate(JSON.parse(reader.result));
        saveState();
        notify("Backup restored.", "success");
        route("dashboard");
      } catch {
        notify("Invalid backup file.", "error");
      }
    };
    reader.readAsText(file);
  }

  function drawRouteCharts(routeName) {
    if (routeName === "dashboard") {
      drawBarChart($("#dailyRevenueChart"), dailySeries().map((item) => item.total), dailySeries().map((item) => item.label), "#2563eb");
      drawDonutChart($("#voucherUsageChart"), statusCounts(), ["#2563eb", "#16a34a", "#d97706", "#dc2626"]);
    }
    if (routeName === "routerDashboard") {
      drawBarChart($("#routerCpuChart"), [42, 28, 18, 35, 22, 31, 15], ["Main", "Office", "Guest", "VPN", "Staff", "IoT", "Backup"], "#7c3aed");
    }
    if (routeName === "bandwidth") {
      drawBarChart($("#bandwidthChart"), [245, 210, 185, 312, 278, 198, 156, 302, 289, 245, 220, 195, 178, 165, 201, 248, 290, 312, 278, 245, 210, 198, 185, 156], Array.from({length:24},(_,i)=>i+"h"), "#7c3aed");
    }
    if (routeName === "reports") {
      drawLineChart($("#salesGraph"), dailySeries().map((item) => item.total), "#2563eb");
      drawDonutChart($("#voucherGraph"), statusCounts(), ["#2563eb", "#16a34a", "#d97706", "#dc2626"]);
      drawBarChart($("#customerGraph"), state.customers.map((c) => customerSales(c.id).length), state.customers.map((c) => c.name), "#06b6d4");
      drawLineChart($("#revenueGraph"), monthlySeries().map((item) => item.total), "#16a34a");
    }
  }

  function drawBarChart(canvas, values, labels, color) {
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    const max = Math.max(1, ...values);
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;
    const gap = 12;
    const barWidth = Math.max(16, (width - gap * (values.length + 1)) / values.length);
    values.forEach((value, index) => {
      const barHeight = (height - 45) * value / max;
      const x = gap + index * (barWidth + gap);
      const y = height - 30 - barHeight;
      roundRect(ctx, x, y, barWidth, barHeight, 7);
      ctx.fill();
      ctx.fillStyle = "#667085";
      ctx.font = "12px Arial";
      ctx.fillText(labels[index]?.slice(0, 8) || "", x, height - 10);
      ctx.fillStyle = color;
    });
  }

  function drawLineChart(canvas, values, color) {
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    const max = Math.max(1, ...values);
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    values.forEach((value, index) => {
      const x = 20 + (index * (width - 40)) / Math.max(1, values.length - 1);
      const y = height - 25 - ((height - 55) * value) / max;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = color;
    values.forEach((value, index) => {
      const x = 20 + (index * (width - 40)) / Math.max(1, values.length - 1);
      const y = height - 25 - ((height - 55) * value) / max;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawDonutChart(canvas, values, colors) {
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    const total = values.reduce((sum, value) => sum + value, 0) || 1;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 24;
    let start = -Math.PI / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    values.forEach((value, index) => {
      const end = start + (value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, start, end);
      ctx.arc(centerX, centerY, radius * .58, end, start, true);
      ctx.closePath();
      ctx.fillStyle = colors[index];
      ctx.fill();
      start = end;
    });
    ctx.fillStyle = "#667085";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${total}`, centerX, centerY + 6);
  }

  function setupCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(280, rect.width);
    canvas.height = Math.max(200, rect.height);
    return canvas.getContext("2d");
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }

  function notify(message, type = "success") {
    const node = document.createElement("div");
    node.className = `app-alert ${type}`;
    node.innerHTML = `<strong>${type[0].toUpperCase() + type.slice(1)}</strong><div>${escapeHtml(message)}</div>`;
    $("#alertHost").appendChild(node);
    setTimeout(() => node.remove(), 3800);
  }

  function confirm(title, body, action) {
    $("#confirmTitle").textContent = title;
    $("#confirmBody").textContent = body;
    pendingConfirm = action;
    confirmModal.show();
  }

  function setModal(title, body, footer) {
    $("#modalTitle").textContent = title;
    $("#modalBody").innerHTML = body;
    $("#modalFooter").innerHTML = footer;
  }

  function csvFor(scope) {
    const rows = scope === "vouchers"
      ? [["Code", "Plan", "Price", "Validity", "Status", "Customer", "Date Generated", "Date Sold", "Date Activated", "Expiry Date", "Generated By", "Batch ID"], ...state.vouchers.map((v) => [v.code, v.plan, v.price, v.validity, v.status, customerName(v.customerId), v.createdAt, v.soldAt, v.activatedAt, v.expiresAt, userName(v.generatedBy), v.batchId])]
      : scope === "reports"
        ? [["Plan", "Total Generated", "Total Sold", "Total Used", "Total Expired", "Revenue", "Profit"], ...planReportRows().map((r) => [r.plan.name, r.generated, r.sold, r.used, r.expired, r.revenue, r.profit])]
        : [["Date", "Invoice", "Receipt", "Customer", "Voucher", "Method", "Total", "Profit"], ...state.sales.map((s) => [s.createdAt, s.invoiceNo, s.receiptNo, customerName(s.customerId), s.voucherCode, s.method, s.total, s.profit])];
    return rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
  }

  function download(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function generateCode() {
    return realisticCode();
  }

  function realisticCode() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const chars = Array.from(bytes).map((byte) => alphabet[byte % alphabet.length]).join("");
    return `PNR-${chars.slice(0, 4)}-${chars.slice(4, 8)}`;
  }

  function uniqueCode() {
    let code = generateCode();
    while (state?.vouchers?.some((voucher) => voucher.code === code)) code = generateCode();
    return code;
  }

  function nextBatchId() {
    return `BATCH-${todayISO().replaceAll("-", "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  function planByKey(key) {
    return PLAN_LIBRARY.find((plan) => plan.key === key);
  }

  function planByName(name) {
    const normalized = String(name || "").toLowerCase();
    if (normalized.includes("daily") || normalized === "24 hours") return planByKey("daily");
    if (normalized.includes("weekly") || normalized.includes("7 day")) return planByKey("weekly");
    if (normalized.includes("monthly") || normalized.includes("30 day")) return planByKey("monthly");
    return PLAN_LIBRARY.find((plan) => plan.name === name);
  }

  function shortPlan(plan) {
    return plan.name.replace(" Voucher", "");
  }

  function nextAvailableVoucher(planKey) {
    return state.vouchers
      .filter((voucher) => voucher.planKey === planKey && voucher.status === "Available" && !voucher.disabled)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0];
  }

  function nextNumber(prefix) {
    const date = todayISO().replaceAll("-", "");
    const count = state.sales.filter((sale) => sale[prefix === "INV" ? "invoiceNo" : "receiptNo"]?.includes(date)).length + 1;
    return `${prefix}-${date}-${String(count).padStart(3, "0")}`;
  }

  function totalWithTax(amount) {
    return amount + taxAmount(amount);
  }

  function taxAmount(amount) {
    return Math.round(amount * ((Number(state.settings.taxRate) || 0) / 100));
  }

  function expireOldVouchers() {
    let changed = false;
    state.vouchers.forEach((voucher) => {
      if (isExpired(voucher) && voucher.status !== "Expired") {
        voucher.status = "Expired";
        changed = true;
      }
    });
    if (changed) saveState();
  }

  function isExpired(voucher) {
    return voucher.expiresAt && new Date(voucher.expiresAt) < new Date();
  }

  function salesTotal(range) {
    return salesRows(range).reduce((sum, sale) => sum + sale.total, 0);
  }

  function salesRows(range) {
    const now = new Date();
    return state.sales.filter((sale) => {
      const date = new Date(sale.createdAt);
      const days = (now - date) / 86400000;
      if (range === "daily") return date.toDateString() === now.toDateString();
      if (range === "weekly") return days <= 7;
      if (range === "monthly") return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      if (range === "yearly") return date.getFullYear() === now.getFullYear();
      return true;
    });
  }

  function dailySeries() {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      return {
        label: date.toLocaleDateString([], { weekday: "short" }),
        total: state.sales.filter((sale) => sale.createdAt.slice(0, 10) === key).reduce((sum, sale) => sum + sale.total, 0)
      };
    });
  }

  function monthlySeries() {
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      return {
        label: date.toLocaleDateString([], { month: "short" }),
        total: state.sales.filter((sale) => {
          const saleDate = new Date(sale.createdAt);
          return saleDate.getMonth() === date.getMonth() && saleDate.getFullYear() === date.getFullYear();
        }).reduce((sum, sale) => sum + sale.total, 0)
      };
    });
  }

  function statusCounts() {
    return ["Available", "Sold", "Used", "Expired"].map((status) => state.vouchers.filter((item) => item.status === status).length);
  }

  function customerSales(id) {
    return state.sales.filter((sale) => sale.customerId === id);
  }

  function customerName(id) {
    return state.customers.find((item) => item.id === id)?.name || "";
  }

  function userName(id) {
    return state.users.find((item) => item.id === id)?.name || "System";
  }

  function lastSale() {
    return [...state.sales].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  }

  function statusBadge(status) {
    const cls = status === "Available" || status === "Active" || status === "Paid" ? "badge-soft-success"
      : status === "Sold" || status === "Pending" ? "badge-soft-warning"
      : status === "Used" ? "badge-soft-info"
      : "badge-soft-danger";
    return `<span class="badge ${cls}">${status}</span>`;
  }

  function option(value, selected = "", label = value) {
    return `<option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(label)}</option>`;
  }

  function emptyRow(cols, message) {
    return `<tr><td colspan="${cols}" class="text-center text-muted py-4">${message}</td></tr>`;
  }

  function pagination(scope, totalPages, page) {
    if (totalPages <= 1) return "";
    return `<div class="card-footer d-flex justify-content-end gap-2">${Array.from({ length: totalPages }, (_, index) => index + 1).map((num) => `<button class="btn btn-sm ${num === page ? "btn-primary" : "btn-outline-secondary"}" data-scope="${scope}" data-page="${num}">${num}</button>`).join("")}</div>`;
  }

  function paginate(items, page) {
    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    return { items: items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE), totalPages };
  }

  function changePage(scope, page) {
    pageState[scope].page = page;
    route(scope);
  }

  function sorter(key) {
    return (a, b) => {
      if (key === "code-asc") return a.code.localeCompare(b.code);
      if (key === "price-desc") return b.price - a.price;
      return b.createdAt.localeCompare(a.createdAt);
    };
  }

  function formatDate(value) {
    if (!value) return "-";
    return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  }

  function formatDuration(minutes) {
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes < 1440) return `${minutes / 60} hour${minutes === 60 ? "" : "s"}`;
    return `${minutes / 1440} day${minutes === 1440 ? "" : "s"}`;
  }

  function rolePermissions(role) {
    return {
      Administrator: ["All access"],
      Manager: ["Reports", "Exports", "Settings"],
      Cashier: ["Sell", "Customers", "Read"]
    }[role] || ["Read"];
  }

  function audit(type, message) {
    state.audit.unshift({ id: uid("a"), type, message, userId: session?.userId || "", createdAt: nowISO() });
    saveState();
  }

  function toggleTheme() {
    state.settings.darkMode = !state.settings.darkMode;
    saveState();
    applyTheme();
  }

  function applyTheme() {
    document.body.classList.toggle("dark", Boolean(state.settings.darkMode));
  }

  function qrSvg(text) {
    const size = 96;
    let cells = "";
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        const filled = (text.charCodeAt((x + y) % text.length) + x * 7 + y * 11) % 3 !== 0;
        if (filled) cells += `<rect x="${x * 10 + 3}" y="${y * 10 + 3}" width="8" height="8"/>`;
      }
    }
    return `<svg width="${size}" height="${size}" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><rect width="96" height="96" fill="#fff"/><g fill="#111">${cells}</g></svg>`;
  }

  function barcodeSvg(text) {
    let x = 0;
    const bars = text.split("").map((char) => {
      const width = (char.charCodeAt(0) % 4) + 1;
      const rect = `<rect x="${x}" y="0" width="${width}" height="42"/>`;
      x += width + 2;
      return rect;
    }).join("");
    return `<svg width="220" height="48" viewBox="0 0 220 48" xmlns="http://www.w3.org/2000/svg"><rect width="220" height="48" fill="#fff"/><g transform="translate(10 3)" fill="#111">${bars}</g><text x="110" y="47" text-anchor="middle" font-size="8" fill="#111">${escapeHtml(text)}</text></svg>`;
  }
  }
  catch(e) { console.error("FATAL:", e); document.body.innerHTML = `<div class="alert alert-danger m-5"><h4>Fatal Error</h4><pre>${e.message}\n${e.stack}</pre></div>`; }
})();
