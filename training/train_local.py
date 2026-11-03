"""
train_local.py - Local fine-tuning script using standard HuggingFace PEFT / TRL.
Use this if running locally with an Nvidia GPU.
"""

import os
import torch
from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
)
from peft import LoraConfig, get_peft_model, TaskType
from trl import SFTTrainer

MODEL_ID = "Qwen/Qwen2.5-Coder-1.5B-Instruct"
DATASET_PATH = os.path.join(os.path.dirname(__file__), "ae_extendscript_train.jsonl")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "outputs")

def main():
    print(f"Loading tokenizer & model: {MODEL_ID}")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    device_map = "auto" if torch.cuda.is_available() else "cpu"
    torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        torch_dtype=torch_dtype,
        device_map=device_map,
        trust_remote_code=True,
    )

    lora_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=16,
        lora_alpha=32,
        lora_dropout=0.05,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    )

    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    dataset = load_dataset("json", data_files=DATASET_PATH, split="train")

    def format_chat(batch):
        texts = [tokenizer.apply_chat_template(m, tokenize=False) for m in batch["messages"]]
        return {"text": texts}

    dataset = dataset.map(format_chat, batched=True)

    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        logging_steps=10,
        num_train_epochs=2,
        weight_decay=0.01,
        save_strategy="epoch",
        fp16=torch.cuda.is_available(),
    )

    trainer = SFTTrainer(
        model=model,
        train_dataset=dataset,
        dataset_text_field="text",
        max_seq_length=2048,
        args=training_args,
    )

    print("Starting training...")
    trainer.train()
    print("Training finished! Saving LoRA adapter...")
    model.save_pretrained(os.path.join(OUTPUT_DIR, "ae_lora_adapter"))
    tokenizer.save_pretrained(os.path.join(OUTPUT_DIR, "ae_lora_adapter"))
    print(f"LoRA adapter saved to {os.path.join(OUTPUT_DIR, 'ae_lora_adapter')}")

if __name__ == "__main__":
    main()
