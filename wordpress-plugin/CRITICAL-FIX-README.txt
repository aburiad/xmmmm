🔴 CRITICAL FIX - MUST READ BEFORE UPLOAD
==========================================

ERROR WAS: "Could not include font definition file"

✅ FIXED IN THIS VERSION!

==========================================
WHAT CHANGED:
==========================================

1. File: includes/class-qp-pdf-generator.php
   - Added: FPDF_FONTPATH constant definition
   - Line 97-100: Sets font path before creating PDF
   
2. New Files Added: fonts/
   - helvetica.php      ← Core font definition
   - helveticab.php     ← Bold font definition  
   - helveticai.php     ← Italic font definition
   - courier.php        ← Monospace font definition

3. File: question-paper-pdf-generator.php
   - Already fixed in previous upload
   - Uses helper functions for wp_upload_dir()

==========================================
HOW TO UPLOAD (Choose ONE method):
==========================================

METHOD A: FTP Upload (Fastest - Recommended)
--------------------------------------------
Use FileZilla or cPanel File Manager

1. Connect to your server via FTP

2. Navigate to:
   /wp-content/plugins/question-paper-pdf-generator/

3. Upload ONLY these files:
   
   ✅ includes/class-qp-pdf-generator.php
      (Replace existing file)
   
   ✅ fonts/helvetica.php
   ✅ fonts/helveticab.php
   ✅ fonts/helveticai.php
   ✅ fonts/courier.php
      (Upload to fonts/ directory - create if not exists)

4. Done! No need to deactivate/reactivate plugin.


METHOD B: Full Plugin Re-upload (Safest)
-----------------------------------------
1. Go to WordPress Admin → Plugins

2. Deactivate "Question Paper PDF Generator"

3. Delete the plugin (don't worry, settings are in database)

4. Download the ZIP file:
   - Create ZIP of entire /wordpress-plugin/ folder
   - OR use the create-zip.sh script
   - OR manually ZIP these items:
     • question-paper-pdf-generator.php
     • readme.txt
     • README.md
     • includes/ (entire folder)
     • fonts/ (entire folder with NEW files)

5. Go to: Plugins → Add New → Upload Plugin

6. Choose your ZIP file

7. Click "Install Now"

8. Activate the plugin

==========================================
VERIFY IT WORKS:
==========================================

1. Upload test-plugin.php to WordPress root directory:
   https://yourdomain.com/test-plugin.php

2. Visit that URL in browser

3. Click "Generate Test PDF" button

4. Expected result:
   ✅ "PDF Generated Successfully!"
   ✅ Download link appears
   ✅ Click link → PDF downloads
   ✅ Open PDF → You see formatted content

5. If you see an error, check:
   - Are all 4 font files in fonts/ directory?
   - Does fonts/ directory have proper permissions (755)?
   - Is the plugin activated?

==========================================
TEST FROM REACT APP:
==========================================

1. Open your Question Paper Generator app

2. Create a simple question paper

3. Click "অনলাইন ডাউনলোড করুন ☁️" button

4. Expected result:
   ✅ PDF generation starts
   ✅ PDF downloads to your computer
   ✅ PDF opens correctly with all formatting

==========================================
FILE CHECKLIST - VERIFY THESE EXIST:
==========================================

After upload, verify on server:

/wp-content/plugins/question-paper-pdf-generator/
├── question-paper-pdf-generator.php     ✅ Main plugin file
├── readme.txt                            ✅ Plugin readme
├── includes/
│   ├── class-qp-post-type.php           ✅
│   ├── class-qp-rest-api.php            ✅
│   ├── class-qp-pdf-generator.php       ✅ UPDATED!
│   └── lib/
│       └── fpdf.php                      ✅
└── fonts/
    ├── README.md                         ✅
    ├── helvetica.php                     ✅ NEW!
    ├── helveticab.php                    ✅ NEW!
    ├── helveticai.php                    ✅ NEW!
    └── courier.php                       ✅ NEW!

==========================================
TROUBLESHOOTING:
==========================================

Still getting "Could not include font definition file"?

→ Check 1: Font files exist?
   SSH/FTP to server and run:
   ls -la /wp-content/plugins/question-paper-pdf-generator/fonts/
   
   You should see:
   - helvetica.php
   - helveticab.php
   - helveticai.php
   - courier.php

→ Check 2: Font directory permissions?
   chmod 755 fonts/
   chmod 644 fonts/*.php

→ Check 3: Plugin constant defined?
   Check if QP_PDF_PLUGIN_DIR is set in main plugin file
   (It should be on line 14)

→ Check 4: Clear WordPress cache
   - Deactivate plugin
   - Reactivate plugin
   - Clear any caching plugins
   - Try test-plugin.php again

→ Still not working?
   Enable WordPress debug mode:
   In wp-config.php add:
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   
   Check /wp-content/debug.log for errors

==========================================
SUPPORT:
==========================================

If you still get errors after following ALL steps above:

1. Check /wp-content/debug.log file
2. Note the exact error message
3. Verify all 4 font files uploaded correctly
4. Try Method B (full re-upload) if Method A didn't work

==========================================
Version: 1.0.0-FIXED
Date: February 11, 2026
==========================================
