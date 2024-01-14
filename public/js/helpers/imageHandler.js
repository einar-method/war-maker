/************************************************************/
/* Variables and functions to handle images. */
/************************************************************/

const defaultImages = [
    "./assets/imgs/arturius token.png",
    "./assets/imgs/beetle man card.png",
    "./assets/imgs/beetle man token.png",
    "./assets/imgs/centurion token.png",
    "./assets/imgs/commando token 1b.png",
    "./assets/imgs/commando token 5d.png",
    "./assets/imgs/elram token.png",
    "./assets/imgs/evo suit token.png",
    "./assets/imgs/garvin token.png",
    "./assets/imgs/gunslinger token.png",
    "./assets/imgs/halo team fighter token.png",
    "./assets/imgs/halo team shield token.png",
    "./assets/imgs/iradrum outcast card.png",
    "./assets/imgs/oak walker card.png",
    "./assets/imgs/orc smile mantis blade token.png",
    "./assets/imgs/reptoid cyborg card.png",
    "./assets/imgs/reptoid token gunner.png",
    "./assets/imgs/rhino token.png",
    "./assets/imgs/riva token.png",
    "./assets/imgs/slayer token.png",
    "./assets/imgs/token ghost.png",
    "./assets/imgs/token helm.png",
    "./assets/imgs/vigg card.png"
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