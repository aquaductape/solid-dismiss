/**
 * Depreciated.
 *
 * Still works in some modern browsers as of Jan 2021, but still usefull when copying text on certain strict Policies that would block Clipboard API
 */
const fallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  let successful = false;
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.opacity = "0";
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    successful = document.execCommand("copy");
    const msg = successful ? "successful" : "unsuccessful";
    if (!successful) console.log("Copying text command was " + msg);
  } catch (err) {
    console.error("Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
  return successful;
};

export const copyTextToClipboard = async (text: string) => {
  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard(text);
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return fallbackCopyTextToClipboard(text);
  }
};
