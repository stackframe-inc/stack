import fs from "fs";
import path from "path";
import { COMMENT_LINE, PLATFORMS, copyFromSrcToDest, processMacros, writeFileSyncIfChanged } from "./utils";

/**
 * Main function to generate from a template:
 * 1. Ensures the destination exists.
 * 2. Copies from src to dest (applying a composite editFn).
 * 3. Removes any items in dest that aren’t in src.
 * 4. Cleans up empty folders.
 *
 * The composite editFn encapsulates the hard rules:
 * - Global ignores (e.g. node_modules, dist, etc.)
 * - Skipping source package.json.
 * - Renaming package-template.json -> package.json.
 * - Inserting header comments into .tsx, .ts, or .js files.
 * - Adding a comment field in package.json files.
 *
 * Custom editFns provided in options can further modify content.
 */
function generateFromTemplate(options: {
  src: string;
  dest: string;
  editFn?: (
    relativePath: string,
    content: string
  ) => { content: string | null; destName?: string } | string | null;
  topLevel?: boolean;
}) {
  const { src, dest, editFn: customEditFn, topLevel = true } = options;

  // Composite edit function that applies the hard rules first,
  // then defers to any custom edit function.
  function compositeEditFn(
    relativePath: string,
    content: string
  ): { content: string | null; destName?: string } | null {
    // Global ignore rules.
    const globalIgnores = ["node_modules", "dist", ".turbo", ".gitignore"];
    for (const ignore of globalIgnores) {
      if (relativePath.startsWith(ignore)) return null;
    }

    // Skip copying if the source file is package.json.
    if (path.basename(relativePath) === "package.json") return null;

    // If the file is package-template.json, mark it to be renamed.
    let destNameOverride: string | undefined;
    if (path.basename(relativePath) === "package-template.json") {
      destNameOverride = "package.json";
    }

    // Apply the custom edit function if provided.
    let result: string | { content: string | null; destName?: string } | null = content;
    if (customEditFn) {
      result = customEditFn(relativePath, content);
      if (result === null) return null;
    }

    let newContent: string | null;
    let customDestName: string | undefined;
    if (typeof result === "string") {
      newContent = result;
    } else {
      newContent = result.content;
      customDestName = result.destName;
      if (newContent === null) return null;
    }

    // Final destination name: override if needed.
    const finalDestName = destNameOverride || customDestName;

    // For .tsx, .ts, or .js files, add header comments.
    if (/\.(tsx|ts|js)$/.test(relativePath)) {
      const hasShebang =
        newContent.startsWith("#") ||
        newContent.startsWith('"') ||
        newContent.startsWith("'");
      let shebangLine = "";
      let contentWithoutShebang = newContent;
      if (hasShebang) {
        const lines = newContent.split("\n");
        shebangLine = lines[0] + "\n\n";
        contentWithoutShebang = lines.slice(1).join("\n");
      }
      newContent =
        shebangLine +
        "//===========================================\n" +
        "// " +
        COMMENT_LINE +
        "\n" +
        "//===========================================\n\n" +
        contentWithoutShebang;
    }

    // If the resulting file is package.json (either originally or via renaming),
    // add a comment field to the JSON.
    if (finalDestName === "package.json" || path.basename(relativePath) === "package.json") {
      try {
        const jsonObj = JSON.parse(newContent);
        newContent = JSON.stringify({ "//": COMMENT_LINE, ...jsonObj }, null, 2);
      } catch (e) {
        // Ignore JSON parsing errors.
      }
    }

    return { content: newContent, destName: finalDestName };
  }

  // Ensure the destination directory exists.
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Copy files from src to dest using the composite edit function.
  copyFromSrcToDest(src, dest, compositeEditFn, process.cwd());
}


const baseDir = path.resolve(__dirname, "..", "packages");
const srcDir = path.resolve(baseDir, "template");

// Copy package-template.json to package.json in the template,
// applying macros and adding a comment field.
const packageTemplateContent = fs.readFileSync(
  path.join(srcDir, "package-template.json"),
  "utf-8"
);
const processedPackageJson = processMacros(packageTemplateContent, PLATFORMS["template"]);
const packageJson = JSON.parse(processedPackageJson);
const packageJsonWithComment = {
  "//": COMMENT_LINE,
  ...packageJson,
};
writeFileSyncIfChanged(
  path.join(srcDir, "package.json"),
  JSON.stringify(packageJsonWithComment, null, 2)
);

// Generate the JS SDK version.
generateFromTemplate({
  src: srcDir,
  dest: path.resolve(baseDir, "js"),
  editFn: (relativePath, content) => {
    const ignores = [
      "postcss.config.js",
      "tailwind.config.js",
      "quetzal.config.json",
      "components.json",
      ".env",
      ".env.local",
      "scripts/",
      "quetzal-translations/",
      "src/components/",
      "src/components-page/",
      "src/generated/",
      "src/providers/",
      "src/global.css",
      "src/global.d.ts",
    ];

    if (
      ignores.some((ignorePath) => relativePath.startsWith(ignorePath)) ||
      relativePath.endsWith(".tsx")
    ) {
      return null;
    }

    return processMacros(content, PLATFORMS["js"]);
  },
});

// Generate the stack version.
generateFromTemplate({
  src: srcDir,
  dest: path.resolve(baseDir, "stack"),
  editFn: (relativePath, content) => {
    // Skip files in the generated folder.
    if (relativePath.startsWith("src/generated")) return null;
    
    return processMacros(content, PLATFORMS["next"]);
  },
});
