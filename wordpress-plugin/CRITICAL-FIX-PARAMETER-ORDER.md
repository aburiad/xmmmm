# 🔥 CRITICAL FIX - Parameter Order Error!

## ❌ Error আপনি পেয়েছেন:

```
FPDF error: Incorrect output destination: /home/u704041778/.../গণিত_6_1770825568746-1770825571.pdf
```

---

## 🎯 Root Cause:

### FPDF এর `Output()` signature:
```php
function Output($dest='', $name='', $isUTF8=false)
```

**Parameters:**
- `$dest` = Destination ('F' for File, 'I' for Inline, 'D' for Download)
- `$name` = File path/name
- `$isUTF8` = UTF-8 encoding flag

---

## ❌ BEFORE (Wrong Order):

```php
$this->pdf->Output($file_path, 'F');
//                  ↑           ↑
//              First (dest)   Second (name)
//              = file path     = 'F'
```

**FPDF received:**
- `$dest` = `/home/u704041778/.../file.pdf` ← ❌ Should be 'F', 'I', 'D', or 'S'!
- `$name` = `'F'` ← ❌ Should be file path!

**Error:** "Incorrect output destination" because file path is not a valid destination!

---

## ✅ AFTER (Correct Order):

```php
$this->pdf->Output('F', $file_path);
//                  ↑     ↑
//              First    Second
//              $dest    $name
//              = 'F'    = file path
```

**FPDF receives:**
- `$dest` = `'F'` ← ✅ Valid destination (File)
- `$name` = `/home/u704041778/.../file.pdf` ← ✅ Correct file path

---

## 📤 Upload করুন:

### Single File Upload:

**File:** `includes/class-qp-pdf-generator.php`  
**Location:** `/wp-content/plugins/question-paper-pdf-generator/includes/`

### Via FTP:
1. Connect to `ahsan.ronybormon.com`
2. Navigate to: `/wp-content/plugins/question-paper-pdf-generator/includes/`
3. Upload: `class-qp-pdf-generator.php` (replace existing)

### Via cPanel File Manager:
1. Navigate to: `/public_html/__ahsan/wp-content/plugins/question-paper-pdf-generator/includes/`
2. Upload: `class-qp-pdf-generator.php` (replace)

---

## 🧪 Test Steps:

1. **Upload the fixed file**
2. **Clear browser cache** (Ctrl+Shift+R)
3. **Reload React app**
4. **Create a question paper**
5. **Click "অনলাইন ডাউনলোড করুন ☁️"**

---

## ✅ Expected Result:

### Browser Console:
```
✅ No errors
✅ POST /wp-json/qpm/v1/generate-pdf → 200 OK
✅ Response contains pdf_url
```

### File System:
```bash
$ ls -la /wp-content/uploads/question-papers/
-rw-r--r-- 1 www-data www-data 15234 Feb 11 গণিত_6_123456.pdf ✅
```

### Browser:
```
✅ PDF downloads automatically
✅ File accessible at URL
✅ No 404 error
```

---

## 🔍 Changed Lines:

**Line 420 (only change!):**

```diff
- $this->pdf->Output($file_path, 'F');
+ $this->pdf->Output('F', $file_path);
```

---

## 🎯 Why This Happened:

FPDF documentation কখনো কখনো confusing হয়:
- কিছু libraries: `save(filename, 'F')`
- FPDF: `Output('F', filename)`

আমরা ভুলে first parameter file path দিয়েছিলাম!

---

## 📊 Verification:

After upload, check WordPress debug.log:

**Success message:**
```
QPM Success: PDF created at: /home/u704041778/.../file.pdf
```

**No error messages like:**
```
❌ FPDF error: Incorrect output destination
❌ Failed to save PDF
```

---

## 🚀 Status:

- ✅ **Error identified:** Parameter order wrong
- ✅ **Fix applied:** Swapped parameters
- ✅ **File ready:** class-qp-pdf-generator.php
- ✅ **Confidence:** 100% (this is the exact error!)

---

## ⚡ Quick Upload Command (if SSH access):

```bash
cd /wp-content/plugins/question-paper-pdf-generator/includes/
# Backup existing file
cp class-qp-pdf-generator.php class-qp-pdf-generator.php.backup
# Upload new file via FTP or paste content
# Then test!
```

---

**এটাই final fix! Upload করুন এবং test করুন! 🎉**
