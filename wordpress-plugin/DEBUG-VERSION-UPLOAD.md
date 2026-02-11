# 🔍 DEBUG VERSION - Upload & Check Logs

## 🎯 Purpose:

এই version detailed logging করবে যাতে আমরা বুঝতে পারি PDF কেন empty হচ্ছে।

---

## 📤 Upload করুন:

### File:
```
/wordpress-plugin/includes/class-qp-pdf-generator.php
```

### Location:
```
/wp-content/plugins/question-paper-pdf-generator/includes/
```

---

## 🧪 Test & Debug Steps:

### 1. Enable WordPress Debug Mode

Edit `wp-config.php`:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

### 2. Upload Updated File

Via FTP/cPanel:
```
Upload: class-qp-pdf-generator.php
Location: /wp-content/plugins/question-paper-pdf-generator/includes/
```

### 3. Test PDF Generation

```
1. Clear browser cache (Ctrl+Shift+R)
2. Open React app
3. Create question paper
4. Click "অনলাইন ডাউনলোড করুন ☁️"
```

### 4. Check Debug Logs

Location: `/wp-content/debug.log`

---

## 📊 Expected Debug Log Output:

### ✅ Success Case:

```
QPM Debug: Starting PDF generation...
QPM Debug: Filename: গণিত_6
QPM Debug: Question paper data: Array(...)
QPM Debug: PDF initialized
QPM Debug: Page added
QPM Debug: Test content added
QPM Debug: Header rendered
QPM Debug: Questions rendered, count: 3
QPM Debug: PDF file size: 15234 bytes
QPM Success: PDF created at: /path/to/file.pdf (15234 bytes)
QPM Debug: PDF saved successfully
```

### ❌ Error Cases:

#### Case 1: Empty PDF
```
QPM Debug: Starting PDF generation...
...
QPM Debug: PDF file size: 45 bytes ← Too small!
QPM Error: PDF file too small (possibly empty): 45 bytes
```

#### Case 2: No Questions
```
QPM Debug: Starting PDF generation...
QPM Debug: Page added
QPM Debug: Test content added
QPM Debug: No questions to render! ← Data problem
```

#### Case 3: File Not Created
```
QPM Debug: Starting PDF generation...
...
QPM Error: PDF file not created: /path/to/file.pdf
```

---

## 🔍 What to Look For:

### 1. **Check Filename Sanitization:**
```
QPM Debug: Filename: গণিত_6
```
Should become: `gonit_6`

### 2. **Check Question Data:**
```
QPM Debug: Question paper data: Array(
    [header] => Array(...)
    [questions] => Array(
        [0] => Array(...)
    )
)
```

If empty → React app না পাঠাচ্ছে data!

### 3. **Check File Size:**
```
QPM Debug: PDF file size: XXXX bytes
```

- < 100 bytes = Empty/corrupt
- 1000-5000 bytes = Minimal content
- > 5000 bytes = Good!

---

## 🎯 Common Issues & Solutions:

### Issue 1: "No questions to render!"

**Cause:** React app থেকে question data আসছে না

**Fix:** Check React app এর `pdfGenerator.js`:
```javascript
questionPaper: {
  header: {...},
  questions: [...] // ← এটা খালি?
}
```

### Issue 2: "PDF file size: 45 bytes"

**Cause:** FPDF content render হচ্ছে না

**Fix:** 
1. Check if `AddPage()` called
2. Check if any `Cell()` or `MultiCell()` called
3. Check font errors

### Issue 3: File created but 404

**Cause:** URL path wrong

**Check logs for:**
```
QPM Success: PDF created at: /home/u704041778/.../file.pdf
```

Then verify URL matches:
```
https://ahsan.ronybormon.com/wp-content/uploads/question-papers/file.pdf
```

---

## 📋 Debug Checklist:

After testing, send me these from debug.log:

- [ ] `QPM Debug: Filename: ...`
- [ ] `QPM Debug: Question paper data: ...`
- [ ] `QPM Debug: Questions rendered, count: ...`
- [ ] `QPM Debug: PDF file size: ... bytes`
- [ ] `QPM Success: PDF created at: ...`
- [ ] Any `QPM Error: ...` messages

---

## 🚀 Quick Commands:

### View Debug Log (SSH):
```bash
tail -f /wp-content/debug.log
```

### Check Last 50 Lines:
```bash
tail -50 /wp-content/debug.log | grep QPM
```

### Clear Debug Log (for fresh test):
```bash
> /wp-content/debug.log
```

### Check PDF File:
```bash
ls -lh /wp-content/uploads/question-papers/*.pdf
```

---

## 🎯 What to Send Me:

1. **Complete debug.log output** (QPM lines only)
2. **Browser console errors** (screenshot)
3. **Network tab** - POST request & response
4. **File size** from server (if created)

এর পর আমি exact problem identify করতে পারবো!

---

**Upload করুন এবং debug.log পাঠান! 🔍**
