#!/bin/bash

# Create WordPress Plugin ZIP for Upload
# This creates a clean ZIP file ready for WordPress installation

cd "$(dirname "$0")"

ZIP_NAME="question-paper-pdf-generator-v1.0.0-FIXED.zip"

echo "🔄 Creating WordPress Plugin ZIP..."

# Remove old ZIP if exists
rm -f "$ZIP_NAME"

# Create ZIP with all necessary files
zip -r "$ZIP_NAME" \
  question-paper-pdf-generator.php \
  readme.txt \
  README.md \
  INSTALLATION.md \
  QUICK-START.md \
  includes/ \
  fonts/ \
  -x "*.DS_Store" \
  -x "*/.*" \
  -x "test-plugin.php"

if [ $? -eq 0 ]; then
  echo "✅ ZIP created successfully: $ZIP_NAME"
  echo ""
  echo "📦 Package contents:"
  unzip -l "$ZIP_NAME"
  echo ""
  echo "🚀 Ready to upload to WordPress!"
  echo "   Go to: WordPress Admin → Plugins → Add New → Upload Plugin"
else
  echo "❌ Failed to create ZIP"
  exit 1
fi
