chrome.runtime.onInstalled.addListener(() => {

  chrome.contextMenus.create({
    id: "explain-with-devtutor",
    title: "Explain with DevTutor",
    contexts: ["selection"]
  });

});


chrome.contextMenus.onClicked.addListener(
  (info, tab) => {

    if (
      info.menuItemId ===
      "explain-with-devtutor"
    ) {

      const selectedText =
        info.selectionText;

      chrome.storage.local.set({
        selectedText
      });

      console.log(
        "Saved text:",
        selectedText
      );
    }

  }
);