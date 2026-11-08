import { criarCardBase } from "../components/card-base.js";
import { inicializarBandas } from "../modules/armazenamento.js";

const bandas = await inicializarBandas();

let containerLista = document.querySelector('[data-type="cardContainer"]');

const campoPesquisa = document.querySelector("#pesquisa-banda");
const botaoPesquisa = document.querySelector(".pesquisa-botao");
const filtroGenero = document.querySelector("#filtro-genero");
const ordenacao = document.querySelector("#ordenar-bandas");

    if (tipo === "cardContainer") {
        try {
            const card = await criarCardBase(caminhoJson);
            elemento.replaceWith(card);
        } catch (erro) {
            console.error("Erro ao carregar as bandas:", erro);
            elemento.textContent = "Não foi possível carregar as bandas.";
        }
    }
});
