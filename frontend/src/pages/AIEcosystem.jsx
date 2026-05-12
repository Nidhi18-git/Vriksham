import { useState } from "react";
import { FiActivity, FiBarChart2, FiCheckCircle, FiDownload, FiMap, FiSun, FiUploadCloud } from "react-icons/fi";
import api from "../api/client";
import AnimatedPage from "../components/AnimatedPage";
import SectionHeader from "../components/SectionHeader";

const initialDisease = { plantName: "", symptoms: "", imageName: "", imagePreview: "" };
const initialRecommendation = {
  environment: "Indoor",
  sunlight: "Low",
  budget: "1500",
  climate: "",
  roomSize: "Medium",
  maintenanceLevel: "Easy"
};
const initialDesign = { spaceType: "Balcony", spaceSize: "Medium", style: "Modern natural", imageName: "", imagePreview: "" };

function ConfidenceMeter({ value }) {
  if (value === undefined) return null;
  const percent = Math.round(Number(value) * 100);

  return (
    <div className="rounded-2xl bg-white p-4 dark:bg-white/10">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
          <FiBarChart2 className="text-leaf-600" /> Model confidence
        </span>
        <span className="text-sm font-black text-leaf-700 dark:text-leaf-300">{percent}%</span>
      </div>
      <div className="mt-3 h-3 rounded-full bg-leaf-100 dark:bg-white/10">
        <div className="h-3 rounded-full bg-gradient-to-r from-leaf-500 to-emerald-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ResultPanel({ title, result }) {
  if (!result) return null;
  const entries = Object.entries(result).filter(([key]) => key !== "confidenceScore");

  return (
    <div className="mt-5 rounded-2xl border border-leaf-100 bg-leaf-50 p-5 text-left shadow-soft dark:border-white/10 dark:bg-white/10">
      <h4 className="flex items-center gap-2 font-black text-leaf-900 dark:text-leaf-100">
        <FiCheckCircle /> {title}
      </h4>
      <div className="mt-4">
        <ConfidenceMeter value={result.confidenceScore} />
      </div>
      <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
        {entries.map(([key, value]) => (
          <div key={key}>
            <p className="font-black capitalize text-slate-950 dark:text-white">{key.replace(/([A-Z])/g, " $1")}</p>
            {Array.isArray(value) ? (
              <ul className="mt-1 grid gap-1">
                {value.map((item) => (
                  <li key={item} className="rounded-xl bg-white px-3 py-2 dark:bg-white/10">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 rounded-xl bg-white px-3 py-2 dark:bg-white/10">{String(value)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AIEcosystem() {
  const [disease, setDisease] = useState(initialDisease);
  const [recommendation, setRecommendation] = useState(initialRecommendation);
  const [design, setDesign] = useState(initialDesign);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const attachPreview = (file, setter, current) => {
    if (!file) return;
    setter({ ...current, imageName: file.name, imagePreview: URL.createObjectURL(file) });
  };

  const saveScanHistory = (output, input) => {
    const historyItem = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      plantName: input.plantName || "Unknown plant",
      imageName: input.imageName || "No image",
      diseaseName: output.diseaseName,
      confidenceScore: output.confidenceScore,
      severity: output.severity,
      treatmentSuggestions: output.treatmentSuggestions || [],
      preventionTips: output.preventionTips || []
    };
    const previous = JSON.parse(localStorage.getItem("vriksham_ai_scan_history") || "[]");
    localStorage.setItem("vriksham_ai_scan_history", JSON.stringify([historyItem, ...previous].slice(0, 12)));
  };

  const downloadDiseaseReport = () => {
    const report = results.disease;
    if (!report) return;
    const percent = Math.round(Number(report.confidenceScore || 0) * 100);
    const popup = window.open("", "_blank", "width=900,height=700");
    if (!popup) return;
    popup.document.write(`
      <html>
        <head>
          <title>Vriksham AI Plant Health Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #102018; }
            h1 { color: #15864e; margin-bottom: 6px; }
            .card { border: 1px solid #d8f7e3; border-radius: 16px; padding: 18px; margin: 16px 0; }
            .pill { display: inline-block; padding: 8px 12px; border-radius: 999px; background: #effcf4; color: #126b41; font-weight: 700; }
            li { margin: 8px 0; }
          </style>
        </head>
        <body>
          <h1>Vriksham AI Plant Health Report</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          <div class="card">
            <p><strong>Plant:</strong> ${disease.plantName || "Unknown plant"}</p>
            <p><strong>Uploaded image:</strong> ${disease.imageName || "No image uploaded"}</p>
            <p><strong>Disease:</strong> ${report.diseaseName}</p>
            <p><strong>Confidence:</strong> <span class="pill">${percent}%</span></p>
            <p><strong>Severity:</strong> ${report.severity || "Not specified"}</p>
          </div>
          <div class="card">
            <h2>Treatment Suggestions</h2>
            <ul>${(report.treatmentSuggestions || []).map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
          <div class="card">
            <h2>Prevention Tips</h2>
            <ul>${(report.preventionTips || []).map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
          <p>This report is generated by the Vriksham AI-ready prototype and can later connect to CNN/TensorFlow/PyTorch inference.</p>
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  const runModule = async (module, payload) => {
    setLoading(module);
    setError("");
    try {
      const { data } = await api.post(`/ai/${module}`, payload);
      setResults((current) => ({ ...current, [module]: data.report.output }));
      if (module === "disease") saveScanHistory(data.report.output, payload);
    } catch (err) {
      setError(err.response?.data?.message || "AI module failed. Please check backend server and try again.");
    } finally {
      setLoading("");
    }
  };

  return (
    <AnimatedPage>
      <section className="section-pad bg-mist dark:bg-[#07140e]">
        <div className="container-page">
          <SectionHeader eyebrow="AI" title="Three Functional AI Models" text="Public AI modules for plant disease detection, plant recommendation, and smart garden design." />
          {error && <p className="mx-auto mt-8 max-w-3xl rounded-2xl bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{error}</p>}
          <div className="mt-12 grid gap-6 xl:grid-cols-3">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                runModule("disease", disease);
              }}
              className="card flex flex-col"
            >
              <FiActivity className="text-3xl text-leaf-600" />
              <h3 className="mt-5 text-2xl font-black">AI Plant Disease Detection</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Upload leaf image details and symptoms to get disease name, confidence, treatment, and prevention tips.</p>
              <div className="mt-5 grid gap-3">
                <label
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    attachPreview(event.dataTransfer.files?.[0], setDisease, disease);
                  }}
                  className="relative flex min-h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-leaf-300 bg-leaf-50 text-center text-sm font-bold text-leaf-800 dark:border-white/15 dark:bg-white/10 dark:text-leaf-100"
                >
                  {disease.imagePreview ? (
                    <>
                      <img src={disease.imagePreview} alt="Leaf preview" className="absolute inset-0 h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/20" />
                      {loading === "disease" && (
                        <>
                          <div className="scan-line absolute left-0 right-0 top-0 h-14 bg-gradient-to-b from-transparent via-emerald-300/70 to-transparent" />
                          <div className="absolute inset-5 rounded-2xl border border-emerald-200/70" />
                        </>
                      )}
                      <span className="relative rounded-full bg-slate-950/60 px-4 py-2 text-white">{loading === "disease" ? "CNN scan in progress..." : disease.imageName}</span>
                    </>
                  ) : (
                    <>
                      <FiUploadCloud className="mb-3 text-4xl" />
                      Drag leaf image here or click to upload
                    </>
                  )}
                  <input className="sr-only" type="file" accept="image/*" onChange={(event) => attachPreview(event.target.files?.[0], setDisease, disease)} />
                </label>
                <input className="input" placeholder="Plant name" value={disease.plantName} onChange={(event) => setDisease({ ...disease, plantName: event.target.value })} />
                <textarea className="input min-h-28" placeholder="Symptoms: yellow leaves, brown spots, white powder..." value={disease.symptoms} onChange={(event) => setDisease({ ...disease, symptoms: event.target.value })} />
                {loading === "disease" && (
                  <div className="rounded-2xl bg-slate-950 p-4 text-xs font-bold text-emerald-100">
                    <p>Preprocessing image...</p>
                    <p className="mt-2">Detecting leaf region...</p>
                    <p className="mt-2">Running CNN disease classifier...</p>
                    <p className="mt-2">Mapping treatment protocol...</p>
                  </div>
                )}
              </div>
              <button disabled={loading === "disease"} className="btn-primary mt-5 w-full">{loading === "disease" ? "Analyzing leaf..." : "Detect Disease"}</button>
              <ResultPanel title="Disease Report" result={results.disease} />
              {results.disease && (
                <button type="button" onClick={downloadDiseaseReport} className="btn-secondary mt-4 w-full">
                  <FiDownload /> Download AI Report
                </button>
              )}
            </form>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                runModule("recommendation", recommendation);
              }}
              className="card flex flex-col"
            >
              <FiSun className="text-3xl text-leaf-600" />
              <h3 className="mt-5 text-2xl font-black">AI Plant Recommendation System</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Get plant suggestions based on sunlight, space, budget, climate, and maintenance level.</p>
              <div className="mt-5 grid gap-3">
                <select className="input" value={recommendation.environment} onChange={(event) => setRecommendation({ ...recommendation, environment: event.target.value })}>
                  <option>Indoor</option>
                  <option>Outdoor</option>
                </select>
                <select className="input" value={recommendation.sunlight} onChange={(event) => setRecommendation({ ...recommendation, sunlight: event.target.value })}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>Bright</option>
                  <option>Full Sun</option>
                </select>
                <input className="input" type="number" placeholder="Budget" value={recommendation.budget} onChange={(event) => setRecommendation({ ...recommendation, budget: event.target.value })} />
                <input className="input" placeholder="Climate / City" value={recommendation.climate} onChange={(event) => setRecommendation({ ...recommendation, climate: event.target.value })} />
                <select className="input" value={recommendation.roomSize} onChange={(event) => setRecommendation({ ...recommendation, roomSize: event.target.value })}>
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
                <select className="input" value={recommendation.maintenanceLevel} onChange={(event) => setRecommendation({ ...recommendation, maintenanceLevel: event.target.value })}>
                  <option>Easy</option>
                  <option>Moderate</option>
                  <option>Expert</option>
                </select>
              </div>
              <button disabled={loading === "recommendation"} className="btn-primary mt-5 w-full">{loading === "recommendation" ? "Matching plants..." : "Recommend Plants"}</button>
              <ResultPanel title="Plant Recommendations" result={results.recommendation} />
            </form>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                runModule("design", design);
              }}
              className="card flex flex-col"
            >
              <FiMap className="text-3xl text-leaf-600" />
              <h3 className="mt-5 text-2xl font-black">AI Garden Design Generator</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Upload balcony or garden image details to generate layout, placement, decor, and optimization ideas.</p>
              <div className="mt-5 grid gap-3">
                {design.imagePreview && <img src={design.imagePreview} alt="Garden preview" className="h-44 w-full rounded-2xl object-cover" />}
                <select className="input" value={design.spaceType} onChange={(event) => setDesign({ ...design, spaceType: event.target.value })}>
                  <option>Balcony</option>
                  <option>Garden</option>
                  <option>Terrace</option>
                  <option>Office Lobby</option>
                </select>
                <select className="input" value={design.spaceSize} onChange={(event) => setDesign({ ...design, spaceSize: event.target.value })}>
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
                <select className="input" value={design.style} onChange={(event) => setDesign({ ...design, style: event.target.value })}>
                  <option>Modern natural</option>
                  <option>Minimal premium</option>
                  <option>Tropical</option>
                  <option>Low-maintenance</option>
                </select>
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-leaf-300 bg-leaf-50 px-4 py-3 text-sm font-bold text-leaf-800 dark:border-white/15 dark:bg-white/10 dark:text-leaf-100">
                  <FiUploadCloud />
                  {design.imageName || "Upload balcony/garden image"}
                  <input className="sr-only" type="file" accept="image/*" onChange={(event) => attachPreview(event.target.files?.[0], setDesign, design)} />
                </label>
              </div>
              <button disabled={loading === "design"} className="btn-primary mt-5 w-full">{loading === "design" ? "Generating layout..." : "Generate Design"}</button>
              <ResultPanel title="Garden Design" result={results.design} />
            </form>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
