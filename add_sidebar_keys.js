const fs = require('fs');

const sidebarAr = {
  dashboard: "الإحصائيات والعمليات",
  reviewQueue: "مراجعة المستندات",
  customers: "حسابات الشركات",
  requests: "طلبات الخدمات",
  notifications: "مركز التنبيهات",
  staff: "فريق العمل والصلاحيات",
  settings: "إعدادات النظام"
};

const sidebarEn = {
  dashboard: "Analytics & Overview",
  reviewQueue: "Document Review Queue",
  customers: "Customer Accounts",
  requests: "Service Requests",
  notifications: "Notification Center",
  staff: "Staff & Permissions",
  settings: "System Settings"
};

// Update AR
const ar = JSON.parse(fs.readFileSync('messages/ar.json', 'utf8'));
ar.admin.sidebar = sidebarAr;
fs.writeFileSync('messages/ar.json', JSON.stringify(ar, null, 2), 'utf8');
console.log('Updated ar.json admin.sidebar');

// Update EN
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
en.admin.sidebar = sidebarEn;
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2), 'utf8');
console.log('Updated en.json admin.sidebar');
