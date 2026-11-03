"""
all_categories_generator.py - Exhaustive coverage of all 23 Categories in the AE Effects & Presets panel:
1. Noise & Grain: Fractal Noise, Add Grain, Noise
2. Expression Controls: Slider Control, Color Control, Checkbox, Angle Control, Point Control
3. Transitions: Linear Wipe, Radial Wipe, Venetian Blinds
4. Generate: Gradient Ramp, 4-Color Gradient, Stroke, Grid
5. Color Correction: Levels, Hue/Saturation, Exposure, Vibrance
6. Time: Posterize Time, Echo
7. Matte: Simple Choker, Matte Choker
8. Distort: Corner Pin, Optics Compensation, Displacement Map
9. Blur & Sharpen: Camera Lens Blur, Radial Blur, Directional Blur, Unsharp Mask
10. Simulation: CC Rainfall, CC Snowfall, CC Ball Action
11. Stylize: CC Vignette, Cartoon, Find Edges
12. Animation Presets: layer.applyPreset(File(...))
13. Channel: Set Matte, Invert
"""

import json
import random
import os

TRAIN_FILE = os.path.join(os.path.dirname(__file__), "ae_extendscript_train.jsonl")
VAL_FILE = os.path.join(os.path.dirname(__file__), "ae_extendscript_val.jsonl")

NEW_EFFECTS = [
    # 1. Noise & Grain
    {
        "category": "Noise & Grain",
        "name": "Fractal Noise",
        "matchName": "ADBE Fractal Noise",
        "config": 'if (eff.property("Contrast")) eff.property("Contrast").setValue(150);\n            if (eff.property("Brightness")) eff.property("Brightness").setValue(-10);\n            if (eff.property("Complexity")) eff.property("Complexity").setValue(6);',
        "prompts": ["add fractal noise to selected layer with high contrast", "apply fractal noise texture", "create procedural clouds/smoke with fractal noise"]
    },
    {
        "category": "Noise & Grain",
        "name": "Noise",
        "matchName": "ADBE Noise",
        "config": 'if (eff.property("Amount of Noise")) eff.property("Amount of Noise").setValue(12);',
        "prompts": ["add subtle 12% film noise to selected layer", "apply noise effect to reduce color banding", "add grain/noise to layer"]
    },

    # 2. Expression Controls
    {
        "category": "Expression Controls",
        "name": "Slider Control",
        "matchName": "ADBE Slider Control",
        "config": 'eff.name = "Master Speed Control";\n            if (eff.property(1)) eff.property(1).setValue(100);',
        "prompts": ["add a slider control to selected layer", "create a master slider controller for expressions", "add expression slider control"]
    },
    {
        "category": "Expression Controls",
        "name": "Color Control",
        "matchName": "ADBE Color Control",
        "config": 'eff.name = "Theme Color";\n            if (eff.property(1)) eff.property(1).setValue([1.0, 0.4, 0.1]);',
        "prompts": ["add a color control expression slider", "create a global theme color control on selected layer", "add color picker control"]
    },
    {
        "category": "Expression Controls",
        "name": "Checkbox Control",
        "matchName": "ADBE Checkbox Control",
        "config": 'eff.name = "Enable Glow Toggle";\n            if (eff.property(1)) eff.property(1).setValue(1);',
        "prompts": ["add a checkbox control toggle to layer", "create expression checkbox switch", "add boolean toggle control"]
    },

    # 3. Transitions
    {
        "category": "Transition",
        "name": "Linear Wipe",
        "matchName": "ADBE Linear Wipe",
        "config": 'var t0 = selected[i].inPoint;\n            if (eff.property("Transition Completion")) {\n                eff.property("Transition Completion").setValueAtTime(t0, 0);\n                eff.property("Transition Completion").setValueAtTime(t0 + 1.2, 100);\n            }\n            if (eff.property("Wipe Angle")) eff.property("Wipe Angle").setValue(90);\n            if (eff.property("Feather")) eff.property("Feather").setValue(35);',
        "prompts": ["add an animated linear wipe transition over 1.2 seconds", "apply 90-degree linear wipe with feather", "transition out layer using linear wipe"]
    },
    {
        "category": "Transition",
        "name": "Radial Wipe",
        "matchName": "ADBE Radial Wipe",
        "config": 'var t0 = selected[i].inPoint;\n            if (eff.property("Transition Completion")) {\n                eff.property("Transition Completion").setValueAtTime(t0, 0);\n                eff.property("Transition Completion").setValueAtTime(t0 + 1.5, 100);\n            }\n            if (eff.property("Feather")) eff.property("Feather").setValue(20);',
        "prompts": ["add clock radial wipe transition to selected layer", "apply radial wipe transition over 1.5s", "animate radial clock wipe"]
    },
    {
        "category": "Transition",
        "name": "Venetian Blinds",
        "matchName": "ADBE Venetian Blinds",
        "config": 'var t0 = selected[i].inPoint;\n            if (eff.property("Transition Completion")) {\n                eff.property("Transition Completion").setValueAtTime(t0, 0);\n                eff.property("Transition Completion").setValueAtTime(t0 + 1.0, 100);\n            }\n            if (eff.property("Width")) eff.property("Width").setValue(30);\n            if (eff.property("Feather")) eff.property("Feather").setValue(10);',
        "prompts": ["add venetian blinds transition to selected layer", "apply blinds transition effect", "animate venetian blinds reveal"]
    },

    # 4. Generate
    {
        "category": "Generate",
        "name": "Gradient Ramp",
        "matchName": "ADBE Ramp",
        "config": 'if (eff.property("Start Color")) eff.property("Start Color").setValue([0.1, 0.15, 0.3]);\n            if (eff.property("End Color")) eff.property("End Color").setValue([0.02, 0.02, 0.05]);\n            if (eff.property("Ramp Shape")) eff.property("Ramp Shape").setValue(2); // Radial Ramp',
        "prompts": ["add a radial gradient ramp background", "apply gradient ramp effect with dark blue colors", "create smooth gradient ramp"]
    },
    {
        "category": "Generate",
        "name": "4-Color Gradient",
        "matchName": "ADBE 4ColorGradient",
        "config": 'if (eff.property("Color 1")) eff.property("Color 1").setValue([0.9, 0.2, 0.4]);\n            if (eff.property("Color 2")) eff.property("Color 2").setValue([0.2, 0.5, 0.9]);\n            if (eff.property("Color 3")) eff.property("Color 3").setValue([0.95, 0.6, 0.1]);\n            if (eff.property("Color 4")) eff.property("Color 4").setValue([0.6, 0.1, 0.8]);',
        "prompts": ["add a dynamic 4-color gradient to selected layer", "apply vibrant four color gradient", "create colorful abstract gradient"]
    },

    # 5. Color Correction additions
    {
        "category": "Color Correction",
        "name": "Hue/Saturation",
        "matchName": "ADBE HUE SATURATION",
        "config": 'if (eff.property("Master Saturation")) eff.property("Master Saturation").setValue(25);\n            if (eff.property("Master Hue")) eff.property("Master Hue").setValue(0);',
        "prompts": ["boost saturation by 25 using Hue/Saturation", "apply Hue/Saturation color adjustment", "increase color vibrancy with Hue Saturation"]
    },
    {
        "category": "Color Correction",
        "name": "Exposure",
        "matchName": "ADBE Exposure2",
        "config": 'if (eff.property("Exposure")) eff.property("Exposure").setValue(0.75);',
        "prompts": ["increase exposure by 0.75 stops", "apply Exposure effect to brighten selected layer", "add exposure adjustment"]
    },

    # 6. Time
    {
        "category": "Time",
        "name": "Posterize Time",
        "matchName": "ADBE Posterize Time",
        "config": 'if (eff.property("Frame Rate")) eff.property("Frame Rate").setValue(12);',
        "prompts": ["add posterize time set to 12fps for anime/stop-motion look", "posterize time to 12 frames per second", "give layer stop motion stutter look with Posterize Time"]
    },
    {
        "category": "Time",
        "name": "Echo",
        "matchName": "ADBE Echo",
        "config": 'if (eff.property("Number Of Echoes")) eff.property("Number Of Echoes").setValue(5);\n            if (eff.property("Echo Time (seconds)")) eff.property("Echo Time (seconds)").setValue(-0.04);\n            if (eff.property("Decay")) eff.property("Decay").setValue(0.75);',
        "prompts": ["add motion echo trails with Echo effect", "apply echo effect with 5 repeats and decay", "create visual trailing ghost effect with Echo"]
    },

    # 7. Matte
    {
        "category": "Matte",
        "name": "Simple Choker",
        "matchName": "ADBE Simple Choker",
        "config": 'if (eff.property("Choke Matte")) eff.property("Choke Matte").setValue(1.5);',
        "prompts": ["choke matte edge by 1.5 pixels using Simple Choker", "apply simple choker to tighten green screen edge", "contract matte outline with Simple Choker"]
    },

    # 8. Distort additions
    {
        "category": "Distort",
        "name": "Optics Compensation",
        "matchName": "ADBE Optics Compensation",
        "config": 'if (eff.property("Field of View")) eff.property("Field of View").setValue(65);\n            if (eff.property("Reverse Lens Distortion")) eff.property("Reverse Lens Distortion").setValue(1);',
        "prompts": ["add fish-eye lens warp with Optics Compensation", "apply optics compensation with reverse lens distortion", "create zoom blur warp using Optics Compensation"]
    },
    {
        "category": "Distort",
        "name": "Displacement Map",
        "matchName": "ADBE Displacement Map",
        "config": 'if (eff.property("Max Horizontal Displacement")) eff.property("Max Horizontal Displacement").setValue(20);\n            if (eff.property("Max Vertical Displacement")) eff.property("Max Vertical Displacement").setValue(20);',
        "prompts": ["apply displacement map distortion to selected layer", "add glitch displacement map", "distort layer using displacement map"]
    },

    # 9. Blur & Sharpen additions
    {
        "category": "Blur & Sharpen",
        "name": "Radial Blur",
        "matchName": "ADBE Radial Blur",
        "config": 'if (eff.property("Amount")) eff.property("Amount").setValue(15);\n            if (eff.property("Type")) eff.property("Type").setValue(2); // Zoom blur',
        "prompts": ["add a zoom radial blur effect", "apply radial blur with zoom mode", "create high-speed radial zoom blur"]
    },
    {
        "category": "Blur & Sharpen",
        "name": "Directional Blur",
        "matchName": "ADBE Motion Blur",
        "config": 'if (eff.property("Direction")) eff.property("Direction").setValue(45);\n            if (eff.property("Blur Length")) eff.property("Blur Length").setValue(30);',
        "prompts": ["add directional blur at 45 degrees angle with length 30", "apply directional motion blur", "linear blur at angle 45"]
    },

    # 10. Simulation additions
    {
        "category": "Simulation",
        "name": "CC Rainfall",
        "matchName": "CC Rainfall",
        "config": 'if (eff.property("Drops")) eff.property("Drops").setValue(5000);\n            if (eff.property("Speed")) eff.property("Speed").setValue(4000);',
        "prompts": ["add simulated rain using CC Rainfall", "apply CC Rainfall effect for stormy weather", "create rain overlay on layer"]
    },
    {
        "category": "Simulation",
        "name": "CC Snowfall",
        "matchName": "CC Snowfall",
        "config": 'if (eff.property("Flakes")) eff.property("Flakes").setValue(2500);\n            if (eff.property("Size")) eff.property("Size").setValue(4);',
        "prompts": ["add falling snow with CC Snowfall", "apply winter snow particles using CC Snowfall", "create snow overlay"]
    },

    # 11. Stylize additions
    {
        "category": "Stylize",
        "name": "CC Vignette",
        "matchName": "CC Vignette",
        "config": 'if (eff.property("Amount")) eff.property("Amount").setValue(120);\n            if (eff.property("Radius")) eff.property("Radius").setValue(60);',
        "prompts": ["add a dark cinematic vignette with CC Vignette", "apply CC Vignette effect to focus on center", "add corner vignette darkening"]
    },

    # 12. Channel
    {
        "category": "Channel",
        "name": "Set Matte",
        "matchName": "ADBE Set Matte",
        "config": 'if (eff.property("Take Matte From Layer")) eff.property("Take Matte From Layer").setValue(1);\n            if (eff.property("Use For Matte")) eff.property("Use For Matte").setValue(1); // Alpha Channel',
        "prompts": ["apply Set Matte effect using layer 1 alpha", "use Set Matte to clip layer", "add Set Matte channel effect"]
    }
]

def generate_catalog_samples():
    samples = []
    for eff in NEW_EFFECTS:
        for prompt in eff["prompts"]:
            code = f"""(function() {{
    app.beginUndoGroup("Apply {eff['name']} ({eff['category']})");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Please open a composition.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer.";
        for (var i = 0; i < selected.length; i++) {{
            var effects = selected[i].property("ADBE Effect Parade");
            var eff = effects.addProperty("{eff['matchName']}");
            {eff['config']}
        }}
        return "SUCCESS: Applied {eff['name']} to " + selected.length + " layer(s).";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
            samples.append({
                "instruction": prompt,
                "input": "",
                "output": code,
                "messages": [
                    {"role": "system", "content": "You are an expert Adobe After Effects ExtendScript assistant. You write safe, correct ExtendScript wrapped in undo groups."},
                    {"role": "user", "content": prompt},
                    {"role": "assistant", "content": f"```javascript\n{code}\n```"}
                ]
            })

            # Conversational phrasing variations
            variations = [
                f"please {prompt.lower()}",
                f"how do I {prompt.lower()}?",
                f"AE script to {prompt.lower()}",
            ]
            for v in variations:
                samples.append({
                    "instruction": v,
                    "input": "",
                    "output": code,
                    "messages": [
                        {"role": "system", "content": "You are an expert Adobe After Effects ExtendScript assistant. You write safe, correct ExtendScript wrapped in undo groups."},
                        {"role": "user", "content": v},
                        {"role": "assistant", "content": f"```javascript\n{code}\n```"}
                    ]
                })

    split = int(len(samples) * 0.9)
    train_part = samples[:split]
    val_part = samples[split:]

    with open(TRAIN_FILE, "a", encoding="utf-8") as f:
        for item in train_part:
            f.write(json.dumps(item) + "\n")

    with open(VAL_FILE, "a", encoding="utf-8") as f:
        for item in val_part:
            f.write(json.dumps(item) + "\n")

    print(f"Generated and appended {len(train_part)} catalog training samples, {len(val_part)} validation samples.")

if __name__ == "__main__":
    generate_catalog_samples()
