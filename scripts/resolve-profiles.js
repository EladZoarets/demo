#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT          = process.cwd();
const CURSOR_AGENTS = path.join(ROOT, '.cursor/agents');
const AMP_AGENTS    = path.join(ROOT, '.agents/skills');
const PROFILES_DIR  = path.join(ROOT, '.cursor/model-profiles');
const REGISTRY_FILE = path.join(PROFILES_DIR, '_registry.md');
const OUTPUT_FILE   = path.join(ROOT, 'resolved-context.md');
const DRY_RUN       = process.argv.includes('--dry-run');

// ── Parsers ──────────────────────────────────────────────────────────────────

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result = {};
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':');
    if (i < 1) continue;
    result[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return result;
}

function parseRegistry(content) {
  const map = {};
  for (const line of content.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || t === '---') continue;
    const i = t.indexOf(':');
    if (i < 1) continue;
    map[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return map;
}

function extractTemplateFormats(content) {
  const formats = {};
  const section = content.match(/## Template Formats\n([\s\S]*?)(?=\n\n## |\n---\n|$)/);
  if (!section) return formats;
  const re = /### (\w+)\n([^\n]+)/g;
  let m;
  while ((m = re.exec(section[1])) !== null) {
    formats[m[1].toLowerCase()] = m[2].trim();
  }
  return formats;
}

// ── Profile loader (with inheritance + circular detection) ───────────────────

function loadProfile(filename, visited = new Set()) {
  const filePath = path.join(PROFILES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Profile not found: ${filename}`);
  }
  if (visited.has(filename)) {
    throw new Error(`Circular inheritance: ${[...visited, filename].join(' → ')}`);
  }
  visited.add(filename);

  const content = fs.readFileSync(filePath, 'utf8');
  const fields  = parseFrontmatter(content);
  const tpl     = extractTemplateFormats(content);

  if (fields.extends) {
    const base = loadProfile(fields.extends, new Set(visited));
    const merged = { ...base };
    for (const [k, v] of Object.entries(fields)) {
      if (k !== 'extends') merged[k] = v;
    }
    merged._tpl = { ...base._tpl, ...tpl };
    return merged;
  }

  fields._tpl = tpl;
  return fields;
}

// ── Agent collector (both surfaces, de-duplicated) ───────────────────────────

function collectAgents() {
  const agents = [];

  if (fs.existsSync(CURSOR_AGENTS)) {
    for (const file of fs.readdirSync(CURSOR_AGENTS).sort()) {
      if (!file.endsWith('.md')) continue;
      const content = fs.readFileSync(path.join(CURSOR_AGENTS, file), 'utf8');
      const fm      = parseFrontmatter(content);
      agents.push({ name: fm.name || path.basename(file, '.md'), preferred_model: fm.preferred_model || null });
    }
  }

  if (fs.existsSync(AMP_AGENTS)) {
    for (const dir of fs.readdirSync(AMP_AGENTS).sort()) {
      const skillPath = path.join(AMP_AGENTS, dir, 'SKILL.md');
      if (!fs.existsSync(skillPath)) continue;
      const content = fs.readFileSync(skillPath, 'utf8');
      const fm      = parseFrontmatter(content);
      const name    = (fm.name || dir).replace(/^sdlc-/, '');
      if (name === 'orchestrator') continue;          // runner, not an injected agent
      if (!agents.find(a => a.name === name)) {       // skip duplicates
        agents.push({ name, preferred_model: fm.preferred_model || null });
      }
    }
  }

  return agents;
}

// ── Output formatter ─────────────────────────────────────────────────────────

function formatBlock(name, modelId, profile) {
  const tf    = profile._tpl || {};
  const lines = [
    `[agent: ${name} | model: ${modelId}]`,
    `prompt_style: ${profile.prompt_style    || 'plain-numbered'}`,
    `role_assignment: ${profile.role_assignment || 'inline-you-are'}`,
    `chain_of_thought: ${profile.chain_of_thought || 'none'}`,
    `output_format: ${profile.output_format   || 'markdown-sections'}`,
    `forbidden: ${profile.forbidden_patterns  || 'none'}`,
  ];
  if (tf.plan)   lines.push(`plan_format: ${tf.plan}`);
  if (tf.score)  lines.push(`score_format: ${tf.score}`);
  if (tf.chaos)  lines.push(`chaos_format: ${tf.chaos}`);
  if (tf.review) lines.push(`review_format: ${tf.review}`);
  lines.push('[/agent]');
  return lines.join('\n');
}

// ── Main ─────────────────────────────────────────────────────────────────────

try {
  if (!fs.existsSync(REGISTRY_FILE)) {
    console.error(`ERROR: Registry not found: ${REGISTRY_FILE}`);
    process.exit(1);
  }

  const registry = parseRegistry(fs.readFileSync(REGISTRY_FILE, 'utf8'));
  const agents   = collectAgents();

  if (agents.length === 0) {
    console.error('ERROR: No agent files found in .cursor/agents/ or .agents/skills/');
    process.exit(1);
  }

  const blocks  = [];
  const summary = [];

  for (const agent of agents) {
    const modelId     = agent.preferred_model || 'default';
    const profileFile = registry[modelId] || registry['default'];

    if (!profileFile) {
      console.error(`ERROR: No profile for '${modelId}' and no default fallback in registry.`);
      process.exit(1);
    }

    const profile = loadProfile(profileFile);
    blocks.push(formatBlock(agent.name, modelId, profile));
    summary.push(`${agent.name}=${modelId}`);
  }

  const timestamp = new Date().toISOString();
  const output = [
    `# Resolved Model Profiles`,
    `<!-- Generated by scripts/resolve-profiles.js on ${timestamp} -->`,
    `<!-- Do not edit manually — re-run the script to regenerate -->`,
    '',
    blocks.join('\n\n'),
  ].join('\n');

  if (DRY_RUN) {
    process.stdout.write(output + '\n');
    console.error(`\n[DRY-RUN] ${blocks.length} agent block(s) — output not written.`);
  } else {
    fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
    console.log(`[PROFILES RESOLVED: ${summary.join(' | ')}]`);
  }

} catch (err) {
  console.error(`ERROR: ${err.message}`);
  process.exit(1);
}
