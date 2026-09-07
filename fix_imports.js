const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === '.next' || file === '.git') return;
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk('d:/khaled/nile_link_website-main');
let updated = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  if (content.includes('import { useRouter } from "next/navigation"')) {
    content = content.replace(/import \{ useRouter \} from ["']next\/navigation["']/, 'import { useRouter } from "@/navigation"');
    changed = true;
  }
  if (content.includes('import { redirect } from "next/navigation"')) {
    content = content.replace(/import \{ redirect \} from ["']next\/navigation["']/, 'import { redirect } from "@/navigation"');
    changed = true;
  }
  if (content.includes('import { usePathname } from "next/navigation"')) {
    content = content.replace(/import \{ usePathname \} from ["']next\/navigation["']/, 'import { usePathname } from "@/navigation"');
    changed = true;
  }
  if (content.includes('import { useParams, useRouter } from "next/navigation"')) {
    content = content.replace(/import \{ useParams, useRouter \} from ["']next\/navigation["']/, 'import { useParams } from "next/navigation"\nimport { useRouter } from "@/navigation"');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    updated++;
    console.log('Updated', f);
  }
});
console.log('Total files updated: ' + updated);
