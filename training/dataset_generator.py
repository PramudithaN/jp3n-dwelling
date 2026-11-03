"""
dataset_generator.py - After Effects ExtendScript Synthetic Dataset Generator
Generates high-quality, verified training pairs (Prompt -> Valid ExtendScript)
for fine-tuning small LLMs (e.g. Qwen 2.5 Coder 1.5B).
"""

import json
import random
import os

OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "ae_extendscript_train.jsonl")
VAL_FILE = os.path.join(os.path.dirname(__file__), "ae_extendscript_val.jsonl")

# 1. Colors Catalog [R, G, B] normalized 0.0 - 1.0
COLORS = [
    ("red", [1.0, 0.1, 0.1]),
    ("deep blue", [0.05, 0.2, 0.8]),
    ("cyan", [0.0, 0.9, 0.9]),
    ("dark charcoal", [0.1, 0.1, 0.12]),
    ("pure black", [0.0, 0.0, 0.0]),
    ("pure white", [1.0, 1.0, 1.0]),
    ("emerald green", [0.1, 0.8, 0.3]),
    ("sunset orange", [1.0, 0.45, 0.1]),
    ("hot pink", [1.0, 0.2, 0.6]),
    ("purple", [0.55, 0.1, 0.85]),
    ("golden yellow", [1.0, 0.8, 0.1]),
]

# 2. Resolutions & Aspect Ratios
RESOLUTIONS = [
    ("1080p full HD", 1920, 1080, 1.0),
    ("4K UHD", 3840, 2160, 1.0),
    ("vertical 9:16 (TikTok/Reel)", 1080, 1920, 1.0),
    ("square 1:1", 1080, 1080, 1.0),
    ("720p HD", 1280, 720, 1.0),
]

FRAME_RATES = [24, 25, 29.97, 30, 60]
DURATIONS = [3, 5, 10, 15, 30]

# 3. Effects Match Names and Setup
EFFECTS_CATALOG = [
    {
        "name": "Gaussian Blur",
        "matchName": "ADBE Gaussian Blur 2",
        "property": "Blurriness",
        "param": "Blurriness",
        "values": [10, 25, 50, 80],
        "prompt_phrasings": ["add a gaussian blur of {val} to the selected layer", "apply gaussian blur with blurriness {val}"]
    },
    {
        "name": "Fast Box Blur",
        "matchName": "ADBE Box Blur2",
        "property": "Blur Radius",
        "param": "Blur Radius",
        "values": [5, 15, 30, 60],
        "prompt_phrasings": ["blur the selected layer using fast box blur with radius {val}", "add fast box blur at {val}px"]
    },
    {
        "name": "Glow",
        "matchName": "ADBE Glow2",
        "property": "Glow Radius",
        "param": "Glow Radius",
        "values": [20, 50, 100, 150],
        "prompt_phrasings": ["add a stylize glow effect with radius {val} to selected layer", "make the layer glow with radius {val}"]
    },
    {
        "name": "Drop Shadow",
        "matchName": "ADBE Drop Shadow",
        "property": "Distance",
        "param": "Distance",
        "values": [10, 20, 35, 50],
        "prompt_phrasings": ["add a drop shadow with distance {val} to selected layer", "apply drop shadow effect at distance {val}"]
    },
    {
        "name": "Fill",
        "matchName": "ADBE Fill",
        "property": "Color",
        "param": "Color",
        "values": [[1, 0, 0], [0, 0.5, 1], [0.1, 0.8, 0.2], [1, 1, 1]],
        "prompt_phrasings": ["apply a fill effect with custom color to selected layer", "add fill effect to the layer"]
    },
    {
        "name": "Motion Tile",
        "matchName": "ADBE Motion Tile",
        "property": "Output Width",
        "param": "Output Width",
        "values": [200, 300, 400],
        "prompt_phrasings": ["add motion tile and set output width and height to {val}% with mirror edges checked", "apply motion tile {val}%"]
    },
    {
        "name": "Turbulent Displace",
        "matchName": "ADBE Turbulent Displace",
        "property": "Amount",
        "param": "Amount",
        "values": [15, 35, 50, 80],
        "prompt_phrasings": ["add turbulent displace with amount {val}", "apply turbulent displacement distortion to layer with strength {val}"]
    }
]

def generate_comp_samples():
    samples = []
    for res_name, w, h, par in RESOLUTIONS:
        for fps in [24, 30, 60]:
            for dur in [5, 10, 15]:
                comp_name = f"My {res_name.split()[0]} Comp"
                prompts = [
                    f"Create a new {res_name} composition at {fps} fps for {dur} seconds",
                    f"Make a composition called '{comp_name}' with resolution {w}x{h}, {dur}s duration at {fps} frames per second",
                    f"Setup a {dur}-second {res_name} comp at {fps}fps",
                ]
                code = f"""(function() {{
    app.beginUndoGroup("Create New Composition");
    try {{
        var proj = app.project || app.newProject();
        var comp = proj.items.addComp("{comp_name}", {w}, {h}, {par}, {dur}, {fps});
        comp.openInViewer();
        return "SUCCESS: Composition created ({w}x{h}, {dur}s, {fps}fps)";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
                for p in prompts:
                    samples.append({"instruction": p, "output": code})
    return samples

def generate_solid_samples():
    samples = []
    for color_name, rgb in COLORS:
        for res_name, w, h, _ in RESOLUTIONS[:3]:
            prompts = [
                f"Create a {color_name} solid layer in the active composition",
                f"Add a {color_name} background solid of size {w}x{h}",
                f"Make a new solid layer with {color_name} color",
            ]
            r, g, b = [round(x, 2) for x in rgb]
            code = f"""(function() {{
    app.beginUndoGroup("Create Solid Layer");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Please select or open a composition first.";
        var solid = comp.layers.addSolid([{r}, {g}, {b}], "{color_name.title()} Solid", {w}, {h}, comp.pixelAspect, comp.duration);
        return "SUCCESS: Created {color_name} solid layer.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
            for p in prompts:
                samples.append({"instruction": p, "output": code})
    return samples

def generate_text_samples():
    samples = []
    phrases = [
        "WELCOME TO THE SHOW",
        "MOTION GRAPHICS",
        "NEW EPISODE",
        "SUBSCRIBE NOW",
        "LIVELY BABBAGE",
        "BREAKING NEWS",
        "CREATIVE DIRECTOR",
    ]
    for text in phrases:
        for size in [60, 80, 120]:
            prompts = [
                f"Add a center-aligned text layer with text '{text}' and font size {size}",
                f"Create a text layer saying '{text}' at size {size}px in the center",
                f"Insert text '{text}' centered on screen",
            ]
            code = f"""(function() {{
    app.beginUndoGroup("Add Centered Text");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Please open a composition.";
        var textLayer = comp.layers.addText("{text}");
        var textProp = textLayer.property("Source Text");
        var textDoc = textProp.value;
        textDoc.fontSize = {size};
        textDoc.fillColor = [1, 1, 1];
        textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
        textProp.setValue(textDoc);
        textLayer.property("Position").setValue([comp.width / 2, comp.height / 2]);
        return "SUCCESS: Text layer created: '{text}'";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
            for p in prompts:
                samples.append({"instruction": p, "output": code})
    return samples

def generate_expression_samples():
    samples = []
    freq_amp = [(2, 20), (3, 35), (4, 50), (5, 80), (8, 15)]
    for freq, amp in freq_amp:
        prompts = [
            f"Add a position wiggle expression of frequency {freq} and amplitude {amp} to the selected layer",
            f"Wiggle the position of selected layer with {freq} wiggles per second and {amp} pixels magnitude",
            f"Apply wiggle({freq}, {amp}) to selected layers position",
        ]
        code = f"""(function() {{
    app.beginUndoGroup("Apply Position Wiggle");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer.";
        for (var i = 0; i < selected.length; i++) {{
            var pos = selected[i].property("Position");
            if (pos && pos.canSetExpression) {{
                pos.expression = "wiggle({freq}, {amp});";
            }}
        }}
        return "SUCCESS: Wiggle expression applied to " + selected.length + " layer(s).";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})

    # Rotation time expression
    for speed in [30, 45, 90, 180, 360]:
        prompts = [
            f"Make the selected layer continuously rotate at {speed} degrees per second",
            f"Add a rotation expression time * {speed} to selected layer",
            f"Continuous spin animation on rotation at {speed} deg/sec",
        ]
        code = f"""(function() {{
    app.beginUndoGroup("Apply Continuous Rotation");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer.";
        for (var i = 0; i < selected.length; i++) {{
            var rot = selected[i].property("Rotation") || selected[i].property("Z Rotation");
            if (rot && rot.canSetExpression) {{
                rot.expression = "time * {speed};";
            }}
        }}
        return "SUCCESS: Continuous rotation ({speed} deg/s) applied.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})

    # LoopOut pingpong and cycle
    for loop_type in ["cycle", "pingpong"]:
        prompts = [
            f"Add loopOut('{loop_type}') expression to all keyframed properties on selected layer",
            f"Loop keyframes continuously on selected layer using {loop_type}",
            f"Make animations on selected layer repeat with loopOut('{loop_type}')",
        ]
        code = f"""(function() {{
    app.beginUndoGroup("Apply loopOut({loop_type})");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select a layer.";
        var count = 0;
        for (var i = 0; i < selected.length; i++) {{
            var layer = selected[i];
            var props = ["Position", "Scale", "Opacity", "Rotation"];
            for (var p = 0; p < props.length; p++) {{
                var prop = layer.property(props[p]);
                if (prop && prop.numKeys > 1 && prop.canSetExpression) {{
                    prop.expression = 'loopOut("{loop_type}");';
                    count++;
                }}
            }}
        }}
        return "SUCCESS: Applied loopOut('{loop_type}') to " + count + " properties.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})

    return samples

def generate_effect_samples():
    samples = []
    for eff in EFFECTS_CATALOG:
        m_name = eff["matchName"]
        for val in eff["values"]:
            for phrasing in eff["prompt_phrasings"]:
                prompt = phrasing.format(val=val)
                val_repr = json.dumps(val)
                code = f"""(function() {{
    app.beginUndoGroup("Apply {eff['name']}");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Please open a composition.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer.";
        for (var i = 0; i < selected.length; i++) {{
            var layer = selected[i];
            var effects = layer.property("ADBE Effect Parade");
            var effect = effects.addProperty("{m_name}");
            if (effect && effect.property("{eff['property']}")) {{
                effect.property("{eff['property']}").setValue({val_repr});
            }}
        }}
        return "SUCCESS: Added {eff['name']} to " + selected.length + " layer(s).";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
                samples.append({"instruction": prompt, "output": code})
    return samples

def generate_keyframing_samples():
    samples = []
    # Fade in / fade out
    for dur in [0.5, 1.0, 1.5, 2.0]:
        prompts = [
            f"Fade in opacity of selected layer from 0 to 100 over {dur} seconds",
            f"Animate selected layer opacity from 0% to 100% in {dur}s",
            f"Add opacity fade-in over {dur}s starting at layer in-point",
        ]
        code = f"""(function() {{
    app.beginUndoGroup("Animate Opacity Fade In");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer.";
        for (var i = 0; i < selected.length; i++) {{
            var op = selected[i].property("Opacity");
            var t0 = selected[i].inPoint;
            var t1 = t0 + {dur};
            op.setValueAtTime(t0, 0);
            op.setValueAtTime(t1, 100);
        }}
        return "SUCCESS: Opacity fade-in applied over {dur}s.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})

    # Scale pop animation
    prompts = [
        "Animate scale pop bounce-in on selected layer (0% to 115% to 100%)",
        "Add a snappy scale pop animation on layer entrance",
        "Make selected layer pop in with scale keyframes",
    ]
    code = """(function() {
    app.beginUndoGroup("Scale Pop In");
    try {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer.";
        for (var i = 0; i < selected.length; i++) {
            var scale = selected[i].property("Scale");
            var t0 = selected[i].inPoint;
            scale.setValueAtTime(t0, [0, 0]);
            scale.setValueAtTime(t0 + 0.35, [115, 115]);
            scale.setValueAtTime(t0 + 0.5, [95, 95]);
            scale.setValueAtTime(t0 + 0.65, [100, 100]);
        }
        return "SUCCESS: Scale pop animation added.";
    } catch (e) {
        return "ERROR: " + e.toString();
    } finally {
        app.endUndoGroup();
    }
})();"""
    for p in prompts:
        samples.append({"instruction": p, "output": code})

    return samples

def generate_null_and_camera_samples():
    samples = []
    # Create Null and Parent
    prompts = [
        "Create a controller Null object and parent all selected layers to it",
        "Add a null layer and link selected layers to the null",
        "Create parent null controller for selection",
    ]
    code = """(function() {
    app.beginUndoGroup("Create Controller Null");
    try {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer to parent.";
        var nullLayer = comp.layers.addNull();
        nullLayer.name = "Controller Null";
        for (var i = 0; i < selected.length; i++) {
            selected[i].parent = nullLayer;
        }
        return "SUCCESS: Created 'Controller Null' and parented " + selected.length + " layer(s).";
    } catch (e) {
        return "ERROR: " + e.toString();
    } finally {
        app.endUndoGroup();
    }
})();"""
    for p in prompts:
        samples.append({"instruction": p, "output": code})

    # Add Camera
    prompts = [
        "Create a 3D camera layer (50mm lens) and an orbit null controller",
        "Add a 50mm 3D camera with target controller null",
        "Setup a 3D camera rig in the active comp",
    ]
    code = """(function() {
    app.beginUndoGroup("Setup 3D Camera Rig");
    try {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var orbitNull = comp.layers.addNull();
        orbitNull.name = "Camera Orbit Controller";
        orbitNull.threeDLayer = true;
        orbitNull.property("Position").setValue([comp.width / 2, comp.height / 2, 0]);

        var camera = comp.layers.addCamera("Main Camera", [comp.width / 2, comp.height / 2]);
        camera.parent = orbitNull;
        return "SUCCESS: Created 3D Camera rig with 'Camera Orbit Controller'.";
    } catch (e) {
        return "ERROR: " + e.toString();
    } finally {
        app.endUndoGroup();
    }
})();"""
    for p in prompts:
        samples.append({"instruction": p, "output": code})

    # Add Adjustment Layer
    prompts = [
        "Create an adjustment layer on top of all layers",
        "Add a new adjustment layer for color grading",
        "Make an adjustment layer across the whole comp",
    ]
    code = """(function() {
    app.beginUndoGroup("Create Adjustment Layer");
    try {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var adj = comp.layers.addSolid([1, 1, 1], "Adjustment Layer", comp.width, comp.height, comp.pixelAspect, comp.duration);
        adj.adjustmentLayer = true;
        adj.moveToBeginning();
        return "SUCCESS: Created top-level Adjustment Layer.";
    } catch (e) {
        return "ERROR: " + e.toString();
    } finally {
        app.endUndoGroup();
    }
})();"""
    for p in prompts:
        samples.append({"instruction": p, "output": code})

    return samples

def main():
    all_samples = []
    all_samples.extend(generate_comp_samples())
    all_samples.extend(generate_solid_samples())
    all_samples.extend(generate_text_samples())
    all_samples.extend(generate_expression_samples())
    all_samples.extend(generate_effect_samples())
    all_samples.extend(generate_keyframing_samples())
    all_samples.extend(generate_null_and_camera_samples())

    random.seed(42)
    random.shuffle(all_samples)

    # Format for standard Chat / Alpaca dataset
    formatted = []
    for item in all_samples:
        formatted.append({
            "instruction": item["instruction"],
            "input": "",
            "output": item["output"],
            "messages": [
                {"role": "system", "content": "You are an expert Adobe After Effects ExtendScript assistant. You write safe, correct ExtendScript wrapped in undo groups."},
                {"role": "user", "content": item["instruction"]},
                {"role": "assistant", "content": f"```javascript\n{item['output']}\n```"}
            ]
        })

    # 90% train / 10% validation split
    split_idx = int(len(formatted) * 0.9)
    train_data = formatted[:split_idx]
    val_data = formatted[split_idx:]

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        for entry in train_data:
            f.write(json.dumps(entry) + "\n")

    with open(VAL_FILE, "w", encoding="utf-8") as f:
        for entry in val_data:
            f.write(json.dumps(entry) + "\n")

    print(f"Generated {len(train_data)} training samples -> {OUTPUT_FILE}")
    print(f"Generated {len(val_data)} validation samples -> {VAL_FILE}")

if __name__ == "__main__":
    main()
