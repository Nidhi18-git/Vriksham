import {
  FiActivity,
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiCpu,
  FiDroplet,
  FiHome,
  FiLayers,
  FiLock,
  FiMap,
  FiShoppingBag,
  FiShield,
  FiSun,
  FiUsers,
  FiZap
} from "react-icons/fi";
import peaceLilyImage from "../assets/lily-plant.jpg";

export const services = [
  {
    title: "Plant Installation",
    icon: FiDroplet,
    description: "Curated plant sourcing, planter selection, soil setup, and professional installation.",
    benefits: ["Expert selection", "Premium planters", "Healthy setup"],
    price: "Custom quote"
  },
  {
    title: "Office Green Setup",
    icon: FiBriefcase,
    description: "Biophilic office zones designed for reception areas, workstations, and meeting rooms.",
    benefits: ["Corporate-ready", "Low disruption", "AMC support"],
    price: "From consultation"
  },
  {
    title: "Indoor Air Purifying Plants",
    icon: FiHome,
    description: "Low-maintenance indoor plants selected for air quality, light conditions, and aesthetics.",
    benefits: ["Cleaner air", "Space matched", "Care guide"],
    price: "Package based"
  },
  {
    title: "Garden Design",
    icon: FiMap,
    description: "Structured layouts for villas, terraces, courtyards, and commercial green areas.",
    benefits: ["Layout planning", "Plant palette", "Execution roadmap"],
    price: "Design quote"
  },
  {
    title: "Balcony Gardening",
    icon: FiSun,
    description: "Compact balcony gardens with railing planters, vertical systems, and seasonal care.",
    benefits: ["Small-space fit", "Sunlight mapping", "Irrigation options"],
    price: "Starter packages"
  },
  {
    title: "Annual Maintenance Contracts",
    icon: FiCalendar,
    description: "Scheduled professional maintenance for homes, offices, and commercial properties.",
    benefits: ["Planned visits", "Plant health checks", "Replacement guidance"],
    price: "AMC quote"
  },
  {
    title: "Subscription-Based Plant Care",
    icon: FiActivity,
    description: "Recurring plant care with notifications, maintenance history, and renewal tracking.",
    benefits: ["Monthly care", "Priority support", "Health reports"],
    price: "Monthly plans"
  }
];

export const aiFeatures = [
  {
    title: "AI Plant Disease Detection",
    icon: FiActivity,
    text: "Upload leaf image, use CNN/TensorFlow/PyTorch model, support PlantVillage dataset, and return disease name, confidence score, treatment suggestions, and prevention tips.",
    points: [
      "Upload leaf image",
      "CNN/TensorFlow/PyTorch model",
      "PlantVillage dataset support",
      "Disease name and confidence score",
      "Treatment suggestions and prevention tips"
    ]
  },
  {
    title: "AI Plant Recommendation System",
    icon: FiSun,
    text: "Recommend plants based on sunlight, indoor/outdoor use, budget, climate, room size, and maintenance level.",
    points: ["Sunlight", "Indoor/outdoor", "Budget", "Climate", "Room size", "Maintenance level"]
  },
  {
    title: "AI Garden Design Generator",
    icon: FiMap,
    text: "Upload balcony or garden image to generate smart garden layout suggestions with plant placement, decor ideas, and space optimization.",
    points: ["Upload balcony/garden image", "Smart layout suggestions", "Plant placement", "Decor ideas", "Space optimization"]
  }
];

export const features = [
  { title: "Centralized Management", icon: FiLayers, text: "Every request is reviewed and assigned internally for consistent delivery." },
  { title: "Privacy Focused", icon: FiLock, text: "Users never directly expose personal details to independent vendors." },
  { title: "Expert Teams", icon: FiUsers, text: "Gardener and nursery partners are coordinated through admin operations." },
  { title: "AI-Ready Platform", icon: FiCpu, text: "Built for plant intelligence, analytics, and sensor-based automation." },
  { title: "Quality Control", icon: FiShield, text: "Structured workflows maintain service standards across locations." },
  { title: "Subscription Revenue", icon: FiBarChart2, text: "AMC and plant care plans support predictable recurring operations." },
  { title: "Fast Operations", icon: FiZap, text: "Admin tools make assignment, priority, and status updates efficient." }
];

export const shopProducts = [
  {
    id: "monstera-deliciosa",
    name: "Monstera Deliciosa",
    type: "Indoor Plant",
    price: 1299,
    care: "Moderate care",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=900&q=85",
    description: "Large sculptural foliage for premium homes, offices, and lounge spaces."
  },
  {
    id: "snake-plant",
    name: "Snake Plant",
    type: "Air Purifying Plant",
    price: 699,
    care: "Easy care",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?auto=format&fit=crop&w=900&q=85",
    description: "Low-maintenance plant for bedrooms, desks, and low-light corners."
  },
  {
    id: "peace-lily",
    name: "Peace Lily",
    type: "Flowering Plant",
    price: 849,
    care: "Easy care",
    image: peaceLilyImage,
    description: "Elegant flowering plant with glossy leaves and soft white blooms."
  },
  {
    id: "orchid-planter",
    name: "Orchid Planter",
    type: "Flower",
    price: 1499,
    care: "Expert care",
    image: "https://images.unsplash.com/photo-1566908829550-e6551b00979b?auto=format&fit=crop&w=900&q=85",
    description: "Premium orchid arrangement for gifting, reception desks, and interiors."
  },
  {
    id: "areca-palm",
    name: "Areca Palm",
    type: "Corporate Plant",
    price: 1199,
    care: "Moderate care",
    image: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=900&q=85",
    description: "Tall green statement plant for office corners and waiting areas."
  },
  {
    id: "rose-bouquet",
    name: "Fresh Rose Bouquet",
    type: "Flowers",
    price: 999,
    care: "Fresh cut",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85",
    description: "Fresh flower bundle for gifting, events, and office hospitality."
  }
];

export const commerceFeatures = [
  { title: "Curated Catalog", icon: FiShoppingBag, text: "Plants and flowers sourced through Vriksham-reviewed nursery partners." },
  { title: "Managed Fulfillment", icon: FiShield, text: "Orders stay centralized so quality, privacy, and delivery can be controlled." },
  { title: "Care Add-ons", icon: FiDroplet, text: "Customers can pair purchases with installation, maintenance, or subscriptions." }
];

export const subscriptionPlans = [
  {
    name: "Free",
    price: "Rs 0",
    audience: "Plant owners starting out",
    features: ["Basic plant care reminders", "AI scan access", "Shop purchases", "Service request tracking"]
  },
  {
    name: "Pro Care",
    price: "Rs 2,499/mo",
    audience: "Homes and apartments",
    features: ["2 monthly maintenance visits", "AI scan history", "Watering calendar", "Priority service review"]
  },
  {
    name: "Enterprise Green",
    price: "Custom",
    audience: "Offices and campuses",
    features: ["Corporate green dashboard", "AMC tracking", "Dedicated service team", "Impact analytics"]
  }
];

export const impactMetrics = [
  ["CO2 impact tracked", "1.8T", "Estimated annual green contribution"],
  ["Oxygen contribution", "42K hrs", "Modeled from plant coverage"],
  ["Plant survival rate", "94%", "With managed maintenance"],
  ["Maintenance SLA", "97%", "On-time service completion"]
];
