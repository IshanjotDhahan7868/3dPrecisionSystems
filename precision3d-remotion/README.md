# Precision 3D Technologies — Remotion Commercial

**53-second B2B sales animation. 12 cinematic scenes. 60fps. 1920×1080.**

---

## 📁 Setup

```bash
npm install
```

## ▶️ Preview

```bash
npm run start
# → http://localhost:3000
```

## 🎬 Render

```bash
# Standard render
npx remotion render src/index.ts Precision3D out/precision3d-commercial.mp4

# High quality
npx remotion render src/index.ts Precision3D out/precision3d-hq.mp4 --codec=h264 --jpeg-quality=95

# Still frame (e.g. thumbnail at frame 200)
npx remotion still src/index.ts Precision3D out/thumbnail.png --frame=200
```

---

## 🎞 Scene Breakdown (53 seconds)

| # | Scene | Frames | Duration | Description |
|---|-------|--------|----------|-------------|
| 01 | Brand Slam | 0–210 | 3.5s | Cold open — logo with crosshair, flash strobes, particles |
| 02 | The Pain | 200–450 | 4.2s | "Your customers can't touch it. So they don't buy it." |
| 03 | The Solution | 440–650 | 3.5s | "What if they could spin it, configure it live, and buy it?" |
| 04 | Live Products | 640–1090 | 7.5s | 5 real configurator videos cycling with browser mockup |
| 05 | Money / ROI | 1080–1360 | 4.7s | **Green money rain** + animated ROI counters |
| 06 | Testimonials | 1350–1870 | 8.7s | All 6 clients with real video, before/after, verified stats |
| 07 | Benefits | 1860–2110 | 4.2s | 8 reasons companies choose Precision 3D (2-column) |
| 08 | Industries | 2100–2290 | 3.2s | 6-grid industry cards, all with real video backgrounds |
| 09 | How It Works | 2280–2540 | 4.3s | 4-step process with wipe animations + subtle money rain |
| 10 | Pricing | 2530–2770 | 4.0s | 3-tier pricing cards — Starter / Pro / Enterprise |
| 11 | Founder | 2760–2950 | 3.2s | Ishanjot Dhahan personal quote + status indicator |
| 12 | CTA Finale | 2940–3180 | 4.0s | Gold flash + "Get your free mockup." + URL burn |

---

## 🎥 Videos Used

All videos must be in the `/public` folder:

- `Precision3D.mp4` — hero brand video (Scene 01 bg)
- `backgroundblueprintcity.mp4` — city blueprint bg (Scene 05)
- `backgroundblueprinthouse.mp4` — house blueprint bg (Scene 07)
- `backgroundblueprintplane.mp4` — plane blueprint bg (Scene 11)
- `basketballcourt.mp4` — DeckCraft Ontario (testimonial)
- `boatconfig.mp4` — NautiCraft Marine (product + testimonial)
- `houseconfig.mp4` — Forma Homes (product + testimonial)
- `jewelryconfig.mp4` — Lumière Jewellery (product + testimonial)
- `pcconfig.mp4` — NovaBuild PC (product + testimonial)
- `poolfloatingshot.mp4` — MyPergolas (testimonial)
- `warehousemachineconfig.mp4` — Vortex Industrial (product + testimonial)
- `weirdmetalthingconfig.mp4` — Axiom Fabrication (industries)

---

## Brand

- Gold: `#c9a96e` | Black: `#080808` | Green: `#22c55e`
- Fonts: Georgia (serif), Arial Black (sans), Courier New (mono)
