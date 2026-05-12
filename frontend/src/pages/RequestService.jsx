import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import api from "../api/client";
import AnimatedPage from "../components/AnimatedPage";
import SectionHeader from "../components/SectionHeader";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  location: "",
  serviceType: "Plant Installation",
  budgetRange: "Under Rs 10,000",
  propertyType: "Home",
  preferredDate: "",
  notes: "",
  imageUrl: ""
};

export default function RequestService() {
  const [form, setForm] = useState(initialForm);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadImage = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("image", file);
      const { data } = await api.post("/upload", body, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((current) => ({ ...current, imageUrl: data.url }));
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed. You can paste a hosted image URL instead.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/request", form);
      setSuccess(data.request);
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <section className="section-pad bg-gradient-to-br from-white to-leaf-100 dark:from-[#07140e] dark:to-leaf-950">
        <div className="container-page">
          <SectionHeader eyebrow="Request Service" title="Submit a Managed Green Service Request" text="Vriksham operations will review your request and internally assign the right expert team." />
          <form onSubmit={submit} className="mx-auto mt-12 max-w-5xl rounded-[2rem] border border-leaf-100 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/10 sm:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <input className="input" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
              <input className="input" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
              <input className="input" placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
              <input className="input" placeholder="Location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} required />
              <select className="input" value={form.serviceType} onChange={(event) => setForm({ ...form, serviceType: event.target.value })}>
                {["Plant Installation", "Office Green Setup", "Indoor Air Purifying Plants", "Garden Design", "Balcony Gardening", "Annual Maintenance Contracts", "Subscription-Based Plant Care", "AI Plant Monitoring"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select className="input" value={form.budgetRange} onChange={(event) => setForm({ ...form, budgetRange: event.target.value })}>
                {["Under Rs 10,000", "Rs 10,000 - Rs 25,000", "Rs 25,000 - Rs 75,000", "Rs 75,000+"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select className="input" value={form.propertyType} onChange={(event) => setForm({ ...form, propertyType: event.target.value })}>
                {["Home", "Apartment", "Office", "Retail", "Commercial Campus"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <input className="input" type="date" value={form.preferredDate} onChange={(event) => setForm({ ...form, preferredDate: event.target.value })} />
              <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-leaf-300 bg-leaf-50 p-5 text-center text-sm font-semibold text-leaf-800 dark:border-white/20 dark:bg-white/10 dark:text-leaf-200 md:col-span-2">
                <FiUploadCloud className="mb-3 text-3xl" />
                {uploading ? "Uploading to Cloudinary..." : "Upload garden image"}
                <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadImage(event.target.files?.[0])} />
                <input type="url" className="input mt-4 bg-white" placeholder="Or paste hosted image URL" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} onClick={(event) => event.stopPropagation()} />
              </label>
              <textarea className="input min-h-36 md:col-span-2" placeholder="Additional notes" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
            </div>
            {error && <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
            <button disabled={loading} className="btn-primary mt-8 w-full sm:w-auto">
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </section>

      {success && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4">
          <div className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-soft dark:bg-[#0b1d14]">
            <h3 className="text-2xl font-black">Request Submitted</h3>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Your tracking ID is</p>
            <p className="mt-3 rounded-2xl bg-leaf-50 px-4 py-3 text-xl font-black text-leaf-800 dark:bg-white/10 dark:text-leaf-200">{success.trackingId}</p>
            <button onClick={() => setSuccess(null)} className="btn-primary mt-6">
              Done
            </button>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
