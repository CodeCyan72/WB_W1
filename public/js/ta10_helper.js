// const { header } = require("express-validator");

// var fetch = require('node-fetch');
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
const addCharacter = async (value = {}, url = '/prove10/insert') => {
    console.log("Making post request");
    const myData = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(value)
    });
    
    return myData.json();
}



var data = getCharacters();
var globalJSON = "";



function updateData(){
    data.then(json => {
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

    const data = addCharacter({name: name})

    data.then(response => {
        if (response.status == 200) {
            updateData()
        }
        else
        {
            //nothing
        }
    })
}