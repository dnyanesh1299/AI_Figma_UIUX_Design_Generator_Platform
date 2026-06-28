import { generateUiDesign } from "./src/services/ai.service.js";
import fs from "fs";

async function run() {
  console.log("Calling generateUiDesign with prompt: 'jewelry website'...");
  try {
    const result = await generateUiDesign("jewelry website");
    console.log("Success status:", result.success);
    if (!result.success) {
      console.log("Error:", result.error);
    }
    fs.writeFileSync("schema.json", JSON.stringify(result.schema, null, 2));
    console.log("Saved full schema to schema.json");
    console.log("Project name:", result.schema?.meta?.projectName);
    console.log("Number of pages generated:", result.schema?.pages?.length);
    result.schema?.pages?.forEach(page => {
      console.log(`Page: ${page.name} (${page.id}), Components count: ${page.components?.length}`);
      page.components?.forEach(c => {
        console.log(`  - Component: ${c.type}, properties:`, JSON.stringify(c.properties));
      });
    });
  } catch (err) {
    console.error("Test execution failed:", err);
  }
}

run();
