import { criarCardBase } from "../components/card-base.js";
import { inicializarBandas } from "../modules/armazenamento.js";

const bandas = await inicializarBandas();

let containerLista = document.querySelector('[data-type="cardContainer"]');

const campoPesquisa = document.querySelector("#pesquisa-banda");
const botaoPesquisa = document.querySelector(".pesquisa-botao");
const filtroGenero = document.querySelector("#filtro-genero");
const ordenacao = document.querySelector("#ordenar-bandas");

function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function carregarGeneros() {

    const generos = new Map();

    bandas.forEach(banda => {
        const genero = banda.generoMusica.trim();
        const generoNormalizado = normalizarTexto(genero);

        if (generoNormalizado && !generos.has(generoNormalizado)) {
            generos.set(generoNormalizado, genero);
        }
    });

    const generosOrdenados = [...generos.entries()]
        .sort((a, b) => a[1].localeCompare(b[1], "pt-BR"));

    generosOrdenados.forEach(([valor, nome]) => {

        const opcao = document.createElement("option");

        opcao.value = valor;
        opcao.textContent = nome;

        filtroGenero.append(opcao);
    });
}

function ordenarBandas(lista) {

    const bandasOrdenadas = [...lista];

    switch (ordenacao.value) {

        case "nome-asc":
            bandasOrdenadas.sort((a, b) =>
                a.nome.localeCompare(b.nome, "pt-BR")
            );
            break;

        case "nome-desc":
            bandasOrdenadas.sort((a, b) =>
                b.nome.localeCompare(a.nome, "pt-BR")
            );
            break;

        case "ano-asc":
            bandasOrdenadas.sort((a, b) =>
                Number(a.anoFormacao) - Number(b.anoFormacao)
            );
            break;

        case "ano-desc":
            bandasOrdenadas.sort((a, b) =>
                Number(b.anoFormacao) - Number(a.anoFormacao)
            );
            break;
    }

    return bandasOrdenadas;
}

function atualizarLista() {

    const pesquisa = normalizarTexto(campoPesquisa.value);
    const generoSelecionado = filtroGenero.value;

    const bandasFiltradas = bandas.filter(banda => {

        const nome = normalizarTexto(banda.nome);
        const genero = normalizarTexto(banda.generoMusica);

        const correspondeNome = nome.includes(pesquisa);

        const correspondeGenero = !generoSelecionado ||
            genero === generoSelecionado;

        return correspondeNome && correspondeGenero;
    });

    const bandasOrdenadas = ordenarBandas(bandasFiltradas);

    const novaLista = criarCardBase(bandasOrdenadas);

    if (bandasOrdenadas.length === 0) {

        const mensagem = document.createElement("p");

        mensagem.classList.add("bandas-destaque__vazio");
        mensagem.textContent = "Nenhuma banda encontrada.";

        novaLista.append(mensagem);
    }

    containerLista.replaceWith(novaLista);

    containerLista = novaLista;
}

campoPesquisa.addEventListener("input", atualizarLista);
botaoPesquisa.addEventListener("click", atualizarLista);
filtroGenero.addEventListener("change", atualizarLista);
ordenacao.addEventListener("change", atualizarLista);

carregarGeneros();
atualizarLista();
