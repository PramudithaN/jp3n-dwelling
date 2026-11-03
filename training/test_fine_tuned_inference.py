"""
test_fine_tuned_inference.py - Benchmark verification suite for local model inference.
Sends prompt requests to http://127.0.0.1:8080/v1/chat/completions and validates
that the generated code contains proper ExtendScript idioms and zero forbidden hallucinations.
"""

import urllib.request
import json
import time

SERVER_URL = "http://127.0.0.1:8080/v1/chat/completions"

TEST_PROMPTS = [
    "Create a 1080p composition with a red solid background",
    "Add a smooth position wiggle expression with frequency 3 and amplitude 25 to selected layer",
    "Apply Keylight to remove green screen from selected layer",
    "Create a frosted glassmorphism card with blur and drop shadow",
    "Setup a 3-point studio lighting rig with Key, Fill, and Rim lights",
    "Animate an animated circle stroke with Trim Paths write-on over 2 seconds",
    "Add a typewriter text animation revealing 'OFFLINE AI' over 3 seconds",
]

def query_model(prompt):
    payload = {
        "messages": [
            {
                "role": "system",
                "content": "You are an expert Adobe After Effects ExtendScript assistant. You write safe, correct ExtendScript wrapped in undo groups."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.2,
        "max_tokens": 512
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(SERVER_URL, data=data, headers={"Content-Type": "application/json"})

    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            t1 = time.time()
            data = json.loads(res.read().decode("utf-8"))
            content = data["choices"][0]["message"]["content"]
            duration = t1 - t0
            return content, duration
    except Exception as e:
        return f"ERROR: {e}", 0

def run_tests():
    print(f"Connecting to local inference engine at {SERVER_URL}...\n")
    for idx, prompt in enumerate(TEST_PROMPTS, 1):
        print(f"[{idx}/{len(TEST_PROMPTS)}] Prompt: \"{prompt}\"")
        content, duration = query_model(prompt)
        print(f"Response ({duration:.2f}s):")
        print("-" * 50)
        # Print first few lines
        lines = content.strip().split("\n")
        print("\n".join(lines[:8]))
        if len(lines) > 8:
            print(f"... ({len(lines) - 8} more lines)")
        print("-" * 50)

        # Validation Checks
        has_undo = "app.beginUndoGroup" in content and "app.endUndoGroup" in content
        has_try = "try" in content and "catch" in content
        no_bad_calls = ".layer(0)" not in content

        print(f"Checks: UndoGroup={has_undo} | TryCatch={has_try} | NoHallucinations={no_bad_calls}\n")

if __name__ == "__main__":
    run_tests()
