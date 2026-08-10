# DailyFlow — Daily Speaking Order

نسخه حرفه‌ای برنامه ترتیب صحبت تیم با زمان‌سنج و خلاصه زمان.

## امکانات
- UI شبیه اپلیکیشن موبایل
- Dark Mode با ذخیره انتخاب کاربر
- انیمیشن قرعه‌کشی و نمایش نام‌های در حال چرخش
- ترتیب تصادفی با امکان جلوگیری از تکرار نفر اول
- **زمان‌سنج زنده** برای نفر در حال صحبت
- نمایش **نفر بعدی** هنگام صحبت نفر فعلی
- امکان **رد کردن (Skip)** نفر
- ثبت زمان صحبت هر نفر
- **Progress Bar رنگی** برای هر نفر در پایان جلسه (نسبت به مجموع زمان)
- تاریخچه ۱۲ قرعه‌کشی اخیر (با فلش صحیح RTL)
- ذخیره اطلاعات در LocalStorage
- PWA / قابلیت نصب روی موبایل
- آماده Deploy روی GitHub Pages

## اجرای محلی
`index.html` را باز کنید. برای PWA و Service Worker بهتر است از یک وب‌سرور ساده استفاده شود:

```bash
npx serve .
# یا
python -m http.server 8080
```

## Deploy روی GitHub Pages
1. یک repository جدید در GitHub بسازید.
2. همه فایل‌های پروژه را در repository قرار دهید.
3. branch اصلی را `main` قرار دهید و push کنید.
4. Workflow داخل `.github/workflows/deploy.yml` به‌صورت خودکار سایت را Deploy می‌کند.
5. در Settings → Pages، Source را روی GitHub Actions قرار دهید (در صورت نیاز).

بعد از Deploy آدرس سایت معمولاً به شکل زیر خواهد بود:
`https://USERNAME.github.io/REPOSITORY/`
