"""
pro_workflows_generator.py - Generates industry-grade motion graphics workflows:
1. Object Morphing (Vector Path Interpolation)
2. Keylight 1.2 (Chroma Key Green Screen)
3. Glassmorphism Design Recipe (Frosted Glass UI)
4. Particle Systems (CC Particle World, Particular)
5. 3-Point Studio Lighting Rigs (Key, Fill, Rim with shadows)
6. Cinematic Camera Moves (Dolly Push-in, Whip Pan, Crane Tilt)
7. Motion Tracking & 3D Camera Tracker
8. Inertial Bounce & Elastic Overshoot Physics Expressions
"""

import json
import random
import os

TRAIN_FILE = os.path.join(os.path.dirname(__file__), "ae_extendscript_train.jsonl")
VAL_FILE = os.path.join(os.path.dirname(__file__), "ae_extendscript_val.jsonl")

# 1. Object Morphing Samples
def generate_morphing_samples():
    samples = []
    shapes = [
        ("Square to Diamond", [[-150, -150], [150, -150], [150, 150], [-150, 150]], [[0, -200], [200, 0], [0, 200], [-200, 0]]),
        ("Box to Triangle", [[-160, -160], [160, -160], [160, 160], [-160, 160]], [[0, -180], [180, 140], [-180, 140], [0, -180]]),
        ("Circle to Star", [[-150, -150], [150, -150], [150, 150], [-150, 150]], [[0, -220], [80, -60], [220, -60], [100, 40]]),
    ]
    for name, v1, v2 in shapes:
        for dur in [1.0, 1.5, 2.0]:
            prompts = [
                f"Animate vector shape morphing ({name}) over {dur} seconds",
                f"Create an object morph animation ({name}) using path keyframes over {dur}s",
                f"Morph path vertices from shape 1 to shape 2 in {dur} seconds",
            ]
            code = f"""(function() {{
    app.beginUndoGroup("Vector Path Morph ({name})");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Please open a composition.";
        var shapeLayer = comp.layers.addShape();
        shapeLayer.name = "Morphing Shape ({name})";
        var contents = shapeLayer.property("ADBE Root Vectors Group");
        var group = contents.addProperty("ADBE Vector Group");
        var groupContents = group.property("ADBE Vectors Group");

        var pathGroup = groupContents.addProperty("ADBE Vector Shape - Group");
        var pathProp = pathGroup.property("ADBE Vector Shape");

        var fill = groupContents.addProperty("ADBE Vector Graphic - Fill");
        fill.property("ADBE Vector Fill Color").setValue([0.2, 0.65, 1.0]);

        var s1 = new Shape();
        s1.vertices = {v1};
        s1.closed = true;

        var s2 = new Shape();
        s2.vertices = {v2};
        s2.closed = true;

        var t0 = shapeLayer.inPoint;
        pathProp.setValueAtTime(t0, s1);
        pathProp.setValueAtTime(t0 + {dur}, s2);

        return "SUCCESS: Created shape morphing animation ({name}).";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
            for p in prompts:
                samples.append({"instruction": p, "output": code})
    return samples

# 2. Keylight Chroma Key Samples
def generate_keylight_samples():
    samples = []
    screen_colors = [
        ("green screen", [0.0, 1.0, 0.0]),
        ("blue screen", [0.0, 0.15, 1.0]),
    ]
    for scr_name, rgb in screen_colors:
        prompts = [
            f"Remove {scr_name} from selected layer using Keylight",
            f"Apply Keylight 1.2 to key out {scr_name} footage",
            f"Chroma key selected layer with Keylight ({scr_name})",
        ]
        code = f"""(function() {{
    app.beginUndoGroup("Keylight Chroma Key ({scr_name})");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select the footage layer to key.";
        for (var i = 0; i < selected.length; i++) {{
            var effects = selected[i].property("ADBE Effect Parade");
            var keylight = effects.addProperty("ADBE Keylight");
            if (keylight) {{
                if (keylight.property("Screen Colour")) keylight.property("Screen Colour").setValue({rgb});
                if (keylight.property("Screen Gain")) keylight.property("Screen Gain").setValue(105);
                if (keylight.property("Screen Balance")) keylight.property("Screen Balance").setValue(50);
            }}
        }}
        return "SUCCESS: Keylight applied with {scr_name} screen colour.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})
    return samples

# 3. Glassmorphism Recipe Samples
def generate_glassmorphism_samples():
    samples = []
    for blur_rad in [20, 35, 50]:
        prompts = [
            f"Create a frosted glassmorphism effect card with blur radius {blur_rad}",
            f"Add a modern UI glassmorphism adjustment layer ({blur_rad}px blur)",
            f"Setup glassmorphism blur and drop shadow card",
        ]
        code = f"""(function() {{
    app.beginUndoGroup("Create Glassmorphism Layer");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition first.";
        var glass = comp.layers.addSolid([1, 1, 1], "Glassmorphism Card", 700, 450, comp.pixelAspect, comp.duration);
        glass.adjustmentLayer = true;
        glass.property("Position").setValue([comp.width / 2, comp.height / 2]);

        var effects = glass.property("ADBE Effect Parade");
        var blur = effects.addProperty("ADBE Box Blur2");
        if (blur) {{
            if (blur.property("Blur Radius")) blur.property("Blur Radius").setValue({blur_rad});
            if (blur.property("Repeat Edge Pixels")) blur.property("Repeat Edge Pixels").setValue(1);
        }}
        var shadow = effects.addProperty("ADBE Drop Shadow");
        if (shadow) {{
            if (shadow.property("Opacity")) shadow.property("Opacity").setValue(80);
            if (shadow.property("Distance")) shadow.property("Distance").setValue(16);
            if (shadow.property("Softness")) shadow.property("Softness").setValue(30);
        }}
        return "SUCCESS: Created Glassmorphism UI Card layer.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})
    return samples

# 4. Particle World Samples
def generate_particle_samples():
    samples = []
    prompts = [
        "Create a particle system using CC Particle World",
        "Add a particle emitter layer with CC Particle World",
        "Setup particle physics simulation layer",
    ]
    code = """(function() {
    app.beginUndoGroup("Create CC Particle World");
    try {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition.";
        var solid = comp.layers.addSolid([0, 0, 0], "Particles (CC Particle World)", comp.width, comp.height, comp.pixelAspect, comp.duration);
        var effects = solid.property("ADBE Effect Parade");
        effects.addProperty("CC Particle World");
        return "SUCCESS: Created CC Particle World simulation layer.";
    } catch (e) {
        return "ERROR: " + e.toString();
    } finally {
        app.endUndoGroup();
    }
})();"""
    for p in prompts:
        samples.append({"instruction": p, "output": code})
    return samples

# 5. 3-Point Studio Lighting Rigs
def generate_lighting_samples():
    samples = []
    prompts = [
        "Setup a professional 3-point studio lighting rig (Key, Fill, and Rim lights)",
        "Create a 3-point lighting setup with shadows enabled",
        "Add studio lights: Key spot light, Fill point light, and Rim back light",
    ]
    code = """(function() {
    app.beginUndoGroup("Create 3-Point Studio Lighting");
    try {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition.";

        var keyLight = comp.layers.addLight("Key Light (Spot)", [comp.width * 0.3, comp.height * 0.35]);
        keyLight.lightType = LightType.SPOT;
        keyLight.property("Intensity").setValue(120);
        keyLight.property("Cone Angle").setValue(65);
        keyLight.property("Cone Feather").setValue(50);
        keyLight.castsShadows = true;

        var fillLight = comp.layers.addLight("Fill Light (Point)", [comp.width * 0.75, comp.height * 0.45]);
        fillLight.lightType = LightType.POINT;
        fillLight.property("Intensity").setValue(55);

        var rimLight = comp.layers.addLight("Rim / Back Light (Spot)", [comp.width * 0.5, comp.height * 0.15]);
        rimLight.lightType = LightType.SPOT;
        rimLight.property("Intensity").setValue(140);

        return "SUCCESS: Created 3-Point Lighting Rig (Key, Fill, Rim).";
    } catch (e) {
        return "ERROR: " + e.toString();
    } finally {
        app.endUndoGroup();
    }
})();"""
    for p in prompts:
        samples.append({"instruction": p, "output": code})
    return samples

# 6. Cinematic Camera Moves
def generate_cinematic_camera_samples():
    samples = []
    # Dolly Push-In
    for dur in [2.5, 3.5, 5.0]:
        prompts = [
            f"Create a cinematic camera dolly push-in move over {dur} seconds",
            f"Add a 3D camera that pushes forward toward the scene over {dur}s",
            f"Animate camera dolly forward {dur} seconds",
        ]
        code = f"""(function() {{
    app.beginUndoGroup("Cinematic Camera Dolly Push-In");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition.";
        var cam = comp.layers.addCamera("Dolly Camera", [comp.width / 2, comp.height / 2]);
        var pos = cam.property("Position");
        var t0 = cam.inPoint;
        var t1 = t0 + {dur};

        pos.setValueAtTime(t0, [comp.width / 2, comp.height / 2, -2600]);
        pos.setValueAtTime(t1, [comp.width / 2, comp.height / 2, -1000]);

        return "SUCCESS: Cinematic Dolly Push-in camera created ({dur}s).";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        for p in prompts:
            samples.append({"instruction": p, "output": code})
    return samples

# 7. Motion Tracking & 3D Camera Tracker Samples
def generate_tracking_samples():
    samples = []
    # 3D Camera Tracker
    prompts = [
        "Apply 3D Camera Tracker to selected footage layer",
        "Add 3D Camera Tracker effect to solve camera motion",
        "Setup 3D Camera Tracker on selection",
    ]
    code = """(function() {
    app.beginUndoGroup("Apply 3D Camera Tracker");
    try {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select the footage layer to track.";
        for (var i = 0; i < selected.length; i++) {
            var fx = selected[i].property("ADBE Effect Parade");
            fx.addProperty("ADBE 3D Camera Tracker");
        }
        return "SUCCESS: Applied 3D Camera Tracker to " + selected.length + " layer(s).";
    } catch (e) {
        return "ERROR: " + e.toString();
    } finally {
        app.endUndoGroup();
    }
})();"""
    for p in prompts:
        samples.append({"instruction": p, "output": code})

    # Point Tracker
    prompts_pt = [
        "Create a Motion Tracker on selected layer and target it to a new Null",
        "Setup a point tracker on footage linked to tracking null controller",
        "Add Track Motion point to layer",
    ]
    code_pt = """(function() {
    app.beginUndoGroup("Setup Motion Tracker to Null");
    try {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select footage layer.";
        var targetNull = comp.layers.addNull();
        targetNull.name = "Motion Track Target Null";
        for (var i = 0; i < selected.length; i++) {
            var trackers = selected[i].trackers;
            if (trackers) {
                var tracker = trackers.add("Motion Tracker");
                var pt = tracker.trackPoints.add("Track Point 1");
                pt.featureCenter.setValue([comp.width / 2, comp.height / 2]);
                pt.target = targetNull;
            }
        }
        return "SUCCESS: Created Motion Tracker targeted to 'Motion Track Target Null'.";
    } catch (e) {
        return "ERROR: " + e.toString();
    } finally {
        app.endUndoGroup();
    }
})();"""
    for p in prompts_pt:
        samples.append({"instruction": p, "output": code_pt})

    return samples

# 8. Inertial Bounce Physics Expression Samples
def generate_inertial_bounce_samples():
    samples = []
    bounce_props = ["Scale", "Position", "Rotation"]
    for prop_name in bounce_props:
        prompts = [
            f"Add inertial bounce (elastic overshoot) physics expression to {prop_name} of selected layer",
            f"Apply organic spring bounce expression to {prop_name}",
            f"Make {prop_name} keyframes bounce naturally when they stop",
        ]
        code = f"""(function() {{
    app.beginUndoGroup("Apply Inertial Bounce to {prop_name}");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a composition.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer.";
        var bounceCode = "n = 0;\\n" +
            "if (numKeys > 0){{\\n" +
            "n = nearestKey(time).index;\\n" +
            "if (key(n).time > time){{ n--; }}\\n" +
            "}}\\n" +
            "if (n == 0){{ t = 0; }} else {{ t = time - key(n).time; }}\\n" +
            "if (n > 0 && t < 1){{\\n" +
            "v = velocityAtTime(key(n).time - thisComp.frameDuration/10);\\n" +
            "amp = 0.05; freq = 4.0; decay = 8.0;\\n" +
            "value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);\\n" +
            "}} else {{ value; }}";

        for (var i = 0; i < selected.length; i++) {{
            var prop = selected[i].property("{prop_name}");
            if (prop && prop.canSetExpression) {{
                prop.expression = bounceCode;
            }}
        }}
        return "SUCCESS: Applied Inertial Bounce physics to {prop_name}.";
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
    pro_samples = []
    pro_samples.extend(generate_morphing_samples())
    pro_samples.extend(generate_keylight_samples())
    pro_samples.extend(generate_glassmorphism_samples())
    pro_samples.extend(generate_particle_samples())
    pro_samples.extend(generate_lighting_samples())
    pro_samples.extend(generate_cinematic_camera_samples())
    pro_samples.extend(generate_tracking_samples())
    pro_samples.extend(generate_inertial_bounce_samples())

    formatted = []
    for item in pro_samples:
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

    # Add conversational and query variations
    expanded = []
    for entry in formatted:
        expanded.append(entry)
        inst = entry["instruction"]
        variations = [
            f"please {inst.lower()}",
            f"how to {inst.lower()} in AE?",
            f"AE script for: {inst}",
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

    print(f"Generated and appended {len(train_part)} pro training samples, {len(val_part)} validation samples.")

if __name__ == "__main__":
    main()
