// const { response } = require("express");

const _csrf = document.querySelector('meta[name="_csrf"]').getAttribute('content');

var myCharacterList = document.getElementById("myCharacterList");

//Default value of url is ""
const getCharacters = async (url = 'prove10/fetchAll') => {
    console.log("Making request");
    const myData = await fetch(url, {
        method: 'GET'
    });
    
    return myData.json();
}

//Default value of url is ""
const addCharacter = (value = "", url = '/prove10/insert') => {
    console.log("Making post request");
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ _csrf, name: value })
    }).then(response => {
        return response.json();
    })
    .then(val => {
        updateData()
    });
}



var data = getCharacters();
var globalJSON = "";



function updateData(){
    getCharacters().then(json => {
        //clear the list
        myCharacterList.innerHTML = "";

        globalJSON = json;

        //update the page
        for (let data of globalJSON.avengers){
            let item = document.createElement('li');
            item.innerHTML = data.name;
            myCharacterList.appendChild(item);
        }   
    });
}

updateData()

function addNewCharacter(){
    const name = document.getElementById("character").value;

    addCharacter(name);
}