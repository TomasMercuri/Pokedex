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

