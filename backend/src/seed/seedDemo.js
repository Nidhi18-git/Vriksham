import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import AIReport from "../models/AIReport.js";
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
    Gardener.deleteMany({}),
    Order.deleteMany({}),
    Plant.deleteMany({}),
    ServiceRequest.deleteMany({}),
    Subscription.deleteMany({}),
    User.deleteMany({})
  ]);

  const [admin, user] = await User.create([
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
    }
  ]);

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
    }
  ]);

  await Subscription.create({
    user: user._id,
    planName: "Care Plus",
    planType: "Monthly",
    price: 2499,
    startDate: new Date(),
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    includedVisits: 2,
    predictedNextMaintenance: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
  });

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
    }
  ]);

  console.log("Demo seed complete");
  console.log("Admin login: admin@vriksham.com / password123");
  console.log("User login: user@vriksham.com / password123");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
