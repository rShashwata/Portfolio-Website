// Wrapper for tools/pdf-cover.py — finds Python, creates a local venv with
// PyMuPDF on first run, then hands over. Keeps the one Python dependency out
// of the global environment and out of package.json.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = dirname(fileURLToPath(import.meta.url));
const VENV = join(TOOLS, '.venv');
const isWin = process.platform === 'win32';
const venvPython = join(VENV, isWin ? 'Scripts' : 'bin', isWin ? 'python.exe' : 'python');

const run = (cmd, args, opts = {}) =>
  spawnSync(cmd, args, { stdio: 'inherit', ...opts });

function findPython() {
  for (const candidate of ['python', 'python3', 'py']) {
    const probe = spawnSync(candidate, ['--version'], { stdio: 'pipe' });
    if (probe.status === 0) return candidate;
  }
  return null;
}

if (!existsSync(venvPython)) {
  const python = findPython();
  if (!python) {
    console.error(
      'Python 3 not found. Install it from python.org (tick "Add to PATH"), then re-run.'
    );
    process.exit(1);
  }
  console.log('First run — creating tools/.venv and installing PyMuPDF…');
  if (run(python, ['-m', 'venv', VENV]).status !== 0) {
    console.error('Could not create the virtualenv.');
    process.exit(1);
  }
  const install = run(venvPython, [
    '-m', 'pip', 'install', '--quiet', '--disable-pip-version-check', 'pymupdf',
  ]);
  if (install.status !== 0) {
    console.error('Could not install PyMuPDF.');
    process.exit(1);
  }
  console.log('Ready.\n');
}

const result = run(venvPython, [join(TOOLS, 'pdf-cover.py'), ...process.argv.slice(2)]);
process.exit(result.status ?? 1);
