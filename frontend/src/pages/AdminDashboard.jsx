import { useEffect, useMemo, useState } from "react";
import { FiBarChart2, FiBox, FiCheckCircle, FiDollarSign, FiPlus, FiSearch, FiUsers } from "react-icons/fi";
import api from "../api/client";
import AnimatedPage from "../components/AnimatedPage";

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
  ]
};

const tabs = [
  ["requests", "Requests"],
  ["orders", "Orders"],
  ["users", "Users"],
  ["plants", "Plants"],
  ["gardeners", "Gardeners"],
  ["aiReports", "AI Reports"]
];

function valueFor(row, key) {
  if (key === "amount") return `Rs ${Number(row.totalAmount || 0).toLocaleString("en-IN")}`;
  if (key === "confidence") return row.confidence ? `${Math.round(row.confidence * 100)}%` : "-";
  return row[key] || row.assignedGardener?.name || "-";
}

const columns = {
  requests: ["trackingId", "name", "serviceType", "status", "priority"],
  orders: ["orderId", "name", "amount", "paymentMethod", "fulfillmentStatus"],
  users: ["name", "email", "role", "location"],
  plants: ["name", "category", "stock", "availability"],
  gardeners: ["name", "status", "rating", "completedJobs"],
  aiReports: ["module", "confidence", "status", "modelVersion"]
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(fallbackAnalytics);
  const [management, setManagement] = useState(fallbackManagement);
  const [activeTab, setActiveTab] = useState("requests");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
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
      })
      .finally(() => setLoading(false));
  }, []);

  const tableRows = useMemo(() => {
    const rows = management[activeTab] || [];
    const term = query.toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(term));
  }, [activeTab, management, query]);

  const cards = [
    [FiUsers, "Total Users", analytics.totalUsers],
    [FiBarChart2, "Active Requests", analytics.activeRequests],
    [FiDollarSign, "Monthly Revenue", `Rs ${Number(analytics.monthlyRevenue).toLocaleString("en-IN")}`],
    [FiBox, "Active Subscriptions", analytics.activeSubscriptions],
    [FiCheckCircle, "Completion Rate", `${analytics.serviceCompletionRate}%`],
    [FiUsers, "Gardener Partners", analytics.gardeners],
    [FiDollarSign, "Shop Revenue", `Rs ${Number(analytics.shopRevenue || 0).toLocaleString("en-IN")}`],
    [FiBox, "Plant Orders", analytics.shopOrders || 0]
  ];

  const updateRow = async (row, patch) => {
    if (activeTab === "requests" && row._id) {
      await api.put(`/update-status/${row._id}`, { status: patch.status });
    }
    if (activeTab === "orders" && row._id) {
      await api.put(`/orders/${row._id}/status`, { fulfillmentStatus: patch.fulfillmentStatus, paymentStatus: row.paymentStatus });
    }
    setManagement((current) => ({
      ...current,
      [activeTab]: current[activeTab].map((item) => (item === row || item._id === row._id ? { ...item, ...patch } : item))
    }));
  };

  const createPlant = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/plants", plantForm);
    setManagement((current) => ({ ...current, plants: [data, ...(current.plants || [])] }));
    setPlantForm({ name: "", category: "Indoor", stock: 10, price: 499, availability: "In Stock" });
  };

  const createGardener = async (event) => {
    event.preventDefault();
    const payload = {
      ...gardenerForm,
      specialties: gardenerForm.specialties.split(",").map((item) => item.trim()).filter(Boolean),
      serviceZones: gardenerForm.serviceZones.split(",").map((item) => item.trim()).filter(Boolean)
    };
    const { data } = await api.post("/gardeners", payload);
    setManagement((current) => ({ ...current, gardeners: [data, ...(current.gardeners || [])] }));
    setGardenerForm({ name: "", phone: "", specialties: "Indoor plants", serviceZones: "Bengaluru", status: "Available" });
  };

  return (
    <AnimatedPage>
      <section className="section-pad">
        <div className="container-page">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-leaf-600">Admin Dashboard</p>
            <h1 className="mt-3 text-4xl font-black">Vriksham Operations Command Center</h1>
            <p className="mt-4 max-w-3xl leading-8 text-slate-600 dark:text-slate-300">
              Manage requests, orders, users, inventory, gardeners, and AI reports from one central panel.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(([Icon, label, value]) => (
              <div key={label} className="card">
                <Icon className="text-3xl text-leaf-600" />
                <p className="mt-5 text-sm font-semibold text-slate-500 dark:text-slate-300">{label}</p>
                <p className="mt-2 text-2xl font-black">{loading ? "..." : value}</p>
              </div>
            ))}
          </div>

          <div className="card mt-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {tabs.map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black transition ${activeTab === id ? "bg-leaf-600 text-white" : "bg-leaf-50 text-leaf-900 dark:bg-white/10 dark:text-leaf-100"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="relative block min-w-0 lg:w-80">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="input pl-11" placeholder="Filter table" value={query} onChange={(event) => setQuery(event.target.value)} />
              </label>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-y-3 text-left text-sm">
                <thead>
                  <tr>
                    {columns[activeTab].map((column) => (
                      <th key={column} className="px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                        {column.replace(/([A-Z])/g, " $1")}
                      </th>
                    ))}
                    {(activeTab === "requests" || activeTab === "orders") && (
                      <th className="px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, index) => (
                    <tr key={row._id || row.orderId || row.trackingId || row.email || `${activeTab}-${index}`} className="rounded-2xl bg-leaf-50 dark:bg-white/10">
                      {columns[activeTab].map((column) => (
                        <td key={column} className="px-4 py-4 font-semibold text-slate-700 first:rounded-l-2xl last:rounded-r-2xl dark:text-slate-200">
                          {valueFor(row, column)}
                        </td>
                      ))}
                      {(activeTab === "requests" || activeTab === "orders") && (
                        <td className="px-4 py-4">
                          {activeTab === "requests" ? (
                            <select className="input min-w-40" value={row.status || "Pending"} onChange={(event) => updateRow(row, { status: event.target.value })}>
                              {["Pending", "Under Review", "Assigned", "In Progress", "Completed"].map((status) => <option key={status}>{status}</option>)}
                            </select>
                          ) : (
                            <select className="input min-w-40" value={row.fulfillmentStatus || "Placed"} onChange={(event) => updateRow(row, { fulfillmentStatus: event.target.value })}>
                              {["Placed", "Confirmed", "Packed", "Out for Delivery", "Delivered", "Cancelled"].map((status) => <option key={status}>{status}</option>)}
                            </select>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {!tableRows.length && <p className="rounded-2xl bg-leaf-50 p-5 text-sm font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">No records found.</p>}
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <form onSubmit={createPlant} className="card">
              <h2 className="flex items-center gap-2 text-2xl font-black"><FiPlus /> Add Plant</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <input className="input" placeholder="Plant name" value={plantForm.name} onChange={(event) => setPlantForm({ ...plantForm, name: event.target.value })} required />
                <select className="input" value={plantForm.category} onChange={(event) => setPlantForm({ ...plantForm, category: event.target.value })}>
                  {["Indoor", "Outdoor", "Air Purifying", "Decorative", "Edible", "Flower", "Bouquet"].map((item) => <option key={item}>{item}</option>)}
                </select>
                <input className="input" type="number" placeholder="Stock" value={plantForm.stock} onChange={(event) => setPlantForm({ ...plantForm, stock: event.target.value })} />
                <input className="input" type="number" placeholder="Price" value={plantForm.price} onChange={(event) => setPlantForm({ ...plantForm, price: event.target.value })} />
              </div>
              <button className="btn-primary mt-5">Add Plant</button>
            </form>

            <form onSubmit={createGardener} className="card">
              <h2 className="flex items-center gap-2 text-2xl font-black"><FiPlus /> Add Gardener</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <input className="input" placeholder="Name" value={gardenerForm.name} onChange={(event) => setGardenerForm({ ...gardenerForm, name: event.target.value })} required />
                <input className="input" placeholder="Phone" value={gardenerForm.phone} onChange={(event) => setGardenerForm({ ...gardenerForm, phone: event.target.value })} />
                <input className="input" placeholder="Specialties comma separated" value={gardenerForm.specialties} onChange={(event) => setGardenerForm({ ...gardenerForm, specialties: event.target.value })} />
                <input className="input" placeholder="Service zones comma separated" value={gardenerForm.serviceZones} onChange={(event) => setGardenerForm({ ...gardenerForm, serviceZones: event.target.value })} />
              </div>
              <button className="btn-primary mt-5">Add Gardener</button>
            </form>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
