// backend/src/llm/generateScript.js
const fs = require('fs');
const path = require('path');

/**
 * generateScriptFromPrompt(prompt, sceneOptions)
 * - prompt: string (not used yet, but kept for future LLM usage)
 * - sceneOptions: object with keys { left, mid, topRight, bottomRight }
 *
 * This function reads the template file, and replaces the placeholder
 * {{LABEL_JSON}} with a JSON string safely produced from sceneOptions.
 */
async function generateScriptFromPrompt(prompt = '', sceneOptions = {}) {
  const templatesDir = path.resolve(__dirname, '..', 'templates');
  const tmplPath = path.join(templatesDir, 'template_scene.py');

  const raw = fs.readFileSync(tmplPath, 'utf8');

  // Provide defaults if some labels are missing
  const labels = {
    left: sceneOptions.left || 'Client',
    mid: sceneOptions.mid || 'Server',
    topRight: sceneOptions.topRight || 'Cache',
    bottomRight: sceneOptions.bottomRight || 'Database',
  };

  // JSON.stringify ensures safe escaping for insertion into the Python file
  const labelsJson = JSON.stringify(labels);

  // Replace the placeholder in the template with our JSON string
  const filled = raw.replace('{{LABEL_JSON}}', labelsJson);

  return filled;
}

module.exports = { generateScriptFromPrompt };
