import {
    inicializarBandas,
    salvarBandas
} from "../modules/armazenamento.js";

let bandas = await inicializarBandas();

const formulario = document.querySelector(".cadastro-banda__formulario");

const nome = document.querySelector("#nome");
const imagem = document.querySelector("#imagem");
const generoMusica = document.querySelector("#generoMusica");
const anoFormacao = document.querySelector("#anoFormacao");

const listaIntegrantes = document.querySelector("#integrantes");
const listaAlbuns = document.querySelector("#albuns");

const titulo = document.querySelector(".cadastro-banda__titulo");
const botaoEnviar = formulario.querySelector('button[type="submit"]');

const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

const bandaExistente = id
    ? bandas.find(banda => banda.id === id)
    : null;

if (id && !bandaExistente) {
    alert("Não foi possível encontrar a banda.");
    window.location.href = "../../index.html";
}

function criarCampo(lista, tipo, numero, valor = "") {

    const novoCampo = document.createElement("div");
    novoCampo.classList.add("cadastro-banda__item");

    const tituloCampo = tipo === "album" ? "Álbum" : "Integrante";
    const nomeLista = tipo === "album" ? "albuns" : "integrantes";
    const placeholder = tipo === "album"
        ? "Nome do álbum"
        : "Nome do integrante";

    const label = document.createElement("label");
    label.htmlFor = `${tipo}-${numero}`;
    label.textContent = `${tituloCampo} ${numero}`;

    const input = document.createElement("input");
    input.type = "text";
    input.id = `${tipo}-${numero}`;
    input.name = `${nomeLista}[]`;
    input.placeholder = placeholder;
    input.value = valor;

    novoCampo.append(label, input);
    lista.append(novoCampo);
}

function preencherLista(lista, tipo, valores = []) {

    lista.innerHTML = "";

    const quantidadeCampos = Math.max(valores.length + 1, 2);

    for (let i = 0; i < quantidadeCampos; i++) {
        criarCampo(lista, tipo, i + 1, valores[i] || "");
    }
}

function adicionarCampoAutomatico(lista, tipo) {

    lista.addEventListener("input", evento => {

        const campos = lista.querySelectorAll("input");
        const ultimoCampo = campos[campos.length - 1];

        if (
            evento.target === ultimoCampo &&
            ultimoCampo.value.trim() !== ""
        ) {
            criarCampo(lista, tipo, campos.length + 1);
        }
    });
}

adicionarCampoAutomatico(listaIntegrantes, "integrante");
adicionarCampoAutomatico(listaAlbuns, "album");

if (bandaExistente) {

    document.title = `Editar ${bandaExistente.nome} | BandHub`;

    titulo.textContent = "Editar banda";
    botaoEnviar.textContent = "Salvar alterações";

    nome.value = bandaExistente.nome;
    imagem.value = bandaExistente.imagem;
    generoMusica.value = bandaExistente.generoMusica;
    anoFormacao.value = bandaExistente.anoFormacao;

    preencherLista(
        listaIntegrantes,
        "integrante",
        bandaExistente.integrantes
    );

    preencherLista(
        listaAlbuns,
        "album",
        bandaExistente.albuns
    );
}

formulario.addEventListener("submit", evento => {

    evento.preventDefault();

    const dados = new FormData(formulario);

    const dadosBanda = {
        nome: dados.get("nome").trim(),
        imagem: dados.get("imagem").trim(),
        generoMusica: dados.get("generoMusica").trim(),
        anoFormacao: Number(dados.get("anoFormacao")),

        integrantes: dados.getAll("integrantes[]")
            .map(integrante => integrante.trim())
            .filter(integrante => integrante !== ""),

        albuns: dados.getAll("albuns[]")
            .map(album => album.trim())
            .filter(album => album !== "")
    };

    if (bandaExistente) {

        const indice = bandas.findIndex(
            banda => banda.id === bandaExistente.id
        );

        bandas[indice] = {
            ...bandaExistente,
            ...dadosBanda
        };

        salvarBandas(bandas);

        alert("Banda atualizada com sucesso!");

        window.location.href =
            `detalhes.html?id=${encodeURIComponent(bandaExistente.id)}`;

    } else {

        const novaBanda = {
            id: crypto.randomUUID(),
            ...dadosBanda
        };

        bandas.push(novaBanda);

        salvarBandas(bandas);

        alert("Banda cadastrada com sucesso!");

        formulario.reset();

        preencherLista(listaIntegrantes, "integrante");
        preencherLista(listaAlbuns, "album");
    }
});
