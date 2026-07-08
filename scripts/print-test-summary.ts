import fs from 'node:fs';
import path from 'node:path';

interface PlaywrightJsonReport {
  stats?: {
    expected?: number;
    unexpected?: number;
    flaky?: number;
    skipped?: number;
    duration?: number;
  };
  suites?: PlaywrightSuite[];
}

interface PlaywrightSuite {
  title?: string;
  specs?: PlaywrightSpec[];
  suites?: PlaywrightSuite[];
}

interface PlaywrightSpec {
  title?: string;
  ok?: boolean;
  tests?: Array<{
    results?: Array<{
      status?: string;
      error?: { message?: string };
    }>;
  }>;
}

function collectSpecs(suites: PlaywrightSuite[] = [], parentTitle = ''): Array<{ name: string; status: string; error?: string }> {
  const rows: Array<{ name: string; status: string; error?: string }> = [];

  for (const suite of suites) {
    const suiteTitle = [parentTitle, suite.title].filter(Boolean).join(' › ');

    for (const spec of suite.specs ?? []) {
      const result = spec.tests?.[0]?.results?.[0];
      const status = result?.status ?? (spec.ok ? 'passed' : 'failed');
      rows.push({
        name: [suiteTitle, spec.title].filter(Boolean).join(' › '),
        status,
        error: result?.error?.message,
      });
    }

    rows.push(...collectSpecs(suite.suites, suiteTitle));
  }

  return rows;
}

function printSummary(): void {
  const reportPath = path.resolve('test-results/summary.json');

  if (!fs.existsSync(reportPath)) {
    console.error('No summary found. Run tests first: npm run test:journey');
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8')) as PlaywrightJsonReport;
  const specs = collectSpecs(report.suites);
  const passed = specs.filter((s) => s.status === 'passed' || s.status === 'expected').length;
  const failed = specs.filter((s) => s.status === 'failed' || s.status === 'unexpected' || s.status === 'timedOut').length;
  const skipped = specs.filter((s) => s.status === 'skipped').length;
  const total = specs.length;
  const durationMs = report.stats?.duration ?? 0;

  console.log('\n================ TEST EXECUTION SUMMARY ================');
  console.log(`Total:   ${total}`);
  console.log(`Passed:  ${passed}`);
  console.log(`Failed:  ${failed}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Time:    ${(durationMs / 1000).toFixed(1)}s`);
  console.log('======================================================\n');

  for (const spec of specs) {
    const icon = spec.status === 'passed' || spec.status === 'expected' ? 'PASS' : spec.status === 'skipped' ? 'SKIP' : 'FAIL';
    console.log(`[${icon}] ${spec.name}`);
    if (spec.error && icon === 'FAIL') {
      console.log(`       ${spec.error.split('\n')[0]}`);
    }
  }

  const allureReport = path.resolve('allure-report/index.html');
  const allureReady = fs.existsSync(allureReport);

  console.log('\nReports:');
  console.log(`  HTML:    ${path.resolve('playwright-report/index.html')}`);
  console.log(`  Allure:  ${allureReady ? allureReport : path.resolve('allure-results') + ' (run: npm run allure:generate)'}`);
  console.log(`  JSON:    ${reportPath}`);
  console.log(`  Artifacts: ${path.resolve('test-results')}`);
  console.log('\nOpen HTML report:  npm run report');
  console.log('Open Allure report: npm run allure:open\n');
}

printSummary();
