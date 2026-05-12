import { useMemo, useState } from "react";
import { FiCheckCircle, FiCreditCard, FiFileText, FiMinus, FiPlus, FiShoppingBag, FiTrash2, FiTruck } from "react-icons/fi";
import api from "../api/client";
import AnimatedPage from "../components/AnimatedPage";
import SectionHeader from "../components/SectionHeader";
import { commerceFeatures, shopProducts } from "../data/siteData";

export default function Shop() {
  const [selected, setSelected] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", deliveryAddress: "", paymentMethod: "Cash on Delivery" });
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const total = useMemo(() => selected.reduce((sum, item) => sum + item.price * item.quantity, 0), [selected]);
  const checkoutStep = selected.length ? (customer.deliveryAddress ? (customer.paymentMethod ? 3 : 2) : 1) : 0;

  const addProduct = (product) => {
    setSelected((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, direction) => {
    setSelected((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + direction) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeProduct = (id) => {
    setSelected((current) => current.filter((item) => item.id !== id));
  };

  const downloadInvoice = () => {
    if (!confirmation) return;
    const popup = window.open("", "_blank", "width=900,height=700");
    if (!popup) return;
    popup.document.write(`
      <html>
        <head>
          <title>Vriksham Invoice ${confirmation.orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #102018; }
            h1 { color: #15864e; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border-bottom: 1px solid #d8f7e3; padding: 12px; text-align: left; }
            .total { font-size: 22px; font-weight: 800; color: #15864e; }
          </style>
        </head>
        <body>
          <h1>Vriksham Plant Shop Invoice</h1>
          <p><strong>Order:</strong> ${confirmation.orderId}</p>
          <p><strong>Customer:</strong> ${confirmation.name}</p>
          <p><strong>Payment:</strong> ${confirmation.paymentMethod} (${confirmation.paymentStatus})</p>
          <p><strong>Status:</strong> ${confirmation.fulfillmentStatus}</p>
          <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
            <tbody>${confirmation.items.map((item) => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>Rs ${(item.price * item.quantity).toLocaleString("en-IN")}</td></tr>`).join("")}</tbody>
          </table>
          <p class="total">Total: Rs ${Number(confirmation.totalAmount).toLocaleString("en-IN")}</p>
        </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  const submitOrder = async (event) => {
    event.preventDefault();
    setError("");
    setConfirmation(null);

    if (!selected.length) {
      setError("Please add at least one plant or flower to your order.");
      return;
    }

    try {
      setPlacing(true);
      const payload = {
        ...customer,
        items: selected.map((item) => ({
          productId: item.id,
          name: item.name,
          productType: item.type,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.image
        })),
        totalAmount: total
      };
      const { data } = await api.post("/orders", payload);
      setConfirmation(data.order);
      setSelected([]);
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order. Please check backend server and try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <AnimatedPage>
      <section className="section-pad bg-gradient-to-br from-white to-leaf-100 dark:from-[#07140e] dark:to-leaf-950">
        <div className="container-page">
          <SectionHeader eyebrow="Plant Shop" title="Purchase Plants and Flowers" text="Curated plants, flowers, and premium greenery fulfilled through Vriksham's managed quality-control system." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {commerceFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card">
                  <Icon className="text-3xl text-leaf-600" />
                  <h3 className="mt-4 text-lg font-black">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.text}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="grid gap-6 md:grid-cols-2">
              {shopProducts.map((product) => (
                <div key={product.id} className="overflow-hidden rounded-2xl border border-leaf-100 bg-white shadow-soft dark:border-white/10 dark:bg-white/10">
                  <img src={product.image} alt={product.name} className="h-64 w-full object-cover" />
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-leaf-600">{product.type}</p>
                    <h3 className="mt-2 text-xl font-black">{product.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{product.description}</p>
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-black text-leaf-700 dark:text-leaf-300">Rs {product.price.toLocaleString("en-IN")}</p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">{product.care}</p>
                      </div>
                      <button onClick={() => addProduct(product)} className="btn-primary px-4 py-2 sm:w-auto">
                        <FiShoppingBag /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={submitOrder} className="card h-fit lg:sticky lg:top-24">
              <h2 className="text-2xl font-black">Checkout</h2>
              <div className="mt-5 grid grid-cols-4 gap-2 text-center text-[11px] font-black text-slate-600 dark:text-slate-300">
                {["Cart", "Details", "Payment", "Confirm"].map((step, index) => (
                  <div key={step} className={`rounded-2xl px-2 py-3 ${checkoutStep >= index ? "bg-leaf-600 text-white" : "bg-leaf-50 dark:bg-white/10"}`}>
                    {step}
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-3">
                {selected.length ? (
                  selected.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-leaf-50 p-3 text-sm dark:bg-white/10">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p>Rs {(item.price * item.quantity).toLocaleString("en-IN")}</p>
                        </div>
                        <button type="button" onClick={() => removeProduct(item.id)} className="grid h-9 w-9 place-items-center rounded-full bg-white text-red-600 dark:bg-white/10">
                          <FiTrash2 />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button type="button" onClick={() => updateQuantity(item.id, -1)} className="grid h-8 w-8 place-items-center rounded-full bg-white dark:bg-white/10"><FiMinus /></button>
                        <span className="min-w-8 text-center font-black">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, 1)} className="grid h-8 w-8 place-items-center rounded-full bg-white dark:bg-white/10"><FiPlus /></button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl bg-leaf-50 p-4 text-sm text-slate-600 dark:bg-white/10 dark:text-slate-300">Your plant cart is empty.</p>
                )}
              </div>
              <div className="mt-5 grid gap-3">
                <input className="input" placeholder="Name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} required />
                <input className="input" placeholder="Phone" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} required />
                <input className="input" type="email" placeholder="Email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} required />
                <textarea className="input min-h-28" placeholder="Delivery address" value={customer.deliveryAddress} onChange={(event) => setCustomer({ ...customer, deliveryAddress: event.target.value })} required />
                <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  <span className="flex items-center gap-2"><FiCreditCard /> Payment method</span>
                  <select className="input" value={customer.paymentMethod} onChange={(event) => setCustomer({ ...customer, paymentMethod: event.target.value })}>
                    <option>Cash on Delivery</option>
                    <option>UPI</option>
                    <option>Card</option>
                    <option>Net Banking</option>
                  </select>
                </label>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-leaf-100 pt-5 dark:border-white/10">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-black text-leaf-700 dark:text-leaf-300">Rs {total.toLocaleString("en-IN")}</span>
              </div>
              {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
              {confirmation && (
                <div className="mt-4 rounded-2xl bg-leaf-50 p-4 text-sm text-leaf-900 dark:bg-white/10 dark:text-leaf-100">
                  <p className="flex items-center gap-2 font-black"><FiCheckCircle /> Order confirmed</p>
                  <p className="mt-2 font-bold">{confirmation.orderId}</p>
                  <p className="mt-1 flex items-center gap-2"><FiTruck /> Status: {confirmation.fulfillmentStatus}</p>
                  <p className="mt-1">Payment: {confirmation.paymentMethod} ({confirmation.paymentStatus})</p>
                  <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[10px] font-black">
                    {["Placed", "Confirmed", "Packed", "Delivered"].map((step, index) => (
                      <span key={step} className={`rounded-full px-2 py-2 ${index < 2 ? "bg-leaf-600 text-white" : "bg-white text-leaf-800 dark:bg-white/10 dark:text-leaf-100"}`}>{step}</span>
                    ))}
                  </div>
                  <button type="button" onClick={downloadInvoice} className="btn-secondary mt-4 w-full">
                    <FiFileText /> Download Invoice
                  </button>
                </div>
              )}
              <button disabled={placing} className="btn-primary mt-5 w-full">{placing ? "Placing order..." : "Place Order"}</button>
            </form>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
