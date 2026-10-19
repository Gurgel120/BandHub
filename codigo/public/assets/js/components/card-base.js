
export async function criarCardBase(caminhoJson) {

    async function carregarJson(caminhoJson) {
        const resposta = await fetch(caminhoJson);

        if (!resposta.ok) {
            throw new Error(`Erro ao carregar JSON: ${resposta.status}`);
        }

        return await resposta.json();
    }

    function Main(dados) {
        const container = document.createElement('div');
        container.classList.add('bandas-destaque__lista');

        dados.bandas.forEach(banda => {
            const card = document.createElement('article');
            card.classList.add('card-base');

            card.style.cursor = 'pointer';

            card.addEventListener('click', () => {
                window.location.href =
                    `./modules/detalhes.html?banda=${encodeURIComponent(banda.nome)}`;
            });

            const nome = document.createElement('h2');
            nome.classList.add('card-base__nome');
            nome.textContent = banda.nome;

            const imagem = document.createElement('img');
            imagem.classList.add('card-base__imagem');
            imagem.src = banda.imagem;
            imagem.alt = `Capa da banda ${banda.nome}`;

            card.append(nome, imagem);
            container.append(card);
        });

        return container;
    }

    const dados = await carregarJson(caminhoJson);
    return Main(dados);
}
