"use client"

import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import {
  Ship,
  FileCheck2,
  Receipt,
  Warehouse,
  Truck,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Layers,
  BellRing,
} from "lucide-react"
import { Link } from "@/navigation"
import { Button } from "@/components/ui/Button"

export interface LogisticsModuleInfo {
  slug: string
  icon: any
  nameEn: string
  nameAr: string
  taglineEn: string
  taglineAr: string
  descriptionEn: string
  descriptionAr: string
  expectedQuarter: string
  featuresEn: string[]
  featuresAr: string[]
  industryContextEn: string
  industryContextAr: string
}

export const LOGISTICS_MODULES: Record<string, LogisticsModuleInfo> = {
  shipments: {
    slug: "shipments",
    icon: Ship,
    nameEn: "Shipment Operations & B/L Tracking",
    nameAr: "عمليات الشحن وتتبع بوالص الشحن (B/L)",
    taglineEn: "End-to-end multi-modal container tracking across sea, air, and land freight",
    taglineAr: "تتبع متكامل للشحنات متعددة الوسائط بحراً وجواً وبراً من الميناء وحتى الوصول",
    descriptionEn:
      "Enterprise freight forwarding hub managing Master & House Bills of Lading, container milestone tracking via AIS satellite telemetry, shipping line EDI integrations, and automated client status webhooks.",
    descriptionAr:
      "منظومة متكاملة لإدارة شحنات التصدير والاستيراد، بوالص الشحن الرئيسية والفرعية، التتبع اللحظي بالأقمار الصناعية للحاويات وسفن الشحن، والتنبيهات الآلية لخطوط الملاحة.",
    expectedQuarter: "Q4 2026",
    featuresEn: [
      "Live AIS Vessel & Container Satellite Tracking",
      "Master & House Bill of Lading (MBL/HBL) Digital Generator",
      "Automated ETA & Milestones Exception Alerts",
      "Multi-Modal Freight Splitting (FCL, LCL, Air Cargo)",
      "Shipping Line EDI & Port Terminal Integrations",
    ],
    featuresAr: [
      "تتبع لحظي للسفن والحاويات عبر الأقمار الصناعية (AIS)",
      "إصدار وتوليد بوالص الشحن الرقمية المعتمدة (MBL / HBL)",
      "تنبيهات فورية عند تغير مواعيد الوصول المقدرة (ETA)",
      "إدارة الشحن الكلي والجزئي والجوي (FCL / LCL / Air)",
      "الربط الإلكتروني المباشر مع التوكيلات الملاحية ومحطات الحاويات",
    ],
    industryContextEn:
      "Essential for global freight forwarders coordinating multi-leg journeys and keeping consignees notified of customs staging.",
    industryContextAr:
      "ركيزة أساسية لشركات الشحن الدولي لتنظيم خطوط الإبحار وإعلام المستوردين بمواعيد الإفراج.",
  },
  customs: {
    slug: "customs",
    icon: FileCheck2,
    nameEn: "Customs Declarations & ACID Nafeza",
    nameAr: "الإقرارات الجمركية ونظام نافذة ACID",
    taglineEn: "Seamless Egyptian Nafeza MTS pre-registration & customs clearance workflows",
    taglineAr: "أتمتة منظومة التسجيل المسبق للشحنات (ACID) والتخليص الجمركي عبر نافذة MTS",
    descriptionEn:
      "Automated Egyptian Customs Nafeza platform integration for ACID registration, 46-K digital declarations, harmonized tariff code (HS Code) lookup, and phytosanitary certificate inspections.",
    descriptionAr:
      "إدارة طلبات إصدار الرقم التعريفي المسبق للشحنات (ACID)، تدقيق مستندات الإفراج الجمركي 46-ك، فهارس بنود التعريفة الجمركية المتكاملة، ومتابعة لجان الفحص والرقابة.",
    expectedQuarter: "Q4 2026",
    featuresEn: [
      "Direct MTS Nafeza ACID Number Issuance & Validation",
      "Customs 46-K Digital Declaration Filing",
      "Harmonized HS Code Automated Duty & Tariff Calculator",
      "GOEIC & Phytosanitary Inspection Scheduling",
      "Customs Duty & VAT Pre-Assessment Summaries",
    ],
    featuresAr: [
      "إصدار والتحقق التلقائي من أرقام التسجيل المسبق للشحنات (ACID)",
      "إنشاء وإرسال الإقرارات الجمركية الرقمية (استمارة 46-ك)",
      "حاسبة الرسوم الجمركية والضرائب لجميع بنود التعريفة (HS Codes)",
      "جدولة لجان الفحص المشترك وهيئة الرقابة على الصادرات والواردات",
      "إشعارات تسوية الضرائب والرسوم الجمركية المسبقة",
    ],
    industryContextEn:
      "Required for Egypt and Free Zone trade compliance to avoid shipment rejections at port gates.",
    industryContextAr:
      "حجر الزاوية للمستوردين والمصدرين في مصر لتفادي غرامات الشحن وتأخيرات الإفراج بالموانئ.",
  },
  financials: {
    slug: "financials",
    icon: Receipt,
    nameEn: "Demurrage, Tariffs & Multi-Currency Invoicing",
    nameAr: "حساب غرامات الأرضيات والرسوم والفوترة",
    taglineEn: "Automated detention & demurrage calculators with multi-currency billing",
    taglineAr: "احتساب دقيق لغرامات التأخير والأرضيات وحسابات خطوط الملاحة بعدة عملات",
    descriptionEn:
      "Eliminate costly shipping line detention penalties with automated free-day countdowns, port storage tiered fee calculators, and multi-currency commercial invoicing in USD, EUR, and EGP.",
    descriptionAr:
      "نظام مالي ذكي لاحتساب الفترات المجانية وساعات السماح، احتساب غرامات الأرضيات والتأخير للخطوط الملاحية، وإصدار الفواتير اللوجستية بالدولار واليورو والجنيه المصري.",
    expectedQuarter: "Q1 2027",
    featuresEn: [
      "Automated Shipping Line Free-Day Countdown & Penalty Estimator",
      "Port Terminal Storage Tiered Cost Matrix (Alexandria, Damietta, Sokhna)",
      "Multi-Currency Automated Invoicing (USD, EUR, EGP, SAR)",
      "Credit Term Tracking & Client Payment Gateways",
      "Profitability & Landed Cost Breakdown per Container",
    ],
    featuresAr: [
      "عداد تنازلي ذكي للأيام المجانية وتنبيهات غرامات الخطوط الملاحية",
      "مصفوفة تسعير رسوم التخزين لموانئ الإسكندرية ودمياط والسخنة وبورسعيد",
      "إصدار الفواتير الآلية بالعملات المتعددة (USD, EUR, EGP, SAR)",
      "إدارة الحدود الائتمانية والدفع الإلكتروني للشركات",
      "تقرير التكلفة الإجمالية وهامش الربحية لكل حاوية مشحونة",
    ],
    industryContextEn:
      "Protects freight operators and shippers from unexpected port demurrage surcharges.",
    industryContextAr:
      "يحمي الشركات من الغرامات الباهظة الناتجة عن تأخر فك الحاويات في الموانئ.",
  },
  warehouses: {
    slug: "warehouses",
    icon: Warehouse,
    nameEn: "Bonded Warehousing & Yard Staging",
    nameAr: "إدارة المستودعات الجمركية وساحات التخزين",
    taglineEn: "Smart bonded warehouse management, barcode inventory, and cold chain tracking",
    taglineAr: "إدارة المستودعات العامة والجمركية، تتبع الشحنات بالباركود، وسلاسل التبريد",
    descriptionEn:
      "Digital warehouse management system (WMS) for bonded staging zones, automated bay/rack allocation, cargo cross-docking, temperature logging for perishable cargo, and gate-out release passes.",
    descriptionAr:
      "إدارة متقدمة للساحات الجمركية والمستودعات العامة، تحديد مواقع التخزين، النقل المباشر بين الحاويات (Cross-Docking)، مراقبة درجات حرارة الحاويات المبردة، وتصاريح الخروج.",
    expectedQuarter: "Q1 2027",
    featuresEn: [
      "Bonded Zone In-Bond / Out-of-Bond Legal Status Tracking",
      "RFID & Barcode Cargo Location Bin Staging",
      "Cold-Chain Telemetry & Temperature Sensor Alerts",
      "Automated Cargo Tally Sheet & Discrepancy Reporting",
      "Digital Warehouse Delivery Orders (DO)",
    ],
    featuresAr: [
      "متابعة الوضع القانوني للبضائع تحت التحفظ الجمركي والإفراج",
      "تحديد وتتبع مواقع البضائع بالباركود والموجات اللاسلكية (RFID)",
      "مراقبة درجات الحرارة والرطوبة للحاويات المبردة للحاصلات الزراعية",
      "إصدار دفاتر الجرد وكشوف المطابقة التفصيلية للحاويات",
      "إصدار أذون تسليم البضائع الرقمية (Delivery Orders)",
    ],
    industryContextEn:
      "Crucial for transit hubs and refrigerated agro-commodity export operations.",
    industryContextAr:
      "أساسي للمراكز اللوجستية ومصدري الخضروات والفواكه والمواد الغذائية سريعة التلف.",
  },
  fleet: {
    slug: "fleet",
    icon: Truck,
    nameEn: "Fleet Dispatch & GPS Trucking Operations",
    nameAr: "أسطول النقل البري والتتبع اللحظي (GPS)",
    taglineEn: "Real-time heavy truck dispatch, driver routes, and port gate appointment passes",
    taglineAr: "إدارة أسطول النقل الثقيل، حجز مواعيد بوابات الموانئ، والتتبع المباشر للشاحنات",
    descriptionEn:
      "Comprehensive trucking operations system managing heavy container trailer fleets, driver electronic logs, port gate pass scheduling, GPS geofencing, and automated fuel efficiency analytics.",
    descriptionAr:
      "نظام تشغيل وإدارة شاحنات النقل الثقيل والمقطورات، جدولة مواعيد دخول الموانئ والمستودعات، التتبع الجغرافي الحي، ومراقبة استهلاك الوقود وكفاءة السائقين.",
    expectedQuarter: "Q2 2027",
    featuresEn: [
      "Real-Time GPS Trailer Location & Geofencing Alerts",
      "Port Terminal Gate Pass Scheduling & Driver Electronic Job Cards",
      "Automated Truck Load Optimization (20ft, 40ft, Flatbed, Lowbed)",
      "Fuel Consumption & Maintenance Preventive Schedules",
      "Consignee Proof of Delivery (e-POD) Sign-off via Mobile",
    ],
    featuresAr: [
      "تتبع جغرافي لحظي لمسارات الشاحنات مع سياج أمني افتراضي (Geofence)",
      "حجز مواعيد دخول بوابات الموانئ وبطاقات المهام الإلكترونية للسائقين",
      "تحسين حمولة الشاحنات وتوزيع الحاويات (20 قدم، 40 قدم، لوابد)",
      "مراقبة استهلاك الوقود وجداول الصيانة الدورية للأسطول",
      "إثبات التسليم الإلكتروني الذكي (e-POD) مع توقيع العميل الرقمي",
    ],
    industryContextEn:
      "Bridges inland logistics between Egyptian seaports, dry ports, and industrial zones.",
    industryContextAr:
      "يربط بين الموانئ البحرية والموانئ الجافة والمناطق الصناعية في كافة المحافظات.",
  },
  quotes: {
    slug: "quotes",
    icon: FileSpreadsheet,
    nameEn: "CRM, Rate Engine & Freight Quotations",
    nameAr: "إدارة علاقات العملاء والتسعير الآلي للشحن",
    taglineEn: "Instant freight tariff calculator, RFQ pipeline, and automated contracts",
    taglineAr: "حاسبة أسعار الشحن الفورية، إدارة طلبات عروض الأسعار (RFQ)، والعقود الآلية",
    descriptionEn:
      "Enterprise sales and freight procurement CRM managing customer RFQs, ocean/air freight carrier rate cards, spot rate surcharges, margin calculations, and 1-click customer quote dispatch.",
    descriptionAr:
      "نظام تجاري متكامل لإدارة عروض الأسعار اللوجستية، استيراد أسعار الخطوط الملاحية والجوية، احتساب هوامش الربح والرسوم الإضافية، وإرسال عروض الأسعار للعملاء بنقرة واحدة.",
    expectedQuarter: "Q2 2027",
    featuresEn: [
      "Dynamic Ocean & Air Freight Rate Tariff Engine",
      "Customer RFQ Pipeline & Automated Quotation Generator",
      "Shipping Line Spot Surcharges (BAF, CAF, PSS, IMO) Auto-Calculator",
      "Electronic Contract Signing & Customer Tier Discounts",
      "Sales Agent Commission & Lead Conversion Analytics",
    ],
    featuresAr: [
      "محرك تسعير ذكي لأسعار الشحن البحري والجوي والبري",
      "إدارة ومتابعة طلبات عروض الأسعار (RFQs) والتوليد الآلي للعروض",
      "احتساب رسوم الوقود ومواسم الذروة (BAF, CAF, PSS, IMO)",
      "التوقيع الإلكتروني على عقود الشحن السنوية وتخفيضات كبار العملاء",
      "تحليلات تحويل الصفقات ومؤشرات أداء مسؤولي المبيعات اللوجستية",
    ],
    industryContextEn:
      "Empowers commercial freight teams to quote competitively in volatile shipping markets.",
    industryContextAr:
      "يمكّن الفرق التجارية من تقديم عروض أسعار سريعة وتنافسية في سوق الشحن الدولي.",
  },
}

interface ModuleComingSoonViewProps {
  moduleSlug: string
}

export function ModuleComingSoonView({ moduleSlug }: ModuleComingSoonViewProps) {
  const t = useTranslations()
  const locale = useLocale()
  const isAr = locale === "ar"

  const moduleData = LOGISTICS_MODULES[moduleSlug] || LOGISTICS_MODULES.shipments
  const IconComponent = moduleData.icon

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb / Back Link */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:underline dark:text-primary-400"
        >
          {isAr ? <ArrowRight className="h-3.5 w-3.5" /> : <ArrowLeft className="h-3.5 w-3.5" />}
          <span>{isAr ? "العودة إلى لوحة القيادة الرئيسية" : "Back to Executive Dashboard"}</span>
        </Link>
      </div>

      {/* Hero Showcase Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-secondary-200 bg-gradient-to-br from-white via-secondary-50 to-primary-50/40 p-8 shadow-xl dark:border-secondary-800 dark:from-secondary-900 dark:via-secondary-950 dark:to-primary-950/20"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/20">
              <IconComponent className="h-8 w-8" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-secondary-900 dark:text-white">
                  {isAr ? moduleData.nameAr : moduleData.nameEn}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500/20 to-primary-500/20 px-3 py-1 text-xs font-bold text-purple-700 dark:text-purple-300 border border-purple-500/30">
                  <Sparkles className="h-3 w-3" />
                  <span>{isAr ? "قيد التطوير - قريباً" : "In Active Development — Coming Soon"}</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary-100 px-2.5 py-0.5 text-[11px] font-semibold text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300">
                  <Clock className="h-3 w-3" />
                  <span>{moduleData.expectedQuarter}</span>
                </span>
              </div>

              <p className="mt-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
                {isAr ? moduleData.taglineAr : moduleData.taglineEn}
              </p>

              <p className="mt-3 text-xs leading-relaxed text-secondary-600 dark:text-secondary-300 max-w-2xl">
                {isAr ? moduleData.descriptionAr : moduleData.descriptionEn}
              </p>
            </div>
          </div>
        </div>

        {/* Planned Features List */}
        <div className="mt-8 border-t border-secondary-200/80 pt-6 dark:border-secondary-800">
          <h3 className="text-xs font-bold text-secondary-900 uppercase tracking-wider dark:text-white">
            {isAr ? "القدرات والوظائف المخطط إطلاقها في هذا الموديول" : "Planned Enterprise Capabilities"}
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(isAr ? moduleData.featuresAr : moduleData.featuresEn).map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-xl border border-secondary-200/70 bg-white/70 p-3.5 shadow-sm dark:border-secondary-800 dark:bg-secondary-900/60"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                <span className="text-xs font-bold text-secondary-800 dark:text-secondary-200">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Context Note */}
        <div className="mt-6 rounded-2xl border border-primary-500/20 bg-primary-50/50 p-4 dark:border-primary-800/40 dark:bg-primary-950/20">
          <div className="flex items-start gap-3">
            <Layers className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-primary-900 dark:text-primary-200">
                {isAr ? "الأهمية التشغيلية في قطاع الشحن واللوجستيات" : "Logistics Industry Significance"}
              </h4>
              <p className="mt-0.5 text-xs text-primary-700 dark:text-primary-300">
                {isAr ? moduleData.industryContextAr : moduleData.industryContextEn}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
