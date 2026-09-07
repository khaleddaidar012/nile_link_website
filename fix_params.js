const fs = require('fs');
const files = [
  'app/api/admin/requests/[id]/price/route.ts',
  'app/api/admin/services/[id]/status/route.ts',
  'app/api/invoice/[token]/route.ts',
  'app/api/portal/quotes/[id]/route.ts',
  'app/api/portal/quotes/[id]/accept/route.ts',
  'app/api/portal/quotes/[id]/reject/route.ts'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\{ params \}: \{ params: \{ ([a-zA-Z0-9_]+): string \} \}/g, '{ params }: { params: Promise<{ $1: string }> }');
  
  content = content.replace(/export async function (GET|POST|PUT|DELETE|PATCH)\(req: NextRequest, \{ params \}: \{ params: Promise<\{ ([a-zA-Z0-9_]+): string \}> \}\) \{\n(\s*)try \{/g, 'export async function $1(req: NextRequest, { params }: { params: Promise<{ $2: string }> }) {\n$2try {\n$2  const { $2 } = await params;');

  content = content.replace(/params\.token/g, 'token');
  content = content.replace(/params\.id/g, 'id');

  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
