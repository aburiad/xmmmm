# Question Paper PDF Generator - WordPress Plugin

## 📦 Features

✅ **No Composer Dependencies** - Uses FPDF (single file library)  
✅ **Bangladesh Education Board Styling**  
✅ **REST API for External Apps**  
✅ **All Question Types Support** - Text, Formula, Image, Table, Diagram, List, Blank  
✅ **Multi-column Layout Support**  
✅ **Bangla Font Support** (with optional TTF font)  
✅ **Base64 Image Support**  
✅ **Custom Post Type** for question papers  

---

## 🚀 Installation (Super Easy!)

### Step 1: Upload Plugin

1. Download all files in the `question-paper-pdf-generator` folder
2. ZIP the folder
3. Go to WordPress Admin → Plugins → Add New → Upload Plugin
4. Upload the ZIP file
5. Click "Activate"

**That's it! No composer install needed!**

---

### Step 2: (Optional) Add Bangla Font

For proper Bangla rendering, download and add Bangla font:

1. Download: https://fonts.google.com/noto/specimen/Noto+Sans+Bengali
2. Extract and copy `NotoSansBengali-Regular.ttf`
3. Upload to: `/wp-content/plugins/question-paper-pdf-generator/fonts/`

---

## 🔌 REST API Endpoints

### 1. Generate PDF

**Endpoint:** `POST /wp-json/qpm/v1/generate-pdf`

**Request Body:**
```json
{
  "title": "my-question-paper",
  "questionPaper": {
    "header": {
      "boardName": "মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, ঢাকা",
      "examTitle": "বার্ষিক পরীক্ষা - ২০২৪",
      "class": "অষ্টম",
      "subject": "গণিত",
      "totalMarks": "১০০",
      "duration": "৩ ঘণ্টা"
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
    "marginRight": 15,
    "marginTop": 15,
    "marginBottom": 15
  }
}
```

**Response:**
```json
{
  "success": true,
  "pdf_url": "https://yoursite.com/wp-content/uploads/question-papers/my-question-paper-1234567890.pdf",
  "file_path": "/path/to/file.pdf",
  "message": "PDF generated successfully"
}
```

---

### 2. Save Question Paper

**Endpoint:** `POST /wp-json/qpm/v1/papers`

**Request Body:**
```json
{
  "title": "Class 8 Math - Annual Exam 2024",
  "questionPaper": { ... },
  "pageSettings": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "post_id": 123,
  "message": "Question paper saved successfully"
}
```

---

### 3. Get All Papers

**Endpoint:** `GET /wp-json/qpm/v1/papers`

**Response:**
```json
{
  "success": true,
  "papers": [
    {
      "id": 123,
      "title": "Class 8 Math - Annual Exam 2024",
      "date": "2024-02-11T10:30:00+00:00",
      "pdf_url": "https://...",
      "has_pdf": true
    }
  ],
  "total": 1
}
```

---

### 4. Get PDF for Saved Paper

**Endpoint:** `GET /wp-json/qpm/v1/papers/{id}/pdf`

**Response:**
```json
{
  "success": true,
  "pdf_url": "https://...",
  "generated_at": "2024-02-11 10:30:00"
}
```

---

## 📁 File Structure

```
question-paper-pdf-generator/
├── question-paper-pdf-generator.php     # Main plugin file
├── includes/
│   ├── class-qp-post-type.php          # Custom post type
│   ├── class-qp-rest-api.php           # REST API endpoints
│   ├── class-qp-pdf-generator.php      # PDF generation logic
│   └── lib/
│       └── fpdf.php                     # FPDF library (no composer!)
├── fonts/
│   └── (Optional) NotoSansBengali-Regular.ttf
└── readme.txt
```

---

## 🧪 Testing with cURL

```bash
curl -X POST https://ahsan.ronybormon.com/wp-json/qpm/v1/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "title": "test-paper",
    "questionPaper": {
      "header": {
        "boardName": "মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড",
        "examTitle": "পরীক্ষা - ২০২৪"
      },
      "questions": [
        {
          "number": "১",
          "marks": "৫",
          "blocks": [
            { "type": "text", "content": { "text": "প্রশ্ন এখানে লিখুন" } }
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

---

## 🎨 Supported Block Types

| Type | Description | Example |
|------|-------------|---------|
| `text` | Plain text | `{ "type": "text", "content": { "text": "..." } }` |
| `formula` | Math formula (LaTeX) | `{ "type": "formula", "content": { "latex": "x^2" } }` |
| `image` | Image (URL or base64) | `{ "type": "image", "content": { "url": "...", "width": 200 } }` |
| `table` | Data table | `{ "type": "table", "content": { "headers": [...], "data": [[...]] } }` |
| `diagram` | Diagram placeholder | `{ "type": "diagram", "content": { "description": "..." } }` |
| `list` | Bullet list | `{ "type": "list", "content": { "items": [...] } }` |
| `blank` | Blank lines | `{ "type": "blank", "content": { "lines": 3 } }` |

---

## 🔧 Configuration

### CORS Settings

The plugin adds CORS headers automatically. For production, edit `question-paper-pdf-generator.php`:

```php
public function add_cors_headers() {
    // Change * to your React app domain
    header("Access-Control-Allow-Origin: https://your-frontend.com");
    // ... rest of headers
}
```

### Upload Directory

PDFs are saved to: `/wp-content/uploads/question-papers/`

To change this, edit constants in main plugin file.

---

## 🐛 Troubleshooting

### PDFs not generating?

1. Check WordPress error log: `/wp-content/debug.log`
2. Enable debugging in `wp-config.php`:
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   ```

### Bangla text showing as boxes?

- Add `NotoSansBengali-Regular.ttf` to `/fonts/` folder
- For now, the plugin uses Arial which has limited Bangla support

### Permission errors?

```bash
chmod 755 /wp-content/uploads/
chmod 755 /wp-content/uploads/question-papers/
```

---

## 📝 Next Steps

1. ✅ Upload and activate plugin
2. ✅ Test PDF generation via API
3. ✅ Integrate with React frontend
4. 🔜 Add authentication (Phase 2)
5. 🔜 Add save/load from React app

---

## 💡 Usage in React App

```javascript
const generatePDF = async (questionPaper, pageSettings) => {
  try {
    const response = await fetch(
      'https://ahsan.ronybormon.com/wp-json/qpm/v1/generate-pdf',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'question-paper',
          questionPaper,
          pageSettings
        })
      }
    );
    
    const data = await response.json();
    
    if (data.success) {
      // Download PDF
      window.open(data.pdf_url, '_blank');
    }
  } catch (error) {
    console.error('PDF generation failed:', error);
  }
};
```

---

## 📞 Support

For issues:
- Check plugin status in WordPress Admin → Plugins
- View error logs
- Test API with Postman/cURL first

---

**Version:** 1.0.0  
**No Composer Required!** 🎉
