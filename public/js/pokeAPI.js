// var fetch = require('node-fetch');
var pokelist = document.getElementById("pokelist");

//Default value of url is ""
const getPokeData = async (url = "") => {
    console.log("Making request");
    const myData = await fetch(url, {
        method: 'GET'
    });
    
    return myData.json();
}

var data = getPokeData('https://pokeapi.co/api/v2/pokemon?offset=0&limit=10');
var globalJSON = "";

function updateData(){
    data.then(json => {
        //clear the list
        pokelist.innerHTML = "";

        globalJSON = json;

        //update the page
        for (let i=0; i<10; i++){
            let item = document.createElement('li');
            item.innerHTML = globalJSON.results[i].name;
            pokelist.appendChild(item);
        }   
    });
}

updateData();

function nextPage(){
    console.log("called next")
    if (globalJSON.next != null)
    {
        //update the json
        data = getPokeData(globalJSON.next);
        updateData();
    }
}

function backPage(){
    console.log("called next")
    if (globalJSON.previous != null)
    {
        //update the json
        data = getPokeData(globalJSON.previous);
        updateData();
    }
}