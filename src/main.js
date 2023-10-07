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



/****************************/
//           MODAL          //
/****************************/
function desbloquearClickUsuario(){
    document.querySelectorAll('.card-item').forEach(cartaActual => {
        cartaActual.addEventListener('click', () => {
            manejarModal(cartaActual);
        });
    });
}

function ocultarFondo(){
    document.querySelector('.card-container').style.filter = 'blur(4px)';
    document.querySelector('.card-container').style.pointerEvents = 'none';
}

function mostrarFondo(){
    document.querySelector('.card-container').style.filter = '';
    document.querySelector('.card-container').style.pointerEvents = '';
}

function eliminarModalAnterior(){
    const $modalAnterior = document.querySelector('.modal-pokemon');
    if($modalAnterior)$modalAnterior.remove();
}

function manejarModal(cartaActual){
    eliminarModalAnterior();
    ocultarFondo();
    crearModal();
    mostrarInformacionPokemon(cartaActual.id);
    permitirCerrarModal();
    permitirNavegarModales(Number(cartaActual.id));
}

function crearModal(){
    const $modal = document.createElement('div');
    $modal.className = "modal-pokemon";

    const $botonCerrarModal = document.createElement('i');
    $botonCerrarModal.className = 'bi bi-x';
    $botonCerrarModal.id = 'cerrar-modal';
    
    const $botonPokemonAnterior = document.createElement('i');
    $botonPokemonAnterior.className = 'bi bi-arrow-left';
    $botonPokemonAnterior.id = 'anterior-pokemon';

    const $botonPokemonSiguiente = document.createElement('i');
    $botonPokemonSiguiente.className = 'bi bi-arrow-right';
    $botonPokemonSiguiente.id = 'siguiente-pokemon';

    const $contenedorImagen = document.createElement('div');
    $contenedorImagen.className = "imagen-pokemon";

    const $contenedorInformacion = document.createElement('div');
    $contenedorInformacion.className = "informacion-pokemon";

    $modal.appendChild($botonPokemonSiguiente);
    $modal.appendChild($botonPokemonAnterior);
    $modal.appendChild($botonCerrarModal);
    $modal.appendChild($contenedorImagen);
    $modal.appendChild($contenedorInformacion);
    document.querySelector('.modal-container').appendChild($modal);
}


function mostrarInformacionPokemon(numeroPokemon){
    fetch(`https://pokeapi.co/api/v2/pokemon/${numeroPokemon}/`)
        .then(respuesta => respuesta.json())
        .then(respuesta => {
            mostrarImagenPokemon(respuesta);
            mostrarCaracteristicasPokemon(respuesta, numeroPokemon);
        })
        .catch(error => {
            console.error('EL POKEMON NO FUE ENCONTRADO: ', error);
            eliminarModalAnterior();
            mostrarError();
            mostrarFondo();
        });
}

function mostrarImagenPokemon(respuestaApi){
    const $imagenModal = document.createElement('img');
    $imagenModal.src = respuestaApi.sprites.other['official-artwork'].front_default || respuestaApi.sprites.front_default || './img/pikachu_silueta.png';
    document.querySelector('.modal-pokemon .imagen-pokemon').appendChild($imagenModal);
}

function mostrarCaracteristicasPokemon(respuestaApi, numeroPokemon) {
    const $caracteristicasPokemon = document.querySelector('.modal-pokemon .informacion-pokemon');
    // NOMBRE DEL POKEMON
    const $nombrePokemon = document.createElement('h5');
    $nombrePokemon.textContent = `${numeroPokemon} | ${document.querySelector(`option[value="${numeroPokemon}"]`).textContent}`;

    // HABILIDADES DEL POKEMON
    const $habilidadesPokemon = document.createElement('span');
    $habilidadesPokemon.textContent = "HABILIDADES: ";
    respuestaApi.abilities.forEach(habilidad => {
        $habilidadesPokemon.textContent += habilidad.ability.name + ' | ';
    });

    // TIPOS ELEMENTALES
    const $tipoElementalPokemon = document.createElement('span');
    $tipoElementalPokemon.textContent = "TIPO: ";
    respuestaApi.types.forEach(tipoElemento => {
        $tipoElementalPokemon.textContent += tipoElemento.type.name + ' | ';
    });

    // ALTURA POKEMON
    const $alturaPokemon = document.createElement('span');
    $alturaPokemon.textContent = "ALTURA: " +  respuestaApi.height;

    // PESO POKEMON
    const $pesoPokemon = document.createElement('span');
    $pesoPokemon.textContent = "PESO: " + respuestaApi.weight;


    $caracteristicasPokemon.appendChild($nombrePokemon);
    $caracteristicasPokemon.appendChild($habilidadesPokemon);
    $caracteristicasPokemon.appendChild($tipoElementalPokemon);
    $caracteristicasPokemon.appendChild($alturaPokemon);
    $caracteristicasPokemon.appendChild($pesoPokemon);
}

function permitirCerrarModal(){
    document.querySelector('#cerrar-modal').addEventListener('click', () => {
        mostrarFondo();
        eliminarModalAnterior();
    });
}


function permitirNavegarModales(numeroPokemonActual){
    const cartasPokemon = document.querySelectorAll('.card-item');
    const numeroPrimerPokemon = Number(cartasPokemon[0].id);
    const numeroUltimoPokemon = Number(cartasPokemon[cartasPokemon.length - 1].id);
    const indiceActual = retornarIndiceActual(cartasPokemon, numeroPokemonActual);

    document.querySelector('#anterior-pokemon').addEventListener('click', () => {
        if(numeroPokemonActual > numeroPrimerPokemon)manejarModal(cartasPokemon[indiceActual - 1]);
    });

    document.querySelector('#siguiente-pokemon').addEventListener('click', () => {
        if(numeroPokemonActual < numeroUltimoPokemon)manejarModal(cartasPokemon[indiceActual + 1]);
    });
}

function retornarIndiceActual(cartasPokemon, numeroPokemonActual){
    let indiceActual;

    cartasPokemon.forEach((cartaPokemon, i) => {
        if(Number(cartaPokemon.id) === numeroPokemonActual)indiceActual = i;
    });

    return indiceActual;
}



/****************************/
//       PAGINACION         //
/****************************/
function cambiarTextoPaginacion(){
    document.querySelector('#pagina-actual').textContent = numeroPaginaActual;
}

function manejarPaginacion(){
    eliminarModalAnterior();
    actualizarPagina();
    cambiarTextoPaginacion();
    mostrarFondo();
}

document.querySelector('#primer-pagina').addEventListener('click', () => {
    if(numeroPaginaActual > 1){
        numeroPaginaActual = 1;
        cantidadPokemonesMostrados = 0;
        manejarPaginacion();
    }
}); 

document.querySelector('#pagina-anterior').addEventListener('click', () => {
    if(numeroPaginaActual > 1){
        numeroPaginaActual--;
        cantidadPokemonesMostrados -= POKEMONES_POR_PAGINA;
        manejarPaginacion();
    }
});

document.querySelector('#menos-diez').addEventListener('click', () => {
    if(numeroPaginaActual > 10){
        numeroPaginaActual -= 10;
        cantidadPokemonesMostrados -= (POKEMONES_POR_PAGINA * 10);
        manejarPaginacion();
    }
});

document.querySelector('#menos-cinco').addEventListener('click', () => {
    if(numeroPaginaActual > 5){
        numeroPaginaActual -= 5;
        cantidadPokemonesMostrados -= (POKEMONES_POR_PAGINA * 5);
        manejarPaginacion();
    }
});

document.querySelector('#mas-cinco').addEventListener('click', () => {
    if(numeroPaginaActual <= numeroUltimaPagina - 5){
        numeroPaginaActual += 5;
        cantidadPokemonesMostrados += (POKEMONES_POR_PAGINA * 5);
        manejarPaginacion();
    }
});

document.querySelector('#mas-diez').addEventListener('click', () => {
    if(numeroPaginaActual <= numeroUltimaPagina - 10){
        numeroPaginaActual += 10;
        cantidadPokemonesMostrados += (POKEMONES_POR_PAGINA * 10);
        manejarPaginacion();
    }
});

document.querySelector('#pagina-siguiente').addEventListener('click', () => {
    if(numeroPaginaActual < numeroUltimaPagina){
        numeroPaginaActual++;
        cantidadPokemonesMostrados += POKEMONES_POR_PAGINA;
        manejarPaginacion();
    }
});

document.querySelector('#ultima-pagina').addEventListener('click', () => {
    if(numeroPaginaActual < numeroUltimaPagina){
        numeroPaginaActual = numeroUltimaPagina;
        cantidadPokemonesMostrados = numeroUltimaPagina * POKEMONES_POR_PAGINA - POKEMONES_POR_PAGINA;
        manejarPaginacion();
    }
});


// INICIAR
function iniciar(){
    actualizarPagina();
    mostrarOpcionesBuscador();
}

iniciar();
