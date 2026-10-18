
// ============================================
// RESIZE GURU - APPLICATION JAVASCRIPT
// ============================================

"use strict";

const $ = (selector) => document.querySelector(selector);

const toolsGrid = $("#toolsGrid");
const toolSearch = $("#toolSearch");
const clearSearch = $("#clearSearch");
const categoryTabs = $("#categoryTabs");
const noResults = $("#noResults");

const workspaceSection = $("#workspaceSection");
const workspaceTitle = $("#workspaceTitle");
const workspaceDescription = $("#workspaceDescription");

const toolForm = $("#toolForm");
const uploadArea = $("#uploadArea");
const fileInput = $("#fileInput");
const browseFiles = $("#browseFiles");
const selectedFiles = $("#selectedFiles");
const fileList = $("#fileList");
const clearFilesBtn = $("#clearFiles");
const toolOptions = $("#toolOptions");
const processBtn = $("#processBtn");

const progressArea = $("#progressArea");
const progressText = $("#progressText");
const progressBar = $("#progressBar");

const resultArea = $("#resultArea");
const resultTitle = $("#resultTitle");
const resultMessage = $("#resultMessage");
const resultFiles = $("#resultFiles");
const downloadAllBtn = $("#downloadAllBtn");
const startAgainBtn = $("#startAgainBtn");

const errorArea = $("#errorArea");
const errorMessage = $("#errorMessage");

let activeCategory = "all";
let activeTool = null;
let selectedFilesArray = [];
let generatedResults = [];
let isProcessing = false;

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_FILES = 30;

const TOOLS = [
    {
        id: "resize-image",
        name: "Resize Image",
        description: "Change image dimensions in pixels or percentage.",
        icon: "fa-expand",
        category: "image",
        accept: "image/*",
        multiple: true,
        engine: "image"
    },
    {
        id: "compress-image",
        name: "Compress Image",
        description: "Reduce image file size and choose quality.",
        icon: "fa-compress",
        category: "image",
        accept: "image/*",
        multiple: true,
        engine: "image"
    },
    {
        id: "image-to-pdf",
        name: "Image to PDF",
        description: "Combine images into a downloadable PDF document.",
        icon: "fa-file-pdf",
        category: "convert",
        accept: "image/*",
        multiple: true,
        engine: "image-to-pdf"
    },
    {
        id: "pdf-to-image",
        name: "PDF to Image",
        description: "Convert PDF pages into JPG or PNG images.",
        icon: "fa-images",
        category: "convert",
        accept: ".pdf,application/pdf",
        multiple: true,
        engine: "pdf-to-image"
    },
    {
        id: "merge-pdf",
        name: "Merge PDF",
        description: "Combine multiple PDF files into one document.",
        icon: "fa-layer-group",
        category: "pdf",
        accept: ".pdf,application/pdf",
        multiple: true,
        engine: "merge-pdf"
    },
    {
        id: "split-pdf",
        name: "Split PDF",
        description: "Extract selected pages from a PDF document.",
        icon: "fa-scissors",
        category: "pdf",
        accept: ".pdf,application/pdf",
        multiple: false,
        engine: "split-pdf"
    },
    {
        id: "compress-pdf",
        name: "Compress PDF",
        description: "Try to reduce PDF size by optimizing its content.",
        icon: "fa-file-zipper",
        category: "pdf",
        accept: ".pdf,application/pdf",
        multiple: false,
        engine: "compress-pdf"
    },
    {
        id: "crop-image",
        name: "Crop Image",
        description: "Crop an image by specifying the crop coordinates.",
        icon: "fa-crop-simple",
        category: "image",
        accept: "image/*",
        multiple: false,
        engine: "crop-image"
    },
    {
        id: "rotate-image",
        name: "Rotate Image",
        description: "Rotate images by 90, 180 or 270 degrees.",
        icon: "fa-rotate",
        category: "image",
        accept: "image/*",
        multiple: true,
        engine: "rotate-image"
    },
    {
        id: "convert-image",
        name: "Image Converter",
        description: "Convert supported images to JPG, PNG or WebP.",
        icon: "fa-repeat",
        category: "convert",
        accept: "image/*",
        multiple: true,
        engine: "convert-image"
    },
    {
        id: "protect-pdf",
        name: "Protect PDF",
        description: "Encrypt PDF documents with a password when supported.",
        icon: "fa-lock",
        category: "pdf",
        accept: ".pdf,application/pdf",
        multiple: false,
        engine: "protect-pdf"
    },
    {
        id: "sign-pdf",
        name: "Sign PDF",
        description: "Add a typed signature to a PDF page.",
        icon: "fa-signature",
        category: "pdf",
        accept: ".pdf,application/pdf",
        multiple: false,
        engine: "sign-pdf"
    },
    {
        id: "watermark-image",
        name: "Image Watermark",
        description: "Place custom text over an image.",
        icon: "fa-stamp",
        category: "image",
        accept: "image/*",
        multiple: true,
        engine: "watermark-image"
    },
    {
        id: "watermark-pdf",
        name: "PDF Watermark",
        description: "Add text watermarks to PDF pages.",
        icon: "fa-file-circle-check",
        category: "pdf",
        accept: ".pdf,application/pdf",
        multiple: false,
        engine: "watermark-pdf"
    },
    {
        id: "image-to-jpg",
        name: "Image to JPG",
        description: "Export compatible images as JPG files.",
        icon: "fa-file-image",
        category: "convert",
        accept: "image/*",
        multiple: true,
        engine: "image-to-jpg"
    },
    {
        id: "image-to-png",
        name: "Image to PNG",
        description: "Export compatible images as PNG files.",
        icon: "fa-image",
        category: "convert",
        accept: "image/*",
        multiple: true,
        engine: "image-to-png"
    },
    {
        id: "pdf-page-extract",
        name: "Extract PDF Pages",
        description: "Extract one or more selected PDF pages.",
        icon: "fa-file-export",
        category: "pdf",
        accept: ".pdf,application/pdf",
        multiple: false,
        engine: "split-pdf"
    },
    {
        id: "image-dimensions",
        name: "Image Dimensions",
        description: "View image width, height and file size.",
        icon: "fa-ruler-combined",
        category: "image",
        accept: "image/*",
        multiple: true,
        engine: "image-info"
    },
    {
        id: "pdf-info",
        name: "PDF Information",
        description: "View PDF page count and document metadata.",
        icon: "fa-circle-info",
        category: "pdf",
        accept: ".pdf,application/pdf",
        multiple: true,
        engine: "pdf-info"
    },
    {
        id: "image-to-webp",
        name: "Image to WebP",
        description: "Convert supported images into WebP format.",
        icon: "fa-file-image",
        category: "convert",
        accept: "image/*",
        multiple: true,
        engine: "image-to-webp"
    },
    {
        id: "pdf-to-png",
        name: "PDF to PNG",
        description: "Render PDF pages as PNG images.",
        icon: "fa-file-image",
        category: "convert",
        accept: ".pdf,application/pdf",
        multiple: true,
        engine: "pdf-to-png"
    },
    {
        id: "pdf-to-jpg",
        name: "PDF to JPG",
        description: "Render PDF pages as JPG images.",
        icon: "fa-file-image",
        category: "convert",
        accept: ".pdf,application/pdf",
        multiple: true,
        engine: "pdf-to-jpg"
    },
    {
        id: "repair-pdf",
        name: "Repair PDF",
        description: "Attempt to reopen and rewrite a readable PDF.",
        icon: "fa-screwdriver-wrench",
        category: "advanced",
        accept: ".pdf,application/pdf",
        multiple: false,
        engine: "repair-pdf"
    },
    {
        id: "compare-images",
        name: "Compare Images",
        description: "Inspect image dimensions and preview files side by side.",
        icon: "fa-code-compare",
        category: "advanced",
        accept: "image/*",
        multiple: true,
        engine: "image-info"
    },
    {
        id: "resize-pdf",
        name: "Resize PDF Pages",
        description: "Change PDF page dimensions to common paper sizes.",
        icon: "fa-up-right-and-down-left-from-center",
        category: "pdf",
        accept: ".pdf,application/pdf",
        multiple: false,
        engine: "resize-pdf"
    },
    {
        id: "pdf-page-count",
        name: "PDF Page Counter",
        description: "Count pages in a PDF document.",
        icon: "fa-list-ol",
        category: "pdf",
        accept: ".pdf,application/pdf",
        multiple: true,
        engine: "pdf-info"
    },
    {
        id: "office-to-pdf",
        name: "Office to PDF",
        description: "Convert supported Office documents using a compatible service.",
        icon: "fa-file-word",
        category: "convert",
        accept: ".doc,.docx,.xls,.xlsx,.ppt,.pptx",
        multiple: true,
        engine: "server-required"
    },
    {
        id: "pdf-to-office",
        name: "PDF to Office",
        description: "Convert PDF files to editable Office formats using a compatible service.",
        icon: "fa-file-word",
        category: "convert",
        accept: ".pdf,application/pdf",
        multiple: true,
        engine: "server-required"
    },
    {
        id: "ocr",
        name: "OCR Text Extractor",
        description: "Extract text from scanned images using an OCR engine.",
        icon: "fa-file-lines",
        category: "advanced",
        accept: "image/*,.pdf",
        multiple: true,
        engine: "server-required"
    },
    {
        id: "translate-document",
        name: "Document Translator",
        description: "Translate extracted text using a translation service.",
        icon: "fa-language",
        category: "advanced",
        accept: ".txt,.pdf,image/*",
        multiple: true,
        engine: "server-required"
    },
    {
        id: "redact-pdf",
        name: "Redact PDF",
        description: "Create a redacted copy with selected areas covered.",
        icon: "fa-user-secret",
        category: "advanced",
        accept: ".pdf,application/pdf",
        multiple: false,
        engine: "redact-pdf"
    },
    {
        id: "edit-pdf",
        name: "Edit PDF",
        description: "Add text to a PDF page and save a modified copy.",
        icon: "fa-pen-to-square",
        category: "pdf",
        accept: ".pdf,application/pdf",
        multiple: false,
        engine: "edit-pdf"
    },
    {
        id: "image-to-bmp",
        name: "Image to BMP",
        description: "Export supported images as BMP files.",
        icon: "fa-file-image",
        category: "convert",
        accept: "image/*",
        multiple: true,
        engine: "image-to-bmp"
    },
    {
        id: "image-to-gif",
        name: "Image to GIF",
        description: "Export a static image as a GIF file.",
        icon: "fa-images",
        category: "convert",
        accept: "image/*",
        multiple: true,
        engine: "image-to-gif"
    }
];

const CATEGORY_LABELS = {
    all: "All Tools",
    image: "Image Tools",
    pdf: "PDF Tools",
    convert: "Converters",
    advanced: "Advanced Tools"
};

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    if (!Number.isFinite(bytes) || bytes < 0) return "Unknown size";

    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1
    );

    return `${(bytes / Math.pow(1024, index)).toFixed(index ? 2 : 0)} ${units[index]}`;
}

function renderTools() {
    const query = toolSearch.value.trim().toLowerCase();

    const filtered = TOOLS.filter((tool) => {
        const matchesCategory =
            activeCategory === "all" || tool.category === activeCategory;

        const matchesSearch =
            `${tool.name} ${tool.description} ${tool.id}`
                .toLowerCase()
                .includes(query);

        return matchesCategory && matchesSearch;
    });

    toolsGrid.innerHTML = filtered.map((tool) => `
        <article class="tool-card"
                 tabindex="0"
                 role="button"
                 data-tool-id="${escapeHTML(tool.id)}"
                 aria-label="Open ${escapeHTML(tool.name)}">
            <div class="tool-icon">
                <i class="fa-solid ${escapeHTML(tool.icon)}"></i>
            </div>
            <h3>${escapeHTML(tool.name)}</h3>
            <p>${escapeHTML(tool.description)}</p>
            <span class="tool-open">
                Open Tool <i class="fa-solid fa-arrow-right"></i>
            </span>
        </article>
    `).join("");

    noResults.hidden = filtered.length !== 0;
    clearSearch.hidden = !query;
}

function showWorkspace(tool) {
    activeTool = tool;
    selectedFilesArray = [];
    generatedResults = [];

    workspaceTitle.textContent = tool.name;
    workspaceDescription.textContent = tool.description;

    fileInput.value = "";
    fileInput.accept = tool.accept;
    fileInput.multiple = tool.multiple;

    $("#uploadNote").textContent =
        `${tool.multiple ? "Choose one or more files" : "Choose one file"} · Maximum 50 MB per file`;

    toolOptions.hidden = false;
    toolOptions.innerHTML = getOptionsHTML(tool);

    resetMessages();
    renderSelectedFiles();
    updateProcessButton();

    workspaceSection.hidden = false;
    workspaceSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getOptionsHTML(tool) {
    let fields = "";

    switch (tool.engine) {
        case "image":
            fields = `
                <div class="option-field">
                    <label for="imgWidth">Width (px)</label>
                    <input id="imgWidth" type="number" min="1" max="12000"
                           placeholder="e.g. 1200">
                </div>
                <div class="option-field">
                    <label for="imgHeight">Height (px)</label>
                    <input id="imgHeight" type="number" min="1" max="12000"
                           placeholder="e.g. 800">
                </div>
                <div class="option-field">
                    <label for="imgFormat">Output format</label>
                    <select id="imgFormat">
                        <option value="original">Keep original format</option>
                        <option value="image/jpeg">JPG</option>
                        <option value="image/png">PNG</option>
                        <option value="image/webp">WebP</option>
                    </select>
                </div>
                <div class="option-field">
                    <label for="imgQuality">Quality: <span id="qualityValue">85%</span></label>
                    <input id="imgQuality" type="range" min="10" max="100"
                           value="85">
                </div>
                <div class="option-field">
                    <label>
                        <input type="checkbox" id="keepRatio" checked>
                        Keep aspect ratio
                    </label>
                </div>
            `;
            break;

        case "image-to-jpg":
        case "image-to-png":
        case "image-to-webp":
        case "image-to-bmp":
        case "image-to-gif":
        case "convert-image":
            fields = `
                <div class="option-field">
                    <label for="convertFormat">Output format</label>
                    <select id="convertFormat">
                        <option value="image/jpeg">JPG</option>
                        <option value="image/png">PNG</option>
                        <option value="image/webp">WebP</option>
                        <option value="image/bmp">BMP</option>
                        <option value="image/gif">GIF (static)</option>
                    </select>
                </div>
                <div class="option-field">
                    <label for="convertQuality">Quality: <span id="convertQualityValue">90%</span></label>
                    <input id="convertQuality" type="range"
                           min="10" max="100" value="90">
                </div>
            `;
            break;

        case "crop-image":
            fields = `
                <div class="option-field">
                    <label for="cropX">Start X (px)</label>
                    <input id="cropX" type="number" min="0" value="0">
                </div>
                <div class="option-field">
                    <label for="cropY">Start Y (px)</label>
                    <input id="cropY" type="number" min="0" value="0">
                </div>
                <div class="option-field">
                    <label for="cropWidth">Crop width (px)</label>
                    <input id="cropWidth" type="number" min="1" value="500">
                </div>
                <div class="option-field">
                    <label for="cropHeight">Crop height (px)</label>
                    <input id="cropHeight" type="number" min="1" value="500">
                </div>
            `;
            break;

        case "rotate-image":
            fields = `
                <div class="option-field">
                    <label for="rotateAngle">Rotation</label>
                    <select id="rotateAngle">
                        <option value="90">90° clockwise</option>
                        <option value="180">180°</option>
                        <option value="270">270° clockwise</option>
                    </select>
                </div>
            `;
            break;

        case "image-to-pdf":
            fields = `
                <div class="option-field">
                    <label for="pdfPageSize">Page size</label>
                    <select id="pdfPageSize">
                        <option value="a4">A4</option>
                        <option value="letter">Letter</option>
                        <option value="image">Fit page to image</option>
                    </select>
                </div>
                <div class="option-field">
                    <label for="pdfOrientation">Orientation</label>
                    <select id="pdfOrientation">
                        <option value="auto">Auto</option>
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                    </select>
                </div>
                <div class="option-field">
                    <label for="imageMargin">Margin (points)</label>
                    <input id="imageMargin" type="number" min="0"
                           max="100" value="20">
                </div>
            `;
            break;

        case "pdf-to-image":
        case "pdf-to-jpg":
        case "pdf-to-png":
            fields = `
                <div class="option-field">
                    <label for="renderFormat">Image format</label>
                    <select id="renderFormat">
                        <option value="png">PNG</option>
                        <option value="jpeg">JPG</option>
                    </select>
                </div>
                <div class="option-field">
                    <label for="renderScale">Resolution</label>
                    <select id="renderScale">
                        <option value="1">Standard</option>
                        <option value="1.5" selected>High</option>
                        <option value="2">Very High</option>
                    </select>
                </div>
            `;
            break;

        case "merge-pdf":
            fields = `
                <p>PDF files will be combined in the order selected.</p>
            `;
            break;

        case "split-pdf":
            fields = `
                <div class="option-field">
                    <label for="pageRanges">Page numbers or ranges</label>
                    <input id="pageRanges" type="text" value="1"
                           placeholder="Example: 1,3-5,8">
                </div>
                <p>Use commas to separate pages and hyphens for ranges.</p>
            `;
            break;

        case "compress-pdf":
        case "repair-pdf":
            fields = `
                <p>
                    Processing depends on the PDF structure. Some PDFs
                    cannot be significantly compressed or repaired in a browser.
                </p>
            `;
            break;

        case "protect-pdf":
            fields = `
                <div class="option-field">
                    <label for="pdfPassword">Password</label>
                    <input id="pdfPassword" type="password"
                           autocomplete="new-password"
                           placeholder="Enter a strong password">
                </div>
                <p>
                    PDF encryption is not supported by the included PDF library.
                    A compatible encryption engine is required.
                </p>
            `;
            break;

        case "sign-pdf":
        case "edit-pdf":
            fields = `
                <div class="option-field">
                    <label for="pdfText">Text to add</label>
                    <textarea id="pdfText" rows="3"
                              placeholder="${tool.engine === "sign-pdf" ? "Type your signature" : "Type text to add"}"></textarea>
                </div>
                <div class="option-field">
                    <label for="pdfPage">Page number</label>
                    <input id="pdfPage" type="number" min="1" value="1">
                </div>
            `;
            break;

        case "watermark-image":
        case "watermark-pdf":
            fields = `
                <div class="option-field">
                    <label for="watermarkText">Watermark text</label>
                    <input id="watermarkText" type="text"
                           placeholder="Your watermark">
                </div>
            `;
            break;

        case "image-info":
        case "pdf-info":
            fields = `
                <p>Choose your files and select Process Files to view information.</p>
            `;
            break;

        case "resize-pdf":
            fields = `
                <div class="option-field">
                    <label for="paperSize">Page size</label>
                    <select id="paperSize">
                        <option value="a4">A4</option>
                        <option value="letter">Letter</option>
                        <option value="a3">A3</option>
                    </select>
                </div>
            `;
            break;

        case "redact-pdf":
            fields = `
                <p>
                    This tool currently creates a covered copy only when
                    the selected redaction coordinates are supplied.
                    Covering content is not the same as secure redaction.
                </p>
                <div class="option-field">
                    <label for="redactPage">Page number</label>
                    <input id="redactPage" type="number" min="1" value="1">
                </div>
                <div class="option-field">
                    <label for="redactX">X position (points)</label>
                    <input id="redactX" type="number" min="0" value="50">
                </div>
                <div class="option-field">
                    <label for="redactY">Y position (points)</label>
                    <input id="redactY" type="number" min="0" value="50">
                </div>
                <div class="option-field">
                    <label for="redactW">Width (points)</label>
                    <input id="redactW" type="number" min="1" value="150">
                </div>
                <div class="option-field">
                    <label for="redactH">Height (points)</label>
                    <input id="redactH" type="number" min="1" value="40">
                </div>
            `;
            break;

        default:
            fields = `
                <p>
                    This feature needs a compatible OCR, translation,
                    or document conversion engine before it can process files.
                </p>
            `;
    }

    return `
        <h3><i class="fa-solid fa-sliders"></i> Tool Settings</h3>
        <div class="option-grid">${fields}</div>
    `;
}

function resetMessages() {
    progressArea.hidden = true;
    resultArea.hidden = true;
    errorArea.hidden = true;

    progressBar.value = 0;
    resultFiles.innerHTML = "";
    generatedResults = [];

    downloadAllBtn.hidden = true;
}

function renderSelectedFiles() {
    selectedFiles.hidden = selectedFilesArray.length === 0;

    fileList.innerHTML = selectedFilesArray.map((file, index) => `
        <div class="file-item">
            <i class="fa-solid fa-file"></i>
            <div class="file-info">
                <strong>${escapeHTML(file.name)}</strong>
                <small>${formatBytes(file.size)} · ${escapeHTML(file.type || "Unknown file type")}</small>
            </div>
            <button class="file-remove" type="button"
                    data-remove-file="${index}">
                Remove
            </button>
        </div>
    `).join("");
}

function updateProcessButton() {
    processBtn.disabled =
        selectedFilesArray.length === 0 || isProcessing;
}

function addFiles(fileListObject) {
    if (!activeTool) return;

    resetMessages();

    const incoming = Array.from(fileListObject || []);
    const accepted = [];
    const rejected = [];

    for (const file of incoming) {
        if (file.size > MAX_FILE_SIZE) {
            rejected.push(`${file.name}: exceeds 50 MB`);
            continue;
        }

        if (selectedFilesArray.some(
            (existing) =>
                existing.name === file.name &&
                existing.size === file.size &&
                existing.lastModified === file.lastModified
        )) {
            continue;
        }

        if (!isAllowedFile(file, activeTool)) {
            rejected.push(`${file.name}: unsupported file type`);
            continue;
        }

        accepted.push(file);
    }

    const limit = activeTool.multiple ? MAX_FILES : 1;

    selectedFilesArray = [
        ...selectedFilesArray,
        ...accepted
    ].slice(0, limit);

    if (!activeTool.multiple && accepted.length > 1) {
        selectedFilesArray = accepted.slice(0, 1);
    }

    renderSelectedFiles();
    updateProcessButton();

    if (rejected.length) {
        showError(rejected.slice(0, 5).join("\n"));
    }
}

function isAllowedFile(file, tool) {
    const accept = tool.accept.split(",").map((item) => item.trim().toLowerCase());

    return accept.some((item) => {
        if (item.startsWith(".")) {
            return file.name.toLowerCase().endsWith(item);
        }

        if (item.endsWith("/*")) {
            return file.type.startsWith(item.slice(0, -1));
        }

        if (item.includes("/")) {
            return file.type === item;
        }

        return false;
    });
}

function showError(message) {
    errorArea.hidden = false;
    errorMessage.textContent = message;
}

function setProgress(value, message) {
    progressArea.hidden = false;
    progressBar.value = Math.max(0, Math.min(100, value));
    progressText.textContent = message;
}

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {
            URL.revokeObjectURL(url);
            resolve(image);
        };

        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error(`Could not read image: ${file.name}`));
        };

        image.src = url;
    });
}

function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Image export failed."));
                    return;
                }

                resolve(blob);
            },
            type,
            quality
        );
    });
}

function extensionForMime(type) {
    const extensions = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/bmp": "bmp",
        "image/gif": "gif"
    };

    return extensions[type] || "png";
}

function outputName(filename, extension, suffix = "") {
    const base = filename.replace(/\.[^.]+$/, "");
    return `${base}${suffix}.${extension}`;
}

function getOptionValue(id, fallback = "") {
    const element = document.getElementById(id);
    return element ? element.value : fallback;
}

function getChecked(id) {
    const element = document.getElementById(id);
    return Boolean(element && element.checked);
}

function addResult(blob, filename) {
    generatedResults.push({
        blob,
        filename
    });
}

function renderResults() {
    resultFiles.innerHTML = "";

    generatedResults.forEach((item, index) => {
        const url = URL.createObjectURL(item.blob);

        const row = document.createElement("div");
        row.className = "result-file";

        const name = document.createElement("span");
        name.textContent = `${item.filename} (${formatBytes(item.blob.size)})`;

        const link = document.createElement("a");
        link.href = url;
        link.download = item.filename;
        link.textContent = "Download";
        link.addEventListener("click", () => {
            setTimeout(() => URL.revokeObjectURL(url), 60000);
        });

        row.append(name, link);
        resultFiles.appendChild(row);
    });

    downloadAllBtn.hidden = generatedResults.length < 2;
}

async function processImage(file, engine) {
    const image = await loadImage(file);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Your browser does not support image processing.");
    }

    let width = image.naturalWidth;
    let height = image.naturalHeight;
    let mime = "image/png";
    let quality = 0.85;
    let suffix = "_processed";

    if (engine === "image") {
        const requestedWidth = Number(getOptionValue("imgWidth", 0));
        const requestedHeight = Number(getOptionValue("imgHeight", 0));
        const keepRatio = getChecked("keepRatio");

        if (requestedWidth > 0 && requestedHeight > 0) {
            width = requestedWidth;
            height = requestedHeight;

            if (keepRatio) {
                const scale = Math.min(
                    requestedWidth / image.naturalWidth,
                    requestedHeight / image.naturalHeight
                );
                width = Math.round(image.naturalWidth * scale);
                height = Math.round(image.naturalHeight * scale);
            }
        } else if (requestedWidth > 0) {
            width = requestedWidth;
            height = Math.round(
                image.naturalHeight * requestedWidth / image.naturalWidth
            );
        } else if (requestedHeight > 0) {
            height = requestedHeight;
            width = Math.round(
                image.naturalWidth * requestedHeight / image.naturalHeight
            );
        }

        const chosenFormat = getOptionValue("imgFormat", "original");
        mime = chosenFormat === "original"
            ? (file.type === "image/jpeg" ? "image/jpeg" : "image/png")
            : chosenFormat;

        quality = Number(getOptionValue("imgQuality", 85)) / 100;
        suffix = "_resized";
    }

    if (engine === "convert-image" ||
        engine === "image-to-jpg" ||
        engine === "image-to-png" ||
        engine === "image-to-webp" ||
        engine === "image-to-bmp" ||
        engine === "image-to-gif") {

        const fixedFormats = {
            "image-to-jpg": "image/jpeg",
            "image-to-png": "image/png",
            "image-to-webp": "image/webp",
            "image-to-bmp": "image/bmp",
            "image-to-gif": "image/gif"
        };

        mime = fixedFormats[engine] ||
            getOptionValue("convertFormat", "image/jpeg");

        quality = Number(getOptionValue("convertQuality", 90)) / 100;
        suffix = "_converted";
    }

    if (engine === "crop-image") {
        const x = Math.max(0, Number(getOptionValue("cropX", 0)));
        const y = Math.max(0, Number(getOptionValue("cropY", 0)));
        width = Math.min(
            Number(getOptionValue("cropWidth", 500)),
            image.naturalWidth - x
        );
        height = Math.min(
            Number(getOptionValue("cropHeight", 500)),
            image.naturalHeight - y
        );

        if (width < 1 || height < 1 ||
            x >= image.naturalWidth || y >= image.naturalHeight) {
            throw new Error("Crop settings are outside the image dimensions.");
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(
            image, x, y, width, height,
            0, 0, width, height
        );

        return {
            blob: await canvasToBlob(canvas, "image/png"),
            filename: outputName(file.name, "png", "_cropped")
        };
    }

    if (engine === "rotate-image") {
        const angle = Number(getOptionValue("rotateAngle", 90));
        const radians = angle * Math.PI / 180;

        canvas.width = Math.abs(
            image.naturalWidth * Math.cos(radians)
        ) + Math.abs(
            image.naturalHeight * Math.sin(radians)
        );

        canvas.height = Math.abs(
            image.naturalHeight * Math.cos(radians)
        ) + Math.abs(
            image.naturalWidth * Math.sin(radians)
        );

        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(radians);
        context.drawImage(
            image,
            -image.naturalWidth / 2,
            -image.naturalHeight / 2
        );

        return {
            blob: await canvasToBlob(canvas, "image/png"),
            filename: outputName(file.name, "png", "_rotated")
        };
    }

    if (engine === "watermark-image") {
        const text = getOptionValue("watermarkText").trim();

        if (!text) {
            throw new Error("Please enter watermark text.");
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0);

        const fontSize = Math.max(18, Math.round(width / 22));
        context.font = `bold ${fontSize}px Arial`;
        context.fillStyle = "rgba(255,255,255,0.75)";
        context.strokeStyle = "rgba(0,0,0,0.5)";
        context.lineWidth = 2;
        context.textAlign = "center";

        context.strokeText(text, width / 2, height - fontSize);
        context.fillText(text, width / 2, height - fontSize);

        return {
            blob: await canvasToBlob(canvas, "image/png"),
            filename: outputName(file.name, "png", "_watermarked")
        };
    }

    if (engine === "image-info") {
        const report = [
            `File: ${file.name}`,
            `Dimensions: ${image.naturalWidth} × ${image.naturalHeight} px`,
            `Size: ${formatBytes(file.size)}`,
            `Format: ${file.type || "Unknown"}`
        ].join("\n");

        return {
            blob: new Blob([report], { type: "text/plain" }),
            filename: outputName(file.name, "txt", "_info")
        };
    }

    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0, width, height);

    // BMP/GIF canvas export is not broadly supported.
    if (mime === "image/bmp" || mime === "image/gif") {
        mime = "image/png";
    }

    const blob = await canvasToBlob(canvas, mime, quality);

    return {
        blob,
        filename: outputName(
            file.name,
            extensionForMime(blob.type),
            suffix
        )
    };
}

async function getPdfLib() {
    if (!window.PDFLib) {
        throw new Error("PDF library did not load. Check your internet connection and refresh.");
    }

    return window.PDFLib;
}

async function getPdfJs() {
    if (!window.pdfjsLib) {
        throw new Error("PDF renderer did not load. Check your internet connection and refresh.");
    }

    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    return window.pdfjsLib;
}

function parsePageRanges(value, totalPages) {
    const pages = new Set();

    for (const part of value.split(",").map((item) => item.trim())) {
        if (!part) continue;

        const range = part.match(/^(\d+)\s*-\s*(\d+)$/);

        if (range) {
            const start = Number(range[1]);
            const end = Number(range[2]);

            if (start < 1 || end < start || end > totalPages) {
                throw new Error(`Invalid page range: ${part}`);
            }

            for (let page = start; page <= end; page++) {
                pages.add(page);
            }
        } else if (/^\d+$/.test(part)) {
            const page = Number(part);

            if (page < 1 || page > totalPages) {
                throw new Error(`Page ${page} does not exist.`);
            }

            pages.add(page);
        } else {
            throw new Error(`Invalid page selection: ${part}`);
        }
    }

    return [...pages].sort((a, b) => a - b);
}

async function processPdf(file, engine) {
    const PDFLib = await getPdfLib();
    const bytes = await file.arrayBuffer();

    if (engine === "pdf-info") {
        const pdf = await PDFLib.PDFDocument.load(bytes);
        const info = [
            `File: ${file.name}`,
            `Pages: ${pdf.getPageCount()}`,
            `Title: ${pdf.getTitle() || "Not specified"}`,
            `Author: ${pdf.getAuthor() || "Not specified"}`,
            `File size: ${formatBytes(file.size)}`
        ].join("\n");

        return {
            blob: new Blob([info], { type: "text/plain" }),
            filename: outputName(file.name, "txt", "_info")
        };
    }

    if (engine === "merge-pdf") {
        throw new Error("Merge processing is handled separately.");
    }

    const pdf = await PDFLib.PDFDocument.load(bytes);

    if (engine === "split-pdf") {
        const ranges = parsePageRanges(
            getOptionValue("pageRanges", "1"),
            pdf.getPageCount()
        );

        if (!ranges.length) {
            throw new Error("Select at least one page.");
        }

        const output = await PDFLib.PDFDocument.create();
        const copiedPages = await output.copyPages(
            pdf,
            ranges.map((page) => page - 1)
        );

        copiedPages.forEach((page) => output.addPage(page));

        return {
            blob: new Blob([await output.save()], {
                type: "application/pdf"
            }),
            filename: outputName(file.name, "pdf", "_pages")
        };
    }

    if (engine === "repair-pdf") {
        return {
            blob: new Blob([await pdf.save()], {
                type: "application/pdf"
            }),
            filename: outputName(file.name, "pdf", "_repaired")
        };
    }

    if (engine === "watermark-pdf") {
        const text = getOptionValue("watermarkText").trim();

        if (!text) throw new Error("Enter watermark text.");

        const font = await pdf.embedFont(PDFLib.StandardFonts.Helvetica);

        pdf.getPages().forEach((page) => {
            const { width, height } = page.getSize();

            page.drawText(text, {
                x: 40,
                y: height / 2,
                size: 24,
                font,
                color: PDFLib.rgb(0.6, 0.6, 0.6),
                opacity: 0.35,
                rotate: PDFLib.degrees(0)
            });
        });

        return {
            blob: new Blob([await pdf.save()], {
                type: "application/pdf"
            }),
            filename: outputName(file.name, "pdf", "_watermarked")
        };
    }

    if (engine === "edit-pdf" || engine === "sign-pdf") {
        const text = getOptionValue("pdfText").trim();

        if (!text) throw new Error("Enter the text to add.");

        const pageNumber = Number(getOptionValue("pdfPage", 1));

        if (pageNumber < 1 || pageNumber > pdf.getPageCount()) {
            throw new Error("Invalid page number.");
        }

        const page = pdf.getPage(pageNumber - 1);
        const font = await pdf.embedFont(PDFLib.StandardFonts.Helvetica);
        const { height } = page.getSize();

        page.drawText(text, {
            x: 45,
            y: height - 70,
            size: engine === "sign-pdf" ? 22 : 14,
            font,
            color: PDFLib.rgb(0.08, 0.08, 0.15)
        });

        return {
            blob: new Blob([await pdf.save()], {
                type: "application/pdf"
            }),
            filename: outputName(
                file.name, "pdf",
                engine === "sign-pdf" ? "_signed" : "_edited"
            )
        };
    }

    if (engine === "redact-pdf") {
        const pageNumber = Number(getOptionValue("redactPage", 1));

        if (pageNumber < 1 || pageNumber > pdf.getPageCount()) {
            throw new Error("Invalid page number.");
        }

        const page = pdf.getPage(pageNumber - 1);
        const { width, height } = page.getSize();

        const x = Number(getOptionValue("redactX", 50));
        const y = Number(getOptionValue("redactY", 50));
        const w = Number(getOptionValue("redactW", 150));
        const h = Number(getOptionValue("redactH", 40));

        if (x + w > width || y + h > height || w <= 0 || h <= 0) {
            throw new Error("Redaction rectangle is outside the page.");
        }

        page.drawRectangle({
            x, y, width: w, height: h,
            color: PDFLib.rgb(0, 0, 0)
        });

        return {
            blob: new Blob([await pdf.save()], {
                type: "application/pdf"
            }),
            filename: outputName(file.name, "pdf", "_covered")
        };
    }

    if (engine === "resize-pdf") {
        const sizes = {
            a4: [595.28, 841.89],
            letter: [612, 792],
            a3: [841.89, 1190.55]
        };

        const [newWidth, newHeight] =
            sizes[getOptionValue("paperSize", "a4")];

        pdf.getPages().forEach((page) => {
            page.setSize(newWidth, newHeight);
        });

        return {
            blob: new Blob([await pdf.save()], {
                type: "application/pdf"
            }),
            filename: outputName(file.name, "pdf", "_resized")
        };
    }

    if (engine === "compress-pdf") {
        throw new Error(
            "This basic browser library cannot reliably recompress embedded PDF images. Use a dedicated PDF optimizer for actual compression."
        );
    }

    if (engine === "protect-pdf") {
        throw new Error(
            "Password encryption requires an encryption-capable PDF engine. This browser library does not provide PDF password protection."
        );
    }

    throw new Error("This PDF operation is not implemented yet.");
}

async function processPdfToImages(file, engine) {
    const pdfjs = await getPdfJs();
    const buffer = await file.arrayBuffer();

    const document = await pdfjs.getDocument({
        data: new Uint8Array(buffer)
    }).promise;

    const scale = Number(getOptionValue("renderScale", 1.5));
    const format = engine === "pdf-to-jpg"
        ? "jpeg"
        : engine === "pdf-to-png"
            ? "png"
            : getOptionValue("renderFormat", "png");

    const results = [];

    for (let pageNo = 1; pageNo <= document.numPages; pageNo++) {
        setProgress(
            Math.round((pageNo / document.numPages) * 90),
            `Rendering PDF page ${pageNo} of ${document.numPages}...`
        );

        const page = await document.getPage(pageNo);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        const context = canvas.getContext("2d");

        await page.render({
            canvasContext: context,
            viewport
        }).promise;

        const mime = format === "jpeg" ? "image/jpeg" : "image/png";
        const blob = await canvasToBlob(canvas, mime, 0.92);

        results.push({
            blob,
            filename: `${file.name.replace(/\.pdf$/i, "")}_page_${pageNo}.${format === "jpeg" ? "jpg" : "png"}`
        });

        canvas.width = 0;
        canvas.height = 0;
    }

    return results;
}

async function imageToPdf(files) {
    const PDFLib = await getPdfLib();
    const pdf = await PDFLib.PDFDocument.create();

    const pageSize = getOptionValue("pdfPageSize", "a4");
    const orientation = getOptionValue("pdfOrientation", "auto");
    const margin = Math.max(0, Number(getOptionValue("imageMargin", 20)));

    const sizes = {
        a4: [595.28, 841.89],
        letter: [612, 792]
    };

    for (let index = 0; index < files.length; index++) {
        setProgress(
            Math.round((index / files.length) * 90),
            `Adding image ${index + 1} of ${files.length}...`
        );

        const file = files[index];
        const bytes = await file.arrayBuffer();
        let image;

        if (file.type === "image/jpeg") {
            image = await pdf.embedJpg(bytes);
        } else if (file.type === "image/png") {
            image = await pdf.embedPng(bytes);
        } else {
            const loaded = await loadImage(file);
            const canvas = document.createElement("canvas");
            canvas.width = loaded.naturalWidth;
            canvas.height = loaded.naturalHeight;
            canvas.getContext("2d").drawImage(loaded, 0, 0);

            image = await pdf.embedPng(
                await (await canvasToBlob(canvas, "image/png")).arrayBuffer()
            );
        }

        const dimensions = image.scale(1);

        let width;
        let height;

        if (pageSize === "image") {
            width = dimensions.width + margin * 2;
            height = dimensions.height + margin * 2;
        } else {
            [width, height] = sizes[pageSize] || sizes.a4;
        }

        if (orientation === "landscape" ||
            (orientation === "auto" &&
             dimensions.width > dimensions.height)) {
            [width, height] = [Math.max(width, height), Math.min(width, height)];
        } else if (orientation === "portrait") {
            [width, height] = [Math.min(width, height), Math.max(width, height)];
        }

        const page = pdf.addPage([width, height]);
        const maxWidth = Math.max(1, width - margin * 2);
        const maxHeight = Math.max(1, height - margin * 2);

        const scale = Math.min(
            maxWidth / dimensions.width,
            maxHeight / dimensions.height
        );

        const drawWidth = dimensions.width * scale;
        const drawHeight = dimensions.height * scale;

        page.drawImage(image, {
            x: (width - drawWidth) / 2,
            y: (height - drawHeight) / 2,
            width: drawWidth,
            height: drawHeight
        });
    }

    return {
        blob: new Blob([await pdf.save()], {
            type: "application/pdf"
        }),
        filename: "resize-guru-images.pdf"
    };
}

async function mergePdfs(files) {
    const PDFLib = await getPdfLib();
    const merged = await PDFLib.PDFDocument.create();

    for (let index = 0; index < files.length; index++) {
        setProgress(
            Math.round((index / files.length) * 90),
            `Merging PDF ${index + 1} of ${files.length}...`
        );

        const source = await PDFLib.PDFDocument.load(
            await files[index].arrayBuffer()
        );

        const pages = await merged.copyPages(
            source,
            source.getPageIndices()
        );

        pages.forEach((page) => merged.addPage(page));
    }

    return {
        blob: new Blob([await merged.save()], {
            type: "application/pdf"
        }),
        filename: "merged.pdf"
    };
}

async function processTool() {
    if (!activeTool || !selectedFilesArray.length || isProcessing) {
        return;
    }

    resetMessages();
    isProcessing = true;
    updateProcessButton();

    try {
        const results = [];
        const engine = activeTool.engine;

        if (engine === "server-required") {
            throw new Error(
                "This tool requires a compatible backend/API. It is not available for local processing yet."
            );
        }

        if (engine === "merge-pdf") {
            if (selectedFilesArray.length < 2) {
                throw new Error("Select at least two PDF files to merge.");
            }

            results.push(await mergePdfs(selectedFilesArray));
        } else if (engine === "image-to-pdf") {
            results.push(await imageToPdf(selectedFilesArray));
        } else {
            for (let index = 0; index < selectedFilesArray.length; index++) {
                const file = selectedFilesArray[index];

                setProgress(
                    Math.round((index / selectedFilesArray.length) * 90),
                    `Processing file ${index + 1} of ${selectedFilesArray.length}...`
                );

                if (engine.startsWith("pdf-to-")) {
                    results.push(...await processPdfToImages(file, engine));
                } else if (
                    engine === "image" ||
                    engine === "convert-image" ||
                    engine.startsWith("image-to-") ||
                    engine === "crop-image" ||
                    engine === "rotate-image" ||
                    engine === "watermark-image" ||
                    engine === "image-info"
                ) {
                    results.push(await processImage(file, engine));
                } else if (
                    engine === "merge-pdf" ||
                    engine === "split-pdf" ||
                    engine === "compress-pdf" ||
                    engine === "protect-pdf" ||
                    engine === "sign-pdf" ||
                    engine === "watermark-pdf" ||
                    engine === "pdf-info" ||
                    engine === "repair-pdf" ||
                    engine === "resize-pdf" ||
                    engine === "redact-pdf" ||
                    engine === "edit-pdf"
                ) {
                    results.push(await processPdf(file, engine));
                } else {
                    throw new Error("This tool is not implemented yet.");
                }
            }
        }

        if (!results.length) {
            throw new Error("No output files were created.");
        }

        generatedResults = results;

        setProgress(100, "Processing complete.");

        resultTitle.textContent = "Processing complete";
        resultMessage.textContent =
            `${results.length} output file(s) ready for download.`;

        renderResults();
        resultArea.hidden = false;

    } catch (error) {
        showError(error.message || "Something went wrong while processing files.");
    } finally {
        isProcessing = false;
        updateProcessButton();
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

toolsGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-tool-id]");
    if (!card) return;

    const tool = TOOLS.find((item) => item.id === card.dataset.toolId);
    if (tool) showWorkspace(tool);
});

toolsGrid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest("[data-tool-id]");
    if (!card) return;

    event.preventDefault();

    const tool = TOOLS.find((item) => item.id === card.dataset.toolId);
    if (tool) showWorkspace(tool);
});

toolSearch.addEventListener("input", renderTools);

clearSearch.addEventListener("click", () => {
    toolSearch.value = "";
    renderTools();
    toolSearch.focus();
});

categoryTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    activeCategory = button.dataset.category;

    categoryTabs.querySelectorAll(".category-btn").forEach((item) => {
        item.classList.toggle("active", item === button);
    });

    renderTools();
});

browseFiles.addEventListener("click", () => fileInput.click());

uploadArea.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    fileInput.click();
});

fileInput.addEventListener("change", () => {
    addFiles(fileInput.files);
    fileInput.value = "";
});

["dragenter", "dragover"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, (event) => {
        event.preventDefault();
        uploadArea.classList.add("drag-over");
    });
});

["dragleave", "drop"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, (event) => {
        event.preventDefault();
        uploadArea.classList.remove("drag-over");
    });
});

uploadArea.addEventListener("drop", (event) => {
    addFiles(event.dataTransfer.files);
});

fileList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-file]");
    if (!button) return;

    selectedFilesArray.splice(Number(button.dataset.removeFile), 1);

    resetMessages();
    renderSelectedFiles();
    updateProcessButton();
});

clearFilesBtn.addEventListener("click", () => {
    selectedFilesArray = [];
    fileInput.value = "";

    resetMessages();
    renderSelectedFiles();
    updateProcessButton();
});

toolOptions.addEventListener("input", (event) => {
    if (event.target.id === "imgQuality") {
        $("#qualityValue").textContent = `${event.target.value}%`;
    }

    if (event.target.id === "convertQuality") {
        $("#convertQualityValue").textContent = `${event.target.value}%`;
    }
});

toolForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await processTool();
});

downloadAllBtn.addEventListener("click", async () => {
    for (const item of generatedResults) {
        const url = URL.createObjectURL(item.blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = item.filename;
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 60000);

        await new Promise((resolve) => setTimeout(resolve, 250));
    }
});

startAgainBtn.addEventListener("click", () => {
    selectedFilesArray = [];
    fileInput.value = "";

    resetMessages();
    renderSelectedFiles();
    updateProcessButton();

    uploadArea.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

$("#backToTools").addEventListener("click", () => {
    workspaceSection.hidden = true;

    $("#tools").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// Mobile navigation
const mobileMenuBtn = $("#mobileMenuBtn");
const mainNav = $("#mainNav");

mobileMenuBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
    mobileMenuBtn.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});

// Set current year
$("#currentYear").textContent = new Date().getFullYear();

// Initialize application
renderTools();

