import AIReport from "../models/AIReport.js";

function detectDisease(input) {
  const text = `${input.symptoms || ""} ${input.plantName || ""}`.toLowerCase();
  const hasYellow = text.includes("yellow");
  const hasSpots = text.includes("spot") || text.includes("brown") || text.includes("black");
  const hasPowder = text.includes("powder") || text.includes("white");

  if (hasPowder) {
    return {
      diseaseName: "Powdery Mildew",
      confidenceScore: 0.88,
      severity: "Medium",
      imageQuality: input.imageName ? "Image received for model pipeline" : "No image uploaded, symptoms used",
      treatmentSuggestions: ["Remove heavily infected leaves", "Improve airflow around the plant", "Apply neem oil or sulfur-based organic fungicide"],
      preventionTips: ["Avoid overhead watering", "Keep leaves dry at night", "Do not overcrowd plants"],
      modelPipeline: ["Image preprocessing", "Leaf region detection", "CNN disease classification", "Treatment recommendation mapping"],
      modelPlaceholder: "CNN/TensorFlow/PyTorch model endpoint can replace this rule engine. PlantVillage dataset supported."
    };
  }

  if (hasSpots) {
    return {
      diseaseName: "Leaf Spot Disease",
      confidenceScore: 0.84,
      severity: "High",
      imageQuality: input.imageName ? "Image received for model pipeline" : "No image uploaded, symptoms used",
      treatmentSuggestions: ["Prune infected leaves", "Use copper-based fungicide if spreading", "Keep the plant away from other plants temporarily"],
      preventionTips: ["Water near soil only", "Sanitize pruning tools", "Increase sunlight and ventilation"],
      modelPipeline: ["Image preprocessing", "Brown/black lesion segmentation", "CNN disease classification", "Care protocol selection"],
      modelPlaceholder: "Future CNN classifier will analyze uploaded leaf pixels and return disease class probability."
    };
  }

  if (hasYellow) {
    return {
      diseaseName: "Nutrient Stress / Overwatering Risk",
      confidenceScore: 0.79,
      severity: "Medium",
      imageQuality: input.imageName ? "Image received for model pipeline" : "No image uploaded, symptoms used",
      treatmentSuggestions: ["Check soil moisture before watering", "Improve drainage", "Add balanced fertilizer after soil stabilizes"],
      preventionTips: ["Use pots with drainage holes", "Follow a fixed watering schedule by plant type", "Inspect roots during repotting"],
      modelPipeline: ["Leaf color analysis", "Yellowing pattern detection", "Watering risk scoring", "Care protocol selection"],
      modelPlaceholder: "Future model can combine image features with watering and soil sensor inputs."
    };
  }

  return {
    diseaseName: "Healthy / Low Disease Signal",
    confidenceScore: 0.72,
    severity: "Low",
    imageQuality: input.imageName ? "Image received for model pipeline" : "No image uploaded, symptoms used",
    treatmentSuggestions: ["Continue routine care", "Monitor leaves weekly", "Upload a clearer close-up if symptoms appear"],
    preventionTips: ["Maintain correct sunlight", "Avoid overwatering", "Clean leaves gently every 2 weeks"],
    modelPipeline: ["Image preprocessing", "Healthy-leaf baseline comparison", "Risk score generation", "Preventive care mapping"],
    modelPlaceholder: "CNN/TensorFlow/PyTorch image inference placeholder with PlantVillage-compatible output schema."
  };
}

function recommendPlants(input) {
  const indoor = input.environment === "Indoor";
  const lowLight = input.sunlight === "Low";
  const easy = input.maintenanceLevel === "Easy";
  const budget = Number(input.budget || 1500);

  const plants = [];
  if (indoor && lowLight) plants.push("Snake Plant", "ZZ Plant", "Peace Lily");
  if (indoor && !lowLight) plants.push("Areca Palm", "Monstera", "Rubber Plant");
  if (!indoor) plants.push("Bougainvillea", "Hibiscus", "Jasmine", "Ixora");
  if (easy) plants.unshift("Money Plant");

  return {
    recommendedPlants: [...new Set(plants)].slice(0, 5),
    confidenceScore: indoor && lowLight ? 0.91 : 0.86,
    recommendationType: `${input.environment || "Indoor"} ${input.sunlight || "Medium"}-light setup`,
    matchReasoning: [
      `${input.environment || "Indoor"} placement selected`,
      `${input.sunlight || "Medium"} sunlight availability considered`,
      `Budget around Rs ${budget.toLocaleString("en-IN")} considered`,
      `${input.roomSize || "Medium"} space size and ${input.climate || "local"} climate considered`,
      `${input.maintenanceLevel || "Easy"} maintenance preference used`
    ],
    carePlan: ["Start with 2-3 plants", "Observe sunlight for 7 days", "Add planters with drainage", "Schedule monthly health checks"],
    modelSignals: ["Sunlight score", "Climate suitability", "Budget fit", "Space density", "Maintenance effort"]
  };
}

function generateGardenDesign(input) {
  const space = input.spaceType || "Balcony";
  const size = input.spaceSize || "Medium";
  const style = input.style || "Modern natural";

  return {
    designName: `${style} ${space} Layout`,
    confidenceScore: 0.87,
    designScore: size === "Small" ? "Space-saving priority" : "Balanced greenery and movement",
    layoutSuggestions: [
      `Use vertical planters on the least-used wall of the ${space.toLowerCase()}`,
      `Place taller plants in back corners to create depth in a ${size.toLowerCase()} space`,
      "Keep a clear walking path for maintenance and watering",
      "Use matching planters to keep the design premium and organized"
    ],
    plantPlacement: ["Tall palms or ficus in corners", "Flowering plants near visible edges", "Trailing plants on railing or shelves", "Low herbs or succulents near seating"],
    decorIdeas: ["Warm floor lighting", "Natural stone pebbles", "Wooden planter stands", "Compact drip irrigation line"],
    spaceOptimization: ["Use wall height", "Group plants by watering need", "Keep service access clear", "Use foldable furniture if seating is needed"],
    generatedZones: ["Feature plant zone", "Flowering accent zone", "Maintenance path", "Decor and lighting zone"]
  };
}

export async function createAIReport(req, res, next) {
  try {
    const module = req.params.module;
    const strategies = {
      disease: { label: "Disease Detection", output: detectDisease(req.body) },
      recommendation: { label: "Plant Recommendation", output: recommendPlants(req.body) },
      design: { label: "Garden Design", output: generateGardenDesign(req.body) }
    };

    const selected = strategies[module];
    if (!selected) {
      return res.status(404).json({ message: "AI module not found" });
    }

    const report = await AIReport.create({
      user: req.user?._id,
      module: selected.label,
      input: req.body,
      output: selected.output,
      confidence: selected.output.confidenceScore || 0.86,
      status: "Processed",
      modelVersion: "rule-prototype-v1-ai-ready"
    });

    res.status(201).json({ message: "AI report generated", report });
  } catch (error) {
    next(error);
  }
}
