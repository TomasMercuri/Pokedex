// Cantidad de pokemones que se muestran por pagina
const POKEMONES_POR_PAGINA = 20;

let cantidadPokemonesMostrados = 0;
let numeroPaginaActual = 1;
let numeroUltimaPagina;


/*****************************/
/*      PAGINA POKEDEX       */
/*****************************/
function actualizarPagina(){
    borrarPaginaAnterior();
    mostrarIconoCarga();
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${cantidadPokemonesMostrados}&limit=${POKEMONES_POR_PAGINA}`)
        .then(respuesta => respuesta.json())
        .then(respuesta => {
            ocultarIconoCarga();
            numeroUltimaPagina = Math.round(respuesta.count / POKEMONES_POR_PAGINA);
            crearCartasPokemones(respuesta.results);
            nombrarPokemones(respuesta.results);
            agregarImagenes();
            desbloquearClickUsuario();
        })
        .catch(error => console.error('FALLO', error));
}

function borrarPaginaAnterior(){
    document.querySelector('.card-container').innerHTML = '';
}

function mostrarIconoCarga(){
    document.querySelector('.card-container').classList.add('visually-hidden');
    document.querySelector('.icono-carga-container').classList.remove('visually-hidden');
}

function ocultarIconoCarga(){
    document.querySelector('.card-container').classList.remove('visually-hidden');
    document.querySelector('.icono-carga-container').classList.add('visually-hidden');
}


/*****************************/
/*      CARTAS POKEMON       */
/*****************************/
function retornarId(URL){
    return Number(URL.split('/')[6]);
}

function crearCartasPokemones(respuestaApi){
    for(let i = 0; i < respuestaApi.length; i++){
        const idCarta = retornarId(respuestaApi[i].url);
        const $cartaPokemon = document.createElement('div');
        $cartaPokemon.classList.add('card-item');
        $cartaPokemon.classList.add(`item-${idCarta}`);
        $cartaPokemon.id = idCarta;

        const $imagenPokemon = document.createElement('img');
        $imagenPokemon.src = './img/pikachu_silueta.png';
        $imagenPokemon.className = 'pokemon-desconocido';

        $cartaPokemon.appendChild($imagenPokemon);
        document.querySelector('.card-container').appendChild($cartaPokemon);
    }
}

function nombrarPokemones(respuestaApi){
    document.querySelectorAll('.card-item').forEach((cartaPokemon, i) => {
        const $nombrePokemon = document.createElement('span');
        $nombrePokemon.id = 'nombre-pokemon';
        $nombrePokemon.textContent = respuestaApi[i].name;
        cartaPokemon.appendChild($nombrePokemon);
    });
}

function agregarImagenes(){
    document.querySelectorAll('.card-item').forEach(cartaPokemon => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${cartaPokemon.id}/`)
            .then(respuesta => respuesta.json())
            .then(respuesta => {
                const $elementoImagen = document.querySelector(`.card-item.item-${cartaPokemon.id} img.pokemon-desconocido`);
                const imagenPokemon = respuesta.sprites.other['official-artwork'].front_default;
                if(imagenPokemon){
                    $elementoImagen.src = imagenPokemon;
                    $elementoImagen.className = 'pokemon-conocido';
                }
            })
            .catch(error => console.error('FALLO', error));
    });
}


/*********************************/
/*       BUSCADOR POKEMONES      */
/*********************************/
function mostrarError(){
    document.querySelector('#buscador-pokemon').style.border = '1px solid red';
}

function ocultarError(){
    document.querySelector('#buscador-pokemon').style.border = '';
}

function ocultarNavegacionModal(){
    document.querySelector('#anterior-pokemon').className = 'visually-hidden';
    document.querySelector('#siguiente-pokemon').className = 'visually-hidden';
}


function mostrarOpcionesBuscador(){
    fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
        .then(respuesta => respuesta.json())
        .then(respuesta => {
            respuesta.results.forEach(pokemon => {
                const $opcionPokemon = document.createElement('option');
                $opcionPokemon.value = retornarId(pokemon.url);
                $opcionPokemon.textContent = pokemon.name.toUpperCase();
                document.querySelector('#opciones-pokemones').appendChild($opcionPokemon);
            });
        })
        .catch(error => console.error('FALLO', error));
}

function retornarPokemonesExistentes(){
    let numeroPokemonesExistentes = [];

    document.querySelectorAll('#opciones-pokemones option').forEach(opcionPokemon => {
        numeroPokemonesExistentes.push(opcionPokemon.value);
    });

    return numeroPokemonesExistentes;
}

document.querySelector('#boton-buscar-pokemon').addEventListener('click', () => {
    const numeroPokemon = document.querySelector('#buscador-pokemon').value;
    const numeroPokemonesExistentes = retornarPokemonesExistentes();

    if(numeroPokemonesExistentes.includes(numeroPokemon)){
        ocultarError();
        eliminarModalAnterior();
        ocultarFondo();
        crearModal();
        mostrarInformacionPokemon(numeroPokemon);
        permitirCerrarModal();
        ocultarNavegacionModal();
    }else{
        mostrarError();
    }
});



