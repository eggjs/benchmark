#!/usr/bin/env node
/**
 * V8 CPU Profile Analyzer for Egg.js v4 Benchmark
 *
 * This script parses V8 profiler output files and generates:
 * - Summary statistics
 * - Top hotspot functions
 * - Call relationship analysis
 *
 * Usage: node analyze-profile.js <profile-file.txt> [--json]
 */

const fs = require('fs');
const path = require('path');

class ProfileAnalyzer {
  constructor() {
    this.ticks = 0;
    this.unaccounted = 0;
    this.jsFunctions = [];
    this.builtins = [];
    this.bottomUpProfile = [];
    this.summary = {};
  }

  parse(content) {
    const lines = content.split('\n');
    let section = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Parse header
      const headerMatch = line.match(/Statistical profiling result.*\((\d+) ticks, (\d+) unaccounted/);
      if (headerMatch) {
        this.ticks = parseInt(headerMatch[1], 10);
        this.unaccounted = parseInt(headerMatch[2], 10);
        continue;
      }

      // Detect section
      if (line.startsWith('[JavaScript]:')) {
        section = 'javascript';
        continue;
      }
      if (line.startsWith('[Summary]:')) {
        section = 'summary';
        continue;
      }
      if (line.startsWith('[Bottom up (heavy) profile]:')) {
        section = 'bottomup';
        continue;
      }
      if (line.startsWith('[C++]:') || line.startsWith('[C++ entry points]:') || line.startsWith('[Shared libraries]:')) {
        section = null;
        continue;
      }

      // Parse JavaScript functions
      if (section === 'javascript' && line.match(/^\d+/)) {
        const match = line.match(/^(\d+)\s+([\d.]+)%\s+([\d.]+)%\s+(.+)$/);
        if (match) {
          const entry = {
            ticks: parseInt(match[1], 10),
            totalPercent: parseFloat(match[2]),
            nonlibPercent: parseFloat(match[3]),
            name: match[4].trim()
          };

          if (entry.name.startsWith('JS:') || entry.name.startsWith('RegExp:')) {
            this.jsFunctions.push(entry);
          } else if (entry.name.startsWith('Builtin:')) {
            this.builtins.push(entry);
          }
        }
      }

      // Parse summary
      if (section === 'summary' && line.match(/^\d+/)) {
        const match = line.match(/^(\d+)\s+([\d.]+)%\s+[\d.]+%?\s+(.+)$/);
        if (match) {
          this.summary[match[3].trim()] = {
            ticks: parseInt(match[1], 10),
            percent: parseFloat(match[2])
          };
        }
      }
    }
  }

  getTopFunctions(n = 20) {
    return this.jsFunctions.slice(0, n);
  }

  getTopBuiltins(n = 20) {
    return this.builtins.slice(0, n);
  }

  categorize() {
    const categories = {
      'Promise/Async Hooks': [],
      'TEGG Runtime': [],
      'Lifecycle Management': [],
      'Koa/HTTP Handling': [],
      'Security Middleware': [],
      'Session/Bodyparser': [],
      'V8 IC (Inline Cache)': [],
      'Other': []
    };

    for (const fn of this.jsFunctions) {
      const name = fn.name.toLowerCase();

      if (name.includes('promise') || name.includes('async') || name.includes('hooks')) {
        categories['Promise/Async Hooks'].push(fn);
      } else if (name.includes('tegg') || name.includes('eggobject') || name.includes('eggcontainer')) {
        categories['TEGG Runtime'].push(fn);
      } else if (name.includes('lifecycle') || name.includes('precreate') || name.includes('postcreate') || name.includes('destroy')) {
        categories['Lifecycle Management'].push(fn);
      } else if (name.includes('koa') || name.includes('handlerequest') || name.includes('dispatch') || name.includes('_http')) {
        categories['Koa/HTTP Handling'].push(fn);
      } else if (name.includes('security') || name.includes('xframe') || name.includes('xss') || name.includes('nosniff')) {
        categories['Security Middleware'].push(fn);
      } else if (name.includes('session') || name.includes('bodyparser')) {
        categories['Session/Bodyparser'].push(fn);
      } else {
        categories['Other'].push(fn);
      }
    }

    for (const fn of this.builtins) {
      if (fn.name.includes('IC') || fn.name.includes('Megamorphic')) {
        categories['V8 IC (Inline Cache)'].push(fn);
      }
    }

    return categories;
  }

  generateReport() {
    const categories = this.categorize();
    let report = `# V8 CPU Profile Analysis Report\n\n`;
    report += `## Overview\n`;
    report += `- Total Ticks: ${this.ticks}\n`;
    report += `- Unaccounted: ${this.unaccounted} (${((this.unaccounted / this.ticks) * 100).toFixed(1)}%)\n\n`;

    report += `## Summary\n`;
    for (const [key, val] of Object.entries(this.summary)) {
      report += `- ${key}: ${val.ticks} ticks (${val.percent}%)\n`;
    }
    report += '\n';

    report += `## Top 15 JavaScript Functions\n`;
    report += `| Ticks | Total% | Function |\n`;
    report += `|-------|--------|----------|\n`;
    for (const fn of this.getTopFunctions(15)) {
      report += `| ${fn.ticks} | ${fn.totalPercent}% | ${fn.name} |\n`;
    }
    report += '\n';

    report += `## Top 15 V8 Builtins\n`;
    report += `| Ticks | Total% | Builtin |\n`;
    report += `|-------|--------|----------|\n`;
    for (const fn of this.getTopBuiltins(15)) {
      report += `| ${fn.ticks} | ${fn.totalPercent}% | ${fn.name} |\n`;
    }
    report += '\n';

    report += `## Categorized Hotspots\n`;
    for (const [category, fns] of Object.entries(categories)) {
      if (fns.length === 0) continue;
      const totalTicks = fns.reduce((sum, f) => sum + f.ticks, 0);
      const totalPercent = fns.reduce((sum, f) => sum + f.totalPercent, 0);
      report += `### ${category} (${totalTicks} ticks, ~${totalPercent.toFixed(1)}%)\n`;
      for (const fn of fns.slice(0, 5)) {
        report += `- ${fn.name}: ${fn.ticks} ticks (${fn.totalPercent}%)\n`;
      }
      if (fns.length > 5) {
        report += `- ... and ${fns.length - 5} more functions\n`;
      }
      report += '\n';
    }

    return report;
  }
}

// Main
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node analyze-profile.js <profile-file.txt> [--json]');
    process.exit(1);
  }

  const filePath = args[0];
  const outputJson = args.includes('--json');

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const analyzer = new ProfileAnalyzer();
    analyzer.parse(content);

    if (outputJson) {
      console.log(JSON.stringify({
        ticks: analyzer.ticks,
        unaccounted: analyzer.unaccounted,
        summary: analyzer.summary,
        topFunctions: analyzer.getTopFunctions(20),
        topBuiltins: analyzer.getTopBuiltins(20),
        categories: analyzer.categorize()
      }, null, 2));
    } else {
      console.log(analyzer.generateReport());
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

module.exports = { ProfileAnalyzer };
