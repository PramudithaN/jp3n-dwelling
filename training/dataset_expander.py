"""
dataset_expander.py - Advanced combinatorial synthesis and augmentor
Expands seed pairs into thousands of high-variance, realistic editor prompts and valid ExtendScript.
"""

import json
import random
import os

TRAIN_FILE = os.path.join(os.path.dirname(__file__), "ae_extendscript_train.jsonl")
VAL_FILE = os.path.join(os.path.dirname(__file__), "ae_extendscript_val.jsonl")

BLEND_MODES = [
    ("Screen", "BlendingMode.SCREEN", ["set blending mode to Screen on selected layers", "change blend mode to Screen", "make selected layers blend mode Screen"]),
    ("Multiply", "BlendingMode.MULTIPLY", ["set blend mode to Multiply", "change layer blending mode to Multiply"]),
    ("Add", "BlendingMode.ADD", ["set blending mode to Add", "change to Add blend mode"]),
    ("Overlay", "BlendingMode.OVERLAY", ["set selected layer blend mode to Overlay", "switch to Overlay blending"]),
    ("Soft Light", "BlendingMode.SOFT_LIGHT", ["change layer blend mode to Soft Light"]),
]

TRACK_MATTES = [
    ("Alpha", "TrackMatteType.ALPHA", ["set alpha matte using the layer above", "apply Alpha track matte"]),
    ("Alpha Inverted", "TrackMatteType.ALPHA_INVERTED", ["set inverted alpha track matte", "apply Alpha Inverted matte"]),
    ("Luma", "TrackMatteType.LUMA", ["apply Luma track matte from layer above"]),
    ("Luma Inverted", "TrackMatteType.LUMA_INVERTED", ["apply Luma Inverted track matte"]),
]

COLOR_GRADES = [
    ("Lumetri Color", "ADBE Lumetri Color", ["apply Lumetri Color to selected layer", "add Lumetri color grading effect"]),
    ("Curves", "ADBE CurvesCustom", ["add Curves color correction effect", "apply Curves adjustment"]),
    ("Tint", "ADBE Tint", ["apply Tint effect to selected layer", "add black and white Tint"]),
    ("Invert", "ADBE Invert", ["invert layer colors with Invert effect", "apply Invert effect"]),
    ("Brightness & Contrast", "ADBE Brightness & Contrast 2", ["add Brightness and Contrast effect"]),
]

def generate_blend_mode_samples():
    samples = []
    for mode_name, enum_val, prompts in BLEND_MODES:
        code = f"""(function() {{
    app.beginUndoGroup("Set Blending Mode to {mode_name}");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer.";
        for (var i = 0; i < selected.length; i++) {{
            selected[i].blendingMode = {enum_val};
        }}
        return "SUCCESS: Set blending mode to {mode_name} on " + selected.length + " layer(s).";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})
    return samples

def generate_track_matte_samples():
    samples = []
    for matte_name, enum_val, prompts in TRACK_MATTES:
        code = f"""(function() {{
    app.beginUndoGroup("Set Track Matte ({matte_name})");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer.";
        for (var i = 0; i < selected.length; i++) {{
            var layer = selected[i];
            var matteLayerIndex = layer.index - 1;
            if (matteLayerIndex >= 1) {{
                var matteLayer = comp.layer(matteLayerIndex);
                layer.setTrackMatte(matteLayer, {enum_val});
            }}
        }}
        return "SUCCESS: Applied {matte_name} track matte.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})
    return samples

def generate_color_grade_samples():
    samples = []
    for eff_name, match_name, prompts in COLOR_GRADES:
        code = f"""(function() {{
    app.beginUndoGroup("Apply {eff_name}");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer.";
        for (var i = 0; i < selected.length; i++) {{
            var effects = selected[i].property("ADBE Effect Parade");
            effects.addProperty("{match_name}");
        }}
        return "SUCCESS: Applied {eff_name} to " + selected.length + " layer(s).";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})
    return samples

def generate_stagger_samples():
    samples = []
    for step_frames in [2, 5, 10, 15, 30]:
        prompts = [
            f"Stagger selected layers sequentially by {step_frames} frames",
            f"Sequence selected layers with a {step_frames}-frame delay between each layer",
            f"Staircase stagger selected layers by {step_frames} frames",
        ]
        code = f"""(function() {{
    app.beginUndoGroup("Stagger Selected Layers");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var selected = comp.selectedLayers;
        if (selected.length < 2) return "ERROR: Please select at least two layers to stagger.";
        var frameDuration = comp.frameDuration;
        var offset = {step_frames} * frameDuration;
        var baseTime = selected[0].inPoint;
        for (var i = 0; i < selected.length; i++) {{
            var dur = selected[i].outPoint - selected[i].inPoint;
            var newIn = baseTime + (i * offset);
            selected[i].startTime = selected[i].startTime + (newIn - selected[i].inPoint);
        }}
        return "SUCCESS: Staggered " + selected.length + " layers by {step_frames} frames.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})
    return samples

def generate_marker_samples():
    samples = []
    markers = ["Intro", "Chorus", "Drop", "Outro", "Cut Here", "Voiceover Start"]
    for m in markers:
        prompts = [
            f"Add a composition marker named '{m}' at the current playhead time",
            f"Create marker '{m}' at current time indicator",
            f"Set comp marker '{m}' at playhead",
        ]
        code = f"""(function() {{
    app.beginUndoGroup("Add Comp Marker");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var markerVal = new MarkerValue("{m}");
        comp.markerProperty.setValueAtTime(comp.time, markerVal);
        return "SUCCESS: Marker '{m}' added at time " + comp.time.toFixed(2) + "s.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})
    return samples

def generate_reposition_samples():
    samples = []
    alignments = [
        ("center of composition", "[comp.width / 2, comp.height / 2]", ["center the selected layer", "align selected layer to comp center"]),
        ("top left corner", "[layer.width / 2, layer.height / 2]", ["move selected layer to top left corner", "align layer to top left"]),
        ("bottom center", "[comp.width / 2, comp.height - (layer.height / 2)]", ["align layer to bottom center", "position at bottom center"]),
    ]
    for align_name, coord_expr, prompts in alignments:
        code = f"""(function() {{
    app.beginUndoGroup("Align Layer to {align_name}");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer.";
        for (var i = 0; i < selected.length; i++) {{
            var layer = selected[i];
            var pos = layer.property("Position");
            if (pos) {{
                pos.setValue({coord_expr});
            }}
        }}
        return "SUCCESS: Aligned to {align_name}.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})
    return samples

def run_augmentation():
    extra_samples = []
    extra_samples.extend(generate_blend_mode_samples())
    extra_samples.extend(generate_track_matte_samples())
    extra_samples.extend(generate_color_grade_samples())
    extra_samples.extend(generate_stagger_samples())
    extra_samples.extend(generate_marker_samples())
    extra_samples.extend(generate_reposition_samples())

    formatted_extra = []
    for item in extra_samples:
        formatted_extra.append({
            "instruction": item["instruction"],
            "input": "",
            "output": item["output"],
            "messages": [
                {"role": "system", "content": "You are an expert Adobe After Effects ExtendScript assistant. You write safe, correct ExtendScript wrapped in undo groups."},
                {"role": "user", "content": item["instruction"]},
                {"role": "assistant", "content": f"```javascript\n{item['output']}\n```"}
            ]
        })

    # Append to existing train and val files
    split = int(len(formatted_extra) * 0.9)
    train_extra = formatted_extra[:split]
    val_extra = formatted_extra[split:]

    with open(TRAIN_FILE, "a", encoding="utf-8") as f:
        for item in train_extra:
            f.write(json.dumps(item) + "\n")

    with open(VAL_FILE, "a", encoding="utf-8") as f:
        for item in val_extra:
            f.write(json.dumps(item) + "\n")

    print(f"Appended {len(train_extra)} augmented samples to train, {len(val_extra)} to val.")

if __name__ == "__main__":
    run_augmentation()
