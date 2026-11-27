export function bindCopyEmail(
  buttonId: string,
  labelId: string,
  copiedText: string,
  defaultText?: string,
): void {
  const copyBtn = document.getElementById(buttonId);
  const copyLabel = document.getElementById(labelId);
  if (!copyBtn || !copyLabel) return;

  copyBtn.addEventListener('click', async () => {
    const email = copyBtn.getAttribute('data-email');
    if (!email) return;

    const resetText = defaultText ?? `Copy ${email}`;
    try {
      await navigator.clipboard.writeText(email);
      copyLabel.textContent = copiedText;
      window.setTimeout(() => {
        copyLabel.textContent = resetText;
      }, 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });
}
