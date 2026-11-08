
export function criarCardBase(bandas) {

    function Main(dados) {
        const container = document.createElement("div");
        container.classList.add("bandas-destaque__lista");

        dados.forEach(banda => {
            const card = document.createElement("article");
            card.classList.add("card-base");

            card.style.cursor = "pointer";

            card.addEventListener("click", () => {
                window.location.href =
                    `public/modules/detalhes.html?id=${banda.id}`;
            });

            const nome = document.createElement("h2");
            nome.classList.add("card-base__nome");
            nome.textContent = banda.nome;

            const imagem = document.createElement("img");
            imagem.classList.add("card-base__imagem");
            imagem.src = banda.imagem;
            imagem.alt = `Capa da banda ${banda.nome}`;

            card.append(nome, imagem);
            container.append(card);
        });

        return container;
    }

    return Main(bandas);
}
