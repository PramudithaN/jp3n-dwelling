# Motion Engine for Adobe After Effects

An extensibility panel for Adobe After Effects engineered with Adobe CEP (Common Extensibility Platform) and ECMAScript ExtendScript. The extension integrates multimodal large language models—specifically Google Gemini and Anthropic Claude—directly into the After Effects workspace, allowing motion designers to execute complex timeline operations, expressions, and computer vision-driven masking using natural language.

---

## Overview

Motion Engine bridges the gap between generative language models and Adobe's low-level scripting environment. By executing commands inside After Effects via ExtendScript (`hostscript.jsx`), the panel translates high-level creative prompts into precise programmatic timeline actions.

The integration includes a frame-analysis pipeline: the panel extracts the active frame snapshot using `CompItem.saveFrameToPng`, serializes it to base64, and transmits it alongside the user's prompt to a multimodal vision model. The model computes spatial pixel coordinates and automatically injects subtractive or additive vector masks onto selected layers.

---

## Architectural Highlights

- **Adobe Spectrum Compliance:** Interface layout adheres to Adobe's native Spectrum design guidelines, matching the host application's typography, palette (#222222, #262626, #181818), and segmented controls.
- **Multimodal Vision Pipeline:** Automatically snapshots the composition playhead, performs visual bounding box calculations via Gemini or Claude Vision, and creates vector masks on targeted video/GIF layers.
- **Safe Execution Architecture:** All generated ExtendScript routines are encapsulated in transactional undo groups (`app.beginUndoGroup` / `app.endUndoGroup`), allowing artists to revert changes with `Ctrl+Z` / `Cmd+Z`.
- **Dynamic Model Discovery:** Queries the Google ModelService API at runtime to discover all supported endpoints available to the user's API credentials.
- **Client-Side Key Isolation:** API credentials are stored strictly in the local Chromium storage (`localStorage`) of the user's local CEP environment and never relayed through third-party servers.
- **Low-Latency Generation:** Explicitly configures model generation parameters (such as `thinkingBudget: 0`) to prevent latency spikes while generating code snippets.

---

## System Requirements

- **Host Application:** Adobe After Effects CC 2015 through 2026+ (CSXS 6.0 through CSXS 16.0).
- **Operating System:** Windows 10 / Windows 11 (installer scripts provided) or macOS.
- **AI Credentials:** A Google Gemini API key (from Google AI Studio) or an Anthropic Claude API key (from Anthropic Console).

---

## Directory Structure

```text
motion.eng/
├── AE_AI_Assistant_Installer/
│   ├── install.bat               # Windows batch automation for CEP debug mode and deployment
│   ├── uninstall.bat             # Automated clean uninstaller script
│   ├── README.txt                # Plaintext operational guide for distributed users
│   └── com.ai.aftereffects/      # Core extension bundle
│       ├── CSXS/
│       │   └── manifest.xml      # Extension lifecycle, permissions, and host compatibility
│       ├── js/
│       │   └── CSInterface.js    # Standard Adobe CEP IPC bridge
│       ├── jsx/
│       │   └── hostscript.jsx    # Native After Effects ExtendScript execution engine
│       └── index.html            # Adobe Spectrum interface and client orchestration logic
├── AE_AI_Assistant_Installer.zip # Standalone distributable archive for beta testers
├── .gitignore                    # Version control ignore definitions
└── README.md                     # Technical documentation
```

---

## Installation & Setup

### Automated Installation (Windows)

1. Ensure Adobe After Effects is closed.
2. Clone or download this repository.
3. Open the `AE_AI_Assistant_Installer` directory and execute `install.bat` (run as Administrator if installing into a shared system environment).
   - This configures `PlayerDebugMode = 1` across registry hives `HKCU\Software\Adobe\CSXS.6` through `CSXS.16`.
   - It places the extension files into `%APPDATA%\Adobe\CEP\extensions\com.ai.aftereffects`.
4. Launch Adobe After Effects.
5. In the top navigation menu, open:
   `Window > Extensions > AI Assistant`

### Manual Installation (Windows & macOS)

1. Enable Developer Mode for Adobe CEP:
   - **Windows:** Run in PowerShell or Command Prompt:
     ```cmd
     reg add "HKCU\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f
     reg add "HKCU\Software\Adobe\CSXS.12" /v PlayerDebugMode /t REG_SZ /d 1 /f
     ```
   - **macOS:** Run in Terminal:
     ```bash
     defaults write com.adobe.CSXS.11 PlayerDebugMode 1
     defaults write com.adobe.CSXS.12 PlayerDebugMode 1
     ```
2. Copy the `com.ai.aftereffects` directory to the target CEP extensions folder:
   - **Windows:** `%APPDATA%\Adobe\CEP\extensions\`
   - **macOS:** `~/Library/Application Support/Adobe/CEP/extensions/`
3. Restart Adobe After Effects.

---

## Configuration & Usage

### 1. Antigravity Local Bridge (Zero API Keys)
- Select the **Antigravity** provider tab in the panel.
- Launch the local bridge server by running [start_bridge.bat](file:///c:/Users/PramudithaN/Documents/antigravity/lively-babbage/start_bridge.bat) or executing `node bridge/server.js`.
- The panel badge will switch to **Active (127.0.0.1:4000)**.
- Input your prompt and click **Send to Antigravity** to execute commands directly through your local session.

### 2. Configuring Cloud Model Credentials (Optional)
- Select the desired cloud provider tab (**Google Gemini** or **Anthropic Claude**).
- Input your private API key and select **Save**. Credentials persist across sessions via client-side storage.
- The panel verifies available models and populates the **Target Model** selector.

### 3. General Animation & Scripting
Enter any creative command into the input field:
- *"Create a 1920x1080 composition with a kinetic bouncing text layer that scales from 0 to 100 percent."*
- *"Add an organic wiggle expression to the position property of all selected layers."*
- *"Apply a staggered keyframe opacity fade to selected clips."*

Click **Execute Command**. The panel generates the script and applies the keyframes directly to your timeline.

### 3. Visual Detection & Automatic Masking
1. Position the timeline playhead over a frame where the target text, logo, or watermark is visible.
2. Select the target layer in your active composition.
3. Ensure **Vision Mode (Frame Analysis)** is checked.
4. Input your prompt:
   - *"Detect the watermark text in this clip and generate a subtractive mask to remove it."*
5. Click **Execute Command**.
   - The engine captures the active frame via `comp.saveFrameToPng`.
   - The vision model locates the object boundaries and returns pixel coordinates.
   - `addMaskToSelected(left, top, right, bottom)` automatically constructs the closed mask path set to `MaskMode.SUBTRACT`.

---

## Technical Flow

```text
[User Prompt] + [Optional Frame Snapshot]
                     │
                     ▼
           [index.html (Client)]
                     │ (JSON payload over HTTPS)
                     ▼
       [Gemini API / Claude API]
                     │ (Structured ECMAScript 3 code)
                     ▼
           [CSInterface.js IPC]
                     │ (csInterface.evalScript)
                     ▼
        [hostscript.jsx (Host Engine)]
                     │
                     ▼
      [Active Timeline / Selected Layers]
```

---

## Security & Data Privacy

- **No Remote Middlewares:** Communication flows directly from the local CEP client to Google and Anthropic official REST APIs over TLS 1.3.
- **Zero Telemetry:** The extension collects no user metadata, usage statistics, or telemetry.
- **Sandboxed File Operations:** Snapshot generation utilizes the host operating system's standard temporary cache directory (`Folder.temp.fsName`), which is cleaned after reading.

---

## License

This project is licensed under the MIT License. See the LICENSE file for full terms.

Created and maintained by Pramuditha.
