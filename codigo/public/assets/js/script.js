import { criarHeaderBase } from './components/header-base.js';

const imagemCaminho='public/assets/images/'
const componentes = document.querySelectorAll('[data-component]');

componentes.forEach((elemento) => {
    const componente = elemento.dataset.component;

    if (componente === 'header-base') {
        elemento.replaceWith(criarHeaderBase(imagemCaminho));
    }
});