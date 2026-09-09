# دليل النشر على Cloudflare Pages لمشروع Next.js

بما أن المشروع الخاص بك مبني باستخدام **Next.js (App Router)** ويحتوي على قواعد بيانات **MongoDB (Mongoose)** واتصالات بالخادم (API Routes)، فإن رفعه على Cloudflare يتطلب بعض الخطوات الخاصة، لأن Cloudflare Pages تعمل ببيئة **Edge Runtime** وليس ببيئة Node.js التقليدية.

إليك الدليل الشامل لكيفية رفع المشروع بنجاح:

---

## 1. المتطلبات الأساسية قبل الرفع

لأنك تستخدم `mongoose` للاتصال بقاعدة بيانات MongoDB، يجب أن تعلم أن Mongoose يستخدم مكتبات Node.js الأساسية (مثل `net` و `tls`) والتي **لا تدعمها بيئة Cloudflare Edge بشكل كامل** بشكل افتراضي. 

> [!WARNING]
> إذا واجهت خطأ يتعلق بـ `net` أو `tls` أثناء الرفع، ستحتاج إما إلى تفعيل التوافق مع Node.js أو استخدام **MongoDB Atlas Data API** (الذي يعتمد على HTTP بدلاً من TCP) للاتصال بقاعدة البيانات من داخل Cloudflare.

### تجهيز المشروع
قم بتثبيت حزمة التوافق الخاصة بـ Cloudflare لمشاريع Next.js:
```bash
npm install -D @cloudflare/next-on-pages
```

ثم افتح ملف `package.json` وقم بتعديل أمر البناء (build):
```json
"scripts": {
  "dev": "next dev",
  "build": "npx @cloudflare/next-on-pages",
  "start": "next start"
}
```

---

## 2. إعدادات Cloudflare Pages عبر موقع Cloudflare

1. قم بتسجيل الدخول إلى حسابك في [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. من القائمة الجانبية، اختر **Workers & Pages**.
3. اضغط على زر **Create Application** ثم اختر تبويب **Pages**.
4. اختر **Connect to Git** وقم بربط حساب GitHub الخاص بك.
5. اختر المستودع الخاص بالمشروع `nile_link_website`.
6. اضغط على **Begin setup**.

---

## 3. إعدادات البناء (Build Settings) في Cloudflare

في شاشة الإعدادات الخاصة بالبناء، قم بضبط الإعدادات التالية بدقة:

- **Framework preset**: اختر `Next.js`
- **Build command**: `npx @cloudflare/next-on-pages`
- **Build output directory**: `.vercel/output/static`

> **تنبيه:** الدليل الناتج عن حزمة `next-on-pages` يكون دائماً داخل مجلد `.vercel/output/static` حتى وإن كنا لا نستخدم Vercel.

### متغيرات البيئة (Environment Variables)
قم بإضافة جميع متغيرات البيئة الموجودة في ملف `.env` الخاص بك (مثل `MONGODB_URI` وأي مفاتيح سرية أخرى).

### تفعيل توافق Node.js (خطوة هامة جداً)
في نفس الصفحة، قم بالتمرير لأسفل واضغط على **Environment variables (advanced)**:
1. قم بإضافة متغير بيئة جديد باسم: `NODE_VERSION` وقيمته `20` أو `18`.
2. بعد إتمام إنشاء المشروع، ستحتاج للذهاب إلى إعدادات المشروع (Settings) > Functions > Compatibility flags.
3. قم بإضافة `nodejs_compat` لتفعيل التوافق مع مكتبات Node.js الأساسية المطلوبة لـ Mongoose.

---

## 4. بدء الرفع (Deployment)

اضغط على **Save and Deploy**.
سيقوم Cloudflare بسحب الكود من GitHub وبدء عملية البناء. قد تستغرق العملية بضع دقائق.

---

## 5. ماذا تفعل إذا فشل الرفع بسبب Mongoose؟

بيئة Cloudflare Workers/Pages مبنية على محرك V8 (مثل المتصفح) وليس Node.js. في حال فشل اتصال `mongoose` بـ MongoDB رغم تفعيل `nodejs_compat`:

### الحل الأمثل (Vercel):
إذا كان المشروع يعتمد بشكل كثيف على Mongoose والعمليات المعقدة في الـ APIs، فإن **Vercel** هو المنصة الأمثل والمدعومة رسمياً بنسبة 100% لمشاريع Next.js. الرفع على Vercel لا يحتاج لأي تعديلات برمجية.

### حل بديل لـ Cloudflare (MongoDB Atlas Data API):
إذا كنت مصراً على استخدام Cloudflare، يجب عليك التبديل من `mongoose` إلى استخدام `MongoDB Atlas Data API` وهو عبارة عن خدمة تقدمها MongoDB للاتصال بقاعدة البيانات عن طريق استدعاءات HTTP (Fetch) وهي مدعومة بشكل كامل وممتاز على Cloudflare.

---

## 6. نصائح إضافية لنجاح الرفع

1. **الصور والمرفقات (Storage)**: إذا كان نظامك يسمح للمستخدمين برفع صور أو ملفات، تأكد من أنك تستخدم خدمة تخزين خارجية مثل AWS S3 أو Cloudflare R2، لأن Cloudflare Pages لا تدعم تخزين الملفات محلياً.
2. **استخدام Edge Runtime**: يمكنك تحديد الـ APIs الخاصة بك لتعمل على بيئة Edge من خلال إضافة السطر التالي أعلى ملفات الـ `route.ts`:
```typescript
export const runtime = 'edge';
```
