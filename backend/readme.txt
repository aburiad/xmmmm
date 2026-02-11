=== Question Paper PDF Generator ===
Contributors: Your Name
Tags: pdf, question paper, education, bangladesh, bangla
Requires at least: 5.6
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later

Generate professional question papers in PDF format with Bangladesh Education Board styling and Bangla font support.

== Description ==

This plugin allows teachers to generate question papers in PDF format with:

* Bangladesh Education Board standard layout
* Bangla (বাংলা) font support
* Multiple column layouts
* Math formulas, images, tables support
* REST API for external applications

== Installation ==

1. Upload the plugin folder to `/wp-content/plugins/`
2. Navigate to the plugin directory via SSH or FTP
3. Run: `composer install` (to install mPDF library)
4. Activate the plugin through the 'Plugins' menu in WordPress
5. Upload Bangla font to `/fonts/` directory (NotoSansBengali-Regular.ttf)

== REST API Endpoints ==

**Generate PDF:**
POST /wp-json/qpm/v1/generate-pdf
Body: { "questionPaper": {...}, "pageSettings": {...}, "title": "..." }

**Get Papers:**
GET /wp-json/qpm/v1/papers

**Get PDF:**
GET /wp-json/qpm/v1/papers/{id}/pdf

== Bangla Font ==

Download Noto Sans Bengali font from:
https://fonts.google.com/noto/specimen/Noto+Sans+Bengali

Place the TTF file in: /wp-content/plugins/question-paper-pdf-generator/fonts/NotoSansBengali-Regular.ttf

== Changelog ==

= 1.0.0 =
* Initial release
* PDF generation with mPDF
* REST API support
* Bangla font integration
* Board-style layouts
