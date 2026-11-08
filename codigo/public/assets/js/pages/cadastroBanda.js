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

const campoPesquisa = document.querySelector("#pesquisa-artista");
const botaoPesquisa = document.querySelector("#botao-pesquisar");
const mensagemPesquisa = document.querySelector("#mensagem-pesquisa");
const resultadosPesquisa = document.querySelector("#resultados-pesquisa");

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


function normalizarTexto(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

let ultimaConsulta = 0;

async function consultarMusicBrainz(endereco) {
    const intervalo = 1100 - (Date.now() - ultimaConsulta);

    if (intervalo > 0) {
        await new Promise(resolve => setTimeout(resolve, intervalo));
    }

    ultimaConsulta = Date.now();

    const resposta = await fetch(endereco);

    if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    return resposta.json();
}

async function pesquisarArtistas() {
    const pesquisa = campoPesquisa.value.trim();

    if (!pesquisa) {
        mensagemPesquisa.textContent = "Digite o nome de uma banda.";
        resultadosPesquisa.innerHTML = "";
        return;
    }

    botaoPesquisa.disabled = true;
    mensagemPesquisa.textContent = "Pesquisando...";
    resultadosPesquisa.innerHTML = "";

    try {
        const endereco = new URL(
            "https://musicbrainz.org/ws/2/artist/"
        );

        endereco.searchParams.set("query", `artist:${pesquisa}`);
        endereco.searchParams.set("fmt", "json");
        endereco.searchParams.set("limit", "10");

        const dados = await consultarMusicBrainz(endereco);
        exibirResultados(dados.artists);

    } catch (erro) {
        console.error("Erro ao pesquisar artistas:", erro);
        mensagemPesquisa.textContent =
            "Não foi possível consultar o MusicBrainz. Tente novamente.";
    } finally {
        botaoPesquisa.disabled = false;
    }
}

function exibirResultados(artistas) {
    resultadosPesquisa.innerHTML = "";

    if (!artistas || artistas.length === 0) {
        mensagemPesquisa.textContent = "Nenhum artista encontrado.";
        return;
    }

    mensagemPesquisa.textContent =
        `${artistas.length} resultado(s) encontrado(s). Selecione uma banda:`;

    artistas.forEach(artista => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.classList.add(
            "cadastro-banda__botao",
            "cadastro-banda__botao--secundario"
        );

        const ano = artista["life-span"]?.begin
            ? artista["life-span"].begin.substring(0, 4)
            : "Ano desconhecido";

        const pais = artista.country || "País desconhecido";

        botao.textContent =
            `${artista.name} — ${artista.type || "Tipo desconhecido"} — ${pais} — ${ano}`;

        botao.addEventListener("click", () => {
            selecionarArtista(artista);
        });

        resultadosPesquisa.append(botao);
    });
}

async function buscarAlbuns(artistaId) {
    const endereco = new URL(
        "https://musicbrainz.org/ws/2/release-group/"
    );

    endereco.searchParams.set("artist", artistaId);
    endereco.searchParams.set("type", "album");
    endereco.searchParams.set("fmt", "json");
    endereco.searchParams.set("limit", "100");

    const dados = await consultarMusicBrainz(endereco);
    const grupos = dados["release-groups"] || [];

    grupos.sort((a, b) => {
        const dataA = a["first-release-date"] || "9999";
        const dataB = b["first-release-date"] || "9999";
        return dataA.localeCompare(dataB);
    });

    const titulosUnicos = new Set();

    const albuns = grupos
        .filter(album => album.title)
        .filter(album => {
            const tituloNormalizado = normalizarTexto(album.title);

            if (titulosUnicos.has(tituloNormalizado)) {
                return false;
            }

            titulosUnicos.add(tituloNormalizado);
            return true;
        })
        .map(album => album.title);

    return albuns.slice(0, 30);
}

async function buscarIntegrantes(artistaId) {
    const endereco = new URL(
        `https://musicbrainz.org/ws/2/artist/${artistaId}`
    );

    endereco.searchParams.set("inc", "artist-rels");
    endereco.searchParams.set("fmt", "json");

    const dados = await consultarMusicBrainz(endereco);
    const relacoes = dados.relations || [];

    const integrantes = relacoes
        .filter(relacao =>
            relacao.type === "member of band" &&
            relacao.direction === "backward" &&
            relacao.artist?.name
        )
        .map(relacao => relacao.artist.name);

    return [...new Set(integrantes)];
}


async function buscarImagem(nomeArtista) {
    const idiomas = ["pt", "en"];

    for (const idioma of idiomas) {
        const parametrosImagem = new URLSearchParams({
            action: "query",
            generator: "search",
            gsrsearch: nomeArtista,
            gsrnamespace: "0",
            gsrlimit: "5",
            prop: "pageimages",
            piprop: "thumbnail",
            pithumbsize: "800",
            format: "json",
            origin: "*"
        });

        const endereco =
            `https://${idioma}.wikipedia.org/w/api.php?${parametrosImagem}`;

        const resposta = await fetch(endereco);

        if (!resposta.ok) {
            continue;
        }

        const dados = await resposta.json();

        const paginas = Object.values(
            dados.query?.pages || {}
        ).sort((a, b) => a.index - b.index);

        const nomeNormalizado = normalizarTexto(nomeArtista);

        const paginaExata = paginas.find(pagina =>
            normalizarTexto(pagina.title) === nomeNormalizado &&
            pagina.thumbnail?.source
        );

        const pagina = paginaExata ||
            paginas.find(item => item.thumbnail?.source);

        if (pagina) {
            return pagina.thumbnail.source;
        }
    }

    return null;
}


async function buscarDadosWikipedia(nomeArtista) {
    const idiomas = ["pt", "en"];

    for (const idioma of idiomas) {
        try {
            const pesquisa = new URLSearchParams({
                action: "query",
                list: "search",
                srsearch: nomeArtista,
                srlimit: "5",
                format: "json",
                origin: "*"
            });

            const respostaPesquisa = await fetch(
                `https://${idioma}.wikipedia.org/w/api.php?${pesquisa}`
            );

            if (!respostaPesquisa.ok) {
                continue;
            }

            const dadosPesquisa = await respostaPesquisa.json();
            const paginas = dadosPesquisa.query?.search || [];

            if (paginas.length === 0) {
                continue;
            }

            const nomeNormalizado = normalizarTexto(nomeArtista);

            const pagina = paginas.find(item =>
                normalizarTexto(item.title) === nomeNormalizado
            ) || paginas[0];

            const parametrosPagina = new URLSearchParams({
                action: "query",
                prop: "pageprops",
                ppprop: "wikibase_item",
                titles: pagina.title,
                format: "json",
                origin: "*"
            });

            const respostaPagina = await fetch(
                `https://${idioma}.wikipedia.org/w/api.php?${parametrosPagina}`
            );

            if (!respostaPagina.ok) {
                continue;
            }

            const dadosPagina = await respostaPagina.json();
            const paginasDetalhadas = Object.values(
                dadosPagina.query?.pages || {}
            );

            const idWikidata =
                paginasDetalhadas[0]?.pageprops?.wikibase_item;

            if (!idWikidata) {
                continue;
            }

            const parametrosWikidata = new URLSearchParams({
                action: "wbgetentities",
                ids: idWikidata,
                props: "claims",
                format: "json",
                origin: "*"
            });

            const respostaWikidata = await fetch(
                `https://www.wikidata.org/w/api.php?${parametrosWikidata}`
            );

            if (!respostaWikidata.ok) {
                continue;
            }

            const dadosWikidata = await respostaWikidata.json();
            const entidade = dadosWikidata.entities?.[idWikidata];

            if (!entidade) {
                continue;
            }

            const claims = entidade.claims || {};

            const valorAno =
                claims.P571?.[0]?.mainsnak?.datavalue?.value?.time || "";

            const ano = valorAno.match(/(?:18|19|20)\d{2}/)?.[0] || "";

            const idsRelacionados = [
                ...(claims.P136 || []),
                ...(claims.P527 || [])
            ]
                .map(item => item.mainsnak?.datavalue?.value?.id)
                .filter(Boolean);

            let generos = [];
            let integrantes = [];

            if (idsRelacionados.length > 0) {
                const idsUnicos = [...new Set(idsRelacionados)];

                const parametrosRotulos = new URLSearchParams({
                    action: "wbgetentities",
                    ids: idsUnicos.join("|"),
                    props: "labels",
                    languages: "pt|en",
                    format: "json",
                    origin: "*"
                });

                const respostaRotulos = await fetch(
                    `https://www.wikidata.org/w/api.php?${parametrosRotulos}`
                );

                if (respostaRotulos.ok) {
                    const dadosRotulos = await respostaRotulos.json();

                    const obterRotulo = id => {
                        const rotulos = dadosRotulos.entities?.[id]?.labels;

                        return rotulos?.pt?.value ||
                            rotulos?.en?.value ||
                            "";
                    };

                    generos = (claims.P136 || [])
                        .map(item =>
                            obterRotulo(
                                item.mainsnak?.datavalue?.value?.id
                            )
                        )
                        .filter(Boolean);

                    integrantes = (claims.P527 || [])
                        .map(item =>
                            obterRotulo(
                                item.mainsnak?.datavalue?.value?.id
                            )
                        )
                        .filter(Boolean);
                }
            }

            return {
                ano,
                genero: generos[0] || "",
                integrantes: [...new Set(integrantes)]
            };

        } catch (erro) {
            console.error(
                `Erro ao consultar Wikipedia/Wikidata (${idioma}):`,
                erro
            );
        }
    }

    return null;
}


async function buscarDadosITunes(nomeArtista) {
    const parametrosITunes = new URLSearchParams({
        term: nomeArtista,
        entity: "album",
        limit: "200"
    });

    const resposta = await fetch(
        `https://itunes.apple.com/search?${parametrosITunes}`
    );

    if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const dados = await resposta.json();
    const resultados = dados.results || [];
    const nomeNormalizado = normalizarTexto(nomeArtista);

    const resultadosValidos = resultados.filter(item => {
        const artista = normalizarTexto(item.artistName || "");

        return artista === nomeNormalizado ||
            artista.includes(nomeNormalizado) ||
            nomeNormalizado.includes(artista);
    });

    const albuns = [
        ...new Set(
            resultadosValidos
                .map(item => item.collectionName)
                .filter(Boolean)
        )
    ];

    const imagem = resultadosValidos.find(item =>
        item.artworkUrl100
    )?.artworkUrl100?.replace(/100x100bb/, "600x600bb");

    return { albuns, imagem };
}


async function selecionarArtista(artista) {
    nome.value = artista.name;

    anoFormacao.value = artista["life-span"]?.begin
        ? artista["life-span"].begin.substring(0, 4)
        : "";

    const generosMusicBrainz = [...(artista.tags || [])];

    generoMusica.value = generosMusicBrainz.length > 0
        ? generosMusicBrainz
            .sort((a, b) => b.count - a.count)[0].name
        : "";

    mensagemPesquisa.textContent =
        `Carregando informações de ${artista.name}...`;

    resultadosPesquisa.innerHTML = "";

    let albuns = [];
    let integrantes = [];
    let imagemITunes = "";

    try {
        albuns = await buscarAlbuns(artista.id);
    } catch (erro) {
        console.error("Erro ao buscar álbuns no MusicBrainz:", erro);
    }

    try {
        integrantes = await buscarIntegrantes(artista.id);
    } catch (erro) {
        console.error("Erro ao buscar integrantes no MusicBrainz:", erro);
    }

    try {
        const dadosWikipedia = await buscarDadosWikipedia(artista.name);

        if (dadosWikipedia) {
            if (!anoFormacao.value && dadosWikipedia.ano) {
                anoFormacao.value = dadosWikipedia.ano;
            }

            if (!generoMusica.value && dadosWikipedia.genero) {
                generoMusica.value = dadosWikipedia.genero;
            }

            if (
                integrantes.length === 0 &&
                dadosWikipedia.integrantes.length > 0
            ) {
                integrantes = dadosWikipedia.integrantes;
            }
        }
    } catch (erro) {
        console.error("Erro ao consultar Wikipedia/Wikidata:", erro);
    }

    try {
        const dadosITunes = await buscarDadosITunes(artista.name);

        if (albuns.length === 0) {
            albuns = dadosITunes.albuns;
        }

        imagemITunes = dadosITunes.imagem || "";

    } catch (erro) {
        console.error("Erro ao consultar iTunes:", erro);
    }

    preencherLista(listaAlbuns, "album", albuns);
    preencherLista(listaIntegrantes, "integrante", integrantes);

    try {
        const urlImagemWikipedia = await buscarImagem(artista.name);

        if (urlImagemWikipedia) {
            imagem.value = urlImagemWikipedia;
        } else if (imagemITunes) {
            imagem.value = imagemITunes;
        }
    } catch (erro) {
        console.error("Erro ao buscar imagem na Wikipedia:", erro);

        if (imagemITunes) {
            imagem.value = imagemITunes;
        }
    }

    mensagemPesquisa.textContent =
        `${artista.name}: pesquisa concluída. Confira os dados antes de salvar.`;
}


botaoPesquisa.addEventListener("click", pesquisarArtistas);

campoPesquisa.addEventListener("keydown", evento => {
    if (evento.key === "Enter") {
        evento.preventDefault();
        pesquisarArtistas();
    }
});


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

        mensagemPesquisa.textContent = "";
        resultadosPesquisa.innerHTML = "";
    }
});