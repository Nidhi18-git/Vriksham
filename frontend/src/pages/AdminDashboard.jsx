import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiBarChart2, FiBox, FiBriefcase, FiDownload, FiEdit3, FiFileText, FiPlus, FiSearch, FiShield, FiShoppingBag, FiTrash2, FiTrendingUp, FiUsers } from "react-icons/fi";
import api from "../api/client";
import AnimatedPage from "../components/AnimatedPage";
import { useAuth } from "../context/AuthContext";

const fallbackAnalytics = {
  totalUsers: 128,
  activeRequests: 34,
  monthlyRevenue: 420000,
  activeSubscriptions: 57,
  serviceCompletionRate: 91,
  gardeners: 18,
  shopOrders: 24,
  shopRevenue: 86000
};

const fallbackManagement = {
  requests: [
    { trackingId: "VRK-DEMO-001", name: "Aarav", serviceType: "Balcony Gardening", status: "Under Review", priority: "High" },
    { trackingId: "VRK-DEMO-002", name: "Nisha", serviceType: "Office Green Setup", status: "Assigned", priority: "Medium" }
  ],
  orders: [
    { orderId: "VRK-ORDER-DEMO-1", name: "Harshita", totalAmount: 2298, paymentMethod: "UPI", fulfillmentStatus: "Confirmed" },
    { orderId: "VRK-ORDER-DEMO-2", name: "Nidhi", totalAmount: 849, paymentMethod: "Cash on Delivery", fulfillmentStatus: "Placed" }
  ],
  users: [
    { name: "Demo User", email: "user@vriksham.com", role: "user", location: "Bengaluru" },
    { name: "Demo Admin", email: "admin@vriksham.com", role: "admin", location: "Remote" }
  ],
  plants: [
    { name: "Snake Plant", category: "Air Purifying", stock: 45, availability: "In Stock" },
    { name: "Peace Lily", category: "Flower", stock: 20, availability: "In Stock" }
  ],
  gardeners: [
    { name: "Urban Roots Team", status: "Available", rating: 4.9, completedJobs: 42 },
    { name: "Rohan GreenCare", status: "Assigned", rating: 4.8, completedJobs: 35 }
  ],
  aiReports: [
    { module: "Disease Detection", confidence: 0.88, status: "Processed", modelVersion: "rule-prototype-v1-ai-ready" },
    { module: "Garden Design", confidence: 0.86, status: "Processed", modelVersion: "rule-prototype-v1-ai-ready" }
  ],
  adminRequests: [
    { name: "Demo Customer", email: "user@vriksham.com", reason: "I help manage plant maintenance operations.", status: "pending" }
  ]
};

const tabs = [
  ["requests", "Services"],
  ["orders", "Orders"],
  ["users", "Users"],
  ["plants", "Inventory"],
  ["gardeners", "Gardeners"],
  ["aiReports", "AI Scans"],
  ["adminRequests", "Admin Requests"]
];

const columns = {
  requests: ["trackingId", "name", "serviceType", "status", "priority"],
  orders: ["orderId", "name", "amount", "paymentMethod", "fulfillmentStatus"],
  users: ["name", "email", "role", "location"],
  plants: ["name", "category", "stock", "availability"],
  gardeners: ["name", "status", "rating", "completedJobs"],
  aiReports: ["module", "confidence", "status", "modelVersion"],
  adminRequests: ["name", "email", "reason", "status"]
};

function valueFor(row, key) {
  if (key === "amount") return `Rs ${Number(row.totalAmount || 0).toLocaleString("en-IN")}`;
  if (key === "confidence") return row.confidence ? `${Math.round(row.confidence * 100)}%` : "-";
  return row[key] || "-";
}

function MiniBars({ values }) {
  return <div className="flex h-24 items-end gap-2">{values.map((value, index) => <span key={index} className="flex-1 rounded-t-xl bg-gradient-to-t from-leaf-600 to-emerald-300" style={{ height: `${value}%` }} />)}</div>;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(fallbackAnalytics);
  const [management, setManagement] = useState(fallbackManagement);
  const [activeTab, setActiveTab] = useState("requests");
  const [query, setQuery] = useState("");
  const [plantForm, setPlantForm] = useState({ name: "", category: "Indoor", stock: 10, price: 499, availability: "In Stock" });
  const [gardenerForm, setGardenerForm] = useState({ name: "", phone: "", specialties: "Indoor plants", serviceZones: "Bengaluru", status: "Available" });

  useEffect(() => {
    Promise.all([api.get("/admin/analytics"), api.get("/admin/management")])
      .then(([analyticsResponse, managementResponse]) => {
        setAnalytics(analyticsResponse.data);
        setManagement(managementResponse.data);
      })
      .catch(() => {
        setAnalytics(fallbackAnalytics);
        setManagement(fallbackManagement);
      });
  }, []);

  const tableRows = useMemo(() => {
    const rows = management[activeTab] || [];
    const term = query.toLowerCase();
    return term ? rows.filter((row) => JSON.stringify(row).toLowerCase().includes(term)) : rows;
  }, [activeTab, management, query]);

  const cards = [
    [FiUsers, "Total users", analytics.totalUsers, "+12%"],
    [FiShield, "Active users", Math.max(analytics.totalUsers - 24, 0), "+8%"],
    [FiBarChart2, "AI scans", management.aiReports?.length || 0, "+31%"],
    [FiShoppingBag, "Revenue", `Rs ${Number((analytics.monthlyRevenue || 0) + (analytics.shopRevenue || 0)).toLocaleString("en-IN")}`, "+18%"],
    [FiBriefcase, "Pending requests", analytics.activeRequests, "Ops"],
    [FiBox, "Orders", analytics.shopOrders || 0, "Shop"]
  ];

  const updateRow = async (row, patch) => {
    if (activeTab === "requests" && row._id) await api.put(`/update-status/${row._id}`, { status: patch.status });
    if (activeTab === "orders" && row._id) await api.put(`/orders/${row._id}/status`, { fulfillmentStatus: patch.fulfillmentStatus, paymentStatus: row.paymentStatus });
    setManagement((current) => ({ ...current, [activeTab]: current[activeTab].map((item) => (item === row || item._id === row._id ? { ...item, ...patch } : item)) }));
  };

  const assignGardener = async (row, gardenerId) => {
    if (row._id) await api.put(`/assign-request/${row._id}`, { gardenerId, priority: row.priority || "Medium" });
    const gardener = (management.gardeners || []).find((item) => item._id === gardenerId);
    setManagement((current) => ({
      ...current,
      requests: current.requests.map((item) => (item === row || item._id === row._id ? { ...item, assignedGardener: gardener, status: "Assigned" } : item))
    }));
  };

  const updatePlantStock = async (row, stock) => {
    if (row._id) await api.put(`/plants/${row._id}`, { stock });
    setManagement((current) => ({
      ...current,
      plants: current.plants.map((item) => (item === row || item._id === row._id ? { ...item, stock } : item))
    }));
  };

  const deletePlant = async (row) => {
    if (row._id) await api.delete(`/plants/${row._id}`);
    setManagement((current) => ({ ...current, plants: current.plants.filter((item) => item !== row && item._id !== row._id) }));
  };

  const downloadOrderInvoice = (order) => {
    const popup = window.open("", "_blank", "width=900,height=700");
    if (!popup) return;
    popup.document.write(`
      <html><head><title>Invoice ${order.orderId}</title><style>
      body{font-family:Arial;padding:32px;color:#102018} h1{color:#15864e}
      table{width:100%;border-collapse:collapse;margin-top:20px} th,td{border-bottom:1px solid #d8f7e3;padding:12px;text-align:left}
      </style></head><body>
      <h1>Vriksham Order Invoice</h1>
      <p><strong>Order:</strong> ${order.orderId}</p>
      <p><strong>Customer:</strong> ${order.name}</p>
      <p><strong>Status:</strong> ${order.fulfillmentStatus}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod || "Pending"}</p>
      <table><thead><tr><th>Item</th><th>Qty</th><th>Amount</th></tr></thead><tbody>
      ${(order.items || []).map((item) => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>Rs ${(item.price * item.quantity).toLocaleString("en-IN")}</td></tr>`).join("")}
      </tbody></table>
      <h2>Total: Rs ${Number(order.totalAmount || 0).toLocaleString("en-IN")}</h2>
      </body></html>
    `);
    popup.document.close();
    popup.print();
  };

  const createPlant = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/plants", plantForm);
    setManagement((current) => ({ ...current, plants: [data, ...(current.plants || [])] }));
    setPlantForm({ name: "", category: "Indoor", stock: 10, price: 499, availability: "In Stock" });
  };

  const createGardener = async (event) => {
    event.preventDefault();
    const payload = { ...gardenerForm, specialties: gardenerForm.specialties.split(",").map((item) => item.trim()), serviceZones: gardenerForm.serviceZones.split(",").map((item) => item.trim()) };
    const { data } = await api.post("/gardeners", payload);
    setManagement((current) => ({ ...current, gardeners: [data, ...(current.gardeners || [])] }));
    setGardenerForm({ name: "", phone: "", specialties: "Indoor plants", serviceZones: "Bengaluru", status: "Available" });
  };

  const reviewAdminRequest = async (row, status) => {
    if (!row._id) {
      setManagement((current) => ({ ...current, adminRequests: current.adminRequests.map((item) => (item === row ? { ...item, status } : item)) }));
      return;
    }
    const { data } = await api.put(`/admin/admin-requests/${row._id}/review`, { status });
    setManagement((current) => ({
      ...current,
      adminRequests: current.adminRequests.map((item) => (item._id === row._id ? data.request : item)),
      users: current.users.map((item) => (item._id === data.request.user?._id ? { ...item, role: data.request.user.role } : item))
    }));
  };

  const updateUser = async (row, patch) => {
    if (!row._id) {
      setManagement((current) => ({ ...current, users: current.users.map((item) => (item === row ? { ...item, ...patch } : item)) }));
      return;
    }
    const { data } = await api.put(`/admin/users/${row._id}/role`, patch);
    setManagement((current) => ({ ...current, users: current.users.map((item) => (item._id === row._id ? data.user : item)) }));
  };

  return (
    <AnimatedPage>
      <section className="min-h-screen bg-[#06110c] py-8 text-white">
        <div className="container-page">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-[#0b1d14] to-[#102a1d] p-7 shadow-glow">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-leaf-300">Admin Command Center</p>
            <h1 className="mt-3 text-4xl font-black lg:text-5xl">Vriksham Business Operations</h1>
            <p className="mt-4 max-w-3xl leading-8 text-emerald-50/75">Analytics-heavy SaaS dashboard for users, services, AI scans, inventory, orders, content and corporate sustainability performance.</p>
            <span className="mt-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase text-leaf-100">Access level: {user?.role}</span>
          </motion.div>

          {user?.role === "superadmin" && (
            <div className="mt-8 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-amber-200">Superadmin Approval Queue</p>
                  <h2 className="mt-2 text-2xl font-black">Pending Admin Access Requests</h2>
                </div>
                <span className="rounded-full bg-amber-200 px-4 py-2 text-sm font-black text-amber-950">{(management.adminRequests || []).filter((item) => item.status === "pending").length} pending</span>
              </div>
              <div className="mt-5 grid gap-4">
                {(management.adminRequests || []).filter((item) => item.status === "pending").slice(0, 4).map((request) => (
                  <div key={request._id || request.email} className="rounded-2xl bg-white/10 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-black">{request.name} <span className="text-emerald-50/60">({request.email})</span></p>
                        <p className="mt-2 text-sm leading-6 text-emerald-50/70">{request.reason}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => reviewAdminRequest(request, "approved")} className="rounded-full bg-leaf-500 px-4 py-2 text-sm font-black text-white">Approve</button>
                        <button onClick={() => reviewAdminRequest(request, "rejected")} className="rounded-full bg-red-500 px-4 py-2 text-sm font-black text-white">Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
                {!(management.adminRequests || []).some((item) => item.status === "pending") && <p className="rounded-2xl bg-white/10 p-4 text-sm font-bold text-emerald-50/70">No pending admin access requests.</p>}
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cards.map(([Icon, label, value, trend]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-soft backdrop-blur">
                <div className="flex items-center justify-between">
                  <Icon className="text-2xl text-leaf-300" />
                  <span className="rounded-full bg-leaf-400/15 px-3 py-1 text-xs font-black text-leaf-200">{trend}</span>
                </div>
                <p className="mt-5 text-sm text-emerald-50/60">{label}</p>
                <p className="mt-2 text-3xl font-black">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 xl:col-span-2">
              <div className="flex items-center justify-between"><h2 className="text-2xl font-black">Scan Frequency & Revenue</h2><FiTrendingUp className="text-leaf-300" /></div>
              <div className="mt-6"><MiniBars values={[42, 58, 46, 72, 65, 84, 76, 92, 70, 88, 95, 82]} /></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Disease trend: Leaf Spot", "Avg AI confidence: 87%", "Service SLA: 97%"].map((item) => <span key={item} className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-emerald-50">{item}</span>)}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <h2 className="text-2xl font-black">Corporate Analytics</h2>
              <div className="mt-5 grid gap-3">
                {["CO2 impact: 1.8T", "Plant survival: 94%", "Oxygen hours: 42K", "Coverage growth: 28%"].map((item) => <p key={item} className="rounded-2xl bg-white/10 p-4 text-sm font-black text-leaf-100">{item}</p>)}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {tabs.map(([id, label]) => <button key={id} onClick={() => setActiveTab(id)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${activeTab === id ? "bg-leaf-500 text-white" : "bg-white/10 text-emerald-50"}`}>{label}</button>)}
              </div>
              <label className="relative block xl:w-80"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-100/50" /><input className="input border-white/10 bg-white/10 pl-11 text-white" placeholder="Filter operations" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[840px] border-separate border-spacing-y-3 text-left text-sm">
                <thead><tr>{columns[activeTab].map((column) => <th key={column} className="px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-50/50">{column.replace(/([A-Z])/g, " $1")}</th>)}{(activeTab === "requests" || activeTab === "orders" || activeTab === "adminRequests" || activeTab === "users" || activeTab === "plants") && <th className="px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-50/50">Action</th>}</tr></thead>
                <tbody>
                  {tableRows.map((row, index) => (
                    <tr key={row._id || row.orderId || row.trackingId || row.email || index} className="bg-white/[0.08]">
                      {columns[activeTab].map((column) => <td key={column} className="px-4 py-4 font-semibold text-emerald-50 first:rounded-l-2xl last:rounded-r-2xl">{valueFor(row, column)}</td>)}
                      {(activeTab === "requests" || activeTab === "orders" || activeTab === "adminRequests" || activeTab === "users" || activeTab === "plants") && (
                        <td className="px-4 py-4">
                          {activeTab === "requests" && <div className="flex min-w-[360px] gap-2"><select className="input bg-white/10 text-white" value={row.status || "Pending"} onChange={(event) => updateRow(row, { status: event.target.value })}>{["Pending", "Under Review", "Assigned", "In Progress", "Completed"].map((status) => <option key={status}>{status}</option>)}</select><select className="input bg-white/10 text-white" value={row.assignedGardener?._id || ""} onChange={(event) => assignGardener(row, event.target.value)}><option value="">Assign gardener</option>{(management.gardeners || []).map((gardener) => <option key={gardener._id || gardener.name} value={gardener._id}>{gardener.name}</option>)}</select></div>}
                          {activeTab === "orders" && <div className="flex min-w-[280px] gap-2"><select className="input bg-white/10 text-white" value={row.fulfillmentStatus || "Placed"} onChange={(event) => updateRow(row, { fulfillmentStatus: event.target.value })}>{["Placed", "Confirmed", "Packed", "Out for Delivery", "Delivered", "Cancelled"].map((status) => <option key={status}>{status}</option>)}</select><button onClick={() => downloadOrderInvoice(row)} className="rounded-full bg-white/10 px-3 py-2 text-xs font-black"><FiDownload /></button></div>}
                          {activeTab === "adminRequests" && user?.role === "superadmin" && row.status === "pending" && <div className="flex gap-2"><button onClick={() => reviewAdminRequest(row, "approved")} className="rounded-full bg-leaf-500 px-3 py-2 text-xs font-black">Approve</button><button onClick={() => reviewAdminRequest(row, "rejected")} className="rounded-full bg-red-500 px-3 py-2 text-xs font-black">Reject</button></div>}
                          {activeTab === "users" && user?.role === "superadmin" && <div className="flex gap-2"><select className="input min-w-36 bg-white/10 text-white" value={row.role || "user"} onChange={(event) => updateUser(row, { role: event.target.value })}>{["user", "admin", "superadmin"].map((role) => <option key={role}>{role}</option>)}</select><button onClick={() => updateUser(row, { blocked: !row.blocked })} className="rounded-full bg-white/10 px-3 py-2 text-xs font-black">{row.blocked ? "Unblock" : "Block"}</button></div>}
                          {activeTab === "plants" && <div className="flex min-w-[220px] gap-2"><input className="input bg-white/10 text-white" type="number" value={row.stock || 0} onChange={(event) => updatePlantStock(row, Number(event.target.value))} /><button onClick={() => deletePlant(row)} className="rounded-full bg-red-500 px-3 py-2 text-xs font-black"><FiTrash2 /></button></div>}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <form onSubmit={createPlant} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <h2 className="flex items-center gap-2 text-2xl font-black"><FiPlus /> Plant Inventory Management</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2"><input className="input bg-white/10 text-white" placeholder="Plant name" value={plantForm.name} onChange={(event) => setPlantForm({ ...plantForm, name: event.target.value })} required /><input className="input bg-white/10 text-white" value={plantForm.category} onChange={(event) => setPlantForm({ ...plantForm, category: event.target.value })} /><input className="input bg-white/10 text-white" type="number" value={plantForm.stock} onChange={(event) => setPlantForm({ ...plantForm, stock: event.target.value })} /><input className="input bg-white/10 text-white" type="number" value={plantForm.price} onChange={(event) => setPlantForm({ ...plantForm, price: event.target.value })} /></div>
              <button className="btn-primary mt-5">Add Plant</button>
            </form>
            <form onSubmit={createGardener} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <h2 className="flex items-center gap-2 text-2xl font-black"><FiEdit3 /> Service Management</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2"><input className="input bg-white/10 text-white" placeholder="Gardener name" value={gardenerForm.name} onChange={(event) => setGardenerForm({ ...gardenerForm, name: event.target.value })} required /><input className="input bg-white/10 text-white" placeholder="Phone" value={gardenerForm.phone} onChange={(event) => setGardenerForm({ ...gardenerForm, phone: event.target.value })} /><input className="input bg-white/10 text-white" value={gardenerForm.specialties} onChange={(event) => setGardenerForm({ ...gardenerForm, specialties: event.target.value })} /><input className="input bg-white/10 text-white" value={gardenerForm.serviceZones} onChange={(event) => setGardenerForm({ ...gardenerForm, serviceZones: event.target.value })} /></div>
              <button className="btn-primary mt-5">Add Gardener</button>
            </form>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-3">
            {["Blogs & plant tips", "Featured plants", "Corporate articles"].map((item) => <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6"><FiFileText className="text-2xl text-leaf-300" /><h3 className="mt-4 text-xl font-black">{item}</h3><p className="mt-3 text-sm leading-7 text-emerald-50/60">Content management placeholder for publishing premium green-care content.</p></div>)}
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
