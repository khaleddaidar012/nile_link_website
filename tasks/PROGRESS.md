# NileLink — حالة المشروع الحالية
> آخر تحديث: 2026-09-06

---

## ملخص سريع

| Task | الاسم | الحالة | ملاحظة |
|------|-------|--------|--------|
| Task 01 | Domain & Database Foundation | ✅ DONE | Models موجودة |
| Task 02 | Admin Pricing Management | ✅ DONE | UI + API جاهز |
| Task 03 | Customer Request Creation | ✅ DONE | Multi-service wizard يعمل |
| Task 04 | Employee Review & Pricing Engine | ⚠️ IN_PROGRESS | UI جاهز، بيانات قديمة ناقصة |
| Task 05 | Quotes Workflow | 🔲 NOT_STARTED | التالي |
| Task 06 | Bookings / Operational Services | 🔲 NOT_STARTED | بعد Task 05 |
| Task 07 | Final Dashboard Refinements | 🔲 NOT_STARTED | في النهاية |

---

## ✅ ما تم إنجازه (هذه الجلسة وقبلها)

### Task 03 — Customer Request Creation
- [x] صفحة اختيار الخدمات (Service Cards) بزر المتابعة فوق الـ Grid
- [x] صفحة تفاصيل الطلب (Details Form) مع حقول Origin/Destination مشتركة
- [x] إزالة الحقول المكررة لكل خدمة
- [x] ترجمة كاملة AR/EN لكل العناصر
- [x] إخفاء صندوق تفاصيل "استفسار لوجستي عام" (لا يحتاج تفاصيل)
- [x] صفحة `/portal/requests` — عمود الخدمة يعرض الأسماء المعربة للخدمات المتعددة
- [x] رقم التتبع في الجدول أصبح لينك مباشر لصفحة الطلب
- [x] زر "عرض المحطات" تحول إلى لينك بدلاً من Modal
- [x] صفحة `/portal/requests/[id]` — ترجمة كاملة + قسم Timeline + زر الإنهاء والعودة

### Task 04 — Employee Review & Pricing Engine  
- [x] صفحة `/admin/requests/[id]` مترجمة بالكامل AR/EN
- [x] Sidebar Admin مترجم بالكامل
- [x] إصلاح crash عند `service.serviceKey` = undefined
- [x] إصلاح crash عند `priceMatch` = undefined
- [x] إصلاح `portal.requests.status_undefined` display
- [x] إصلاح Hydration errors للتواريخ في كل الصفحات
- [x] ترجمة خدمات الطلب باستخدام مفاتيح `portal.requests.new.*`

---

## ⚠️ مشاكل قائمة / تحتاج انتباه

### بيانات الطلبات القديمة
الطلبات المحفوظة قبل التحديث ليس فيها:
- `service.serviceKey` → يعرض "خدمة" كنص افتراضي
- `service.status` → يعرض "—"

> **الحل:** البيانات الجديدة التي يُنشئها المستخدم من خلال الـ Wizard ستحتوي على هذه الحقول.

### Hydration Warning
يظهر في بيئة التطوير فقط بسبب إضافة متصفح (Browser Extension).
لن يظهر في Production.

---

## 🔲 الخطوة التالية — Task 05: Quotes Workflow

### المطلوب لإكمال Task 05:

#### Backend APIs
- [ ] `POST /api/admin/quotes` — إنشاء Quote من Admin
- [ ] `GET /api/portal/quotes` — جلب Quotes للعميل
- [ ] `GET /api/portal/quotes/[id]` — تفاصيل Quote
- [ ] `POST /api/portal/quotes/[id]/accept` — قبول Quote
- [ ] `POST /api/portal/quotes/[id]/reject` — رفض Quote

#### Admin UI
- [ ] صفحة `/admin/requests/[id]/quote` — نموذج إنشاء Quote
  - عرض الأسعار المقترحة من Pricing Engine
  - تعديل السعر لكل خدمة
  - إضافة ملاحظات
  - زر "إرسال للعميل"
- [ ] ترجمة كاملة AR/EN

#### Customer Portal UI
- [ ] صفحة `/portal/quotes` — قائمة عروض الأسعار
- [ ] صفحة `/portal/quotes/[id]` — تفاصيل العرض مع Accept/Reject
- [ ] إشعار للعميل عند وصول Quote جديد
- [ ] ترجمة كاملة AR/EN

#### ربط مع Notifications
- [ ] إشعار للعميل عند إنشاء Quote
- [ ] إشعار للـ Admin عند قبول/رفض العميل

---

## 📋 ملفات المهام التفصيلية

| ملف | المحتوى |
|-----|---------|
| [`task_03_customer_request_creation.md`](./task_03_customer_request_creation.md) | تفاصيل إنشاء الطلب |
| [`task_04_employee_review_pricing.md`](./task_04_employee_review_pricing.md) | مراجعة الموظف والتسعير |
| [`task_05_quotes_workflow.md`](./task_05_quotes_workflow.md) | **التالي** — سير عمل عروض الأسعار |
| [`task_06_bookings_operations.md`](./task_06_bookings_operations.md) | الحجز والعمليات |
| [`task_07_dashboards_communication.md`](./task_07_dashboards_communication.md) | لوحات التحكم والتواصل |

---

## 🗂️ ملفات تم تعديلها في هذه الجلسة

```
app/[locale]/portal/requests/new/page.tsx          ← اختيار الخدمات
app/[locale]/portal/requests/new/details/page.tsx  ← نموذج التفاصيل
app/[locale]/portal/requests/page.tsx              ← قائمة الطلبات
app/[locale]/portal/requests/[id]/page.tsx         ← تفاصيل الطلب (Portal)
app/[locale]/admin/requests/[id]/page.tsx          ← تفاصيل الطلب (Admin)
app/[locale]/dashboard/components/DashboardClient.tsx
messages/ar.json                                   ← ترجمات عربية
messages/en.json                                   ← ترجمات إنجليزية
```
