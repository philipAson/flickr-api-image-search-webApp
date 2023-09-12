const searchButton = document.getElementById("search_button");
const searchField = document.getElementById("search_text");
const mainElement = document.querySelector("main");
const overlay = document.getElementById("overlay");
const overlayImg = document.querySelector("#overlay img");
const overlayTitle = document.querySelector("#overlay figcaption");

let currentPage = "1";
let loading = false;
searchButton.addEventListener("click", async () => {
// clear pics
    clearPage();

    loadPage();
})

const loadPage = async () => {
    loading = true;
    // 1 hämta bildInfo från API
    const imageData = await getImages();

    // 2 uppdatera UI - skapa upp bilderna i en grid
    updateUi(imageData);

    loading = false;
}

const clearPage = () => {
    mainElement.innerHTML = "";
    currentPage = "1";
}

const updateUi = (data) => {

    data.photos.photo.forEach(img => {
        const imgElement = document.createElement("img");
        imgElement.setAttribute("src", imgUrl(img, "thumb"));
        imgElement.setAttribute("alt", img.title);
        
        mainElement.appendChild(imgElement);

        imgElement.addEventListener("click", () => {
            // magnify clicked img
            openLightBox(img.title, imgUrl(img, "large"));
        })
    });
}

const openLightBox = (title, url) => {
    overlayImg.setAttribute("src", url);
    overlayImg.setAttribute("alt", title);

    overlayTitle.innerHTML = title;
    overlay.classList.toggle("show");

}
overlay.addEventListener("click", () => {
    overlay.classList.toggle("show");
})

const getImages = async () => {

    const baseUrl = "https://www.flickr.com/services/rest";

    const method = "flickr.photos.search";

    const text =  searchField.value;

    const apiKey = "ed7bbffd5d5e0d80f7812b1f84337b1c";

    const url = `${baseUrl}?method=${method}&page=${currentPage}&text=${text}&api_key=${apiKey}&format=json&nojsoncallback=1`;

    const response = await fetch(url);
    const imageData = await response.json();

    return imageData;
}

const imgUrl = (img, size) => {
    let sizeSuffix = "q";
    if (size == "large") {sizeSuffix = "b"};

    const url = `https://live.staticflickr.com/${img.server}/${img.id}_${img.secret}_${sizeSuffix}.jpg`

    return url;
}

const nextPage = async () => {

    currentPage++;

    loadPage();
}

window.addEventListener("scroll", () => {

    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

    // console.log("scrollTop: ", scrollTop);
    // console.log("scrollheight: ", scrollHeight);
    // console.log("clientHeight: ", clientHeight);

    if (scrollTop + clientHeight >= scrollHeight) {

        if (!loading) {
            nextPage();
        }
        
    }
})

