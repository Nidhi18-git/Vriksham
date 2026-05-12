import { useEffect, useState } from "react";
import { FiActivity, FiBell, FiCalendar, FiClock, FiCreditCard, FiDroplet, FiTrendingUp, FiUser } from "react-icons/fi";
import api from "../api/client";
import AnimatedPage from "../components/AnimatedPage";

const fallbackRequests = [
  { trackingId: "VRK-DEMO-001", serviceType: "Balcony Gardening", status: "Under Review", createdAt: new Date().toISOString() },
  { trackingId: "VRK-DEMO-002", serviceType: "Plant Maintenance", status: "Completed", createdAt: new Date().toISOString() }
];

const healthStats = [
  ["Plant Health", 86, "Healthy"],
  ["Watering Consistency", 74, "Good"],
  ["Growth Tracking", 68, "Improving"]
];

const wateringDays = [
  ["Mon", true],
  ["Tue", false],
  ["Wed", true],
  ["Thu", false],
  ["Fri", true],
  ["Sat", false],
  ["Sun", true]
];

const reminders = [
  "Water Peace Lily tomorrow morning",
  "Fertilizer cycle due in 6 days",
  "Balcony pruning visit pending",
  "Upload next leaf scan after 10 days"
];

const activity = [
  "AI disease scan completed",
  "Plant order confirmed",
  "Maintenance request moved to Assigned",
  "Subscription renewal reminder generated"
];

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  useEffect(() => {
    api.get("/profile").then(({ data }) => setProfile(data)).catch(() => setProfile({ requests: fallbackRequests, notifications: [] }));
    setScanHistory(JSON.parse(localStorage.getItem("vriksham_ai_scan_history") || "[]"));
  }, []);

  const requests = profile?.requests || fallbackRequests;
  const orders = profile?.orders || [];

  return (
    <AnimatedPage>
      <section className="section-pad">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-leaf-600">User Dashboard</p>
              <h1 className="mt-3 text-4xl font-black">Track Your Green Services</h1>
            </div>
            <span className="rounded-full bg-leaf-100 px-4 py-2 text-sm font-bold text-leaf-800 dark:bg-white/10 dark:text-leaf-200">Managed by Vriksham Ops</span>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {[
              [FiClock, "Open Requests", requests.filter((item) => item.status !== "Completed").length],
              [FiBell, "Notifications", profile?.notifications?.length || 0],
              [FiCreditCard, "Subscription", "Care Plus"],
              [FiActivity, "AI Scans", scanHistory.length],
              [FiUser, "Profile", profile?.user?.name || "Customer"]
            ].map(([Icon, label, value]) => (
              <div key={label} className="card">
                <Icon className="text-2xl text-leaf-600" />
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-300">{label}</p>
                <p className="mt-1 text-2xl font-black">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="card">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black">Plant Health Analytics</h2>
                <FiTrendingUp className="text-2xl text-leaf-600" />
              </div>
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {healthStats.map(([label, value, status]) => (
                  <div key={label} className="rounded-2xl bg-leaf-50 p-5 text-center dark:bg-white/10">
                    <div
                      className="mx-auto grid h-28 w-28 place-items-center rounded-full"
                      style={{ background: `conic-gradient(#20a963 ${value * 3.6}deg, rgba(32,169,99,0.12) 0deg)` }}
                    >
                      <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-xl font-black text-leaf-800 dark:bg-[#07140e] dark:text-leaf-200">{value}%</div>
                    </div>
                    <p className="mt-4 font-black">{label}</p>
                    <p className="mt-1 text-sm font-bold text-leaf-700 dark:text-leaf-300">{status}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black">Watering Calendar</h2>
                <FiCalendar className="text-2xl text-leaf-600" />
              </div>
              <div className="mt-6 grid grid-cols-7 gap-2">
                {wateringDays.map(([day, active]) => (
                  <div key={day} className={`rounded-2xl p-3 text-center text-xs font-black ${active ? "bg-leaf-600 text-white" : "bg-leaf-50 text-leaf-800 dark:bg-white/10 dark:text-leaf-100"}`}>
                    <FiDroplet className="mx-auto mb-2" />
                    {day}
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3">
                {reminders.map((item) => (
                  <div key={item} className="rounded-2xl bg-leaf-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">{item}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="card">
              <h2 className="text-2xl font-black">Service Requests</h2>
              <div className="mt-6 grid gap-4">
                {requests.map((request) => (
                  <div key={request.trackingId} className="rounded-2xl border border-leaf-100 p-4 dark:border-white/10">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-black">{request.serviceType}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-300">{request.trackingId}</p>
                      </div>
                      <span className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-black text-leaf-800 dark:bg-white/10 dark:text-leaf-200">{request.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h2 className="text-2xl font-black">Maintenance History</h2>
              <div className="mt-6 grid gap-4 text-sm text-slate-600 dark:text-slate-300">
                <p>Plant health check completed</p>
                <p>Soil nutrition refreshed</p>
                <p>Next visit predicted by AI placeholder</p>
              </div>
            </div>
          </div>

          <div className="card mt-10">
            <h2 className="text-2xl font-black">AI Plant Scan History</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {scanHistory.length ? (
                scanHistory.slice(0, 6).map((scan) => (
                  <div key={scan.id} className="rounded-2xl border border-leaf-100 bg-leaf-50 p-4 dark:border-white/10 dark:bg-white/10">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black">{scan.diseaseName}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">{scan.plantName} • {scan.imageName}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-leaf-800 dark:bg-white/10 dark:text-leaf-100">
                        {Math.round(Number(scan.confidenceScore || 0) * 100)}%
                      </span>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white dark:bg-white/10">
                      <div className="h-2 rounded-full bg-leaf-600" style={{ width: `${Math.round(Number(scan.confidenceScore || 0) * 100)}%` }} />
                    </div>
                    <p className="mt-3 text-xs font-bold text-slate-500 dark:text-slate-300">{new Date(scan.createdAt).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-leaf-50 p-4 text-sm text-slate-600 dark:bg-white/10 dark:text-slate-300">No AI scans yet. Run a disease scan from the AI page and it will appear here.</p>
              )}
            </div>
          </div>

          <div className="card mt-10">
            <h2 className="text-2xl font-black">Activity Timeline</h2>
            <div className="mt-6 grid gap-4">
              {activity.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-2xl bg-leaf-50 p-4 dark:bg-white/10">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-leaf-600 text-sm font-black text-white">{index + 1}</span>
                  <div>
                    <p className="font-bold">{item}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-300">{index + 1} day{index ? "s" : ""} ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card mt-10">
            <h2 className="text-2xl font-black">Plant & Flower Orders</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {orders.length ? (
                orders.map((order) => (
                  <div key={order.orderId} className="rounded-2xl border border-leaf-100 p-4 dark:border-white/10">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-black">{order.orderId}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-300">{order.items?.length || 0} item(s)</p>
                      </div>
                      <span className="rounded-full bg-leaf-50 px-3 py-1 text-xs font-black text-leaf-800 dark:bg-white/10 dark:text-leaf-200">{order.fulfillmentStatus}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-leaf-50 p-4 text-sm text-slate-600 dark:bg-white/10 dark:text-slate-300">No plant shop orders yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
