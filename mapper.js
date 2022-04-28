var numberInWords = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const metaContentParser = (originalFileContent) => {
  const metaContent = {
    seo: {
      indexing: true,
      title: originalFileContent.title,
      meta_title: originalFileContent.title,
      meta_description: originalFileContent.description,
      keywords:
        "Online scheduling, scheduling software, scheduling assistant, free scheduler, appointment booking, digital scheduler, automate, agenda, appointment diary",
      og: {
        title: originalFileContent.og_title,
        description: originalFileContent.og_description,
        url: originalFileContent.og_url,
        image: originalFileContent.og_image_link,
      },
      twitter: {
        title: originalFileContent.twitter_title,
        description: originalFileContent.twitter_description,
        url: originalFileContent.og_url,
        image: originalFileContent.og_image_link,
        image_alt: originalFileContent.twitter_image_alt,
      },
    },
  };
  return JSON.stringify(metaContent);
};

const removeImageTypeFromURL = (link) => (link.toString().replace(/\.png/, ""));

function isImagePrefixMobileOrCrop(link){
  link = removeImageTypeFromURL(link);
  if(link.search("mobile") > 0){
    return "mobile";
  }else if(link.search("crop") > 0){
    return "crop";
  }
}


const heroContentParser = (originalFileContent) => {
  
  const heroContent = {
    title: originalFileContent.hero_header,
    desc: [originalFileContent.hero_para],
    image: {
      src: removeImageTypeFromURL(originalFileContent.hero_img_link_png_1x),
      dimensions: [760, 520],
      alt: originalFileContent.hero_alt,
      prefixes: { mobile: isImagePrefixMobileOrCrop(originalFileContent.hero_img_mobile_link_png_1x), dpi: "@2x" },
    },
    cta: {
      text: originalFileContent.hero_cta,
      link: originalFileContent.hero_cta_link,
    },
  };

  if(originalFileContent.hasOwnProperty("hero_para_two")){
    heroContent.desc.push(originalFileContent.hero_para_two);
  }

  return JSON.stringify(heroContent);
};

const integrationFeaturesParser = (originalFileContent) => {
  
  const integrationContent = [];
  for(let i = 0; i<3;i++){
    integrationContent.push({
      "icon": originalFileContent[`features_cards_${numberInWords[i]}_image`],
      "title": originalFileContent[`features_cards_${numberInWords[i]}_header`],
      "desc": originalFileContent[`features_cards_${numberInWords[i]}_para`]
    })
  }
  return JSON.stringify(integrationContent);
}

const highlightContentParser = (originalFileContent) => {
  const highlightContent = {
    heading:  originalFileContent.highlight_cards_section_header,
    list: []
  }
  for(let i = 0; i<3;i++){
    highlightContent.list.push({
      "href": originalFileContent[`highlight_cards_${numberInWords[i]}_link`],
      "heading": originalFileContent[`highlight_cards_${numberInWords[i]}_header`],
      "desc": originalFileContent[`highlight_cards_${numberInWords[i]}_para`]
    })
  }

  return JSON.stringify(highlightContent);
}

const ctaContentParser = (originalFileContent) => {
  const ctaContent = {
    heading: originalFileContent.cta_w_image_header,
    desc: originalFileContent.cta_w_image_para,
    link: {
      href: "/start-now",
      text: originalFileContent.cta_w_image_button,
    },
    image: {
      path: originalFileContent.cta_w_image_link_png_2x,
      alt: originalFileContent.cta_w_image_alt,
      offset: true,
      maxwidth: "460",
      dimensions: [460, 572]
    }
  };
  return JSON.stringify(ctaContent);
};

function findNumberOfFaqs(originalFileContent){
  let count = 0;
  for(let i = 0; i<numberInWords.length;i++){
    if(originalFileContent.hasOwnProperty(`faq_${numberInWords[i]}_question`)){
      count++;
    }else{
      break;
    }
  }
  return count;
}

const faqContentParser = (originalFileContent) => {

  let numberOfFaqs;
  if(originalFileContent.faq_count){
    numberOfFaqs = originalFileContent.faq_count;
  }else{
    numberOfFaqs = findNumberOfFaqs(originalFileContent);
  }
  const faqContent = [];
  for (let i = 0; i < numberOfFaqs; i++) {
    const faq = {
      ques: "",
      ans: [],
    };
    faq.ques = originalFileContent[`faq_${numberInWords[i]}_question`];
    faq.ans.push(originalFileContent[`faq_${numberInWords[i]}_answer`]);
    if (
      originalFileContent.hasOwnProperty(`faq_${numberInWords[i]}_answer_two`)
    ) {
      faq.ans.push(originalFileContent[`faq_${numberInWords[i]}_answer_two`]);
    }
    if (
      originalFileContent.hasOwnProperty(`faq_${numberInWords[i]}_answer_three`)
    ) {
      faq.ans.push(originalFileContent[`faq_${numberInWords[i]}_answer_three`]);
    }
    if (
      originalFileContent.hasOwnProperty(`faq_${numberInWords[i]}_answer_four`)
    ) {
      faq.ans.push(originalFileContent[`faq_${numberInWords[i]}_answer_four`]);
    }
    faqContent.push(faq);
  }

  return JSON.stringify(faqContent);
};

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

function fileUploadHandler() {
  const file = uploadFileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = JSON.parse(reader.result);
      console.log("File Content", fileContent);
      console.log("Meta Content", metaContentParser(fileContent));
      console.log("Hero Content", heroContentParser(fileContent));
      console.log("Faq Content", faqContentParser(fileContent));
      console.log("Highlight Content", highlightContentParser(fileContent));
      console.log("Cta Content", ctaContentParser(fileContent));
      console.log("Integration Content", integrationFeaturesParser(fileContent));

      window['meta-content-container'] = metaContentParser(fileContent);
      window['hero-content-container'] = heroContentParser(fileContent);
      window['faq-content-container'] = faqContentParser(fileContent);
      window['integration-content-container'] = integrationFeaturesParser(fileContent);
      window['highlight-content-container'] = highlightContentParser(fileContent);
      window['cta-content-container'] = ctaContentParser(fileContent);
      metaContentContainer.textContent = window['meta-content-container'];
      heroContentContainer.textContent = window['hero-content-container'];
      faqContentContainer.textContent = window['faq-content-container'];
      integrationContentContainer.textContent = window['integration-content-container'];
      highlightContentContainer.textContent = window['highlight-content-container'];
      ctaContentContainer.textContent = window['cta-content-container'];
    };
    reader.readAsText(file);
  }
}

function clickHandler(e) {
  e.preventDefault();
  copyTextToClipboard(window[e.target.id])

  document.querySelector(".snackbar").classList.remove("hide");
  setTimeout(function () {
    document.querySelector(".snackbar").classList.add("hide");
  }, 2000);
}

const uploadFileInput = document.getElementById("upload-input");
const metaContentContainer = document.getElementById("meta-content-container");
const heroContentContainer = document.getElementById("hero-content-container");
const integrationContentContainer = document.getElementById("integration-content-container");
const ctaContentContainer = document.getElementById("cta-content-container");
const highlightContentContainer = document.getElementById("highlight-content-container");
const faqContentContainer = document.getElementById("faq-content-container");

uploadFileInput.addEventListener("change", fileUploadHandler);

metaContentContainer.addEventListener("click", clickHandler);
heroContentContainer.addEventListener("click", clickHandler);
faqContentContainer.addEventListener("click", clickHandler);
integrationContentContainer.addEventListener("click", clickHandler);
ctaContentContainer.addEventListener("click", clickHandler);
highlightContentContainer.addEventListener("click", clickHandler);
