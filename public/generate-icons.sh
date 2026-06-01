#!/bin/bash

# Create a simple SVG icon and convert to PNG
# This script uses ImageMagick to generate the icons

# Colors for finflow app - Blue & gradient
ICON_COLOR="#3b82f6"
ACCENT_COLOR="#06b6d4"

# Create temporary SVG for the app icon
cat > /tmp/finflow-icon.svg << 'EOF'
<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Background circle -->
  <circle cx="96" cy="96" r="96" fill="url(#grad1)"/>
  
  <!-- Financial chart symbolism -->
  <g fill="white" opacity="0.95">
    <!-- Bar chart -->
    <rect x="36" y="96" width="20" height="40" rx="2"/>
    <rect x="66" y="76" width="20" height="60" rx="2"/>
    <rect x="96" y="56" width="20" height="80" rx="2"/>
    <rect x="126" y="66" width="20" height="70" rx="2"/>
    
    <!-- Upward trend line -->
    <polyline points="36,110 66,90 96,65 126,80" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
EOF

cat > /tmp/finflow-maskable.svg << 'EOF'
<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Maskable icon - uses full viewport -->
  <circle cx="96" cy="96" r="96" fill="url(#grad1)"/>
  
  <!-- Financial chart symbolism -->
  <g fill="white" opacity="0.95">
    <!-- Bar chart -->
    <rect x="36" y="96" width="20" height="40" rx="2"/>
    <rect x="66" y="76" width="20" height="60" rx="2"/>
    <rect x="96" y="56" width="20" height="80" rx="2"/>
    <rect x="126" y="66" width="20" height="70" rx="2"/>
    
    <!-- Upward trend line -->
    <polyline points="36,110 66,90 96,65 126,80" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
EOF

echo "SVG icons created. If ImageMagick is available, converting to PNG..."

# Convert using ImageMagick if available
if command -v convert &> /dev/null; then
  convert /tmp/finflow-icon.svg -background none /home/gokul/Documents/finflow/public/icon-192.png
  convert /tmp/finflow-icon.svg -background none -resize 512x512 /home/gokul/Documents/finflow/public/icon-512.png
  convert /tmp/finflow-maskable.svg -background none /home/gokul/Documents/finflow/public/icon-192-maskable.png
  convert /tmp/finflow-maskable.svg -background none -resize 512x512 /home/gokul/Documents/finflow/public/icon-512-maskable.png
  echo "PNG icons generated successfully!"
else
  echo "ImageMagick not found. Please install it with: sudo apt-get install imagemagick"
fi

rm /tmp/finflow-icon.svg /tmp/finflow-maskable.svg
