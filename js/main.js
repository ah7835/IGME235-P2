//Need to do: Find popular, Favorite images, Copy link to clipboard, Get more, delete 10 gif function, 

// onload
window.onload = (e) => {
    document.querySelector("#search").onclick = searchButtonClicked;
    document.querySelector("#popular").onclick = popularButtonClicked;
    document.querySelector("#previous").onclick = subtractOffset;
    document.querySelector("#next").onclick = addOffset;

    loadOptions();
};


//local var
let displayTerm = "";
let currentPage;
let GIPHY_KEY = "lgElp29QHh28qbtyLkyDVp1qpNP7THGX";

//offset
let offset = 0;

//storage
const prefix = "ah7835-";
const inputKey = prefix + "search";
const limitKey = prefix + "limit";
const ratingKey = prefix + "rating";


//loads search options from local storage
function loadOptions() {
    //values
    const storedSearch = document.getElementById("searchterm").value
    const storedRating = document.getElementById("ratedGif").value
    const storedLimit = document.getElementById("limit").value


    //search term
    let searchLoadInput = localStorage.getItem(inputKey);
    //defaults
    if (storedSearch) {
        searchLoadInput.value = storedSearch;
    } else {
        searchLoadInput.value = "cats";
    }
    //load search terms
    if (searchLoadInput) {
        // document.querySelector("#searchterm");
        document.getElementById("searchterm").value = searchLoadInput;
    }
    document.getElementById("searchterm").onchange = e=>{ localStorage.setItem(inputKey, e.target.value); };

    //load rating
    let ratingLoad = localStorage.getItem(ratingKey);
    //defaults
    if (storedRating) {
        ratingLoad.value = storedRating;
    } else {
        ratingLoad.value = "g"; 
    }
    //load ratings
    if (ratingLoad) {
        document.getElementById("ratedGif").value = ratingLoad;
    }
    document.getElementById("ratedGif").onchange = e=>{ localStorage.setItem(ratingKey, e.target.value); };


    //limit filter
    let limitLoad = localStorage.getItem(limitKey);
    //defaults
    if (storedLimit) {
        limitLoad.value = storedLimit;
    } else {
        limitLoad.value = "g";
    }
    //load limit filter
    if (limitLoad) {
        document.getElementById("limit").value = limitLoad;
    }
    document.getElementById("limit").onchange = e=>{ localStorage.setItem(limitKey, e.target.value); };

}


//search for Gif when"Search for GIF" is clicked
function searchButtonClicked(offset) {
    currentPage = displayTerm

    console.log("searchButtonClicked() called");
    let GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    //key
    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    //Search for keyword
    term = document.querySelector("#searchterm").value;
    displayTerm = term;
    term = term.trim();
    term = encodeURIComponent(term);
    if (term.length < 1) { return; };
    url += "&q=" + term;
    limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    // offset = document.querySelector("#previous").value;
    // offset = document.querySelector("#next").value;
    url += "&offset=" + offset;

    rating = document.querySelector("#ratedGif").value;
    url += "&rating=" + rating;

    document.querySelector("#status").innerHTML = '<img src="images/Loading.gif"></img><b> Searching for gifs</b>';
    console.log(url);


    saveData(inputKey, term);
    // getData(term); 
    saveData(limitKey, limit);
    // getData(limit);
    saveData(ratingKey, rating);
    // getData(rating);

    //reset offset?
    offset = 0;

    //Retrieve data
    getData(url);
}

//localStorage save
function saveData(key, variable) {
    //saving recent search?
    let storedData = localStorage.getItem(key);
    if (storedData) {
        variable.value = storedData;
    }
}

//localStorage get
function getData(url) {
    // 1 - create a new XHR object
    let xhr = new XMLHttpRequest();
    // 2 - set the onload handler
    xhr.onload = dataLoaded;
    // 3 - set the onerror handler
    xhr.onerror = dataError;
    // 4 - open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

//popular button
function popularButtonClicked(offset) {
    document.querySelector("#popular").onclick = popularButtonClicked;

    console.log("popularButtonClicked() called");

    //changing 
    currentPage = "popular"
    let GIPHY_URL = "https://api.giphy.com/v1/gifs/trending?api_key=";
    let url = GIPHY_URL + GIPHY_KEY;

    //url
    limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;
    url += "&offset=" + offset;

    rating = document.querySelector("#ratedGif").value;
    url += "&rating=" + rating;

    document.querySelector("#status").innerHTML = '<img src="images/Loading.gif"></img><b> Searching for gifs</b>';
    getData(url);
}

//copy Gif URL
function copyLink(link = " ") {
    const linkDoc = document.createElement('textarea');
    linkDoc.value = link;
    //add to doc
    document.body.appendChild(linkDoc);
    linkDoc.select();
    //copy to clipboard
    document.execCommand("copy");
    document.body.removeChild(linkDoc);
    //show feedback
    feedbackText("Link Copied")
}
//feedback for copying link
function feedbackText(a) {
    document.querySelector("#feedbackText").innerHTML = "<p>" + a + "</p>"
    document.querySelector("#feedbackText").style.display = "inline-block";
    setTimeout(function () {
        document.querySelector("#feedbackText").style.display = "none";
    }, 800);
}


// Callback Functions
//load Gif data
function dataLoaded(e) {
    let xhr = e.target;
    console.log(xhr.responseText);
    let obj = JSON.parse(xhr.responseText);
    console.log(obj);
    let results = obj.data;
    console.log("results.length = " + results.length);


    let line = "<div>"
    // l0 - loop through the array of results
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        //spinner not working?
        let smallURL;
        smallURL = result.images.fixed_width_small.url;

        // smallURL = result.images.fixed_width_small.url;

        if (!smallURL) { smallURL = "images/no-image-found.png"; }
        let url = result.url;
        let rating = (result.rating ? result.rating : "NA").toUpperCase();
        line += "<div class='result'>";
        line += `<img src='${smallURL}' title = '$(result.id)' />`;
        line += `<span class="gifSearch"><button class="gify"><a target='_blank' href='${url}'>View on Giphy</a></button>`;
        line += ` <button class='gify copyLink' onclick="copyLink('${result.embed_url}')">Copy Link</button>`
        line += `<p class="rating" id="rated">Rating: ${rating}</span>`
        line += `<div></div></div></div>`
    }


    // 16 - all done building the HTML = show it to the user!
    document.querySelector("#content").innerHTML = line;

    // 17 - update the status
    document.querySelector("#status").innerHTML = "<b>Successfully found </b>" + currentPage + "<p><i>";
}

//previous and next button functions
//previous
function subtractOffset() {
    // if (offset > dataLoaded) {
        offset -= limit;
    // }
    if (offset < 0) {
        offset = 0;
    }
    ifElseOffset(offset);
}
//next
function addOffset() {
    // if (offset < dataLoaded) {
        offset += limit;
    // }
    ifElseOffset(offset);
}
//changes offset based on which button is pressed
function ifElseOffset(offset){
    if(currentPage === "popular") {
        popularButtonClicked(offset)
    } else {
        searchButtonClicked(offset);
    }
}

function dataError(e) {
    console.log("An error occurred");
}