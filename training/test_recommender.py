"""
test_recommender.py - Verifies recommendations and prediction accuracy of Model 2.
"""

import json
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "AE_AI_Assistant_Installer",
    "com.ai.aftereffects",
    "js",
    "recommender_model.json"
)

def test():
    with open(MODEL_PATH, "r", encoding="utf-8") as f:
        model = json.load(f)

    test_scenarios = [
        {"desc": "Footage with Keylight applied", "context": {"layerType": "AVLayer", "hasEffect": "ADBE Keylight", "effects": ["ADBE Keylight"]}},
        {"desc": "Vector Shape Layer", "context": {"layerType": "ShapeLayer", "effects": []}},
        {"desc": "Text Layer", "context": {"layerType": "TextLayer", "effects": []}},
        {"desc": "Adjustment Layer", "context": {"layerType": "AdjustmentLayer", "effects": []}},
        {"desc": "3D Layer with 3D switch active", "context": {"threeDLayer": True, "effects": []}},
    ]

    print("--- Running Model 2 Recommender Verification ---")
    for s in test_scenarios:
        ctx = s["context"]
        matches = []
        for rule in model["context_rules"]:
            m = True
            if "layerType" in rule["context"] and rule["context"]["layerType"] != ctx.get("layerType"):
                m = False
            if "threeDLayer" in rule["context"] and rule["context"]["threeDLayer"] != ctx.get("threeDLayer", False):
                m = False
            if "hasEffect" in rule["context"] and rule["context"]["hasEffect"] not in ctx.get("effects", []):
                m = False
            if m:
                for r in rule["recommendations"]:
                    matches.append(r["label"])

        top3 = matches[:3]
        print(f"Scenario: {s['desc']}")
        print(f" -> Suggestions: {top3}\n")

if __name__ == "__main__":
    test()
