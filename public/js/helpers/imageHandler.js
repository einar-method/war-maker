/************************************************************/
/* Variables and functions to handle images. */
/************************************************************/

const defaultImages = [
    "./assets/imgs/a1.png",
    "./assets/imgs/a2.png",
    "./assets/imgs/a3.png",
    "./assets/imgs/a4.png",
];

function handleImageUpload(input, unit, target) {
    const file = input.files[0];

    const imageElement = target.querySelector('.card-img');
    if (!file || !imageElement) {
        console.log("No image uploaded.")
        return;
    }

    const reader = new FileReader();

    if (imageElement) {
        const parentSection = imageElement.closest('section');

        if (parentSection && parentSection.id === "card-" + unit.unitID) {
            reader.onload = function (e) {
                if (imageElement && imageElement instanceof HTMLImageElement) {
                    if (reader && reader.readyState === FileReader.DONE) {
                        imageElement.src = e.target.result;

                        console.log("Old image src:", unit.imageSrc)
                        unit.imageSrc = e.target.result;
                        console.log("New image src:", unit.imageSrc)
                    } else {
                        console.error("Invalid FileReader state");
                        return;
                    }
                } else {
                    console.error("Invalid image element");
                    return;
                }
            };
            reader.readAsDataURL(file);
        } else {
            // The imageElement does not belong to the expected section
            // Handle other logic or provide feedback
            console.error("Matching error")
        }
    }
};

function showImage(uploadId, displayId) {
    const preview = document.getElementById(displayId);
    preview.src = "";
    //const file = document.querySelector("input[type=file]").files[0];
    const file = document.getElementById(uploadId).files[0];
    const reader = new FileReader();
  
    reader.addEventListener(
      "load",
      () => {
        // convert image file to base64 string
        preview.src = reader.result;
      },
      false,
    );
  
    if (file) {
      reader.readAsDataURL(file);
    }

    URL.revokeObjectURL(file)
};

function removeImage(id) {
    document.getElementById(id).src = "";
}