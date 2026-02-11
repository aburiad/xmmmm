# Question Paper PDF Generator - Installation Guide

## 📦 Requirements

- WordPress 5.6+
- PHP 7.4+
- Write permissions on wp-content/uploads/
- **NO COMPOSER NEEDED!** ✅

---

## 🚀 Installation Steps (Super Easy!)

### Method 1: WordPress Admin Upload (Recommended)

1. **Download/ZIP the plugin folder:**
   - Folder name: `question-paper-pdf-generator`
   - Create ZIP file

2. **Upload to WordPress:**
   - Go to: WordPress Admin → Plugins → Add New
   - Click: "Upload Plugin"
   - Choose your ZIP file
   - Click: "Install Now"

3. **Activate:**
   - Click "Activate Plugin"

**✅ Done! No composer install needed!**

---

### Method 2: FTP/File Manager Upload

1. **Upload entire folder via FTP:**
   ```
   Upload to: /wp-content/plugins/question-paper-pdf-generator/
   ```

2. **Activate in WordPress:**
   - Go to: WordPress Admin → Plugins
   - Find "Question Paper PDF Generator"
   - Click "Activate"

---

## 🔤 (Optional) Add Bangla Font

For better Bangla text rendering:

1. **Download Noto Sans Bengali:**
   - Visit: https://fonts.google.com/noto/specimen/Noto+Sans+Bengali
   - Click "Download family"
   - Extract the ZIP

2. **Upload Font File:**
   ```
   Upload: NotoSansBengali-Regular.ttf
   To: /wp-content/plugins/question-paper-pdf-generator/fonts/
   ```

3. **Done!** Plugin will automatically use it.

---

## ⚙️ Configuration

### File Permissions

Ensure upload directory is writable:

```bash
chmod 755 /wp-content/uploads/
```

### CORS Configuration (For React App)

**For production, edit `question-paper-pdf-generator.php`:**

Find this function:

```php
public function add_cors_headers() {
    // Change * to your React app domain
    header("Access-Control-Allow-Origin: https://your-react-app.com");
    // ... rest of headers
}
```

Replace `*` with your specific domain:
```php
header("Access-Control-Allow-Origin: https://ahsan.ronybormon.com");
```

---

## 🧪 Testing

### Test 1: Check Plugin Status

1. Go to: WordPress Admin → Plugins
2. Find: "Question Paper PDF Generator"
3. Status should be: **Active** ✅

---

### Test 2: Test REST API

**Using cURL:**

```bash
curl -X POST https://ahsan.ronybormon.com/wp-json/qpm/v1/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "title": "test-bangla",
    "questionPaper": {
      "header": {
        "boardName": "মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, ঢাকা",
        "examTitle": "বার্ষিক পরীক্ষা - ২০২৪",
        "class": "অষ্টম",
        "subject": "গণিত"
      },
      "questions": [
        {
          "number": "১",
          "marks": "৫",
          "blocks": [
            {
              "type": "text",
              "content": { "text": "একটি সমকোণী ত্রিভুজ আঁক।" }
            }
          ]
        }
      ]
    },
    "pageSettings": {
      "columns": 1,
      "marginLeft": 15,
      "marginRight": 15
    }
  }'
```

**Using Postman:**

- **Method:** POST
- **URL:** `https://ahsan.ronybormon.com/wp-json/qpm/v1/generate-pdf`
- **Headers:** `Content-Type: application/json`
- **Body:** (Copy JSON from cURL example above)

**Expected Response:**

```json
{
  "success": true,
  "pdf_url": "https://ahsan.ronybormon.com/wp-content/uploads/question-papers/test-bangla-1234567890.pdf",
  "file_path": "/path/to/file.pdf",
  "message": "PDF generated successfully"
}
```

---

### Test 3: Download PDF

1. Copy `pdf_url` from the response
2. Open it in your browser
3. You should see a properly formatted PDF! 🎉

---

## 📁 Plugin Structure

```
question-paper-pdf-generator/
├── question-paper-pdf-generator.php     # Main plugin file
├── includes/
│   ├── class-qp-post-type.php          # Custom post type
│   ├── class-qp-rest-api.php           # REST endpoints
│   ├── class-qp-pdf-generator.php      # PDF generation
│   └── lib/
│       └── fpdf.php                     # FPDF library (built-in!)
├── fonts/
│   └── README.md                        # Font instructions
│   └── (Optional) NotoSansBengali-Regular.ttf
├── README.md                            # Full documentation
├── QUICK-START.md                       # Quick start guide
├── INSTALLATION.md                      # This file
└── readme.txt                           # WordPress plugin readme
```

---

## 🐛 Troubleshooting

### Error: Plugin doesn't activate

**Solution:**
- Check PHP version (must be 7.4+)
- Check WordPress version (must be 5.6+)
- Check file permissions

### Error: "Permission denied" when generating PDF

**Solution:**
```bash
chmod -R 755 /wp-content/uploads/
chown -R www-data:www-data /wp-content/uploads/
```

Or create the directory manually:
```bash
mkdir -p /wp-content/uploads/question-papers
chmod 755 /wp-content/uploads/question-papers
```

### Error: CORS errors from React app

**Solution:**
Update CORS headers in `question-paper-pdf-generator.php` (see Configuration section above)

### Bangla text showing as boxes (□□□)

**Solutions:**
1. Add `NotoSansBengali-Regular.ttf` to `/fonts/` folder (see Optional Font section)
2. For now, Arial is used which has limited Bangla support

### API returns 404

**Solution:**
1. Go to: WordPress Admin → Settings → Permalinks
2. Click "Save Changes" (this refreshes rewrite rules)
3. Try API again

---

## 🔗 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/wp-json/qpm/v1/generate-pdf` | POST | Generate PDF from JSON |
| `/wp-json/qpm/v1/papers` | GET | Get all saved papers |
| `/wp-json/qpm/v1/papers` | POST | Save new paper |
| `/wp-json/qpm/v1/papers/{id}/pdf` | GET | Get PDF URL for saved paper |

See `README.md` for detailed API documentation.

---

## 📝 Next Steps

After successful installation:

1. ✅ Test PDF generation via REST API (see Test 2 above)
2. ✅ Integrate with your React frontend (see example below)
3. 🔜 Add authentication (Phase 2)
4. 🔜 Add save/load functionality (Phase 2)

---

## 💡 React Integration Example

```javascript
const handleDownloadPDF = async () => {
  try {
    const response = await fetch(
      'https://ahsan.ronybormon.com/wp-json/qpm/v1/generate-pdf',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'my-question-paper',
          questionPaper: questionPaper,  // Your question paper data
          pageSettings: pageSettings      // Your page settings
        })
      }
    );
    
    const data = await response.json();
    
    if (data.success) {
      // Open PDF in new tab
      window.open(data.pdf_url, '_blank');
      
      // Or trigger download
      // const link = document.createElement('a');
      // link.href = data.pdf_url;
      // link.download = 'question-paper.pdf';
      // link.click();
    } else {
      console.error('PDF generation failed:', data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 📞 Support

For issues or questions:

1. **Check WordPress error logs:**
   - Location: `/wp-content/debug.log`

2. **Enable WordPress debugging:**
   - Edit: `wp-config.php`
   - Add:
     ```php
     define('WP_DEBUG', true);
     define('WP_DEBUG_LOG', true);
     define('WP_DEBUG_DISPLAY', false);
     ```

3. **Check plugin files:**
   - Make sure all files are uploaded correctly
   - Check file permissions

4. **Test API directly:**
   - Use Postman or cURL to test endpoints
   - Check response for error messages

---

## ✨ Features

✅ **No Composer Dependencies** - Works immediately after activation  
✅ **Bangladesh Education Board Styling**  
✅ **Multiple Question Types** - Text, Formula, Image, Table, Diagram, List, Blank  
✅ **Multi-column Support** - 1, 2, or 3 columns  
✅ **Bangla Font Support** - Optional TTF font  
✅ **Base64 Image Support** - Upload images directly from React  
✅ **REST API** - Easy integration with any frontend  
✅ **Custom Post Type** - Save papers in WordPress database  

---

**Plugin Version:** 1.0.0  
**Last Updated:** February 2024  
**License:** GPL v2 or later

**No Composer Required! Ready to Use! 🎉**
