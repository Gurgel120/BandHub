import {
    inicializarBandas,
    salvarBandas
} from "../modules/armazenamento.js";

const bandas = await inicializarBandas();

const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

const banda = bandas.find(banda => banda.id === id);

const imagem = document.querySelector("#imagem-banda");
const nome = document.querySelector("#nome-banda");
const descricao = document.querySelector("#descricao-banda");
const genero = document.querySelector("#genero-banda");
const ano = document.querySelector("#ano-banda");

const listaIntegrantes = document.querySelector("#lista-integrantes");
const listaAlbuns = document.querySelector("#lista-albuns");

const botaoEditar = document.querySelector("#editar-banda");
const botaoExcluir = document.querySelector("#excluir-banda");

if (!banda) {
    document.querySelector(".banda").textContent =
        "Banda não encontrada.";

    document.querySelectorAll(".secao").forEach(secao => {
        secao.hidden = true;
    });

} else {

    document.title = `${banda.nome} | BandHub`;

    botaoEditar.href =
        `cadastroBanda.html?id=${encodeURIComponent(banda.id)}`;

    imagem.src = banda.imagem;
    imagem.alt = `Imagem da banda ${banda.nome}`;

    nome.textContent = banda.nome;
    genero.textContent = banda.generoMusica;
    ano.textContent = banda.anoFormacao;

    if (banda.descricao) {
        descricao.textContent = banda.descricao;
    } else {
        descricao.hidden = true;
    }

    banda.integrantes.forEach(integrante => {

        const artigo = document.createElement("article");
        artigo.classList.add("integrante");

        const inicial = document.createElement("span");
        inicial.classList.add("integrante__inicial");
        inicial.textContent = integrante.charAt(0).toUpperCase();

        const nomeIntegrante = document.createElement("h3");
        nomeIntegrante.classList.add("integrante__nome");
        nomeIntegrante.textContent = integrante;

        artigo.append(inicial, nomeIntegrante);
        listaIntegrantes.append(artigo);
    });

    banda.albuns.forEach((album, indice) => {

        const artigo = document.createElement("article");
        artigo.classList.add("album");

        const numero = document.createElement("span");
        numero.classList.add("album__numero");
        numero.textContent = String(indice + 1).padStart(2, "0");

        const informacoes = document.createElement("div");
        informacoes.classList.add("album__informacoes");

        const nomeAlbum = document.createElement("h3");
        nomeAlbum.classList.add("album__nome");
        nomeAlbum.textContent = album;

        informacoes.append(nomeAlbum);
        artigo.append(numero, informacoes);
        listaAlbuns.append(artigo);
    });

    botaoExcluir.addEventListener("click", () => {

        const confirmar = confirm(
            `Tem certeza de que deseja excluir ${banda.nome}?`
        );

        if (!confirmar) {
            return;
        }

        const bandasAtualizadas = bandas.filter(
            item => item.id !== banda.id
        );

        salvarBandas(bandasAtualizadas);

        alert("Banda excluída com sucesso!");

        window.location.href = "../../index.html";
    });
}
