#!/usr/bin/env node
/**
 * Start Next.js dev mode and warm the chunks that Tauri's WebView needs first.
 */

const { spawn } = require('child_process');

const host = '127.0.0.1';
const port = 3118;
const baseUrl = `http://${host}:${port}`;
const startupTimeoutMs = 180000;
const requestTimeoutMs = 30000;

const nextCli = require.resolve('next/dist/bin/next');
const nextProcess = spawn(process.execPath, [nextCli, 'dev', '-H', host, '-p', String(port)], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
});

let shuttingDown = false;

function stopChild(signal) {
  if (shuttingDown) return;
  shuttingDown = true;

  if (!nextProcess.killed) {
    nextProcess.kill(signal);
  }
}

process.on('SIGINT', () => stopChild('SIGINT'));
process.on('SIGTERM', () => stopChild('SIGTERM'));
process.on('exit', () => stopChild('SIGTERM'));

nextProcess.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    return await fetch(url, {
      cache: 'no-store',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function unique(values) {
  return [...new Set(values)];
}

function scriptUrlsFromHtml(html) {
  const matches = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)];
  const scriptUrls = matches.map((match) => match[1]).filter((src) => src.startsWith('/_next/'));

  return unique([
    ...scriptUrls,
    '/_next/static/chunks/app/layout.js',
    '/_next/static/chunks/app/page.js',
  ]);
}

async function waitForOk(url) {
  const startedAt = Date.now();
  let lastError = '';

  while (Date.now() - startedAt < startupTimeoutMs) {
    try {
      const response = await fetchWithTimeout(url);
      if (response.ok) {
        return response;
      }
      lastError = `${response.status} ${response.statusText}`;
    } catch (error) {
      lastError = error.message || String(error);
    }

    await sleep(1000);
  }

  throw new Error(`Timed out waiting for ${url}${lastError ? ` (${lastError})` : ''}`);
}

async function warmChunk(pathname) {
  const url = new URL(pathname, baseUrl).toString();
  const response = await waitForOk(url);
  const body = await response.text();

  if (!body.trim()) {
    throw new Error(`Next.js returned an empty chunk: ${url}`);
  }
}

(async () => {
  try {
    const response = await waitForOk(baseUrl);
    const html = await response.text();
    const scriptUrls = scriptUrlsFromHtml(html);

    for (const scriptUrl of scriptUrls) {
      await warmChunk(scriptUrl);
    }

    console.log(`Next.js dev server is ready at ${baseUrl}`);
  } catch (error) {
    console.error(error.message || error);
    stopChild('SIGTERM');
    process.exit(1);
  }
})();
