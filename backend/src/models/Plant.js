import mongoose from "mongoose";

const plantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    scientificName: String,
    category: { type: String, enum: ["Indoor", "Outdoor", "Air Purifying", "Decorative", "Edible", "Flower", "Bouquet"] },
    productType: { type: String, enum: ["Plant", "Flower", "Bouquet", "Accessory"], default: "Plant" },
    sunlight: String,
    wateringFrequency: String,
    careLevel: { type: String, enum: ["Easy", "Moderate", "Expert"], default: "Easy" },
    price: Number,
    salePrice: Number,
    stock: { type: Number, default: 0 },
    imageUrl: String,
    aiTags: [String],
    availability: { type: String, enum: ["In Stock", "Low Stock", "Unavailable"], default: "In Stock" }
  },
  { timestamps: true }
);

export default mongoose.model("Plant", plantSchema);
