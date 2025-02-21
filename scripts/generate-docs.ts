import fs from "fs";
import path from "path";
import yaml from "yaml";
import { writeFileSyncIfChanged } from "./utils";

interface DocObject {
  platform?: string;
  [key: string]: any;
}

function processDocObject(obj: any, env: string): any {
  // If not an object, return as is
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj
      .map(item => processDocObject(item, env))
      .filter(item => item !== null);
  }

  // Handle objects
  const docObj = obj as DocObject;
  
  // If object has platform and it doesn't match current env, exclude it
  if (docObj.platform) {
    if (docObj.platform !== env) {
      return null;
    }
    // Remove the platform field from the output
    const { platform, ...rest } = docObj;
    obj = rest;
  }

  // Recursively process all properties
  const result: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(obj)) {
    const processed = processDocObject(value, env);
    if (processed !== null) {
      result[key] = processed;
    }
  }

  return result;
}

export function generateDocs() {
  const docsDir = path.resolve(__dirname, "..", "docs", "fern");
  const templatePath = path.join(docsDir, "docs-template.yml");
  
  // Read and parse the template
  const templateContent = fs.readFileSync(templatePath, "utf-8");
  const template = yaml.parse(templateContent);

  // Generate for each environment
  const environments = ["js", "next"];
  
  for (const env of environments) {
    // Process the template for this environment
    const processed = processDocObject(template, env);
    
    // Convert back to YAML
    const output = yaml.stringify(processed);
    
    // Write to environment-specific file
    const outputPath = path.join(docsDir, `${env}.yml`);
    writeFileSyncIfChanged(outputPath, output);
  }
}
