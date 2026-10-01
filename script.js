const tools = {

    "image-pdf": {
        title: "Image to PDF",
        description: "Convert your JPG, PNG or other images into a PDF."
    },

    "pdf-image": {
        title: "PDF to Image",
        description: "Convert PDF pages into JPG or PNG images."
    },

    "merge": {
        title: "Merge PDF",
        description: "Combine multiple PDF files into one document."
    },

    "split": {
        title: "Split PDF",
        description: "Split your PDF into separate documents."
    },

    "compress-pdf": {
        title: "Compress PDF",
        description: "Reduce your PDF file size."
    },

    "rotate": {
        title: "Rotate PDF",
        description: "Rotate PDF pages."
    },

    "watermark": {
        title: "Watermark PDF",
        description: "Add text or image watermarks to your PDF."
    },

    "sign": {
        title: "Sign PDF",
        description: "Add your electronic signature to a PDF."
    },

    "ocr": {
        title: "OCR PDF",
        description: "Extract text from scanned PDF documents."
    },

    "pdf-word": {
        title: "PDF to Word",
        description: "Convert PDF documents to editable Word files."
    },

    "pdf-excel": {
        title: "PDF to Excel",
        description: "Extract PDF tables into Excel."
    },

    "pdf-ppt": {
        title: "PDF to PowerPoint",
        description: "Convert PDF documents into PowerPoint."
    },

    "resize-image": {
        title: "Resize Image",
        description: "Resize images using percentage, pixels or dimensions."
    },

    "compress-image": {
        title: "Compress Image",
        description: "Reduce image size while maintaining quality."
    },

    "crop-image": {
        title: "Crop Image",
        description: "Crop your image to your desired dimensions."
    },

    "convert-image": {
        title: "Convert Image",
        description: "Convert between JPG, PNG and WebP formats."
    }

};


const modal = document.getElementById("toolModal");

const modalTitle =
    document.getElementById("modalTitle");

const modalDescription =
    document.getElementById("modalDescription");

const fileInput =
    document.getElementById("fileInput");

const selectedFile =
    document.getElementById("selectedFile");


function openTool(toolName) {

    const tool = tools[toolName];

    if (!tool) {
        return;
    }

    modalTitle.textContent = tool.title;

    modalDescription.textContent =
        tool.description;

    fileInput.value = "";

    selectedFile.innerHTML = "";

    modal.classList.add("active");

}


function closeTool() {

    modal.classList.remove("active");

}


function fileSelected(event) {

    const file =
        event.target.files[0];

    if (!file) {
        selectedFile.innerHTML = "";
        return;
    }

    selectedFile.innerHTML =
        `<i class="fa-solid fa-file"></i>
         &nbsp; ${file.name}
         &nbsp; (${formatFileSize(file.size)})`;

}


function formatFileSize(bytes) {

    if (bytes === 0) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );

    return (
        parseFloat(
            (bytes / Math.pow(1024, index))
            .toFixed(2)
        )
        + " "
        + units[index]
    );

}


function startProcessing() {

    const file =
        fileInput.files[0];

    if (!file) {

        alert(
            "Please select a file first."
        );

        return;

    }

    /*
       Actual PDF/image processing will be
       connected here in the next stage.

       We are deliberately NOT pretending
       that the conversion has happened.
    */

    alert(
        "File uploaded successfully. Processing engine will be connected in the next step."
    );

}


function showMessage(type) {

    alert(
        type +
        " feature will be connected to the Resize Guru support system."
    );

}


function toggleMenu() {

    const nav =
        document.querySelector(".nav-links");

    nav.classList.toggle("mobile-visible");

}


window.addEventListener(
    "click",
    function(event) {

        if (event.target === modal) {
            closeTool();
        }

    }
);
