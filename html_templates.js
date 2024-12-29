function returnIndexTab(pokemonIndexTabId, pokemonStatsId, pokemonMainBoardId){
    return `<div class="index_tab" id="${pokemonIndexTabId}">
        <div class="about" onclick="getPokemonMainBoard('${pokemonStatsId}', '${pokemonMainBoardId}')">About</div>
        <div class="base-stats" onclick="getPokemonStatBoard('${pokemonStatsId}', '${pokemonMainBoardId}')">Base Stats</div>
      </div>`
}

function returnPokemonMainBoard(pokemonMainBoardId, mainInfo){
    return `<div class="pokemonMainBoard" id="${pokemonMainBoardId}">
        <p> Height: ${mainInfo[0]}m </p> 
        <p> Weight: ${mainInfo[1]}kg </p>  
        <p> Base Experience: ${mainInfo[2]}</p> 
        <p> Abilities: ${mainInfo[3]}</p>
      </div>`
}

function getPokemonCardsZoomedArrowLeft(pokemonCardsZoomed, previousPokemon, pokemonCloseIn){
    return pokemonCardsZoomed.innerHTML += 
        `<div class="arrow_left" id='arrow_left'>
            <img src="img/chevron_left.svg" class="arrow" onclick="showPreviousPokemon('${previousPokemon}', '${pokemonCloseIn}')">
        </div>`;
}
      
function getPokemonCardsZoomedArrowRight(pokemonCardsZoomed, nextPokemon, pokemonCloseIn){
    return pokemonCardsZoomed.innerHTML += 
        `<div class="arrow_right" id='arrow_right'>
            <img src="img/chevron_right.svg" class="arrow" onclick="showNextPokemon('${nextPokemon}','${pokemonCloseIn}')">
        </div>`;
}
      
function getPokemonCardsZoomedTitle(pokemonCloseIn, pokemonCardsZoomed, pokemonName){
    return pokemonCardsZoomed.innerHTML += 
        `<div class="pokemonCloseIn" id="${pokemonCloseIn}">
            <h2>${pokemonName}</h2>
        </div>`;
}    

function addPokemonsToContainer(container, pokemonID, pokemonName){
    return container.innerHTML += `
      <div class="pokemonContainer" id="${pokemonID}" onclick="openPokemonCard('${pokemonID}', '${pokemonName}')">
        <h2>${pokemonName}</h2>
      </div>`;
}

function buildPokemonContainer(pokemonID, pokemonName, pokemonImage, pokemonTypesId){
    return `<div class="pokemonContainer" id='${pokemonID}' onclick="openPokemonCard('${pokemonName}')">
                <h2>${pokemonName}</h2>
                <div class="types" id="${pokemonTypesId}"></div>
                <img src="${pokemonImage}">
            </div>`;
}
