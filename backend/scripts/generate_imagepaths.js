const fs = require("fs");
const path = require("path");

const backgroundsDir = path.join(__dirname, "../../assets/backgrounds");
const outputFile = path.join(
    __dirname,
    "../../src/constants/backgrounds.tsx"
);

const supportedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const categories = fs
    .readdirSync(backgroundsDir)
    .filter((file) =>
        fs.statSync(path.join(backgroundsDir, file)).isDirectory()
    );

let output = `// AUTO-GENERATED FILE
// DO NOT EDIT MANUALLY
// Run: node scripts/generate-backgrounds.js

export const quoteBackgrounds = {\n`;

for (const category of categories) {
    const categoryDir = path.join(backgroundsDir, category);

    const images = fs
        .readdirSync(categoryDir)
        .filter((file) =>
            supportedExtensions.includes(path.extname(file).toLowerCase())
        )
        .sort();

    output += `  ${capitalize(category)}: [\n`;

    for (const image of images) {
        output += `    require("../../assets/backgrounds/${category}/${image}"),\n`;
    }

    output += `  ],\n\n`;
}

output += `}`// as const;\n`;

fs.writeFileSync(outputFile, output);

console.log("✅ Generated:", outputFile);