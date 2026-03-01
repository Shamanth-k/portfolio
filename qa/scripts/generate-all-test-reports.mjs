import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");
const reportRoot = path.resolve(projectRoot, "qa/test-reports/by-test");
const markdownDir = path.resolve(reportRoot, "markdown");
const pdfDir = path.resolve(reportRoot, "pdf");
const rawVitestPath = path.resolve(projectRoot, "qa/test-reports/raw/vitest-results.json");
const extendedChecksPath = path.resolve(projectRoot, "qa/test-reports/raw/extended-checks.json");

const testTypes = [
  "Unit Test",
  "Component Test",
  "Integration Test",
  "API Test",
  "Contract Test",
  "End-to-End (E2E) Test",
  "Load Test",
  "Stress Test",
  "Soak Test",
  "Spike Test",
  "Volume Test",
  "Performance Test",
  "Latency Test",
  "Throughput Test",
  "Scalability Test",
  "Concurrency Test",
  "Failover Test",
  "Resilience Test",
  "Chaos Test",
  "Recovery Test",
  "Regression Test",
  "Smoke Test",
  "Sanity Test",
  "Acceptance Test",
  "User Acceptance Test (UAT)",
  "System Test",
  "Functional Test",
  "Non-Functional Test",
  "Exploratory Test",
  "Usability Test",
  "Accessibility Test",
  "Cross-Browser Test",
  "Responsive Test",
  "Compatibility Test",
  "Security Test",
  "Penetration Test",
  "Vulnerability Scan",
  "Static Application Security Test (SAST)",
  "Dynamic Application Security Test (DAST)",
  "Interactive Application Security Test (IAST)",
  "Dependency Scan",
  "Fuzz Test",
  "Input Validation Test",
  "Authentication Test",
  "Authorization Test",
  "Session Management Test",
  "CSRF Test",
  "XSS Test",
  "Injection Test",
  "CSP Test",
  "Rate Limit Test",
  "Abuse Test",
  "Bot Resistance Test",
  "Data Integrity Test",
  "Data Consistency Test",
  "Idempotency Test",
  "Queue Reliability Test",
  "Circuit Breaker Test",
  "Timeout Handling Test",
  "Retry Logic Test",
  "Backpressure Test",
  "Monitoring Validation Test",
  "Logging Validation Test",
  "Alerting Test",
  "Deployment Test",
  "Configuration Test",
  "Environment Variable Test",
  "Build Verification Test",
  "Bundle Size Test",
  "SEO Test",
];

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapePdfText(text) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapText(text, maxChars = 95) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    if (!word) continue;
    if (!current) {
      current = word;
      continue;
    }
    if (`${current} ${word}`.length <= maxChars) {
      current = `${current} ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function createSimplePdf(lines, outputPath) {
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 50;
  const lineHeight = 14;
  const maxLinesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);
  const pages = [];

  for (let i = 0; i < lines.length; i += maxLinesPerPage) {
    pages.push(lines.slice(i, i + maxLinesPerPage));
  }

  const objects = [];
  const addObject = (content) => {
    objects.push(content);
    return objects.length;
  };

  const fontObjectId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pagesObjectId = addObject("");

  const pageObjectIds = [];

  for (const pageLines of pages) {
    const textOps = [
      "BT",
      "/F1 11 Tf",
      `${lineHeight} TL`,
      `${margin} ${pageHeight - margin} Td`,
    ];

    if (pageLines.length === 0) {
      textOps.push("(No content) Tj");
    } else {
      textOps.push(`(${escapePdfText(pageLines[0])}) Tj`);
      for (let i = 1; i < pageLines.length; i += 1) {
        textOps.push("T*");
        textOps.push(`(${escapePdfText(pageLines[i])}) Tj`);
      }
    }
    textOps.push("ET");

    const stream = `${textOps.join("\n")}\n`;
    const streamLength = Buffer.byteLength(stream, "utf8");
    const contentObjectId = addObject(`<< /Length ${streamLength} >>\nstream\n${stream}endstream`);

    const pageObjectId = addObject(
      `<< /Type /Page /Parent ${pagesObjectId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>`
    );
    pageObjectIds.push(pageObjectId);
  }

  objects[pagesObjectId - 1] = `<< /Type /Pages /Kids [${pageObjectIds
    .map((id) => `${id} 0 R`)
    .join(" ")}] /Count ${pageObjectIds.length} >>`;

  const catalogObjectId = addObject(`<< /Type /Catalog /Pages ${pagesObjectId} 0 R >>`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObjectId} 0 R >>\n`;
  pdf += `startxref\n${xrefStart}\n%%EOF\n`;

  fs.writeFileSync(outputPath, Buffer.from(pdf, "utf8"));
}

function loadVitestEvidence() {
  if (!fs.existsSync(rawVitestPath)) {
    return [];
  }

  const raw = JSON.parse(fs.readFileSync(rawVitestPath, "utf8"));
  const assertions = [];

  for (const suite of raw.testResults || []) {
    for (const assertion of suite.assertionResults || []) {
      assertions.push({
        suite: suite.name || "",
        name: assertion.fullName || assertion.title || "Unnamed test",
        status: assertion.status === "passed" ? "PASS" : "FAIL",
      });
    }
  }

  return assertions;
}

function loadExtendedChecks() {
  if (!fs.existsSync(extendedChecksPath)) {
    return {};
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(extendedChecksPath, "utf8"));
    return parsed.checks || {};
  } catch {
    return {};
  }
}

function getTaggedAssertions(assertions, testType) {
  return assertions.filter((item) => item.name.includes(`[${testType}]`));
}

function getUnitAssertions(assertions) {
  return assertions.filter((item) => item.suite.toLowerCase().includes("/qa/tests/unit/"));
}

function buildReport(testType, assertions, extendedChecks) {
  const executedAt = new Date().toISOString();
  const externalCheck = extendedChecks[testType];

  if (externalCheck) {
    return {
      status: externalCheck.status,
      executedAt,
      scope: "Executed from scripted command checks.",
      method: "Evidence from `qa/scripts/run-extended-checks.mjs`.",
      summary: externalCheck.summary,
      details: (externalCheck.details || []).map(String),
      blockers: [],
      recommendations: [],
    };
  }

  const matched = testType === "Unit Test" ? getUnitAssertions(assertions) : getTaggedAssertions(assertions, testType);

  if (matched.length > 0) {
    const passed = matched.filter((item) => item.status === "PASS").length;
    const failed = matched.length - passed;

    return {
      status: failed === 0 ? "PASS" : "FAIL",
      executedAt,
      scope: "Executed via Vitest tagged assertions.",
      method: "Evidence parsed from `qa/test-reports/raw/vitest-results.json`.",
      summary: `${passed}/${matched.length} assertions passed for ${testType}.`,
      details: matched.slice(0, 20).map((item, index) => `${index + 1}. ${item.name}: ${item.status}`),
      blockers: [],
      recommendations: [],
    };
  }

  return {
    status: "NOT_EXECUTED",
    executedAt,
    scope: "Requested test type has no executable test case wired in this repository.",
    method: "No tagged Vitest assertion or command-based evidence found for this test type.",
    summary: `${testType} has not been executed in an automated, verifiable way in this run.`,
    details: [
      "Add dedicated test cases or command checks for this category.",
      "Re-run `npm run test:report:all` after implementation.",
    ],
    blockers: ["Missing executable test implementation for this category."],
    recommendations: ["Define one or more automated checks and tag them with the exact test type name."],
  };
}

function reportToMarkdown(testType, report) {
  const lines = [
    `# ${testType} Report`,
    "",
    `- Status: ${report.status}`,
    `- Executed At: ${report.executedAt}`,
    "",
    "## Scope",
    report.scope,
    "",
    "## Method",
    report.method,
    "",
    "## Summary",
    report.summary,
    "",
    "## Details",
    ...report.details.map((line) => `- ${line}`),
  ];

  if (report.blockers.length > 0) {
    lines.push("", "## Blockers", ...report.blockers.map((line) => `- ${line}`));
  }

  if (report.recommendations.length > 0) {
    lines.push("", "## Recommendations", ...report.recommendations.map((line) => `- ${line}`));
  }

  lines.push("");
  return lines.join("\n");
}

function reportToPdfLines(testType, report) {
  const sections = [
    `${testType} Report`,
    `Status: ${report.status}`,
    `Executed At: ${report.executedAt}`,
    "",
    "Scope:",
    report.scope,
    "",
    "Method:",
    report.method,
    "",
    "Summary:",
    report.summary,
    "",
    "Details:",
    ...report.details.map((line) => `- ${line}`),
  ];

  if (report.blockers.length > 0) {
    sections.push("", "Blockers:", ...report.blockers.map((line) => `- ${line}`));
  }

  if (report.recommendations.length > 0) {
    sections.push("", "Recommendations:", ...report.recommendations.map((line) => `- ${line}`));
  }

  const lines = [];
  for (const sectionLine of sections) {
    if (sectionLine === "") {
      lines.push("");
      continue;
    }
    lines.push(...wrapText(sectionLine, 92));
  }
  return lines;
}

function main() {
  fs.mkdirSync(markdownDir, { recursive: true });
  fs.mkdirSync(pdfDir, { recursive: true });

  const assertions = loadVitestEvidence();
  const extendedChecks = loadExtendedChecks();
  const indexRows = [];

  for (const testType of testTypes) {
    const report = buildReport(testType, assertions, extendedChecks);
    const slug = slugify(testType);
    const markdownPath = path.resolve(markdownDir, `${slug}.md`);
    const pdfPath = path.resolve(pdfDir, `${slug}.pdf`);

    fs.writeFileSync(markdownPath, reportToMarkdown(testType, report), "utf8");
    createSimplePdf(reportToPdfLines(testType, report), pdfPath);

    indexRows.push(`| ${testType} | ${report.status} | markdown/${slug}.md | pdf/${slug}.pdf |`);
  }

  const indexContent = [
    "# Test Report Index",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "| Test Type | Status | Markdown Report | PDF Report |",
    "| --- | --- | --- | --- |",
    ...indexRows,
    "",
  ].join("\n");

  fs.writeFileSync(path.resolve(reportRoot, "index.md"), indexContent, "utf8");

  console.log(`Generated ${testTypes.length} markdown reports in: ${markdownDir}`);
  console.log(`Generated ${testTypes.length} pdf reports in: ${pdfDir}`);
  console.log(`Generated report index: ${path.resolve(reportRoot, "index.md")}`);
}

main();
