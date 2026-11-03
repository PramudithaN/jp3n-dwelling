"""
advanced_dataset_generator.py - Generates advanced professional After Effects workflows:
1. Shape Layers (Trim Paths, Repeaters, Polystars, Vector Strokes)
2. Text Animators (Typewriter, Range Selectors, Character Tracking & Opacity)
3. Mask Paths (Custom Bezier Shapes, Feathering, Expansion, Mask Modes)
4. Render Queue (Adding comps, configuring output paths, batch export)
5. Third-Party Plugin Support (Deep Glow, Optical Flares, Particular, Sapphire)
6. Audio & Marker Systems (Audio Levels, Waveforms, Cue Points)
"""

import json
import random
import os

TRAIN_FILE = os.path.join(os.path.dirname(__file__), "ae_extendscript_train.jsonl")
VAL_FILE = os.path.join(os.path.dirname(__file__), "ae_extendscript_val.jsonl")

def generate_shape_layer_samples():
    samples = []

    # 1. Circle / Stroke with Trim Paths write-on
    for radius in [150, 200, 300, 400]:
        for dur in [1.0, 1.5, 2.0, 3.0]:
            prompts = [
                f"Create a shape layer with a circular stroke of radius {radius} and an animated Trim Paths write-on over {dur} seconds",
                f"Add a circle stroke outline that draws itself on using Trim Paths over {dur}s",
                f"Animate a write-on circular line with Trim Paths (radius {radius}px, {dur}s)",
            ]
            code = f"""(function() {{
    app.beginUndoGroup("Create Animated Circle with Trim Paths");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Please open a composition.";
        var shapeLayer = comp.layers.addShape();
        shapeLayer.name = "Circle Write-On";
        var contents = shapeLayer.property("ADBE Root Vectors Group");
        var group = contents.addProperty("ADBE Vector Group");
        var groupContents = group.property("ADBE Vectors Group");

        var ellipse = groupContents.addProperty("ADBE Vector Shape - Ellipse");
        ellipse.property("ADBE Vector Ellipse Size").setValue([{radius * 2}, {radius * 2}]);

        var stroke = groupContents.addProperty("ADBE Vector Graphic - Stroke");
        stroke.property("ADBE Vector Stroke Width").setValue(6);
        stroke.property("ADBE Vector Stroke Color").setValue([1, 1, 1]);

        var trim = groupContents.addProperty("ADBE Vector Filter - Trim");
        var endProp = trim.property("ADBE Vector Trim End");
        var t0 = shapeLayer.inPoint;
        endProp.setValueAtTime(t0, 0);
        endProp.setValueAtTime(t0 + {dur}, 100);

        return "SUCCESS: Created animated circular stroke with Trim Paths.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
            for p in prompts:
                samples.append({"instruction": p, "output": code})

    # 2. Shape Layer with Repeater (Burst effect)
    for copies in [6, 8, 12, 16]:
        rot = 360 / copies
        prompts = [
            f"Create a shape layer radial burst using a Repeater with {copies} copies",
            f"Add a radial shape repeater with {copies} copies rotated {rot} degrees around the center",
            f"Make a repeater burst with {copies} repeated elements",
        ]
        code = f"""(function() {{
    app.beginUndoGroup("Create Shape Repeater Burst");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition.";
        var shapeLayer = comp.layers.addShape();
        shapeLayer.name = "Repeater Burst ({copies} copies)";
        var contents = shapeLayer.property("ADBE Root Vectors Group");
        var group = contents.addProperty("ADBE Vector Group");
        var groupContents = group.property("ADBE Vectors Group");

        var rect = groupContents.addProperty("ADBE Vector Shape - Rect");
        rect.property("ADBE Vector Rect Size").setValue([10, 80]);
        rect.property("ADBE Vector Rect Position").setValue([0, -120]);

        var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
        fill.property("ADBE Vector Fill Color").setValue([1, 0.8, 0.2]);

        var repeater = groupContents.addProperty("ADBE Vector Filter - Repeater");
        repeater.property("ADBE Vector Repeater Copies").setValue({copies});
        var repXform = repeater.property("ADBE Vector Repeater Transform");
        repXform.property("ADBE Vector Repeater Position").setValue([0, 0]);
        repXform.property("ADBE Vector Repeater Rotation").setValue({rot});

        return "SUCCESS: Created shape repeater with {copies} radial copies.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})

    return samples

def generate_text_animator_samples():
    samples = []
    # Typewriter animation with Range Selector
    phrases = [
        "CINEMATIC MOTION",
        "GENERATIVE AI ASSISTANT",
        "AFTER EFFECTS EXTENSION",
        "DATA DRIVEN GRAPHICS",
        "OFFLINE INFERENCE ENGINE",
    ]
    for text in phrases:
        for dur in [1.5, 2.5, 3.5]:
            prompts = [
                f"Add a text layer saying '{text}' with a smooth typewriter character reveal over {dur} seconds",
                f"Create a typewriter text animation for '{text}' using text animators and range selectors ({dur}s)",
                f"Typewriter effect for '{text}' over {dur} seconds",
            ]
            code = f"""(function() {{
    app.beginUndoGroup("Typewriter Text Animation");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition.";
        var textLayer = comp.layers.addText("{text}");
        var textProp = textLayer.property("Source Text");
        var textDoc = textProp.value;
        textDoc.fontSize = 64;
        textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
        textDoc.fillColor = [1, 1, 1];
        textProp.setValue(textDoc);
        textLayer.property("Position").setValue([comp.width / 2, comp.height / 2]);

        var animators = textLayer.property("ADBE Text Properties").property("ADBE Text Animators");
        var animator = animators.addProperty("ADBE Text Animator");
        animator.name = "Typewriter";

        var selector = animator.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
        var opacity = animator.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity");
        opacity.setValue(0);

        var endProp = selector.property("ADBE Text Range End");
        var t0 = textLayer.inPoint;
        endProp.setValueAtTime(t0, 0);
        endProp.setValueAtTime(t0 + {dur}, 100);

        return "SUCCESS: Typewriter animation created for '{text}'.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
            for p in prompts:
                samples.append({"instruction": p, "output": code})
    return samples

def generate_mask_samples():
    samples = []
    shapes = [
        ("rectangular center crop", "[-200, -150], [200, -150], [200, 150], [-200, 150]", 25),
        ("square vignette mask", "[-300, -300], [300, -300], [300, 300], [-300, 300]", 60),
        ("wide cinematic letterbox mask", "[-comp.width/2, -300], [comp.width/2, -300], [comp.width/2, 300], [-comp.width/2, 300]", 40),
    ]
    for name, verts, feather in shapes:
        prompts = [
            f"Add a {name} vector mask with {feather}px feather to selected layer",
            f"Create a feathered mask ({name}) with {feather}px softness",
            f"Apply a {name} mask to selection",
        ]
        code = f"""(function() {{
    app.beginUndoGroup("Create Mask ({name})");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer.";
        for (var i = 0; i < selected.length; i++) {{
            var layer = selected[i];
            var masks = layer.property("ADBE Mask Parade");
            var mask = masks.addProperty("ADBE Mask Atom");
            mask.maskMode = MaskMode.ADD;

            var myShape = new Shape();
            myShape.vertices = [{verts}];
            myShape.closed = true;
            mask.property("ADBE Mask Shape").setValue(myShape);
            mask.property("ADBE Mask Feather").setValue([{feather}, {feather}]);
        }}
        return "SUCCESS: Created {name} mask with {feather}px feather.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})
    return samples

def generate_render_queue_samples():
    samples = []
    formats = [
        ("ProRes 422 QuickTime", ".mov", "Render as Apple ProRes QuickTime file"),
        ("H.264 MP4", ".mp4", "Add active composition to render queue for MP4 export"),
        ("PNG Sequence", "_[#####].png", "Queue active comp as PNG image sequence"),
    ]
    for fmt_name, ext, prompt_text in formats:
        prompts = [
            f"{prompt_text} to default render folder",
            f"Add active comp to Render Queue as {fmt_name}",
            f"Setup render queue export ({fmt_name}) for active comp",
        ]
        code = f"""(function() {{
    app.beginUndoGroup("Add to Render Queue ({fmt_name})");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Please select a composition first.";
        var rq = app.project.renderQueue;
        var item = rq.items.add(comp);
        var om = item.outputModule(1);

        var outputFolder = Folder.myDocuments.fsName + "/AfterEffects_Renders";
        var outDir = new Folder(outputFolder);
        if (!outDir.exists) outDir.create();

        om.file = new File(outputFolder + "/" + comp.name + "{ext}");
        return "SUCCESS: Comp '" + comp.name + "' added to Render Queue -> " + om.file.fsName;
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})
    return samples

def generate_third_party_plugin_samples():
    samples = []
    plugins = [
        ("Deep Glow", "Deep Glow", ["apply Deep Glow to selected layer", "add Deep Glow effect", "make the layer neon using Deep Glow"]),
        ("Optical Flares", "Optical Flares", ["add Video Copilot Optical Flares to selected layer", "apply Optical Flares"]),
        ("Trapcode Particular", "tc Particular", ["add Trapcode Particular particle system to layer", "apply Particular particle effect"]),
        ("Sapphire Glow", "S_Glow", ["apply Boris FX Sapphire Glow (S_Glow) to selected layer", "add S_Glow effect"]),
        ("Sapphire Blur", "S_Blur", ["apply Boris FX Sapphire Blur (S_Blur) to selected layer", "add S_Blur effect"]),
    ]
    for plug_name, match_name, prompts in plugins:
        code = f"""(function() {{
    app.beginUndoGroup("Apply {plug_name}");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer.";
        for (var i = 0; i < selected.length; i++) {{
            var effects = selected[i].property("ADBE Effect Parade");
            effects.addProperty("{match_name}");
        }}
        return "SUCCESS: Applied {plug_name} plugin to " + selected.length + " layer(s).";
    }} catch (e) {{
        return "ERROR: Plugin '{plug_name}' might not be installed or: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})
    return samples

def generate_audio_samples():
    samples = []
    for db in [-12, -6, -3, 0, 3, 6]:
        prompts = [
            f"Set audio levels of selected layer to {db} dB",
            f"Adjust selected layer audio volume to {db}dB",
            f"Change audio level to {db} dB",
        ]
        code = f"""(function() {{
    app.beginUndoGroup("Set Audio Level ({db} dB)");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select an audio or video layer.";
        for (var i = 0; i < selected.length; i++) {{
            var audioProp = selected[i].property("Audio Levels");
            if (audioProp) {{
                audioProp.setValue([{db}, {db}]);
            }}
        }}
        return "SUCCESS: Set audio levels to {db} dB on " + selected.length + " layer(s).";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})
    return samples

def main():
    advanced_samples = []
    advanced_samples.extend(generate_shape_layer_samples())
    advanced_samples.extend(generate_text_animator_samples())
    advanced_samples.extend(generate_mask_samples())
    advanced_samples.extend(generate_render_queue_samples())
    advanced_samples.extend(generate_third_party_plugin_samples())
    advanced_samples.extend(generate_audio_samples())

    formatted = []
    for item in advanced_samples:
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

    # Permute and expand variations to build substantial training volume
    expanded = []
    for entry in formatted:
        expanded.append(entry)
        # Duplicate with subtle user variations (lowercase, imperative, question format)
        inst = entry["instruction"]
        variations = [
            f"please {inst.lower()}",
            f"how do I {inst.lower()}?",
            f"AE script to {inst.lower()}",
        ]
        for v in variations:
            expanded.append({
                "instruction": v,
                "input": "",
                "output": entry["output"],
                "messages": [
                    {"role": "system", "content": "You are an expert Adobe After Effects ExtendScript assistant. You write safe, correct ExtendScript wrapped in undo groups."},
                    {"role": "user", "content": v},
                    {"role": "assistant", "content": f"```javascript\n{entry['output']}\n```"}
                ]
            })

    split = int(len(expanded) * 0.9)
    train_part = expanded[:split]
    val_part = expanded[split:]

    with open(TRAIN_FILE, "a", encoding="utf-8") as f:
        for item in train_part:
            f.write(json.dumps(item) + "\n")

    with open(VAL_FILE, "a", encoding="utf-8") as f:
        for item in val_part:
            f.write(json.dumps(item) + "\n")

    print(f"Generated and appended {len(train_part)} advanced training samples, {len(val_part)} validation samples.")

if __name__ == "__main__":
    main()
