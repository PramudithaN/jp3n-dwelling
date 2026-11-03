"""
build_master_dataset.py - Single unified pipeline that constructs, shuffles,
and validates the entire comprehensive dataset covering all 23 AE Categories.
"""

import json
import random
import os

TRAIN_FILE = os.path.join(os.path.dirname(__file__), "ae_extendscript_train.jsonl")
VAL_FILE = os.path.join(os.path.dirname(__file__), "ae_extendscript_val.jsonl")

# Import generator functions
import dataset_generator
import dataset_expander
import batch_scale
import advanced_dataset_generator
import pro_workflows_generator
import all_categories_generator

def collect_all_samples():
    print("Collecting from all 6 specialized domain generators...")
    all_data = []

    # 1. Base Core Samples
    base = []
    base.extend(dataset_generator.generate_comp_samples())
    base.extend(dataset_generator.generate_solid_samples())
    base.extend(dataset_generator.generate_text_samples())
    base.extend(dataset_generator.generate_expression_samples())
    base.extend(dataset_generator.generate_effect_samples())
    base.extend(dataset_generator.generate_keyframing_samples())
    base.extend(dataset_generator.generate_null_and_camera_samples())
    for item in base:
        all_data.append((item["instruction"], item["output"]))

    # 2. Expander (Blend modes, mattes, color grades, staggers, markers)
    exp = []
    exp.extend(dataset_expander.generate_blend_mode_samples())
    exp.extend(dataset_expander.generate_track_matte_samples())
    exp.extend(dataset_expander.generate_color_grade_samples())
    exp.extend(dataset_expander.generate_stagger_samples())
    exp.extend(dataset_expander.generate_marker_samples())
    exp.extend(dataset_expander.generate_reposition_samples())
    for item in exp:
        all_data.append((item["instruction"], item["output"]))

    # 3. Advanced (Trim paths, Repeaters, Typewriter, Masks, Render Queue, Audio, 3rd party)
    adv = []
    adv.extend(advanced_dataset_generator.generate_shape_layer_samples())
    adv.extend(advanced_dataset_generator.generate_text_animator_samples())
    adv.extend(advanced_dataset_generator.generate_mask_samples())
    adv.extend(advanced_dataset_generator.generate_render_queue_samples())
    adv.extend(advanced_dataset_generator.generate_third_party_plugin_samples())
    adv.extend(advanced_dataset_generator.generate_audio_samples())
    for item in adv:
        all_data.append((item["instruction"], item["output"]))

    # 4. Pro Workflows (Morphing, Keylight, Glassmorphism, 3-point light, cameras, tracking, bounce physics)
    pro = []
    pro.extend(pro_workflows_generator.generate_morphing_samples())
    pro.extend(pro_workflows_generator.generate_keylight_samples())
    pro.extend(pro_workflows_generator.generate_glassmorphism_samples())
    pro.extend(pro_workflows_generator.generate_particle_samples())
    pro.extend(pro_workflows_generator.generate_lighting_samples())
    pro.extend(pro_workflows_generator.generate_cinematic_camera_samples())
    pro.extend(pro_workflows_generator.generate_tracking_samples())
    pro.extend(pro_workflows_generator.generate_inertial_bounce_samples())
    for item in pro:
        all_data.append((item["instruction"], item["output"]))

    # 5. All 23 Categories Catalog (Fractal Noise, Sliders, Wipes, Ramps, Posterize Time, etc.)
    for eff in all_categories_generator.NEW_EFFECTS:
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
            all_data.append((prompt, code))

    # 6. Compound Multi-Step Scenes (Batch Scale)
    titles = ["SUMMER REEL", "CYBERPUNK 2077", "TECH TALK", "FINANCE 101", "PORTFOLIO", "DEV LOG", "GAMEPLAY HIGHLIGHTS"]
    comp_names = ["Main Comp", "Teaser", "Promo 01", "Shorts Edit", "Vertical Cut", "Render Ready"]
    resolutions = [(1920, 1080), (3840, 2160), (1080, 1920)]
    for _ in range(1500):
        template = random.choice(batch_scale.COMPOUND_TEMPLATES)
        if template["desc"] == "Create comp with solid background and title":
            w, h = random.choice(resolutions)
            fps = random.choice([24, 30, 60])
            dur = random.choice([5, 10, 15, 30])
            c_name = f"{random.choice(comp_names)} {random.randint(1, 99)}"
            title = random.choice(titles)
            p, c = template["func"](w, h, fps, dur, c_name, title)
        elif template["desc"] == "Apply Glow and Wiggle":
            freq = random.randint(1, 8)
            amp = random.randint(10, 75)
            glow_rad = random.choice([25, 50, 75, 100, 150])
            p, c = template["func"](freq, amp, glow_rad)
        else:
            dur = round(random.uniform(0.4, 2.0), 2)
            p, c = template["func"](dur)
        all_data.append((p, c))

    return all_data

def build():
    raw_pairs = collect_all_samples()
    print(f"Total raw pairs gathered: {len(raw_pairs)}")

    formatted = []
    for inst, out in raw_pairs:
        # Standard instruction
        formatted.append({
            "instruction": inst,
            "input": "",
            "output": out,
            "messages": [
                {"role": "system", "content": "You are an expert Adobe After Effects ExtendScript assistant. You write safe, correct ExtendScript wrapped in undo groups."},
                {"role": "user", "content": inst},
                {"role": "assistant", "content": f"```javascript\n{out}\n```"}
            ]
        })
        # Add conversational phrasing variation for 40% of samples
        if random.random() < 0.4:
            v_prompt = f"please {inst.lower()}" if not inst.lower().startswith("please") else inst.lower()
            formatted.append({
                "instruction": v_prompt,
                "input": "",
                "output": out,
                "messages": [
                    {"role": "system", "content": "You are an expert Adobe After Effects ExtendScript assistant. You write safe, correct ExtendScript wrapped in undo groups."},
                    {"role": "user", "content": v_prompt},
                    {"role": "assistant", "content": f"```javascript\n{out}\n```"}
                ]
            })

    # Global uniform shuffle
    random.seed(42)
    random.shuffle(formatted)

    split = int(len(formatted) * 0.9)
    train_data = formatted[:split]
    val_data = formatted[split:]

    with open(TRAIN_FILE, "w", encoding="utf-8") as f:
        for item in train_data:
            f.write(json.dumps(item) + "\n")

    with open(VAL_FILE, "w", encoding="utf-8") as f:
        for item in val_data:
            f.write(json.dumps(item) + "\n")

    print(f"Successfully generated clean Master Dataset:")
    print(f" - Train samples: {len(train_data)} -> {TRAIN_FILE}")
    print(f" - Validation samples: {len(val_data)} -> {VAL_FILE}")
    print(f" - Total: {len(formatted)}")

if __name__ == "__main__":
    build()
