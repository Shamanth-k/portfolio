import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");
const rawPath = path.resolve(projectRoot, "qa/test-reports/raw/vitest-results.json");
const reportDir = path.resolve(projectRoot, "qa/test-reports");
const outputPath = path.resolve(reportDir, "unit-test-report.md");

if (!fs.existsSync(rawPath)) {
  console.error(`Raw test report not found at: ${rawPath}`);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(rawPath, "utf8"));
const testResults = raw.testResults || [];

const rows = [];
let counter = 1;

for (const suite of testResults) {
  for (const assertion of suite.assertionResults || []) {
    rows.push({
      no: counter,
      variable: assertion.fullName || assertion.title || "Unnamed test",
      result: assertion.status === "passed" ? "PASS" : "FAIL",
    });
    counter += 1;
  }
}

fs.mkdirSync(reportDir, { recursive: true });
fs.mkdirSync(path.resolve(reportDir, "raw"), { recursive: true });

const header = [
  "# Unit Test Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "| Test Case No | Test Case Variable | Test Result |",
  "| --- | --- | --- |",
];

const body =
  rows.length > 0
    ? rows.map((row) => `| ${row.no} | ${row.variable} | ${row.result} |`)
    : ["| - | No test cases found | - |"];

fs.writeFileSync(outputPath, [...header, ...body, ""].join("\n"), "utf8");
console.log(`Report generated: ${outputPath}`);
