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
        image:
          "https://assets.setmore.com/website/v2/images/og-images/setmore-og-integration-listing-facebook.png",
      },
      twitter: {
        title: originalFileContent.twitter_title,
        description: originalFileContent.twitter_description,
        url: originalFileContent.og_url,
        image:
          "https://assets.setmore.com/website/v2/images/og-images/setmore-og-integration-listing-facebook.png",
        image_alt: originalFileContent.twitter_image_alt,
      },
    },
  };
  return JSON.stringify(metaContent);
};

const heroContentParser = (originalFileContent) => {
  const imageSrcFormatter = originalFileContent.hero_img_link_png_1x
    .toString()
    .replace(/\.png/, "");
  const heroContent = {
    title: originalFileContent.title,
    desc: originalFileContent.description,
    image: {
      src: imageSrcFormatter,
      dimensions: [760, 520],
      alt: originalFileContent.hero_alt,
      prefixes: { mobile: "mobile", dpi: "@2x" },
    },
    cta: {
      text: originalFileContent.hero_cta,
      link: originalFileContent.hero_cta_link,
    },
  };
  return JSON.stringify(heroContent);
};

const faqContentParser = (originalFileContent) => {
  const numberInWords = [
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
  const numberOfFaqs = originalFileContent.faq_count;
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
      metaContentContainer.textContent = metaContentParser(fileContent);
      heroContentContainer.textContent = heroContentParser(fileContent);
      faqContentContainer.textContent = faqContentParser(fileContent);
    };
    reader.readAsText(file);
  }
}

function clickHandler(e){
  e.preventDefault();
  copyTextToClipboard(e.target.innerHTML);
  document.querySelector(".snackbar").classList.remove("hide");
  setTimeout(function(){
    document.querySelector(".snackbar").classList.add("hide");
  },2000);  
}

const uploadFileInput = document.getElementById("upload-input");
const metaContentContainer = document.getElementById("meta-content-container");
const heroContentContainer = document.getElementById("hero-content-container");
const faqContentContainer = document.getElementById("faq-content-container");

uploadFileInput.addEventListener("change", fileUploadHandler);

metaContentContainer.addEventListener("click", clickHandler);
heroContentContainer.addEventListener("click", clickHandler);
faqContentContainer.addEventListener("click", clickHandler);
