/* =====================================================
   RESIZE GURU
   IMAGE -> PDF ENGINE
===================================================== */

const {
    PDFDocument
} = PDFLib;


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let currentTool = null;

let selectedImages = [];


/* =====================================================
   ELEMENTS
===================================================== */

const modal =
    document.getElementById("toolModal");

const modalTitle =
    document.getElementById("modalTitle");

const modalDescription =
    document.getElementById("modalDescription");

const fileInput =
    document.getElementById("fileInput");

const uploadArea =
    document.getElementById("uploadArea");

const previewContainer =
    document.getElementById(
        "previewContainer"
    );

const fileCount =
    document.getElementById(
        "fileCount"
    );

const progress =
    document.getElementById(
        "progress"
    );


/* =====================================================
   OPEN IMAGE TO PDF
===================================================== */

function openTool(tool) {

    currentTool = tool;

    selectedImages = [];

    fileInput.value = "";

    renderPreviews();


    if (tool === "image-pdf") {

        modalTitle.textContent =
            "Image to PDF";

        modalDescription.textContent =
            "Convert multiple JPG, PNG or WebP images into one PDF.";

    }


    modal.classList.add("active");

}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeTool() {

    modal.classList.remove("active");

    selectedImages = [];

    fileInput.value = "";

    renderPreviews();

}


/* =====================================================
   FILE INPUT
===================================================== */

fileInput.addEventListener(
    "change",
    function (event) {

        const files =
            Array.from(
                event.target.files
            );

        addImages(files);

    }
);


/* =====================================================
   ADD IMAGES
===================================================== */

function addImages(files) {

    const validFiles =
        files.filter(
            file =>
                file.type === "image/jpeg" ||
                file.type === "image/png" ||
                file.type === "image/webp"
        );


    if (!validFiles.length) {

        alert(
            "Please select JPG, PNG or WebP images."
        );

        return;

    }


    validFiles.forEach(
        file => {

            /*
              Avoid adding the exact same
              file multiple times.
            */

            const alreadyExists =
                selectedImages.some(
                    item =>
                        item.name === file.name &&
                        item.size === file.size &&
                        item.lastModified === file.lastModified
                );


            if (!alreadyExists) {

                selectedImages.push(file);

            }

        }
    );


    renderPreviews();

}


/* =====================================================
   DRAG & DROP
===================================================== */

uploadArea.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        uploadArea.classList.add(
            "dragover"
        );

    }
);


uploadArea.addEventListener(
    "dragleave",
    function () {

        uploadArea.classList.remove(
            "dragover"
        );

    }
);


uploadArea.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        uploadArea.classList.remove(
            "dragover"
        );


        const files =
            Array.from(
                event.dataTransfer.files
            );


        addImages(files);

    }
);


/* =====================================================
   RENDER PREVIEWS
===================================================== */

function renderPreviews() {

    previewContainer.innerHTML = "";


    if (!selectedImages.length) {

        fileCount.textContent =
            "No images selected.";

        return;

    }


    fileCount.textContent =
        `${selectedImages.length} image${
            selectedImages.length > 1
                ? "s"
                : ""
        } selected`;


    selectedImages.forEach(
        (file, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "preview-card";


            const number =
                document.createElement(
                    "div"
                );


            number.className =
                "preview-number";

            number.textContent =
                index + 1;


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                URL.createObjectURL(
                    file
                );


            image.onload =
                () => {

                    URL.revokeObjectURL(
                        image.src
                    );

                };


            const name =
                document.createElement(
                    "div"
                );


            name.className =
                "preview-name";

            name.textContent =
                file.name;


            const controls =
                document.createElement(
                    "div"
                );


            controls.className =
                "preview-controls";


            const up =
                document.createElement(
                    "button"
                );

            up.innerHTML =
                '<i class="fa-solid fa-arrow-up"></i>';

            up.title =
                "Move up";

            up.onclick =
                () =>
                    moveImage(
                        index,
                        -1
                    );


            const down =
                document.createElement(
                    "button"
                );

            down.innerHTML =
                '<i class="fa-solid fa-arrow-down"></i>';

            down.title =
                "Move down";

            down.onclick =
                () =>
                    moveImage(
                        index,
                        1
                    );


            const remove =
                document.createElement(
                    "button"
                );

            remove.className =
                "remove-image";

            remove.innerHTML =
                '<i class="fa-solid fa-trash"></i>';

            remove.title =
                "Remove image";

            remove.onclick =
                () =>
                    removeImage(
                        index
                    );


            controls.appendChild(up);

            controls.appendChild(down);

            controls.appendChild(remove);


            card.appendChild(number);

            card.appendChild(image);

            card.appendChild(name);

            card.appendChild(controls);


            previewContainer.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   MOVE IMAGE
===================================================== */

function moveImage(
    index,
    direction
) {

    const newIndex =
        index + direction;


    if (
        newIndex < 0 ||
        newIndex >= selectedImages.length
    ) {

        return;

    }


    const temp =
        selectedImages[index];


    selectedImages[index] =
        selectedImages[newIndex];


    selectedImages[newIndex] =
        temp;


    renderPreviews();

}


/* =====================================================
   REMOVE IMAGE
===================================================== */

function removeImage(index) {

    selectedImages.splice(
        index,
        1
    );


    renderPreviews();

}


/* =====================================================
   CLEAR
===================================================== */

function clearImages() {

    selectedImages = [];

    fileInput.value = "";

    progress.innerHTML = "";

    renderPreviews();

}


/* =====================================================
   CREATE PDF
===================================================== */

async function createImagePDF() {

    if (!selectedImages.length) {

        alert(
            "Please select at least one image."
        );

        return;

    }


    try {

        progress.innerHTML =
            "⏳ Creating PDF...";


        const pdfDoc =
            await PDFDocument.create();


        const pageSize =
            document.getElementById(
                "pageSize"
            ).value;


        const orientation =
            document.getElementById(
                "orientation"
            ).value;


        const marginMM =
            Number(
                document.getElementById(
                    "margin"
                ).value
            );


        const imageFit =
            document.getElementById(
                "imageFit"
            ).value;


        /*
          1 PDF point = 1/72 inch
          A4 = 595.28 × 841.89 points
        */

        const A4_WIDTH =
            595.28;

        const A4_HEIGHT =
            841.89;


        /*
          Convert millimetres
          to PDF points.
        */

        const margin =
            marginMM *
            72 /
            25.4;


        for (
            let i = 0;
            i < selectedImages.length;
            i++
        ) {

            const file =
                selectedImages[i];


            progress.innerHTML =
                `⏳ Processing image ${
                    i + 1
                } of ${
                    selectedImages.length
                }...`;


            const image =
                await embedImage(
                    pdfDoc,
                    file
                );


            let pageWidth;

            let pageHeight;


            /* ORIGINAL SIZE */

            if (
                pageSize === "original"
            ) {

                const dimensions =
                    image.scale(1);


                pageWidth =
                    dimensions.width +
                    margin * 2;


                pageHeight =
                    dimensions.height +
                    margin * 2;

            }


            /* A4 */

            else {

                if (
                    orientation ===
                    "landscape"
                ) {

                    pageWidth =
                        A4_HEIGHT;

                    pageHeight =
                        A4_WIDTH;

                }

                else {

                    pageWidth =
                        A4_WIDTH;

                    pageHeight =
                        A4_HEIGHT;

                }

            }


            const page =
                pdfDoc.addPage(
                    [
                        pageWidth,
                        pageHeight
                    ]
                );


            const dimensions =
                image.scale(1);


            let availableWidth =
                pageWidth -
                margin * 2;


            let availableHeight =
                pageHeight -
                margin * 2;


            let drawWidth;

            let drawHeight;

            let drawX;

            let drawY;


            /* =========================
               FILL
            ========================= */

            if (
                imageFit === "fill"
            ) {

                drawWidth =
                    availableWidth;

                drawHeight =
                    availableHeight;

                drawX =
                    margin;

                drawY =
                    margin;

            }


            /* =========================
               CONTAIN
            ========================= */

            else {

                const ratio =
                    Math.min(

                        availableWidth /
                        dimensions.width,

                        availableHeight /
                        dimensions.height

                    );


                drawWidth =
                    dimensions.width *
                    ratio;


                drawHeight =
                    dimensions.height *
                    ratio;


                drawX =
                    (
                        pageWidth -
                        drawWidth
                    ) / 2;


                drawY =
                    (
                        pageHeight -
                        drawHeight
                    ) / 2;

            }


            page.drawImage(
                image,
                {
                    x: drawX,

                    y: drawY,

                    width: drawWidth,

                    height: drawHeight
                }
            );

        }


        progress.innerHTML =
            "⏳ Finalizing PDF...";


        const pdfBytes =
            await pdfDoc.save();


        if (
            !pdfBytes ||
            pdfBytes.length === 0
        ) {

            throw new Error(
                "PDF generation failed."
            );

        }


        const blob =
            new Blob(
                [pdfBytes],
                {
                    type:
                        "application/pdf"
                }
            );


        downloadBlob(
            blob,
            "resize-guru-images.pdf"
        );


        progress.innerHTML =
            "✅ PDF created and downloaded successfully.";


    }

    catch (error) {

        console.error(error);


        progress.innerHTML =
            "❌ " +
            (
                error.message ||
                "Something went wrong."
            );

    }

}


/* =====================================================
   EMBED IMAGE
===================================================== */

async function embedImage(
    pdfDoc,
    file
) {

    const bytes =
        await file.arrayBuffer();


    if (
        file.type ===
        "image/jpeg"
    ) {

        return await pdfDoc.embedJpg(
            bytes
        );

    }


    if (
        file.type ===
        "image/png"
    ) {

        return await pdfDoc.embedPng(
            bytes
        );

    }


    /*
      WebP is not directly supported
      by PDF-LIB.

      Convert WebP to PNG through
      browser canvas first.
    */

    if (
        file.type ===
        "image/webp"
    ) {

        const image =
            await loadImage(file);


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            image.naturalWidth;

        canvas.height =
            image.naturalHeight;


        const ctx =
            canvas.getContext(
                "2d"
            );


        ctx.drawImage(
            image,
            0,
            0
        );


        const pngBlob =
            await canvasToBlob(
                canvas,
                "image/png",
                1
            );


        const pngBytes =
            await pngBlob.arrayBuffer();


        return await pdfDoc.embedPng(
            pngBytes
        );

    }


    throw new Error(
        "Unsupported image format."
    );

}


/* =====================================================
   LOAD IMAGE
===================================================== */

function loadImage(file) {

    return new Promise(
        (resolve, reject) => {

            const img =
                new Image();


            const url =
                URL.createObjectURL(
                    file
                );


            img.onload =
                () => {

                    URL.revokeObjectURL(
                        url
                    );

                    resolve(img);

                };


            img.onerror =
                () => {

                    URL.revokeObjectURL(
                        url
                    );

                    reject(
                        new Error(
                            "Could not load image."
                        )
                    );

                };


            img.src =
                url;

        }
    );

}


/* =====================================================
   CANVAS TO BLOB
===================================================== */

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


/* =====================================================
   DOWNLOAD
===================================================== */

function downloadBlob(
    blob,
    filename
) {

    if (!blob) {

        throw new Error(
            "No file was generated."
        );

    }


    if (blob.size === 0) {

        throw new Error(
            "Generated file is empty."
        );

    }


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        filename;


    link.style.display =
        "none";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1500
    );

}


/* =====================================================
   CLOSE MODAL ON BACKGROUND CLICK
===================================================== */

modal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === modal
        ) {

            closeTool();

        }

    }
);
