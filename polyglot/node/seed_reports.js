#!/usr/bin/env node
/**
 * seed_reports.js
 *
 * Seeds the Nie Otchitame FastAPI backend with a handful of sample reports.
 * Demonstrates Node.js / JavaScript fetch and CLI skills from the job posting.
 *
 * Usage:
 *   node seed_reports.js
 *
 * Set API_URL via environment variable or edit the default below.
 */

const API_URL = process.env.API_URL || 'http://localhost:8000/api/v1/reports';

const sampleReports = [
  {
    title: 'Q2 Revenue',
    report_type: 'revenue',
    amount: 12500.5,
    date: '2026-06-20',
    status: 'approved',
  },
  {
    title: 'Office supplies',
    report_type: 'expense',
    amount: 245.3,
    date: '2026-06-18',
    status: 'submitted',
  },
  {
    title: 'Milestone Alpha',
    report_type: 'project',
    amount: 0,
    date: '2026-06-15',
    status: 'draft',
  },
  {
    title: 'New hire onboarding',
    report_type: 'hr',
    amount: 1500.0,
    date: '2026-06-10',
    status: 'approved',
  },
  {
    title: 'Travel costs',
    report_type: 'expense',
    amount: 890.75,
    date: '2026-06-05',
    status: 'draft',
  },
];

/**
 * POST a single report to the API.
 * @param {object} report
 * @returns {Promise<object>}
 */
async function createReport(report) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(report),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} creating "${report.title}": ${JSON.stringify(data)}`
    );
  }

  return data;
}

async function main() {
  console.log(`Seeding reports to ${API_URL}...\n`);

  let created = 0;
  let failed = 0;

  for (const report of sampleReports) {
    try {
      const result = await createReport(report);
      console.log(`✓ Created "${report.title}" (id=${result.id ?? 'unknown'})`);
      created++;
    } catch (error) {
      console.error(`✗ Failed "${report.title}": ${error.message}`);
      failed++;
    }
  }

  console.log(`\nDone. Created: ${created}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
