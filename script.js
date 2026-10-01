const {
    PDFDocument,
    degrees,
    rgb,
    StandardFonts
} = PDFLib;


let currentTool = null;

const modal =
    document.getElementById("toolModal");

const modalTitle =
    document.getElementById("modalTitle");

const modalDescription =
    document.getElementById("modalDescription");

const fileInput =
    document.getElementById("fileInput");

const selectedFile =
    document.getElementById("selectedFile");

const toolOptions =
    document.getElementById("toolOptions");

const progress =
    document.getElementById("progress");


const tools = {

    "image-pdf": {
        title: "Image to PDF",
        description: "Convert one or more images into a PDF."
    },

    "pdf-image": {
        title: "PDF to Image",
        description: "Convert PDF pages into JPG images."
    },

    "merge": {
        title: "Merge PDF",
        description: "Combine multiple PDF files."
    },

    "split": {
        title: "Split PDF",
        description: "Extract selected pages from a PDF."
    },

    "rotate": {
        title: "Rotate PDF",
        description: "Rotate every page of your PDF."
    },

    "page-number": {
        title: "Page Number",
        description: "Add page numbers to your PDF."
    },

    "resize-image": {
        title: "Resize Image",
        description: "Resize using percentage or pixel dimensions."
    },

    "compress-image": {
        title: "Compress Image",
        description: "Reduce image file size."
    },

    "crop-image": {
        title: "Crop Image",
        description: "Crop an image."
    },

    "rotate-image": {
        title: "Rotate Image",
        description: "Rotate an image."
    }

};


function openTool(name) {

    currentTool = name;

    const tool = tools[name];

    modalTitle.textContent = tool.title;

    modalDescription.textContent =
        tool.description;

    fileInput.value = "";

    selectedFile.innerHTML = "";

    progress.innerHTML = "";

    createOptions(name);

    modal.classList.add("active");

}


function closeTool() {

    modal.classList.remove("active");

}


function createOptions(tool) {

    toolOptions.innerHTML = "";


    /* IMAGE RESIZE */

    if (tool === "resize-image") {

        toolOptions.innerHTML = `

        <div class="options-box">

            <label>
                Resize Method
            </label>

            <select id="resizeMode"
                onchange="changeResizeMode()">

                <option value="percentage">
                    Percentage
                </option>

                <option value="pixels">
                    Pixels
                </option>

                <option value="dimensions">
                    Dimensions
                </option>

            </select>


            <div id="resizeControls">

                <label>
                    Percentage
                </label>

                <input
                    type="number"
                    id="resizePercentage"
                    value="50"
                    min="1"
                    max="500"
                >

            </div>

        </div>

        `;

    }


    /* IMAGE COMPRESSION */

    if (tool === "compress-image") {

        toolOptions.innerHTML = `

        <div class="options-box">

            <label>
                Quality
            </label>

            <input
                type="range"
                id="imageQuality"
                min="10"
                max="100"
                value="75"
                oninput="
                    document.getElementById('qualityValue')
                    .textContent=this.value+'%'
                "
            >

            <strong id="qualityValue">
                75%
            </strong>

        </div>

        `;

    }


    /* CROP */

    if (tool === "crop-image") {

        toolOptions.innerHTML = `

        <div class="options-box">

            <div class="two-inputs">

                <input
                    type="number"
                    id="cropWidth"
                    placeholder="Width px"
                >

                <input
                    type="number"
                    id="cropHeight"
                    placeholder="Height px"
                >

            </div>

        </div>

        `;

    }


    /* ROTATE IMAGE */

    if (tool === "rotate-image") {

        toolOptions.innerHTML = `

        <div class="options-box">

            <label>
                Rotation
            </label>

            <select id="imageRotation">

                <option value="90">90°</option>
                <option value="180">180°</option>
                <option value="270">270°</option>

            </select>

        </div>

        `;

    }


    /* PDF ROTATION */

    if (tool === "rotate") {

        toolOptions.innerHTML = `

        <div class="options-box">

            <label>
                Rotation
            </label>

            <select id="pdfRotation">

                <option value="90">90°</option>
                <option value="180">180°</option>
                <option value="270">270°</option>

            </select>

        </div>

        `;

    }


    /* SPLIT */

    if (tool === "split") {

        toolOptions.innerHTML = `

        <div class="options-box">

            <label>
                Pages
            </label>

            <input
                type="text"
                id="splitPages"
                placeholder="Example: 1,3,5-7"
            >

            <small>
                Leave empty to extract every page separately.
            </small>

        </div>

        `;

    }

}


function changeResizeMode() {

    const mode =
        document.getElementById("resizeMode").value;

    const controls =
        document.getElementById("resizeControls");


    if (mode === "percentage") {

        controls.innerHTML = `

            <label>Percentage</label>

            <input
                type="number"
                id="resizePercentage"
                value="50"
                min="1"
                max="500"
            >

        `;

    }


    if (
        mode === "pixels" ||
        mode === "dimensions"
    ) {

        controls.innerHTML = `

            <div class="two-inputs">

                <input
                    type="number"
                    id="resizeWidth"
                    placeholder="Width px"
                >

                <input
                    type="number"
                    id="resizeHeight"
                    placeholder="Height px"
                >

            </div>

            <label>
                <input
                    type="checkbox"
                    id="keepRatio"
                    checked
                >
                Keep aspect ratio
            </label>

        `;

    }

}


fileInput.addEventListener(
    "change",
    function () {

        const files =
            Array.from(fileInput.files);

        if (!files.length) {

            selectedFile.innerHTML = "";

            return;

        }

        selectedFile.innerHTML =
            files
                .map(
                    file =>
                        `<div>
                            ${file.name}
                            (${formatSize(file.size)})
                        </div>`
                )
                .join("");

    }
);


function formatSize(bytes) {

    if (!bytes) return "0 B";

    const units = [
        "B",
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
        (bytes /
            Math.pow(1024, index))
            .toFixed(2)
        + " "
        + units[index]
    );

}


async function startProcessing() {

    const files =
        Array.from(fileInput.files);

    if (!files.length) {

        alert("Please select a file first.");

        return;

    }

    try {

        progress.innerHTML =
            "⏳ Processing...";

        let result;


        switch (currentTool) {

            case "image-pdf":

                result =
                    await imageToPDF(files);

                break;


            case "pdf-image":

                await pdfToImage(files[0]);

                progress.innerHTML =
                    "✅ PDF converted successfully.";

                return;


            case "merge":

                result =
                    await mergePDF(files);

                break;


            case "split":

                await splitPDF(files[0]);

                progress.innerHTML =
                    "✅ PDF split successfully.";

                return;


            case "rotate":

                result =
                    await rotatePDF(files[0]);

                break;


            case "page-number":

                result =
                    await addPageNumbers(files[0]);

                break;


            case "resize-image":

                result =
                    await resizeImage(files[0]);

                break;


            case "compress-image":

                result =
                    await compressImage(files[0]);

                break;


            case "crop-image":

                result =
                    await cropImage(files[0]);

                break;


            case "rotate-image":

                result =
                    await rotateImage(files[0]);

                break;


            default:

                throw new Error(
                    "This tool is not connected yet."
                );

        }


        if (result) {

            downloadBlob(
                result.blob,
                result.filename
            );

        }

        progress.innerHTML =
            "✅ Processing completed successfully.";

    }

    catch (error) {

        console.error(error);

        progress.innerHTML =
            "❌ " + error.message;

    }

}


/* =====================================================
   IMAGE → PDF
===================================================== */

async function imageToPDF(files) {

    const pdfDoc =
        await PDFDocument.create();


    for (const file of files) {

        const bytes =
            await file.arrayBuffer();

        let image;


        if (
            file.type === "image/jpeg" ||
            file.type === "image/jpg"
        ) {

            image =
                await pdfDoc.embedJpg(bytes);

        }

        else if (
            file.type === "image/png"
        ) {

            image =
                await pdfDoc.embedPng(bytes);

        }

        else {

            throw new Error(
                "Please upload JPG or PNG images."
            );

        }


        const dimensions =
            image.scale(1);


        const page =
            pdfDoc.addPage([
                dimensions.width,
                dimensions.height
            ]);


        page.drawImage(image, {

            x: 0,

            y: 0,

            width: dimensions.width,

            height: dimensions.height

        });

    }


    const pdfBytes =
        await pdfDoc.save();


    return {

        blob:
            new Blob(
                [pdfBytes],
                { type: "application/pdf" }
            ),

        filename:
            "resize-guru-images.pdf"

    };

}


/* =====================================================
   PDF → IMAGE
===================================================== */

async function pdfToImage(file) {

    /*
      PDF.js is loaded as an ES module.
      We dynamically import it here.
    */

    const pdfjsLib =
        await import(
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs"
        );


    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";


    const bytes =
        new Uint8Array(
            await file.arrayBuffer()
        );


    const pdf =
        await pdfjsLib.getDocument({
            data: bytes
        }).promise;


    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        const page =
            await pdf.getPage(pageNumber);


        const viewport =
            page.getViewport({
                scale: 2
            });


        const canvas =
            document.createElement("canvas");


        const context =
            canvas.getContext("2d");


        canvas.width =
            viewport.width;

        canvas.height =
            viewport.height;


        await page.render({

            canvasContext: context,

            viewport: viewport

        }).promise;


        const blob =
            await new Promise(
                resolve =>
                    canvas.toBlob(
                        resolve,
                        "image/jpeg",
                        0.92
                    )
            );


        downloadBlob(
            blob,
            `resize-guru-page-${pageNumber}.jpg`
        );

    }

}


/* =====================================================
   MERGE PDF
===================================================== */

async function mergePDF(files) {

    if (files.length < 2) {

        throw new Error(
            "Select at least two PDF files."
        );

    }


    const merged =
        await PDFDocument.create();


    for (const file of files) {

        const bytes =
            await file.arrayBuffer();

        const pdf =
            await PDFDocument.load(bytes);

        const pages =
            await merged.copyPages(
                pdf,
                pdf.getPageIndices()
            );


        pages.forEach(
            page =>
                merged.addPage(page)
        );

    }


    const bytes =
        await merged.save();


    return {

        blob:
            new Blob(
                [bytes],
                { type: "application/pdf" }
            ),

        filename:
            "resize-guru-merged.pdf"

    };

}


/* =====================================================
   SPLIT PDF
===================================================== */

async function splitPDF(file) {

    const bytes =
        await file.arrayBuffer();


    const pdf =
        await PDFDocument.load(bytes);


    const total =
        pdf.getPageCount();


    let pagesText =
        document.getElementById(
            "splitPages"
        ).value.trim();


    let indexes;


    if (!pagesText) {

        indexes =
            Array.from(
                { length: total },
                (_, i) => i
            );

    }

    else {

        indexes =
            parsePageSelection(
                pagesText,
                total
            );

    }


    for (const index of indexes) {

        const newPdf =
            await PDFDocument.create();


        const [page] =
            await newPdf.copyPages(
                pdf,
                [index]
            );


        newPdf.addPage(page);


        const output =
            await newPdf.save();


        downloadBlob(

            new Blob(
                [output],
                {
                    type:
                        "application/pdf"
                }
            ),

            `resize-guru-page-${index + 1}.pdf`

        );

    }

}


function parsePageSelection(text, total) {

    const result = [];


    const parts =
        text.split(",");


    for (const part of parts) {

        const value =
            part.trim();


        if (value.includes("-")) {

            const [a, b] =
                value
                    .split("-")
                    .map(Number);


            if (
                !Number.isInteger(a) ||
                !Number.isInteger(b)
            ) {

                throw new Error(
                    "Invalid page range."
                );

            }


            for (
                let i = a;
                i <= b;
                i++
            ) {

                if (
                    i >= 1 &&
                    i <= total
                ) {

                    result.push(i - 1);

                }

            }

        }

        else {

            const page =
                Number(value);


            if (
                Number.isInteger(page) &&
                page >= 1 &&
                page <= total
            ) {

                result.push(page - 1);

            }

        }

    }


    return [
        ...new Set(result)
    ];

}


/* =====================================================
   ROTATE PDF
===================================================== */

async function rotatePDF(file) {

    const bytes =
        await file.arrayBuffer();


    const pdf =
        await PDFDocument.load(bytes);


    const rotation =
        Number(
            document.getElementById(
                "pdfRotation"
            ).value
        );


    for (const page of pdf.getPages()) {

        const existing =
            page.getRotation().angle || 0;


        page.setRotation(
            degrees(
                existing + rotation
            )
        );

    }


    const output =
        await pdf.save();


    return {

        blob:
            new Blob(
                [output],
                {
                    type:
                        "application/pdf"
                }
            ),

        filename:
            "resize-guru-rotated.pdf"

    };

}


/* =====================================================
   PAGE NUMBERS
===================================================== */

async function addPageNumbers(file) {

    const bytes =
        await file.arrayBuffer();


    const pdf =
        await PDFDocument.load(bytes);


    const font =
        await pdf.embedFont(
            StandardFonts.Helvetica
        );


    const pages =
        pdf.getPages();


    pages.forEach(
        (page, index) => {

            const {
                width
            } = page.getSize();


            page.drawText(
                `${index + 1}`,
                {
                    x:
                        width / 2 - 5,

                    y:
                        20,

                    size:
                        10,

                    font,

                    color:
                        rgb(
                            0.2,
                            0.2,
                            0.2
                        )
                }
            );

        }
    );


    const output =
        await pdf.save();


    return {

        blob:
            new Blob(
                [output],
                {
                    type:
                        "application/pdf"
                }
            ),

        filename:
            "resize-guru-numbered.pdf"

    };

}


/* =====================================================
   IMAGE RESIZE
===================================================== */

async function resizeImage(file) {

    const image =
        await loadImage(file);


    let width =
        image.naturalWidth;

    let height =
        image.naturalHeight;


    const mode =
        document.getElementById(
            "resizeMode"
        ).value;


    if (mode === "percentage") {

        const percentage =
            Number(
                document.getElementById(
                    "resizePercentage"
                ).value
            );


        width =
            Math.round(
                width *
                percentage /
                100
            );


        height =
            Math.round(
                height *
                percentage /
                100
            );

    }


    else {

        const newWidth =
            Number(
                document.getElementById(
                    "resizeWidth"
                ).value
            );


        const newHeight =
            Number(
                document.getElementById(
                    "resizeHeight"
                ).value
            );


        const keepRatio =
            document.getElementById(
                "keepRatio"
            ).checked;


        if (!newWidth) {

            throw new Error(
                "Enter image width."
            );

        }


        if (keepRatio) {

            width =
                newWidth;

            height =
                Math.round(
                    image.naturalHeight *
                    newWidth /
                    image.naturalWidth
                );

        }

        else {

            if (!newHeight) {

                throw new Error(
                    "Enter image height."
                );

            }

            width =
                newWidth;

            height =
                newHeight;

        }

    }


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        width;

    canvas.height =
        height;


    const ctx =
        canvas.getContext("2d");


    ctx.drawImage(
        image,
        0,
        0,
        width,
        height
    );


    const blob =
        await canvasToBlob(
            canvas,
            "image/png",
            1
        );


    return {

        blob,

        filename:
            "resize-guru-resized.png"

    };

}


/* =====================================================
   IMAGE COMPRESS
===================================================== */

async function compressImage(file) {

    const image =
        await loadImage(file);


    const quality =
        Number(
            document.getElementById(
                "imageQuality"
            ).value
        ) / 100;


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        image.naturalWidth;

    canvas.height =
        image.naturalHeight;


    const ctx =
        canvas.getContext("2d");


    ctx.drawImage(
        image,
        0,
        0
    );


    const blob =
        await canvasToBlob(
            canvas,
            "image/jpeg",
            quality
        );


    return {

        blob,

        filename:
            "resize-guru-compressed.jpg"

    };

}


/* =====================================================
   CROP IMAGE
===================================================== */

async function cropImage(file) {

    const image =
        await loadImage(file);


    const cropWidth =
        Number(
            document.getElementById(
                "cropWidth"
            ).value
        );


    const cropHeight =
        Number(
            document.getElementById(
                "cropHeight"
            ).value
        );


    if (
        !cropWidth ||
        !cropHeight
    ) {

        throw new Error(
            "Enter crop width and height."
        );

    }


    if (
        cropWidth > image.naturalWidth ||
        cropHeight > image.naturalHeight
    ) {

        throw new Error(
            "Crop dimensions cannot exceed image dimensions."
        );

    }


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        cropWidth;

    canvas.height =
        cropHeight;


    const ctx =
        canvas.getContext("2d");


    const x =
        (image.naturalWidth -
            cropWidth) / 2;


    const y =
        (image.naturalHeight -
            cropHeight) / 2;


    ctx.drawImage(

        image,

        x,
        y,

        cropWidth,
        cropHeight,

        0,
        0,

        cropWidth,
        cropHeight

    );


    const blob =
        await canvasToBlob(
            canvas,
            "image/png",
            1
        );


    return {

        blob,

        filename:
            "resize-guru-cropped.png"

    };

}


/* =====================================================
   ROTATE IMAGE
===================================================== */

async function rotateImage(file) {

    const image =
        await loadImage(file);


    const rotation =
        Number(
            document.getElementById(
                "imageRotation"
            ).value
        );


    const swap =
        rotation === 90 ||
        rotation === 270;


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        swap ?
        image.naturalHeight :
        image.naturalWidth;


    canvas.height =
        swap ?
        image.naturalWidth :
        image.naturalHeight;


    const ctx =
        canvas.getContext("2d");


    ctx.translate(
        canvas.width / 2,
        canvas.height / 2
    );


    ctx.rotate(
        rotation *
        Math.PI /
        180
    );


    ctx.drawImage(

        image,

        -image.naturalWidth / 2,

        -image.naturalHeight / 2

    );


    const blob =
        await canvasToBlob(
            canvas,
            "image/png",
            1
        );


    return {

        blob,

        filename:
            "resize-guru-rotated.png"

    };

}


/* =====================================================
   HELPERS
===================================================== */

function loadImage(file) {

    return new Promise(
        (resolve, reject) => {

            const image =
                new Image();


            const url =
                URL.createObjectURL(file);


            image.onload =
                () => {

                    URL.revokeObjectURL(
                        url
                    );

                    resolve(image);

                };


            image.onerror =
                () => {

                    URL.revokeObjectURL(
                        url
                    );

                    reject(
                        new Error(
                            "Unable to read image."
                        )
                    );

                };


            image.src =
                url;

        }
    );

}


function canvasToBlob(
    canvas,
    type,
    quality
) {

    return new Promise(
        resolve => {

            canvas.toBlob(
                resolve,
                type,
                quality
            );

        }
    );

}


function downloadBlob(
    blob,
    filename
) {

    if (!blob) {

        throw new Error(
            "Generated file is empty."
        );

    }


    if (blob.size === 0) {

        throw new Error(
            "Generated file is blank."
        );

    }


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;

    link.download =
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () =>
            URL.revokeObjectURL(url),
        1000
    );

}
