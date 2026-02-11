# 🚀 Quick Start Guide

## ✅ Super Simple Installation (No Composer!)

### Step 1: Upload to WordPress

1. **Zip this folder:** `question-paper-pdf-generator`
2. **Go to:** WordPress Admin → Plugins → Add New → Upload Plugin
3. **Upload** the ZIP file
4. **Activate** the plugin

✅ **Done! Ready to use immediately!**

---

## 🧪 Test It

### Using Browser/Postman:

**URL:** `https://ahsan.ronybormon.com/wp-json/qpm/v1/generate-pdf`

**Method:** POST

**Body (JSON):**
```json
{
  "title": "test",
  "questionPaper": {
    "header": {
      "boardName": "মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, ঢাকা",
      "examTitle": "পরীক্ষা ২০২৪"
    },
    "questions": [
      {
        "number": "১",
        "blocks": [
          { "type": "text", "content": { "text": "এটি একটি টেস্ট প্রশ্ন" } }
        ]
      }
    ]
  },
  "pageSettings": {
    "columns": 1,
    "marginLeft": 15,
    "marginRight": 15
  }
}
```

**Expected Response:**
```json
{
  "success": true,
  "pdf_url": "https://ahsan.ronybormon.com/wp-content/uploads/question-papers/test-123456.pdf"
}
```

---

## 📋 What's Included

✅ FPDF Library (built-in, no composer)  
✅ REST API Endpoints  
✅ Custom Post Type  
✅ PDF Generation  
✅ Bangla Support (basic)  
✅ All Block Types  

---

## 🔗 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/wp-json/qpm/v1/generate-pdf` | POST | Generate PDF |
| `/wp-json/qpm/v1/papers` | GET | List all papers |
| `/wp-json/qpm/v1/papers` | POST | Save paper |
| `/wp-json/qpm/v1/papers/{id}/pdf` | GET | Get PDF URL |

---

## 📝 Full Documentation

See `README.md` for:
- Complete API documentation
- React integration examples
- Troubleshooting guide
- Advanced configuration

---

## ⚡ Next: Integrate with React

After plugin is active, you can call the API from your React app:

```javascript
const handleDownloadPDF = async () => {
  const response = await fetch(
    'https://ahsan.ronybormon.com/wp-json/qpm/v1/generate-pdf',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'my-paper',
        questionPaper: questionPaperData,
        pageSettings: pageSettingsData
      })
    }
  );
  
  const result = await response.json();
  if (result.success) {
    window.open(result.pdf_url, '_blank'); // Opens PDF
  }
};
```

---

**Ready to go! No complicated setup! 🎉**
