import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiBell,
  FiCalendar,
  FiCamera,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiDroplet,
  FiImage,
  FiMap,
  FiShield,
  FiShoppingBag,
  FiSun,
  FiUploadCloud
} from "react-icons/fi";
import api from "../api/client";
import AnimatedPage from "../components/AnimatedPage";
import { useAuth } from "../context/AuthContext";

const fallbackRequests = [
  { trackingId: "VRK-DEMO-001", serviceType: "Balcony Gardening", status: "Under Review" },
  { trackingId: "VRK-DEMO-002", serviceType: "Plant Maintenance", status: "Completed" }
];

const myPlants = [
  { name: "Peace Lily", health: 92, water: "Tomorrow", sunlight: "Low indirect", stage: "Blooming" },
  { name: "Snake Plant", health: 88, water: "Friday", sunlight: "Low light", stage: "Stable" },
  { name: "Monstera", health: 81, water: "Today", sunlight: "Bright indirect", stage: "New leaves" }
];

const reminders = [
  ["Watering alert", "Monstera needs water today", FiDroplet],
  ["Fertilizer reminder", "Peace Lily feeding in 6 days", FiActivity],
  ["Gardener visit", "Balcony AMC visit pending", FiClock],
  ["AI follow-up", "Scan Peace Lily again next week", FiCamera]
];

const journal = [
  ["Week 1", "Peace Lily transferred to new planter"],
  ["Week 2", "New white blooms visible"],
  ["Week 3", "Leaves cleaned and soil moisture stable"]
];

function ProgressRing({ value, label }) {
  return (
    <div className="rounded-3xl bg-white/80 p-5 text-center shadow-soft dark:bg-white/10">
      <div
        className="mx-auto grid h-28 w-28 place-items-center rounded-full"
        style={{ background: `conic-gradient(#20a963 ${value * 3.6}deg, rgba(32,169,99,0.14) 0deg)` }}
      >
        <div className="grid h-20 w-20 place-items-center rounded-full bg-mist text-xl font-black text-leaf-800 dark:bg-[#07140e] dark:text-leaf-100">{value}%</div>
      </div>
      <p className="mt-4 text-sm font-black text-slate-700 dark:text-slate-200">{label}</p>
    </div>
  );
}

function DownloadReport({ scan }) {
  const download = () => {
    if (!scan) return;
    const popup = window.open("", "_blank", "width=900,height=700");
    if (!popup) return;
    popup.document.write(`
      <html><head><title>Vriksham AI Report</title><style>
      body{font-family:Arial;padding:32px;color:#102018} h1{color:#15864e}
      .card{border:1px solid #d8f7e3;border-radius:16px;padding:18px;margin:16px 0}
      li{margin:8px 0}
      </style></head><body>
      <h1>Vriksham AI Plant Report</h1>
      <div class="card"><p><strong>Disease:</strong> ${scan.diseaseName}</p><p><strong>Confidence:</strong> ${Math.round(Number(scan.confidenceScore || 0) * 100)}%</p><p><strong>Severity:</strong> ${scan.severity || "Low"}</p></div>
      <div class="card"><h2>Treatment</h2><ul>${(scan.treatmentSuggestions || []).map((item) => `<li>${item}</li>`).join("")}</ul></div>
      <div class="card"><h2>Prevention</h2><ul>${(scan.preventionTips || []).map((item) => `<li>${item}</li>`).join("")}</ul></div>
      </body></html>
    `);
    popup.document.close();
    popup.print();
  };

  return (
    <button onClick={download} className="btn-secondary mt-4 w-full">
      <FiDownload /> Download AI Report
    </button>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [scanner, setScanner] = useState({ plantName: "Peace Lily", symptoms: "yellow leaves and brown spots", imageName: "", imagePreview: "" });
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [recommendation, setRecommendation] = useState({ climate: "Warm", sunlight: "Low", environment: "Indoor", budget: 1500, maintenanceLevel: "Easy", roomSize: "Medium" });
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [garden, setGarden] = useState({ spaceType: "Balcony", spaceSize: "Medium", style: "Modern natural", imageName: "" });
  const [gardenResult, setGardenResult] = useState(null);
  const [adminReason, setAdminReason] = useState("");
  const [adminRequestStatus, setAdminRequestStatus] = useState("");

  useEffect(() => {
    api.get("/profile").then(({ data }) => setProfile(data)).catch(() => setProfile({ requests: fallbackRequests, notifications: [] }));
    api.get("/admin-requests/mine").then(({ data }) => setAdminRequestStatus(data[0]?.status || "")).catch(() => {});
    setScanHistory(JSON.parse(localStorage.getItem("vriksham_ai_scan_history") || "[]"));
  }, []);

  const requests = profile?.requests || fallbackRequests;
  const orders = profile?.orders || [];
  const totalPlants = myPlants.length;
  const healthyPlants = myPlants.filter((plant) => plant.health >= 85).length;
  const unhealthyPlants = totalPlants - healthyPlants;
  const healthAverage = Math.round(myPlants.reduce((sum, plant) => sum + plant.health, 0) / totalPlants);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const attachPreview = (file) => {
    if (!file) return;
    setScanner((current) => ({ ...current, imageName: file.name, imagePreview: URL.createObjectURL(file) }));
  };

  const runScan = async () => {
    setScanning(true);
    const { data } = await api.post("/ai/disease", scanner);
    setScanResult(data.report.output);
    const historyItem = { id: Date.now(), createdAt: new Date().toISOString(), plantName: scanner.plantName, imageName: scanner.imageName || "Uploaded leaf", ...data.report.output };
    const nextHistory = [historyItem, ...scanHistory].slice(0, 12);
    setScanHistory(nextHistory);
    localStorage.setItem("vriksham_ai_scan_history", JSON.stringify(nextHistory));
    setScanning(false);
  };

  const runRecommendation = async () => {
    const { data } = await api.post("/ai/recommendation", recommendation);
    setRecommendationResult(data.report.output);
  };

  const runGarden = async () => {
    const { data } = await api.post("/ai/design", garden);
    setGardenResult(data.report.output);
  };

  const requestAdminAccess = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/admin-requests", { reason: adminReason });
    setAdminRequestStatus(data.request.status);
    setAdminReason("");
  };

  return (
    <AnimatedPage>
      <section className="bg-gradient-to-br from-[#fffaf0] via-mist to-leaf-100/80 py-8 dark:from-[#07140e] dark:via-[#0d2016] dark:to-leaf-950">
        <div className="container-page">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] bg-white/80 p-6 shadow-soft backdrop-blur dark:bg-white/10 lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-leaf-600">AI Plant Companion</p>
                <h1 className="mt-3 text-4xl font-black text-slate-950 dark:text-white lg:text-5xl">{greeting}, {profile?.user?.name || "User"} 🌱</h1>
                <p className="mt-4 max-w-2xl leading-8 text-slate-600 dark:text-slate-300">
                  Your plants look calm today. Monstera needs watering, Peace Lily has a fertilizer reminder, and your next gardener visit is waiting for confirmation.
                </p>
              </div>
              <div className="grid gap-3">
                {reminders.slice(0, 3).map(([title, text, Icon]) => (
                  <div key={title} className="flex items-center gap-3 rounded-2xl bg-leaf-50 p-4 dark:bg-white/10">
                    <Icon className="text-xl text-leaf-600" />
                    <div>
                      <p className="text-sm font-black">{title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-300">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {user?.role === "user" && (
            <div className="mt-8 rounded-[2rem] border border-leaf-100 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10">
              <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-leaf-600"><FiShield /> Admin Access</p>
                  <h2 className="mt-3 text-2xl font-black">Request Admin Access</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Submit a reason to request operational access. A superadmin reviews and approves role changes manually.</p>
                  {adminRequestStatus && <span className="mt-4 inline-flex rounded-full bg-leaf-50 px-4 py-2 text-xs font-black uppercase text-leaf-800 dark:bg-white/10 dark:text-leaf-100">Status: {adminRequestStatus}</span>}
                </div>
                <form onSubmit={requestAdminAccess} className="grid gap-3">
                  <textarea className="input min-h-28" placeholder="Why do you need admin access?" value={adminReason} onChange={(event) => setAdminReason(event.target.value)} required minLength={10} />
                  <button disabled={adminRequestStatus === "pending"} className="btn-primary w-full sm:w-fit">{adminRequestStatus === "pending" ? "Request Pending" : "Request Admin Access"}</button>
                </form>
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <ProgressRing value={healthAverage} label="Overall Health" />
            <div className="card"><FiActivity className="text-2xl text-leaf-600" /><p className="mt-4 text-sm text-slate-500">Total plants</p><p className="text-3xl font-black">{totalPlants}</p></div>
            <div className="card"><FiCheckCircle className="text-2xl text-leaf-600" /><p className="mt-4 text-sm text-slate-500">Healthy plants</p><p className="text-3xl font-black">{healthyPlants}</p></div>
            <div className="card"><FiBell className="text-2xl text-amber-500" /><p className="mt-4 text-sm text-slate-500">Needs attention</p><p className="text-3xl font-black">{unhealthyPlants}</p></div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="card overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-leaf-600">Google Lens style scanner</p>
                  <h2 className="mt-2 text-3xl font-black">AI Plant Disease Scanner</h2>
                </div>
                <FiCamera className="text-3xl text-leaf-600" />
              </div>
              <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <label
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    attachPreview(event.dataTransfer.files?.[0]);
                  }}
                  className="relative flex min-h-72 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed border-leaf-300 bg-leaf-50 text-center font-bold text-leaf-800 dark:border-white/15 dark:bg-white/10 dark:text-leaf-100"
                >
                  {scanner.imagePreview ? (
                    <>
                      <img src={scanner.imagePreview} alt="Leaf preview" className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/20" />
                      {scanning && <div className="scan-line absolute left-0 right-0 top-0 h-16 bg-gradient-to-b from-transparent via-emerald-300/80 to-transparent" />}
                      <span className="relative rounded-full bg-slate-950/70 px-4 py-2 text-sm text-white">{scanning ? "CNN processing..." : scanner.imageName}</span>
                    </>
                  ) : (
                    <>
                      <FiUploadCloud className="mb-3 text-5xl" />
                      Drag leaf image or click to upload
                    </>
                  )}
                  <input className="sr-only" type="file" accept="image/*" onChange={(event) => attachPreview(event.target.files?.[0])} />
                </label>
                <div className="grid gap-3">
                  <input className="input" placeholder="Plant name" value={scanner.plantName} onChange={(event) => setScanner({ ...scanner, plantName: event.target.value })} />
                  <textarea className="input min-h-28" placeholder="Symptoms" value={scanner.symptoms} onChange={(event) => setScanner({ ...scanner, symptoms: event.target.value })} />
                  {scanning && (
                    <div className="rounded-2xl bg-slate-950 p-4 text-xs font-bold text-emerald-100">
                      <p>Preprocessing image...</p><p className="mt-2">Detecting leaf region...</p><p className="mt-2">Running CNN classifier...</p><p className="mt-2">Generating care protocol...</p>
                    </div>
                  )}
                  <button onClick={runScan} disabled={scanning} className="btn-primary">{scanning ? "Scanning..." : "Run AI Scan"}</button>
                </div>
              </div>
              {scanResult && (
                <div className="mt-6 rounded-3xl bg-leaf-50 p-5 dark:bg-white/10">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="text-sm font-bold text-leaf-700">Detected result</p><h3 className="text-2xl font-black">{scanResult.diseaseName}</h3></div>
                    <span className="rounded-full bg-white px-5 py-3 text-xl font-black text-leaf-700 dark:bg-white/10 dark:text-leaf-200">{Math.round(scanResult.confidenceScore * 100)}%</span>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-white dark:bg-white/10"><div className="h-3 rounded-full bg-leaf-600" style={{ width: `${Math.round(scanResult.confidenceScore * 100)}%` }} /></div>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {(scanResult.treatmentSuggestions || []).slice(0, 3).map((item) => <p key={item} className="rounded-2xl bg-white p-3 text-sm font-semibold dark:bg-white/10">{item}</p>)}
                  </div>
                  <DownloadReport scan={scanResult} />
                </div>
              )}
            </div>

            <div className="grid gap-6">
              <div className="card">
                <h2 className="text-2xl font-black">My Plants</h2>
                <div className="mt-5 grid gap-3">
                  {myPlants.map((plant) => (
                    <div key={plant.name} className="rounded-2xl bg-leaf-50 p-4 dark:bg-white/10">
                      <div className="flex items-center justify-between"><p className="font-black">{plant.name}</p><span className="text-sm font-black text-leaf-700">{plant.health}%</span></div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Water: {plant.water} • {plant.sunlight}</p>
                      <p className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-leaf-800 dark:bg-white/10 dark:text-leaf-100">{plant.stage}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h2 className="text-2xl font-black">Notifications</h2>
                <div className="mt-5 grid gap-3">
                  {reminders.map(([title, text, Icon]) => <div key={title} className="flex gap-3 rounded-2xl bg-leaf-50 p-3 dark:bg-white/10"><Icon className="mt-1 text-leaf-600" /><div><p className="font-bold">{title}</p><p className="text-sm text-slate-500 dark:text-slate-300">{text}</p></div></div>)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="card">
              <div className="flex items-center gap-3"><FiSun className="text-2xl text-leaf-600" /><h2 className="text-2xl font-black">AI Plant Recommendation</h2></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {["climate", "sunlight", "environment", "maintenanceLevel"].map((field) => <input key={field} className="input" value={recommendation[field]} onChange={(event) => setRecommendation({ ...recommendation, [field]: event.target.value })} />)}
                <input className="input" type="number" value={recommendation.budget} onChange={(event) => setRecommendation({ ...recommendation, budget: event.target.value })} />
                <input className="input" value={recommendation.roomSize} onChange={(event) => setRecommendation({ ...recommendation, roomSize: event.target.value })} />
              </div>
              <button onClick={runRecommendation} className="btn-primary mt-5">Recommend Plants</button>
              {recommendationResult && <div className="mt-5 grid gap-2">{recommendationResult.recommendedPlants.map((plant) => <span key={plant} className="rounded-2xl bg-leaf-50 px-4 py-3 text-sm font-black text-leaf-800 dark:bg-white/10 dark:text-leaf-100">{plant}</span>)}</div>}
            </div>

            <div className="card">
              <div className="flex items-center gap-3"><FiMap className="text-2xl text-leaf-600" /><h2 className="text-2xl font-black">AI Garden Design Generator</h2></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["spaceType", "spaceSize", "style"].map((field) => <input key={field} className="input" value={garden[field]} onChange={(event) => setGarden({ ...garden, [field]: event.target.value })} />)}
              </div>
              <button onClick={runGarden} className="btn-primary mt-5">Generate Layout</button>
              {gardenResult && <div className="mt-5 grid gap-2">{gardenResult.layoutSuggestions.map((item) => <span key={item} className="rounded-2xl bg-leaf-50 px-4 py-3 text-sm font-black text-leaf-800 dark:bg-white/10 dark:text-leaf-100">{item}</span>)}</div>}
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-3">
            <div className="card">
              <h2 className="text-2xl font-black">Orders & Services</h2>
              <div className="mt-5 grid gap-3">
                {[...requests.map((request) => `${request.serviceType} - ${request.status}`), ...orders.map((order) => `${order.orderId} - ${order.fulfillmentStatus}`), "AMC Plan - Care Plus"].map((item) => <p key={item} className="rounded-2xl bg-leaf-50 p-3 text-sm font-bold dark:bg-white/10">{item}</p>)}
              </div>
            </div>
            <div className="card">
              <h2 className="text-2xl font-black">Growth Journal</h2>
              <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-leaf-300 p-4 text-sm font-bold text-leaf-800 dark:border-white/10 dark:text-leaf-100"><FiImage /> Upload progress photo<input className="sr-only" type="file" accept="image/*" /></label>
              <div className="mt-4 grid gap-3">{journal.map(([week, note]) => <p key={week} className="rounded-2xl bg-leaf-50 p-3 text-sm dark:bg-white/10"><strong>{week}:</strong> {note}</p>)}</div>
            </div>
            <div className="card">
              <h2 className="text-2xl font-black">AI Report History</h2>
              <div className="mt-5 grid gap-3">
                {scanHistory.length ? scanHistory.slice(0, 5).map((scan) => <p key={scan.id} className="rounded-2xl bg-leaf-50 p-3 text-sm font-bold dark:bg-white/10">{scan.diseaseName} - {Math.round(Number(scan.confidenceScore || 0) * 100)}%</p>) : <p className="rounded-2xl bg-leaf-50 p-3 text-sm dark:bg-white/10">No saved AI reports yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
