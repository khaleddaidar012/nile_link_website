const fs = require('fs');
const path = require('path');

function findTKeys(dir) {
  const keys = new Set();
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      findTKeys(full).forEach(k => keys.add(k));
    } else if (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) {
      const content = fs.readFileSync(full, 'utf8');
      // Match t("admin.xxx.yyy") patterns
      const re = /t\(["'`](admin\.[^"'`]+)["'`]/g;
      let m;
      while ((m = re.exec(content)) !== null) {
        keys.add(m[1]);
      }
    }
  }
  return keys;
}

const keys = findTKeys('app/[locale]/admin');
[...keys].sort().forEach(k => console.log(k));
