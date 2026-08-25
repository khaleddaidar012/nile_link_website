1. Authentication & Access Architecture

تحديد نظام تسجيل الدخول والتسجيل والصلاحيات والـ session/token architecture، بأسلوب قريب من CMA-CGM / MSC.

2. Professional Login & Registration Entry

إضافة أزرار Login / Sign Up للموقع التعريفي بشكل احترافي ومتناسق مع الـ branding الحالي، بدون التأثير على صفحات الموقع الموجودة.

3. Login Page

إنشاء صفحة تسجيل دخول احترافية للعميل تشمل Email/Username، Password، Remember Me، Forgot Password، وإظهار/إخفاء كلمة المرور.

4. Registration / Sign Up Page

إنشاء صفحة تسجيل حساب جديد للعميل مع بيانات الحساب والشركة ووسائل التواصل والتحقق من البيانات.

5. Password Recovery & Account Verification

نظام Forgot Password، Reset Password، Email Verification، وإدارة حالات الحساب.

6. Authentication Backend

إنشاء Backend كامل للـ authentication، وتشفير كلمات المرور، Sessions/Tokens، Refresh Tokens، Logout، وحماية الـ APIs.

7. User & Customer Management

إنشاء نظام إدارة المستخدمين والعملاء وربط كل User بالـ Customer/Company الخاصة به.

8. Roles & Permissions

إنشاء نظام صلاحيات قابل للتوسع مثل:

Customer
Customer Admin
Staff
Super Admin
9. Customer Portal Layout

إنشاء الـ Layout الأساسي للـ Client Portal: Sidebar/Navbar، Header، Profile، Notifications، Responsive Mobile UI.

10. Customer Dashboard

صفحة Dashboard للعميل تعرض أهم المعلومات والإحصائيات والطلبات والحالة المالية والإشعارات.

11. Customer Profile & Company Profile

صفحات بيانات العميل والشركة، تعديل البيانات، بيانات التواصل، وإدارة الحساب.

12. Customer Requests / Orders

نظام إنشاء ومتابعة الطلبات الخاصة بالعميل مع حالات الطلب وTimeline للتحديثات.

13. Documents Management

صفحة مستندات العميل لعرض ورفع وتنزيل الملفات وربطها بالطلبات والمعاملات.

14. Financial / Payments

صفحة الحسابات والمدفوعات والفواتير والمعاملات المالية الخاصة بالعميل.

15. Notifications & Communication

نظام Notifications داخل المنصة مع إمكانية ربطه لاحقًا Email/SMS/WhatsApp.

16. Admin Portal

لوحة تحكم داخلية للموظفين لإدارة العملاء والمستخدمين والطلبات والمستندات والمدفوعات.

17. Customer ↔ Admin Workflow

ربط الـ Client Portal بالـ Admin Portal بحيث أي طلب أو تحديث أو مستند أو معاملة تظهر للطرف المناسب تلقائيًا.

18. Security & Access Protection

حماية Routes وAPIs، Authorization، Rate Limiting، Validation، Secure Cookies/Tokens، ومنع الوصول غير المصرح به.

19. Responsive & Mobile Experience

تحويل الـ Client Portal بالكامل إلى تجربة Mobile احترافية قريبة من تطبيق Android، مع الحفاظ على Desktop.

20. Localization & Language System

دعم Arabic / English للـ Login والـ Portal والـ Dashboard وكل الصفحات الجديدة.

21. UX/UI Polish & Design System

توحيد الألوان، Typography، Buttons، Forms، Cards، Tables، Modals، Loading States، Empty States، Error States والـ Animations.

22. Integration & API Layer

تجهيز وربط كل صفحات الـ Portal بالـ Backend APIs بشكل منظم وقابل للتوسع.

23. Testing & Authentication Security Audit

اختبار Login/Register/Logout/Reset Password/Roles/Protected Routes وجميع الـ Customer workflows.

24. Production Readiness & Deployment

Environment Variables، Database، Security Configuration، Build، Deployment، Error Logging، Backup، وأخيرًا Production Testing.

والترتيب المنطقي للتنفيذ:
الموقع التعريفي → Login/Sign Up → Authentication → Customer Portal → Customer Features → Admin Portal → Integration → Security → Mobile → Testing → Production.

ولو هتديه للـAI عشان يحول كل عنوان إلى .md منفصل، خليه يعتبر كل عنوان من دول Epic مستقل، وكل Epic يتحول إلى مجموعة Tasks صغيرة قابلة للتنفيذ والاختبار، مع شرط مهم: عدم إعادة بناء أو كسر أي جزء موجود في الموقع التعريفي إلا المطلوب لإضافة الـ Authentication Entry.

وعاوز العميل لازم يرفع الملفات بتاعته وفيه لودر احترافيه كدا بيحمل وهو بيرفع وبيدعم ل 20 مستند 
العميل بيقدر يتابع حالة ا لمستندات دي من جوا عنه في الاكونت 
في اكونتات موظفين هستبق المستند دا وتكتبة في اكونت العميل اسمه وبتاريخ البد وتاريخ الانتهاء و وحالة المستند وفي الاخر حالة العميل نشط ولا لاء 
لو مستند قريب ينتهي بيطلع للموظف تحذر و تحذير للعميل وبقدر بضغطه زرار ابعته ايميل وممكن واتس بتحدذير انتهاء المستند قبل 10 ايام والتحديث يفضل يشتد او لونه يبقي اشد فاهم 

فاهمك جدًا. كده الموضوع مش مجرد Client Portal؛ إحنا بنبني Document Management + Expiry Tracking + Employee Review Workflow.

وأنا شايف نضيف العناوين دي للخطة، والأفضل تتعمل كـ Modules مستقلة عشان الـAI يحول كل واحدة لملف .md فيه Tasks صغيرة:

25. Customer Document Upload System

العميل يقدر يرفع مستنداته من حسابه، مع دعم حتى 20 مستند للحساب/العملية حسب الـbusiness rule.

26. Professional Multi-File Upload UX

واجهة رفع احترافية تدعم:

Drag & Drop
اختيار أكثر من ملف
Progress لكل ملف
Progress إجمالي
Loader/Animation احترافي
Upload Success / Failed
Retry للملف الفاشل
منع الملفات غير المسموح بها
إظهار عدد الملفات 12 / 20
27. Document Validation & Storage

التحقق من:

نوع الملف
حجم الملف
عدد الملفات
اسم الملف
Duplicate documents
Secure file storage
ربط كل مستند بالعميل الصحيح.
28. Customer Documents Dashboard

العميل يشوف كل مستنداته داخل حسابه في جدول/Card واضح:

المستند	تاريخ البدء	تاريخ الانتهاء	الحالة
Commercial Register	01/01/2026	01/01/2027	Active
Tax Card	10/02/2026	10/02/2027	Expiring Soon
License	01/03/2025	01/03/2026	Expired
29. Employee Document Review System

إنشاء حسابات الموظفين بحيث الموظف يقدر يشوف المستندات المرفوعة ويراجعها ويحدد حالتها.

30. Document Status Workflow

حالات المستند تكون واضحة وقابلة للتوسع، مثل:

Pending Review → Approved → Expiring Soon → Expired → Rejected

مع إمكانية إضافة سبب الرفض وملاحظات الموظف.

31. Employee Document Verification

الموظف يراجع المستند ويقدر يسجل:

اسم المستند
اسم العميل
تاريخ البداية
تاريخ الانتهاء
حالة المستند
ملاحظات
تاريخ المراجعة
الموظف الذي قام بالمراجعة.
32. Customer Account Status Engine

النظام يحسب حالة العميل تلقائيًا بناءً على مستنداته:

Active / Warning / Inactive

مثلاً لو كل المستندات المطلوبة سليمة → Active.

ولو فيه مستند قرب ينتهي → Warning.

ولو مستند أساسي انتهى → Inactive حسب قواعد النظام.

33. Document Expiry Detection Engine

نظام Background/Automated Job يفحص تواريخ انتهاء المستندات بشكل دوري ويحدد:

Expired
Expires Today
Expires Within 3 Days
Expires Within 7 Days
Expires Within 10 Days
34. Employee Expiry Alerts

لو مستند قرب ينتهي، يظهر للموظف Warning داخل الـDashboard، مثل:

⚠ 8 documents will expire within 10 days

وممكن يدخل يشوف التفاصيل.

35. Customer Expiry Alerts

العميل نفسه يظهر له التحذير داخل حسابه:

⚠ Your Commercial Registration will expire in 8 days.

مع زر:

Upload New Document

36. Progressive Warning System

وده الجزء اللي أنت قصدك عليه إن التحذير يزيد تدريجيًا.

مثلاً:

🟢 أكثر من 30 يوم → Normal
🟡 10–30 يوم → Warning
🟠 3–9 أيام → Urgent
🔴 0–2 يوم → Critical
⛔ بعد الانتهاء → Expired

والـUI نفسه يتغير تدريجيًا: لون + Badge + Icon + Animation + Notification Priority.

37. Employee Notification Center

صفحة تجمع كل التنبيهات الخاصة بالموظف:

مستندات قربت تنتهي
مستندات انتهت
مستندات جديدة تحتاج مراجعة
مستندات مرفوضة
عملاء أصبحوا Inactive.
38. Customer Notification Center

نفس الفكرة للعميل لكن فقط بالمعلومات الخاصة به.

39. Email Document Expiry Notifications

إرسال Email تلقائي للعميل عند اقتراب انتهاء المستند.

والـsystem يقدر يدعم Templates مختلفة حسب درجة الخطورة.

40. Manual Employee Notification

الموظف يقدر من داخل حساب العميل يضغط:

Send Expiry Warning

ويختار:

Email
WhatsApp
Both

مع تسجيل عملية الإرسال في الـActivity Log.

41. WhatsApp Notification Integration

تجهيز Integration مع WhatsApp Business/API لإرسال تحذيرات انتهاء المستندات، مع تسجيل حالة الرسالة:

Pending → Sent → Delivered → Failed

42. Automated 10-Day Expiry Notification

قبل انتهاء المستند بـ 10 أيام يتم إرسال التنبيه تلقائيًا، مع منع إرسال نفس التنبيه بشكل متكرر بدون داعٍ.

43. Notification Escalation System

لو العميل لم يجدد المستند، التنبيهات تصبح أكثر إلحاحًا كلما اقترب تاريخ الانتهاء.

مثلاً:

10 Days: Warning
7 Days: Important
3 Days: Urgent
1 Day: Critical
Expired: Action Required

44. Document & Notification Activity Log

تسجيل كل العمليات:

العميل رفع المستند
الموظف فتح المستند
الموظف وافق عليه
الموظف رفضه
تاريخ التعديل
إرسال Email
إرسال WhatsApp
تغيير حالة المستند.
45. Employee Customer Overview

صفحة الموظف تعرض العملاء مع حالة سريعة:

Client | Documents | Expiring | Expired | Account Status

بحيث الموظف يعرف فورًا مين محتاج تدخل.

46. Expiry Dashboard & Analytics

Dashboard للموظفين تعرض:

Total Customers
Active Customers
Inactive Customers
Documents Pending Review
Documents Expiring Soon
Expired Documents
Notifications Sent.

وبكده الـCore Workflow يبقى:

CLIENT
  ↓
Login
  ↓
Upload Documents
  ↓
Professional Upload Progress
  ↓
Document Status = Pending Review
  ↓
EMPLOYEE
  ↓
Review Document
  ↓
Set Start Date + Expiry Date + Status
  ↓
APPROVED
  ↓
Expiry Monitoring Engine
  ↓
10 Days Before Expiry
  ↓
Employee Warning + Customer Warning
  ↓
Email / WhatsApp
  ↓
3 Days → Stronger Warning
  ↓
Expired
  ↓
Customer Status → Inactive