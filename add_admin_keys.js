const fs = require('fs');

// Missing admin keys to add to AR
const arAdminAdditions = {
  dashboard: {
    title: "الإحصائيات والعمليات",
    subtitle: "قائمة التحقق من المستندات، وتواريخ الانتهاء، وإحصائيات العملاء"
  },
  customerTable: {
    title: "حسابات الشركات",
    client: "العميل"
  },
  customers: {
    pageTitle: "إدارة العملاء",
    pageSubtitle: "عرض وإدارة حسابات الشركات",
    detailTitle: "ملف الشركة",
    contactDetails: "بيانات التواصل",
    noDocs: "لا توجد مستندات بعد",
    reasonLabel: "سبب التعليق",
    reviewAction: "مراجعة",
    statusControlSub: "تغيير حالة الحساب",
    statusControlTitle: "التحكم في الحساب",
    tabDocs: "المستندات",
    tabGovernance: "الحوكمة",
    tabProfile: "الملف",
    teamMembers: "أعضاء الفريق"
  },
  notifications: {
    title: "مركز التنبيهات",
    subtitle: "إدارة الإشعارات وإرسالها للعملاء",
    tabRadar: "رادار المستندات"
  },
  requests: {
    title: "طلبات الخدمات",
    subtitle: "مراجعة طلبات العملاء وإدارتها",
    desc: "مراجعة طلبات العملاء، تحديث الحالات، وإنشاء عروض الأسعار",
    loading: "جاري تحميل الطلبات...",
    empty: "لا توجد طلبات حالياً",
    refresh: "تحديث",
    viewDetails: "عرض التفاصيل",
    colTracking: "رقم التتبع",
    colCompany: "الشركة",
    colService: "الخدمة",
    colStatus: "الحالة",
    colPriority: "الأولوية",
    colActions: "الإجراءات",
    detail: {
      title: "الطلب: {trackingNumber}",
      loading: "جاري التحميل...",
      notFound: "لم يتم العثور على الطلب",
      returnToQueue: "العودة إلى القائمة",
      backToQueue: "رجوع للقائمة",
      generalInfo: "معلومات عامة",
      description: "الوصف:",
      servicesTitle: "الخدمات المطلوبة ومحرك التسعير",
      origin: "نقطة الانطلاق",
      destination: "وجهة الوصول",
      weight: "الوزن",
      volume: "الحجم",
      suggestedPrice: "السعر المقترح",
      matchedRule: "قاعدة التسعير:",
      manualPricing: "يتطلب تسعيراً يدوياً",
      clientInfo: "معلومات العميل",
      companyName: "اسم الشركة",
      email: "البريد الإلكتروني",
      readyToQuote: "جاهز لإرسال عرض السعر؟",
      readyToQuoteDesc: "يمكنك مراجعة الأسعار المقترحة وإنشاء عرض سعر رسمي في الخطوة التالية.",
      generateQuote: "إنشاء عرض سعر",
      serviceLabel: "خدمة"
    }
  },
  review: {
    pageSubtitle: "مراجعة وقبول أو رفض المستندات المرفوعة من العملاء",
    colDocTitle: "المستند",
    colUploadDate: "تاريخ الرفع",
    colUploadedBy: "رُفع بواسطة",
    queueClear: "قائمة المراجعة فارغة",
    queueClearSub: "جميع المستندات تمت مراجعتها",
    queueHeading: "قائمة انتظار المراجعة",
    reviewBtnAction: "مراجعة"
  },
  settings: {
    title: "إعدادات النظام",
    subtitle: "إدارة فئات الخدمات وقواعد التسعير",
    colType: "النوع"
  },
  staff: {
    title: "فريق العمل والصلاحيات",
    subtitle: "إدارة أعضاء الفريق وصلاحياتهم"
  }
};

const enAdminAdditions = {
  dashboard: {
    title: "Operations & Expiry Analytics",
    subtitle: "Live document verification queue, upcoming expirations & customer stats"
  },
  customerTable: {
    title: "Customer Accounts",
    client: "Client"
  },
  customers: {
    pageTitle: "Customer Management",
    pageSubtitle: "View and manage company accounts",
    detailTitle: "Company Profile",
    contactDetails: "Contact Details",
    noDocs: "No documents yet",
    reasonLabel: "Suspension Reason",
    reviewAction: "Review",
    statusControlSub: "Change account status",
    statusControlTitle: "Account Control",
    tabDocs: "Documents",
    tabGovernance: "Governance",
    tabProfile: "Profile",
    teamMembers: "Team Members"
  },
  notifications: {
    title: "Notification Center",
    subtitle: "Manage and send notifications to customers",
    tabRadar: "Document Radar"
  },
  requests: {
    title: "Service Requests",
    subtitle: "Review and manage customer service requests",
    desc: "Review client requests, update statuses, and generate quotes",
    loading: "Loading requests...",
    empty: "No requests at the moment",
    refresh: "Refresh",
    viewDetails: "View Details",
    colTracking: "Tracking #",
    colCompany: "Company",
    colService: "Service",
    colStatus: "Status",
    colPriority: "Priority",
    colActions: "Actions",
    detail: {
      title: "Request: {trackingNumber}",
      loading: "Loading details...",
      notFound: "Request Not Found",
      returnToQueue: "Return to Queue",
      backToQueue: "Back to Queue",
      generalInfo: "General Information",
      description: "Description:",
      servicesTitle: "Requested Services & Pricing Engine",
      origin: "Origin",
      destination: "Destination",
      weight: "Weight",
      volume: "Volume",
      suggestedPrice: "Suggested Base Price",
      matchedRule: "Matched Rule:",
      manualPricing: "Manual Pricing Required",
      clientInfo: "Client Information",
      companyName: "Company Name",
      email: "Email",
      readyToQuote: "Ready to Quote?",
      readyToQuoteDesc: "You can review these suggested prices and generate an official quote in the next step.",
      generateQuote: "Generate Quote",
      serviceLabel: "Service"
    }
  },
  review: {
    pageSubtitle: "Review, approve or reject documents submitted by customers",
    colDocTitle: "Document",
    colUploadDate: "Upload Date",
    colUploadedBy: "Uploaded By",
    queueClear: "Review Queue is Clear",
    queueClearSub: "All documents have been reviewed",
    queueHeading: "Review Queue",
    reviewBtnAction: "Review"
  },
  settings: {
    title: "System Settings",
    subtitle: "Manage service categories and pricing rules",
    colType: "Type"
  },
  staff: {
    title: "Staff & Permissions",
    subtitle: "Manage team members and their access levels"
  }
};

// Update AR
const ar = JSON.parse(fs.readFileSync('messages/ar.json', 'utf8'));
ar.admin = arAdminAdditions;
fs.writeFileSync('messages/ar.json', JSON.stringify(ar, null, 2), 'utf8');
console.log('Updated ar.json admin section');

// Update EN
const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
en.admin = enAdminAdditions;
fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2), 'utf8');
console.log('Updated en.json admin section');
