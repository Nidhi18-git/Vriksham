import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import AIEcosystem from "./pages/AIEcosystem";
import Auth from "./pages/Auth";
import Business from "./pages/Business";
import Home from "./pages/Home";
import RequestService from "./pages/RequestService";
import Shop from "./pages/Shop";
import Services from "./pages/Services";
import UserDashboard from "./pages/UserDashboard";

function Protected({ children, roles }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-mist text-slate-950 transition dark:bg-[#07140e] dark:text-white">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/business" element={<Business />} />
          <Route path="/ai" element={<AIEcosystem />} />
          <Route path="/request-service" element={<Protected><RequestService /></Protected>} />
          <Route path="/dashboard" element={<Protected><UserDashboard /></Protected>} />
          <Route path="/admin" element={<Protected roles={["admin", "superadmin"]}><AdminDashboard /></Protected>} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
