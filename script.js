let url = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0'; 
let searchInput = document.getElementById('searchInput');
let pokemonsArray = [];
let pokemonCloseUp = false;
let pokemonClickedOn = '';
let pokemonDetailInfo = {};
let container = document.getElementById('Maincontainer');
let pokemonLabels = ["Hp", "Attack", "Defense", "Special-attack", "Special-defense", "Speed"];

document.addEventListener('DOMContentLoaded', (event) => {
  const popupContainer = document.getElementById('big-pokemon-cards');
  popupContainer.addEventListener('click', (event) => {
      if (event.target === popupContainer) {
          closePokemonCardBig();
      }
  });
});

function closePokemonCardBig() {
  let pokemonName = pokemonClickedOn;
  let pokemonCloseIn = pokemonName + '_close_In';
  let pokemonCloseInCard = document.getElementById(pokemonCloseIn);
  closePokemonCard(pokemonCloseInCard, pokemonName);
}

function closePokemonCard(pokemonCloseInCard, pokemonName) {
  if (pokemonCloseUp === true) {
      let pokemonCardsZoomed = document.getElementById('big-pokemon-cards');
      let pokemonID = pokemonName + '_card';
      let pokemon = document.getElementById(pokemonID);
      let arrowLeft = document.getElementById('arrow_left');
      let arrowRight = document.getElementById('arrow_right');
      unsetPokemonCardsZoomedAttributes(pokemonCardsZoomed);
      removeAttributesFunctionInClosePokemon(pokemon, arrowLeft, pokemonCloseInCard, arrowRight);
      setRemainingAttributesInClosePokemon();
  }
}

async function init(){
    let response = await fetch(url);
    responseAsJson = await response.json();
    displayPokemons(responseAsJson);
}

async function displayPokemons(responseAsJson){
    let pokemons = await responseAsJson['results'];
    for(let i = 0; i < pokemons.length; i++){
        let pokemonName = pokemons[i]['name'].charAt(0).toUpperCase() + pokemons[i]['name'].slice(1);;
        let pokemonURL = pokemons[i]['url'];
        let pokemon = await fetchPokemonData(pokemonURL);
        pokemonsArray.push(pokemonName);
        loadPokemonInfo(pokemon, pokemonName);
    }
    displayPokemonInfo();
}

async function fetchPokemonData(pokemonURL){
  let pokemonData = await fetch(pokemonURL);
  let pokemonDataAsJson = await pokemonData.json();
  return pokemonDataAsJson;
}

function loadPokemonInfo(pokemon, pokemonName){
  let pokemonID = pokemonName + '_card';
  let pokemonImage = pokemon["sprites"]["other"]["official-artwork"]["front_default"];
  let pokemonTypes = pokemon["types"];
  let pokemonStats = pokemon["stats"];
  let mainInfo = createMainInfo(pokemon);
  let pokemonObject = buildPokemonDetail(pokemonName, pokemonID, pokemonImage, pokemonTypes, pokemonStats, mainInfo);
  pokemonDetailInfo[pokemonName] = pokemonObject;
}

function buildPokemonDetail(pokemonName, pokemonID, pokemonImage, pokemonTypes, pokemonStats, mainInfo){
  let obj = {
    "pokemonName": pokemonName,
    "pokemonID": pokemonID,
    "pokemonImage": pokemonImage,
    "pokemonTypes": pokemonTypes,
    "pokemonStats": pokemonStats,
    "pokemonMainInfo": mainInfo
  }
  return obj;
}

function displayPokemonInfo(){
  container.innerHTML = "";
  for(key in pokemonDetailInfo){
    let access = pokemonDetailInfo[key];
    let pokemonType = access["pokemonTypes"][0]["type"]["name"];
    let pokemonTypesId = access["pokemonName"] + '_types';
    container.innerHTML += buildPokemonContainer(access['pokemonID'], access["pokemonName"], access["pokemonImage"], pokemonTypesId);
    let pokemonCard = document.getElementById(access["pokemonID"]);
    pokemonCard.classList.add(pokemonType);
    extractPokemonType(pokemonTypesId, access);
  }
}

function extractPokemonType(pokemonTypesId, access){
  let array = access["pokemonTypes"];
  let types = document.getElementById(pokemonTypesId);
  for(i = 0; i < array.length; i++){
    types.innerHTML += `<div class="type"><p>${array[i]["type"]["name"]}</p></div>`;
  }
}

function openPokemonCard(pokemonName){
  let access = pokemonDetailInfo[pokemonName];
  if(pokemonCloseUp === false){
    let pokemon = document.getElementById(access["pokemonID"]);
    pokemon.classList.add('d-none');
    pokemonClickedOn = access["pokemonName"];
    getPokemonCardClose(access);
    pokemonClickedOn = pokemonName;
  }
}

function getPokemonCardClose(access){
  let pokemonCardsZoomed = document.getElementById("big-pokemon-cards");
  let pokemonCloseIn = access["pokemonName"] + '_close_In';
  let resultArray = returnNeighbouringPokemons(access["pokemonName"]);
  let previousPokemon = resultArray[0];
  let nextPokemon = resultArray[1];
  let pokemonStatsDataset = createPokemonStatsDataset(access["pokemonStats"]);
  setPokemonCardsZoomedAttributes(pokemonCardsZoomed);
  getPokemonCardsZoomedArrowLeft(pokemonCardsZoomed, previousPokemon, pokemonCloseIn);
  getPokemonCardsZoomedTitle(pokemonCloseIn, pokemonCardsZoomed, access["pokemonName"]);
  let pokemonCloseInCard = document.getElementById(pokemonCloseIn);
  getPokemonCardsZoomedTypes(pokemonCloseInCard, access["pokemonTypes"]);
  setPokemonCardsZoomedImageAndBackground(pokemonCloseInCard, access["pokemonImage"], access["pokemonTypes"][0]["type"]["name"]);
  getPokemonCardsZoomedArrowRight(pokemonCardsZoomed, nextPokemon, pokemonCloseIn);
  createPokemonCharts(pokemonStatsDataset, pokemonCloseIn, access["pokemonName"], access["pokemonMainInfo"]);
  setRemainingAttributesInOpenPokemon();
}

function setPokemonCardsZoomedImageAndBackground(pokemonCloseInCard, pokemonImage, pokemonBackgroundColor){
  pokemonCloseInCard.innerHTML += `<img src='${pokemonImage}'>`; 
  pokemonCloseInCard.classList.add(pokemonBackgroundColor); 
}

function createMainInfo(pokemonDataAsJson){
  let height = pokemonDataAsJson["height"];
  let weight = pokemonDataAsJson["weight"];
  let base_experience = pokemonDataAsJson["base_experience"] ;
  let abilities = pokemonDataAsJson["abilities"];
  let allAbilities = extractAbilities(abilities);
  return [height, weight, base_experience, allAbilities];
}

function extractAbilities(abilities){
  let allAbilities = [];
  for(let i = 0; i < abilities.length; i++){
    let ability = abilities[i]["ability"]["name"];
    let abilityModified = ability[0].toUpperCase() + ability.slice(1);
    for(let j = 0; j < abilityModified.length; j++){
      if(abilityModified.charAt(j) === '-'){
        let chars = abilityModified.split('');
        if(j+1 < chars.length){
          chars[j+1] = chars[j+1].toUpperCase();
        }
        abilityModified = chars.join('');
      }
    }
    allAbilities.push(abilityModified);
  }
  return allAbilities;
}

function createPokemonStatsDataset(pokemonStats){
  pokemonStatsDataset = [];
  for(i=0; i < pokemonStats.length; i++){
    let pokemonStat = pokemonStats[i]["base_stat"];
    pokemonStatsDataset.push(pokemonStat);
  }
  return pokemonStatsDataset;
}

function getPokemonMainBoard(pokemonStatsId, pokemonMainBoardId){
  let pokemonStatsCard = document.getElementById(pokemonStatsId);
  let pokemonMainBoardCard = document.getElementById(pokemonMainBoardId);
  if(pokemonStatsCard.style.display != 'none'){
    pokemonStatsCard.style.display = 'none';
    pokemonMainBoardCard.style.display = 'flex';
  }
}

function getPokemonStatBoard(pokemonStatsId, pokemonMainBoardId){
  let pokemonStatsCard = document.getElementById(pokemonStatsId);
  let pokemonMainBoardCard = document.getElementById(pokemonMainBoardId);
  if(pokemonMainBoardCard.style.display != 'none'){
    pokemonMainBoardCard.style.display = 'none';
    pokemonStatsCard.style.display = 'block';
  }
}

function createPokemonCharts(pokemonStatsDataset, pokemonCloseIn, pokemonName, mainInfo){
  let pokemonStatsId = pokemonName + 'StatsChart';
  let pokemonMainBoardId = pokemonName + 'MainBoard';
  let pokemonIndexTabId = pokemonName + '_index_tab';
  let pokemonCloseInCard = document.getElementById(pokemonCloseIn);
  pokemonCloseInCard.innerHTML += `<div class="pokemonCloseInLowerPart"></div>`;
  let pokemonCloseInLowerPart = pokemonCloseInCard.querySelector('.pokemonCloseInLowerPart');
  pokemonCloseInLowerPart.innerHTML += returnIndexTab(pokemonIndexTabId, pokemonStatsId, pokemonMainBoardId);
  pokemonCloseInLowerPart.innerHTML += returnPokemonMainBoard(pokemonMainBoardId, mainInfo);
  let canvasElement = document.createElement('canvas');
  setCanvasElementAttributes(canvasElement, pokemonStatsId);
  pokemonCloseInLowerPart.appendChild(canvasElement);
  let pokemonStatsCard = document.getElementById(pokemonStatsId);
  displayPokemonChart(pokemonStatsCard, pokemonName, pokemonStatsDataset);
};

function setCanvasElementAttributes(canvasElement, pokemonStatsId){
  canvasElement.id = pokemonStatsId;
  canvasElement.className = 'canvasElement';
  canvasElement.style.display = "none";
}

function setRemainingAttributesInOpenPokemon(){
  document.body.style.overflow = 'hidden';
  container.classList.add('no-click');
  pokemonCloseUp = true;
}

function getPokemonCardsZoomedTypes(pokemonCloseInCard, pokemonTypes){
  for(let j=0; j < pokemonTypes.length; j++){
    pokemonCloseInCard.innerHTML += `<div class="name-wrap">${pokemonTypes[j]["type"]["name"]}</div>`; 
  }
}

function setPokemonCardsZoomedAttributes(pokemonCardsZoomed){
  pokemonCardsZoomed.classList.remove('d-none');
  pokemonCardsZoomed.style.height = '100%';
  pokemonCardsZoomed.style.width = '100%';
  pokemonCardsZoomed.style.backgroundColor = 'rgba(0,0,0,0.4)';
}

function unsetPokemonCardsZoomedAttributes(pokemonCardsZoomed){
  pokemonCardsZoomed.style.height = '0';
  pokemonCardsZoomed.style.width = '0';
  pokemonCardsZoomed.style.backgroundColor = '';
  pokemonCardsZoomed.classList.add('d-none');
  container.classList.remove('no-click');
}

function returnNeighbouringPokemons(pokemonName){
  let indexPokemonName = pokemonsArray.indexOf(pokemonName);
  let resultArray = returnRightPokemonIndices(indexPokemonName);
  let previousPokemonIndex = resultArray[0];
  let nextPokemonIndex = resultArray[1];
  let nextPokemon = pokemonsArray[nextPokemonIndex];
  let previousPokemon = pokemonsArray[previousPokemonIndex];
  let resultPokemonArray = [previousPokemon, nextPokemon];
  return resultPokemonArray; 
}

function returnRightPokemonIndices(indexPokemonName){
  if(indexPokemonName == 0){
    let previousPokemonIndex = pokemonsArray.length - 1;
    let nextPokemonIndex = 1;
    resultArray = [previousPokemonIndex, nextPokemonIndex];
    return resultArray;
  } else if(indexPokemonName == pokemonsArray.length-1){
    let nextPokemonIndex = 0;
    let previousPokemonIndex = indexPokemonName - 1;
    resultArray = [previousPokemonIndex, nextPokemonIndex];
    return resultArray;
  } else {
    let nextPokemonIndex = indexPokemonName + 1;
    let previousPokemonIndex = indexPokemonName - 1;
    resultArray = [previousPokemonIndex, nextPokemonIndex];
    return resultArray;
  }
}

function showNextPokemon(nextPokemon, pokemonCloseIn){
  let pokemonName = pokemonClickedOn;
  let pokemonCloseInCard = document.getElementById(pokemonCloseIn);
  closePokemonCard(pokemonCloseInCard, pokemonName);
  openPokemonCard(nextPokemon);
}

function showPreviousPokemon(previousPokemon, pokemonCloseIn){
  let pokemonName = pokemonClickedOn;
  let pokemonCloseInCard = document.getElementById(pokemonCloseIn);
  closePokemonCard(pokemonCloseInCard, pokemonName);
  openPokemonCard(previousPokemon);
}

function setRemainingAttributesInClosePokemon(){
  pokemonClickedOn = '';
  pokemonCloseUp = false;
  document.body.style.overflow = 'auto';
}

function removeAttributesFunctionInClosePokemon(pokemon, arrowLeft, pokemonCloseInCard, arrowRight){
  pokemon.classList.remove('d-none');
  arrowLeft.remove();
  pokemonCloseInCard.remove();
  arrowRight.remove();
}

function prepareURL(){
    let resultArray = iterateString(url); 
    let lastCharacter = resultArray[0];
    let placeholders = resultArray[1];
    updateCharacter = Number(lastCharacter) + 20;
    updateCharacter.toString();
    url = url.slice(0, -placeholders) + updateCharacter; 
    loadFurtherPokemons();
}

async function loadFurtherPokemons(){
    let response = await fetch(url);
    responseAsJson = await response.json();
    displayPokemons(responseAsJson);
}

function iterateString(string){
    let array = [];
    for(let i = string.length-1; i > 0; i--){
        if(string[i] == "="){
            j = i + 1;
            character = string.slice(j, string.legnth);
            placeholders = character.length;
            array.push([character, placeholders]);
        }
    }
    return array[0];
}

searchInput.addEventListener('input', function() {
    let searchTerm = this.value.trim().toLowerCase();
    if(searchTerm.length > 0){
        PrepareToDisplaySearchResults(searchTerm);
    } else {
        removeDisplayNone();
    }
    disableFurtherPokemon();
});

function disableFurtherPokemon(){
  let furtherPokemons = document.getElementById('morePokemons');
  if(searchInput.value.length > 0){
    furtherPokemons.classList.add('d-none');
  } else {
    furtherPokemons.classList.remove('d-none');
  }
}

function PrepareToDisplaySearchResults(searchTerm){
    let pokemonArrayToShow = [];
    let pokemonArrayNotToShow = [];
    for(let index = 0; index < pokemonsArray.length; index++){
        let pokemonName = pokemonsArray[index];
        if(pokemonName.toLowerCase().startsWith(searchTerm)){
            pokemonArrayToShow.push(pokemonName);
        } else {
            pokemonArrayNotToShow.push(pokemonName);
        }
    }
    displaySearchResults(pokemonArrayToShow, pokemonArrayNotToShow)
}

function displaySearchResults(pokemonArrayToShow, pokemonArrayNotToShow){
  if(pokemonArrayToShow.length < 11){
    iterateArray(pokemonArrayToShow, increase=true, partial=false, string='block');
    iterateArray(pokemonArrayNotToShow, increase=true, partial=false, string='none');
  } else {
    iterateArray(pokemonArrayToShow, increase=true, partial=true, string='block');
    iterateArray(pokemonArrayToShow, increase=false, partial=true, string='none');
    iterateArray(pokemonArrayNotToShow, increase=true, partial=false, string='none');
  }
}

function iterateArray(array, increase, partial, string){
  if(increase == true && partial == false){
    for(i = 0; i < array.length; i++){
      setVariables(array, i, string);
    }
  } else if(increase == true && partial == true){
    for(i = 0; i < 10; i++){
      setVariables(array, i, string);
    }
  } else if(increase == false && partial == true){
    for(i = array.length; i > 9; i--){
      setVariables(array, i, string);
    }
  }
}

function setVariables(array, i, string){
  let pokemonName = array[i];
  let pokemonID = pokemonName + '_card';
  let pokemon = document.getElementById(pokemonID);
  pokemon.style.display = string; 
}

function removeDisplayNone(){
    for(let i = 0; i < pokemonsArray.length; i++){
        let pokemonName = pokemonsArray[i];
        let pokemonID = pokemonName + '_card';
        let pokemon = document.getElementById(pokemonID);
        pokemon.style.display = 'block';
    }
}