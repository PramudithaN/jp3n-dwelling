# Motion Engine for Adobe After Effects
### *by Pramuditha*

An intelligent, native-styled Adobe CEP extension for Adobe After Effects that connects your timeline and compositions directly to **Google Gemini** and **Anthropic Claude**.

---

## ✨ Features
- **Adobe Spectrum UI:** Matches native After Effects styling, colors, and typography.
- **Dual AI Engine:**
  - **Google Gemini** (Gemini 3.8 Flash, 2.0 Flash, 2.5 Pro) with auto-discovery and low-latency thinking configuration.
  - **Anthropic Claude** (Claude 3.7 Sonnet, 3.5 Sonnet, 3.5 Haiku) with direct in-panel browser integration.
- **Live ExtendScript Execution:** Executes generated After Effects actions live on active projects with full undo-group support.
- **Built-in Presets:** One-click utility tools (dynamic title comp generator, smooth expression injector, auto-fade).
- **1-Click Windows Installer:** Automated setup script that configures `PlayerDebugMode` across CSXS 6–16 and installs into Adobe directories.

---

## 🚀 Quick Installation

1. Download or clone this repository.
2. Run `install.bat` inside the `AE_AI_Assistant_Installer` folder (or extract `AE_AI_Assistant_Installer.zip`).
3. Open or restart **Adobe After Effects**.
4. In the top menu, navigate to:
   ```
   Window > Extensions > AI Assistant
   ```
5. Enter your Gemini or Claude API key in the panel and click **Save**.

---

## 📁 Repository Structure

```text
├── AE_AI_Assistant_Installer/
│   ├── install.bat               # 1-click installer for Windows
│   ├── uninstall.bat             # 1-click uninstaller
│   ├── README.txt                # Quick guide for testers
│   └── com.ai.aftereffects/      # Full extension source
│       ├── CSXS/
│       │   └── manifest.xml      # Adobe CEP manifest
│       ├── js/
│       │   └── CSInterface.js    # Adobe CEP interface bridge
│       ├── jsx/
│       │   └── hostscript.jsx    # ExtendScript timeline automation
│       └── index.html            # Native Spectrum panel interface
├── AE_AI_Assistant_Installer.zip # Pre-packaged distribution archive
└── README.md
```

---

## 🛠️ Requirements
- Adobe After Effects (CC 2015 – 2026+)
- Windows 10 / 11
- Google Gemini API key and/or Anthropic Claude API key

---

## 📄 License
MIT License. Created by Pramuditha.
