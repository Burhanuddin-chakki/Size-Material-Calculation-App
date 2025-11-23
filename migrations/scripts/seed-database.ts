import mongoose from "mongoose";
import WindowModel from "../../models/window.model";
import MaterialModel from "../../models/material.model";
import PipeTypeModel from "../../models/pipe-type.model";
import windowData from "../seeds/windows.json";
import pipeTypeData from "../seeds/pipetypes.json";
import materialData from "../seeds/materials.json";
import pipeData from "../seeds/pipes.json";
import PipeModel from "@/models/pipe.model";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/window-estimation-db";

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully");

    // Clear existing data
    console.log("\nClearing existing data...");
    await WindowModel.deleteMany({});
    await MaterialModel.deleteMany({});
    await PipeTypeModel.deleteMany({});
    await PipeModel.deleteMany({});
    console.log("Existing data cleared");

    // Insert Window data
    console.log("\nInserting Window types...");
    const windows = await WindowModel.insertMany(windowData);
    console.log(`✓ Inserted ${windows.length} window types`);

    // Insert PipeType data
    console.log("\nInserting Pipe types...");
    const pipeTypes = await PipeTypeModel.insertMany(pipeTypeData);
    console.log(`✓ Inserted ${pipeTypes.length} pipe types`);

    // Insert Material data
    console.log("\nInserting Materials...");
    const materials = await MaterialModel.insertMany(materialData);
    console.log(`✓ Inserted ${materials.length} materials`);

    // Insert Pipe data
    console.log("\nInserting Pipes...");
    const pipes = await PipeModel.insertMany(pipeData);
    console.log(`✓ Inserted ${pipes.length} pipes`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\nSummary:");
    console.log(`- Windows: ${windows.length}`);
    console.log(`- Pipe Types: ${pipeTypes.length}`);
    console.log(`- Materials: ${materials.length}`);
    console.log(`- Pipes: ${pipes.length}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log("\n🎉 Migration completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Migration failed:", error);
    process.exit(1);
  });
