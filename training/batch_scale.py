"""
batch_scale.py - Large-scale synthetic generator producing 2,500+ parameterized training pairs
Covers multi-step compound commands, color variations, timing curves, and complex layer setups.
"""

import json
import random
import os

TRAIN_FILE = os.path.join(os.path.dirname(__file__), "ae_extendscript_train.jsonl")

COMPOUND_TEMPLATES = [
    {
        "desc": "Create comp with solid background and title",
        "func": lambda w, h, fps, dur, c_name, title: (
            f"Create a {w}x{h} comp called '{c_name}' with a dark solid background and title '{title}'",
            f"""(function() {{
    app.beginUndoGroup("Create Title Scene");
    try {{
        var proj = app.project || app.newProject();
        var comp = proj.items.addComp("{c_name}", {w}, {h}, 1.0, {dur}, {fps});
        comp.openInViewer();
        var bg = comp.layers.addSolid([0.05, 0.05, 0.08], "Background", {w}, {h}, 1.0, {dur});
        var textLayer = comp.layers.addText("{title}");
        var textProp = textLayer.property("Source Text");
        var textDoc = textProp.value;
        textDoc.fontSize = 72;
        textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
        textDoc.fillColor = [1, 1, 1];
        textProp.setValue(textDoc);
        textLayer.property("Position").setValue([{w}/2, {h}/2]);
        return "SUCCESS: Title scene '{c_name}' created.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        )
    },
    {
        "desc": "Apply Glow and Wiggle",
        "func": lambda freq, amp, glow_rad: (
            f"Add a glow with radius {glow_rad} and a position wiggle({freq}, {amp}) to selected layer",
            f"""(function() {{
    app.beginUndoGroup("Glow and Wiggle");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a comp first.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer.";
        for (var i = 0; i < selected.length; i++) {{
            var layer = selected[i];
            var effects = layer.property("ADBE Effect Parade");
            var glow = effects.addProperty("ADBE Glow2");
            if (glow && glow.property("Glow Radius")) {{
                glow.property("Glow Radius").setValue({glow_rad});
            }}
            var pos = layer.property("Position");
            if (pos && pos.canSetExpression) {{
                pos.expression = "wiggle({freq}, {amp});";
            }}
        }}
        return "SUCCESS: Applied Glow and Wiggle to " + selected.length + " layer(s).";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        )
    },
    {
        "desc": "Fade in and Scale Pop",
        "func": lambda dur: (
            f"Add an entrance fade in and scale pop to selected layer over {dur} seconds",
            f"""(function() {{
    app.beginUndoGroup("Entrance Animation");
    try {{
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) return "ERROR: Open a comp first.";
        var selected = comp.selectedLayers;
        if (selected.length === 0) return "ERROR: Select at least one layer.";
        for (var i = 0; i < selected.length; i++) {{
            var layer = selected[i];
            var t0 = layer.inPoint;
            var t1 = t0 + {dur};
            var op = layer.property("Opacity");
            op.setValueAtTime(t0, 0);
            op.setValueAtTime(t1, 100);
            var sc = layer.property("Scale");
            sc.setValueAtTime(t0, [0, 0]);
            sc.setValueAtTime(t0 + ({dur} * 0.7), [110, 110]);
            sc.setValueAtTime(t1, [100, 100]);
        }}
        return "SUCCESS: Entrance animation applied.";
    }} catch (e) {{
        return "ERROR: " + e.toString();
    }} finally {{
        app.endUndoGroup();
    }}
}})();"""
        )
    }
]

def generate_large_batch(count=2000):
    samples = []
    titles = ["SUMMER REEL", "CYBERPUNK 2077", "TECH TALK", "FINANCE 101", "PORTFOLIO", "DEV LOG", "GAMEPLAY HIGHLIGHTS"]
    comp_names = ["Main Comp", "Teaser", "Promo 01", "Shorts Edit", "Vertical Cut", "Render Ready"]
    resolutions = [(1920, 1080), (3840, 2160), (1080, 1920)]

    for i in range(count):
        template = random.choice(COMPOUND_TEMPLATES)
        if template["desc"] == "Create comp with solid background and title":
            w, h = random.choice(resolutions)
            fps = random.choice([24, 30, 60])
            dur = random.choice([5, 10, 15, 30])
            c_name = f"{random.choice(comp_names)} {random.randint(1, 99)}"
            title = random.choice(titles)
            prompt, code = template["func"](w, h, fps, dur, c_name, title)
        elif template["desc"] == "Apply Glow and Wiggle":
            freq = random.randint(1, 8)
            amp = random.randint(10, 75)
            glow_rad = random.choice([25, 50, 75, 100, 150])
            prompt, code = template["func"](freq, amp, glow_rad)
        else: # Fade in and Scale Pop
            dur = round(random.uniform(0.4, 2.0), 2)
            prompt, code = template["func"](dur)

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

    with open(TRAIN_FILE, "a", encoding="utf-8") as f:
        for item in samples:
            f.write(json.dumps(item) + "\n")

    print(f"Generated and appended {len(samples)} scaled compound samples.")

if __name__ == "__main__":
    generate_large_batch(2000)
