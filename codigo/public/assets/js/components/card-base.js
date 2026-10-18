export async function criarCardBase(caminhoJson) {

    async function carregarJson(caminhoJson) {
        const resposta = await fetch(caminhoJson);
        const dados = await resposta.json();
        return dados;
    }

    function Main(dados) {
        const container = document.createElement('div');

        dados.bandas.forEach(banda => {
            const card = document.createElement('article');
            card.classList.add('card-base');

            // Torna o card clicável
            card.style.cursor = 'pointer';

            card.addEventListener('click', () => {
                window.location.href =
                    `/modules/detalhes.html?banda=${encodeURIComponent(banda.nome)}`;
            });

            const nome = document.createElement('h1');
            nome.classList.add('card-base__nome');
            nome.textContent = banda.nome;

            const imagem = document.createElement('img');
            imagem.classList.add('card-base__imagem');
            imagem.setAttribute('src', banda.imagem);
            imagem.setAttribute('alt', `Capa da banda ${banda.nome}`);

            card.append(nome, imagem);
            container.append(card);
        });

        return container;
    }

    const dados = await carregarJson(caminhoJson);
    return Main(dados);
}