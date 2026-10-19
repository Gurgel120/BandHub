import { criarCardBase } from "../components/card-base.js";

const caminhoJson = "/BandHub/db/db.json";

const containers = document.querySelectorAll('[data-type]');

containers.forEach(async (elemento) => {
    const tipo = elemento.dataset.type;

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
