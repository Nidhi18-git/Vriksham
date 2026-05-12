import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import AIReport from "../models/AIReport.js";
import AdminRequest from "../models/AdminRequest.js";
import Gardener from "../models/Gardener.js";
import Order from "../models/Order.js";
import Plant from "../models/Plant.js";
import ServiceRequest from "../models/ServiceRequest.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import { sampleGardeners, samplePlants } from "./sampleData.js";

dotenv.config();

async function seed() {
  await connectDB();

  await Promise.all([
    AIReport.deleteMany({}),
    AdminRequest.deleteMany({}),
    Gardener.deleteMany({}),
    Order.deleteMany({}),
    Plant.deleteMany({}),
    ServiceRequest.deleteMany({}),
    Subscription.deleteMany({}),
    User.deleteMany({})
  ]);

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "owner@vriksham.com";
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || "password123";

  const [superadmin, admin, user, corporateUser, homeowner] = await User.create([
    {
      name: process.env.SUPER_ADMIN_NAME || "Vriksham Owner",
      email: superAdminEmail,
      phone: "+91 90000 00000",
      password: superAdminPassword,
      role: "superadmin",
      location: "Head Office"
    },
    {
      name: "Vriksham Admin",
      email: "admin@vriksham.com",
      phone: "+91 90000 00001",
      password: "password123",
      role: "admin",
      location: "Bengaluru"
    },
    {
      name: "Demo Customer",
      email: "user@vriksham.com",
      phone: "+91 90000 00002",
      password: "password123",
      role: "user",
      location: "Indiranagar, Bengaluru"
    },
    {
      name: "Corporate Facility Lead",
      email: "facility@vriksham.com",
      phone: "+91 90000 00003",
      password: "password123",
      role: "user",
      location: "Manyata Tech Park"
    },
    {
      name: "Home Garden Owner",
      email: "home@vriksham.com",
      phone: "+91 90000 00004",
      password: "password123",
      role: "user",
      location: "Whitefield, Bengaluru"
    }
  ]);

  await AdminRequest.create({
    user: user._id,
    name: user.name,
    email: user.email,
    reason: "I manage plant maintenance operations and need access to service request workflows.",
    status: "pending"
  });

  const gardeners = await Gardener.create(sampleGardeners);
  await Plant.create([
    ...samplePlants,
    {
      name: "Peace Lily",
      scientificName: "Spathiphyllum",
      category: "Flower",
      productType: "Flower",
      sunlight: "Low to medium indirect light",
      wateringFrequency: "Every 5-7 days",
      careLevel: "Easy",
      price: 849,
      stock: 30,
      availability: "In Stock",
      aiTags: ["flowering", "indoor", "low-light"]
    },
    {
      name: "Fresh Rose Bouquet",
      category: "Bouquet",
      productType: "Bouquet",
      careLevel: "Easy",
      price: 999,
      stock: 18,
      availability: "In Stock",
      aiTags: ["gift", "flower", "event"]
    }
  ]);

  await ServiceRequest.create([
    {
      trackingId: "VRK-DEMO-REQUEST-001",
      user: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      serviceType: "Balcony Gardening",
      budgetRange: "Rs 10,000 - Rs 25,000",
      propertyType: "Apartment",
      status: "Assigned",
      priority: "High",
      assignedGardener: gardeners[0]._id
    },
    {
      trackingId: "VRK-DEMO-REQUEST-002",
      user: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: "MG Road Office",
      serviceType: "Office Green Setup",
      budgetRange: "Rs 75,000+",
      propertyType: "Office",
      status: "Under Review",
      priority: "Medium"
    },
    {
      trackingId: "VRK-DEMO-REQUEST-003",
      user: corporateUser._id,
      name: corporateUser.name,
      email: corporateUser.email,
      phone: corporateUser.phone,
      location: corporateUser.location,
      serviceType: "Corporate Green Infrastructure",
      budgetRange: "Rs 75,000+",
      propertyType: "Commercial Campus",
      status: "In Progress",
      priority: "Urgent",
      assignedGardener: gardeners[1]._id
    },
    {
      trackingId: "VRK-DEMO-REQUEST-004",
      user: homeowner._id,
      name: homeowner.name,
      email: homeowner.email,
      phone: homeowner.phone,
      location: homeowner.location,
      serviceType: "Annual Maintenance Contracts",
      budgetRange: "Rs 25,000 - Rs 75,000",
      propertyType: "Home",
      status: "Completed",
      priority: "Low",
      assignedGardener: gardeners[0]._id,
      maintenanceHistory: [{ title: "First AMC visit", description: "Soil refresh and pruning completed", completedAt: new Date(), gardener: gardeners[0]._id }]
    }
  ]);

  await Order.create([
    {
      orderId: "VRK-ORDER-DEMO-001",
      user: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      deliveryAddress: user.location,
      items: [{ productId: "peace-lily", name: "Peace Lily", productType: "Flowering Plant", price: 849, quantity: 2 }],
      totalAmount: 1698,
      paymentMethod: "UPI",
      paymentStatus: "Pending",
      checkoutStatus: "Order Confirmed",
      fulfillmentStatus: "Confirmed"
    },
    {
      orderId: "VRK-ORDER-DEMO-002",
      user: corporateUser._id,
      name: corporateUser.name,
      phone: corporateUser.phone,
      email: corporateUser.email,
      deliveryAddress: corporateUser.location,
      items: [
        { productId: "snake-plant", name: "Snake Plant", productType: "Air Purifying Plant", price: 699, quantity: 8 },
        { productId: "areca-palm", name: "Areca Palm", productType: "Corporate Plant", price: 1199, quantity: 4 }
      ],
      totalAmount: 10388,
      paymentMethod: "Net Banking",
      paymentStatus: "Pending",
      checkoutStatus: "Order Confirmed",
      fulfillmentStatus: "Out for Delivery"
    },
    {
      orderId: "VRK-ORDER-DEMO-003",
      user: homeowner._id,
      name: homeowner.name,
      phone: homeowner.phone,
      email: homeowner.email,
      deliveryAddress: homeowner.location,
      items: [{ productId: "rose-bouquet", name: "Fresh Rose Bouquet", productType: "Flowers", price: 999, quantity: 1 }],
      totalAmount: 999,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
      checkoutStatus: "Order Confirmed",
      fulfillmentStatus: "Placed"
    }
  ]);

  await Subscription.create([
    {
      user: user._id,
      planName: "Care Plus",
      planType: "Monthly",
      price: 2499,
      startDate: new Date(),
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      includedVisits: 2,
      predictedNextMaintenance: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
    },
    {
      user: corporateUser._id,
      planName: "Enterprise Green",
      planType: "Annual AMC",
      price: 45000,
      startDate: new Date(),
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      includedVisits: 24,
      predictedNextMaintenance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  ]);

  await AIReport.create([
    {
      user: user._id,
      module: "Disease Detection",
      input: { plantName: "Peace Lily", symptoms: "white powder" },
      output: { diseaseName: "Powdery Mildew", confidenceScore: 0.88 },
      confidence: 0.88,
      status: "Processed",
      modelVersion: "rule-prototype-v1-ai-ready"
    },
    {
      user: user._id,
      module: "Plant Recommendation",
      input: { environment: "Indoor", sunlight: "Low" },
      output: { recommendedPlants: ["Snake Plant", "ZZ Plant", "Peace Lily"], confidenceScore: 0.91 },
      confidence: 0.91,
      status: "Processed",
      modelVersion: "rule-prototype-v1-ai-ready"
    },
    {
      user: corporateUser._id,
      module: "Green Space Analytics",
      input: { campus: "Manyata Tech Park", coverage: "large" },
      output: { oxygenHours: 42000, survivalRate: 0.94, confidenceScore: 0.9 },
      confidence: 0.9,
      status: "Processed",
      modelVersion: "impact-prototype-v1"
    },
    {
      user: homeowner._id,
      module: "Garden Design",
      input: { spaceType: "Terrace", style: "Tropical" },
      output: { designName: "Tropical Terrace Layout", confidenceScore: 0.87 },
      confidence: 0.87,
      status: "Processed",
      modelVersion: "rule-prototype-v1-ai-ready"
    }
  ]);

  console.log("Demo seed complete");
  console.log(`Super admin login: ${superAdminEmail} / ${superAdminPassword}`);
  console.log("Admin login: admin@vriksham.com / password123");
  console.log("User login: user@vriksham.com / password123");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
