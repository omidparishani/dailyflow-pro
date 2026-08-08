# DailyFlow — Daily Speaking Order

نسخه حرفه‌ای‌تر برنامه ترتیب صحبت تیم.

## امکانات
- UI شبیه اپلیکیشن
- Dark Mode با ذخیره انتخاب کاربر
- انیمیشن قرعه‌کشی و نمایش نام‌های در حال چرخش
- ترتیب تصادفی با امکان جلوگیری از تکرار نفر اول
- مشخص کردن نفر در حال صحبت و نفر بعدی
- تاریخچه ۱۲ قرعه‌کشی اخیر
- ذخیره اطلاعات در LocalStorage
- PWA / قابلیت نصب روی موبایل
- آماده Deploy روی GitHub Pages

## اجرای محلی
`index.html` را باز کنید. برای PWA و Service Worker بهتر است از یک وب‌سرور ساده استفاده شود.

## Deploy روی GitHub Pages
1. یک repository جدید در GitHub بسازید.
2. همه فایل‌های پروژه را در repository قرار دهید.
3. branch اصلی را `main` قرار دهید و push کنید.
4. Workflow داخل `.github/workflows/deploy.yml` به‌صورت خودکار سایت را Deploy می‌کند.
5. در Settings → Pages، Source را روی GitHub Actions قرار دهید (در صورت نیاز).

بعد از Deploy آدرس سایت معمولاً به شکل:
`https://USERNAME.github.io/REPOSITORY/`
خواهد بود.
