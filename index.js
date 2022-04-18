
var editableDiv = document.getElementById("editableDiv");
var parsedTextContainer = document.getElementById(
  "parsed-text-container"
);
var formattedTextContainer = document.getElementById(
  "formatted-text-container"
);


function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}


var editableDiv = document.getElementById('editableDiv');

function handlepaste (e) {
    var types, pastedData, savedContent;
    
    // Browsers that support the 'text/html' type in the Clipboard API (Chrome, Firefox 22+)
    if (e && e.clipboardData && e.clipboardData.types && e.clipboardData.getData) {
    		
        // Check for 'text/html' in types list. See abligh's answer below for deatils on
        // why the DOMStringList bit is needed
        types = e.clipboardData.types;
        if (((types instanceof DOMStringList) && types.contains("text/html")) || 
        				(types.indexOf && types.indexOf('text/html') !== -1)) {
        
        		// Extract data and pass it to callback
            pastedData =  e.clipboardData.getData('text/html');
            processPaste(editableDiv, pastedData);

						// Stop the data from actually being pasted
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    }
    
    // Everything else: Move existing element contents to a DocumentFragment for safekeeping
    savedContent = document.createDocumentFragment();
    while(editableDiv.childNodes.length > 0) {
    	savedContent.appendChild(editableDiv.childNodes[0]);
    }
    
    // Then wait for browser to paste content into it and cleanup
    waitForPastedData(editableDiv, savedContent);
    return true;
}

function waitForPastedData (elem, savedContent) {

		// If data has been processes by browser, process it
    if (elem.childNodes && elem.childNodes.length > 0) {
    
    		// Retrieve pasted content via innerHTML
        // (Alternatively loop through elem.childNodes or elem.getElementsByTagName here)
    		var pastedData = elem.innerHTML;
        
        // Restore saved content
        elem.innerHTML = "";
        elem.appendChild(savedContent);
        
        // Call callback
        processPaste(elem, pastedData);
    }
    
    // Else wait 20ms and try again
    else {
        setTimeout(function () {
            waitForPastedData(elem, savedContent)
        }, 20);
    }
}

function processPaste (elem, pastedData) {
    // Do whatever with gathered data;
      parsedTextContainer.innerHTML = pastedData;
  const parser = new DOMParser();
  const domChildrenArr = [
    ...parser.parseFromString(pastedData, "text/html").body.children,
  ];
    let parsedText = "";
  domChildrenArr.forEach((child) => {
    console.log(child);
    if (child.tagName === "SPAN" && child.className === "dot") {
      child.textContent = child.textContent.replace(/\u00a0/g, " ");
      parsedText += `<span class='dot'>child.textContent</span>`;
    }
    if (child.tagName === "SPAN") {
      child.textContent = child.textContent.replace(/\u00a0/g, " ");
      parsedText += child.textContent;
    }
    else if (child.tagName === "A") {
      parsedText += `<a href='${child.href}' class='text-brandcolor'>${child.innerText}</a>`;
    }
    else if (child.tagName === "B" || child.tagName === "STRONG") {
      parsedText += `<b>${child.innerText}</b>`;
    }
  });
  console.log(parsedText);
  formattedTextContainer.innerText = parsedText;
  document.querySelector(".snackbar").classList.remove("hide");
  setTimeout(function(){
    document.querySelector(".snackbar").classList.add("hide");
  },2000);  
    copyTextToClipboard(parsedText);
    elem.focus();
}

// Modern browsers. Note: 3rd argument is required for Firefox <= 6
if (editableDiv.addEventListener) {
	editableDiv.addEventListener('paste', handlepaste, false);
}
// IE <= 8
else {
	editableDiv.attachEvent('onpaste', handlepaste);
}
