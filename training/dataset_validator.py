"""
dataset_validator.py - Verifies quality, schema, and API safety of the training set.
"""

import json
import os

TRAIN_FILE = os.path.join(os.path.dirname(__file__), "ae_extendscript_train.jsonl")
VAL_FILE = os.path.join(os.path.dirname(__file__), "ae_extendscript_val.jsonl")

def validate_dataset(filepath):
    print(f"\n--- Validating {os.path.basename(filepath)} ---")
    if not os.path.exists(filepath):
        print(f"Error: File not found {filepath}")
        return False

    total = 0
    errors = 0
    has_undo = 0
    has_try_catch = 0

    with open(filepath, "r", encoding="utf-8") as f:
        for idx, line in enumerate(f, 1):
            total += 1
            try:
                data = json.loads(line)
            except Exception as e:
                print(f"[Line {idx}] Invalid JSON: {e}")
                errors += 1
                continue

            inst = data.get("instruction", "")
            out = data.get("output", "")
            msgs = data.get("messages", [])

            if not inst or not out or not msgs:
                print(f"[Line {idx}] Missing fields")
                errors += 1
                continue

            # API Safety checks
            if "app.beginUndoGroup" in out and "app.endUndoGroup" in out:
                has_undo += 1
            if "try" in out and "catch" in out:
                has_try_catch += 1

            # Check for known hallucinations
            if "app.project.activeItem.layer(0)" in out:
                print(f"[Line {idx}] Contains forbidden hallucination: .layer(0)")
                errors += 1

    print(f"Total entries: {total}")
    print(f"Clean & Error-free: {total - errors} / {total} ({(total - errors)/total*100:.1f}%)")
    print(f"Undo group protected: {has_undo} / {total} ({has_undo/total*100:.1f}%)")
    print(f"Try/catch encapsulated: {has_try_catch} / {total} ({has_try_catch/total*100:.1f}%)")

    return errors == 0

if __name__ == "__main__":
    train_ok = validate_dataset(TRAIN_FILE)
    val_ok = validate_dataset(VAL_FILE)
    if train_ok and val_ok:
        print("\nAll datasets 100% VALIDATED!")
    else:
        print("\nValidation issues found.")
