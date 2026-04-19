#!/bin/bash
# Generate Apple splash screens for iOS PWA
# Portrait sizes cover the main iPhone/iPad models

set -e

sizes=(
  "640x1136"    # iPhone SE 1st gen
  "750x1334"    # iPhone 8, 7, 6s, 6
  "828x1792"    # iPhone 11, XR
  "1125x2436"   # iPhone X, XS, 11 Pro
  "1170x2532"   # iPhone 12, 13, 14, 12 Pro, 13 Pro
  "1179x2556"   # iPhone 14 Pro, 15
  "1242x2208"   # iPhone 8 Plus, 7 Plus
  "1242x2688"   # iPhone 11 Pro Max, XS Max
  "1290x2796"   # iPhone 14 Pro Max, 15 Pro Max
  "1488x2266"   # iPad mini 6
  "1620x2160"   # iPad 10.2
  "1640x2360"   # iPad Air 10.9
  "1668x2388"   # iPad Pro 11
  "2048x2732"   # iPad Pro 12.9
)

for dim in "${sizes[@]}"; do
  w=${dim%x*}
  h=${dim#*x}
  icon_size=$((w < h ? w / 3 : h / 3))
  icon_offset_x=$(( (w - icon_size) / 2 ))
  icon_offset_y=$(( (h - icon_size) / 2 ))
  scale=$(awk "BEGIN { printf \"%.4f\", $icon_size / 512 }")

  tmp=$(mktemp --suffix=.svg)
  cat > "$tmp" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" width="$w" height="$h" viewBox="0 0 $w $h">
  <rect width="$w" height="$h" fill="#ffffff"/>
  <g transform="translate($icon_offset_x $icon_offset_y) scale($scale)" fill="#000000">
    <path d="m111 208.5h-47v63h47zm-15 48h-17v-33h17z"/>
    <path d="m168 327.5h47v-47h-47zm15-32h17v17h-17z"/>
    <path d="m232 327.5h47v-47h-47zm15-32h17v17h-17z"/>
    <path d="m343 280.5h-47v47h47zm-15 32h-17v-17h17z"/>
    <path d="m447 208.5h-47v63h47zm-15 48h-17v-33h17z"/>
    <path d="m487 424.5v-233h24v-119h-47v40h-17v-40h-47v40h-17v-40h-47v119h24v17h-32v40h-17v-40h-47v40h-17v-40h-47v40h-17v-40h-32v-17h24v-119h-47v40h-17v-40h-47v40h-17v-40h-47v119h24v40h15v-40h97v233h-97v-49h25v16h15v-16h17v-15h-25v-17h9v-15h-41v-81h-15v177h-24v15h416v-15h-41v-233h97v145h-48v15h16v17h-24v15h16v16h15v-16h25v41h-40v15h80v-15zm-472-337h17v40h47v-40h17v40h47v-40h17v89h-145zm41 256v17h-17v-17zm304 49h-17v-17h17zm-209-16v-17h17v17zm121 48h-33v-33c0-9.098 7.402-16.5 16.5-16.5s16.5 7.402 16.5 16.5zm15 0v-33c0-17.369-14.131-31.5-31.5-31.5s-31.5 14.131-31.5 31.5v33h-73v-33h25v16h15v-16h17v-15h-25v-17h17v-15h-49v-121h17v40h47v-40h17v40h47v-40h17v40h47v-40h17v137h-25v-17h-15v17h-8v15h16v17h-16v15h48v17zm64-337h17v40h47v-40h17v40h47v-40h17v89h-145zm104 281v-17h17v17z"/>
    <path d="m48 144.5h16v15h-16z"/>
    <path d="m80 144.5h16v15h-16z"/>
    <path d="m112 144.5h16v15h-16z"/>
    <path d="m384 144.5h16v15h-16z"/>
    <path d="m416 144.5h16v15h-16z"/>
    <path d="m448 144.5h16v15h-16z"/>
  </g>
</svg>
EOF

  rsvg-convert -w "$w" -h "$h" "$tmp" -o "public/splashes/splash-${w}x${h}.png"
  rm "$tmp"
  echo "✓ splash-${w}x${h}.png"
done
