#!/usr/bin/env node
/**
 * Aggregate V8 CPU Profiles from Multiple Workers
 *
 * Usage: node aggregate-profiles.js <profile1.txt> <profile2.txt> ...
 */

const fs = require('fs');
const path = require('path');
const { ProfileAnalyzer } = require('./analyze-profile.js');

class AggregatedAnalyzer {
  constructor() {
    this.analyzers = [];
    this.aggregated = {
      totalTicks: 0,
      totalUnaccounted: 0,
      functions: new Map(),
      builtins: new Map()
    };
  }

  addProfile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const analyzer = new ProfileAnalyzer();
    analyzer.parse(content);
    this.analyzers.push({ filePath, analyzer });

    this.aggregated.totalTicks += analyzer.ticks;
    this.aggregated.totalUnaccounted += analyzer.unaccounted;

    for (const fn of analyzer.jsFunctions) {
      const existing = this.aggregated.functions.get(fn.name) || { ticks: 0, count: 0 };
      existing.ticks += fn.ticks;
      existing.count += 1;
      this.aggregated.functions.set(fn.name, existing);
    }

    for (const fn of analyzer.builtins) {
      const existing = this.aggregated.builtins.get(fn.name) || { ticks: 0, count: 0 };
      existing.ticks += fn.ticks;
      existing.count += 1;
      this.aggregated.builtins.set(fn.name, existing);
    }
  }

  getSortedFunctions(map, n = 30) {
    const entries = Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        ticks: data.ticks,
        avgTicks: Math.round(data.ticks / data.count),
        count: data.count,
        percent: ((data.ticks / this.aggregated.totalTicks) * 100).toFixed(2)
      }))
      .sort((a, b) => b.ticks - a.ticks);

    return entries.slice(0, n);
  }

  generateReport() {
    let report = `# Aggregated CPU Profile Analysis\n\n`;
    report += `## Overview\n`;
    report += `- Profiles Analyzed: ${this.analyzers.length}\n`;
    report += `- Total Ticks: ${this.aggregated.totalTicks}\n`;
    report += `- Total Unaccounted: ${this.aggregated.totalUnaccounted} (${((this.aggregated.totalUnaccounted / this.aggregated.totalTicks) * 100).toFixed(1)}%)\n\n`;

    report += `## Per-Worker Summary\n`;
    report += `| Worker | Ticks | JS% | Unaccounted% |\n`;
    report += `|--------|-------|-----|------------|\n`;
    for (const { filePath, analyzer } of this.analyzers) {
      const name = path.basename(filePath).replace('-processed.txt', '');
      const jsPercent = analyzer.summary['JavaScript']?.percent || 0;
      const unaccPercent = ((analyzer.unaccounted / analyzer.ticks) * 100).toFixed(1);
      report += `| ${name} | ${analyzer.ticks} | ${jsPercent}% | ${unaccPercent}% |\n`;
    }
    report += '\n';

    report += `## Top 25 Aggregated JavaScript Functions\n`;
    report += `| Total Ticks | Avg/Worker | % Total | Function |\n`;
    report += `|-------------|------------|---------|----------|\n`;
    for (const fn of this.getSortedFunctions(this.aggregated.functions, 25)) {
      report += `| ${fn.ticks} | ${fn.avgTicks} | ${fn.percent}% | ${fn.name} |\n`;
    }
    report += '\n';

    report += `## Top 20 Aggregated V8 Builtins\n`;
    report += `| Total Ticks | Avg/Worker | % Total | Builtin |\n`;
    report += `|-------------|------------|---------|----------|\n`;
    for (const fn of this.getSortedFunctions(this.aggregated.builtins, 20)) {
      report += `| ${fn.ticks} | ${fn.avgTicks} | ${fn.percent}% | ${fn.name} |\n`;
    }

    return report;
  }
}

// Main
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node aggregate-profiles.js <profile1.txt> <profile2.txt> ...');
    process.exit(1);
  }

  try {
    const aggregator = new AggregatedAnalyzer();
    for (const filePath of args) {
      aggregator.addProfile(filePath);
    }
    console.log(aggregator.generateReport());
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

module.exports = { AggregatedAnalyzer };
