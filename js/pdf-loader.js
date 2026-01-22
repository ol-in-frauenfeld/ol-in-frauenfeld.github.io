const OFF_DOCS = {
  "OFF.pdf": "Aktueller Flyer",
  "OFF_Streckendaten.pdf": "Streckendaten",
  "OFF_Ablauf.pdf": "Wie geht OFF?"
};

async function openPdfNoCache(file) {
  if (!Object.prototype.hasOwnProperty.call(OFF_DOCS, file)) {
    alert("Dokument nicht verfügbar.");
    return;
  }

  try {
    const response = await fetch(`/flyer/${file}?v=${Date.now()}`, {
      cache: "no-store",
      headers: { "Accept": "application/pdf" }
    });
    if (!response.ok) {
      throw new Error("Download fehlgeschlagen");
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const newWindow = window.open(objectUrl, "_blank");
    if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = file;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setTimeout(() => URL.revokeObjectURL(objectUrl), 60 * 1000);
  } catch (err) {
    console.error(err);
    alert("Das Dokument konnte nicht geladen werden. Bitte später nochmals versuchen.");
  }
}
