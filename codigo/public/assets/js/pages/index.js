import { criarCardBase } from "../components/card-base.js";

const caminhoJson = "BandHub/db/db.json";

const containers = document.querySelectorAll("[data-type]");

containers.forEach(async (elemento) => {
    const tipo = elemento.dataset.type;

    if (tipo === "cardContainer") {
        const card = await criarCardBase(caminhoJson);
        elemento.replaceWith(card);
    }
});