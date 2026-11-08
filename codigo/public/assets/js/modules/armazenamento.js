const CHAVE = "bandhub_bandas";
const CAMINHO_JSON = new URL("../../../../db/db.json", import.meta.url);

export function carregarBandas() {

    try {
        const bandasSalvas = localStorage.getItem(CHAVE);

        return bandasSalvas ? JSON.parse(bandasSalvas) : [];

    } catch (erro) {
        console.error("Erro ao recuperar bandas:", erro);
        return [];
    }
}
export function salvarBandas(bandas) {
    localStorage.setItem(CHAVE, JSON.stringify(bandas));
}

export async function inicializarBandas() {
    let bandasSalvas = localStorage.getItem(CHAVE);

    if (bandasSalvas !== null) {
        return carregarBandas();
    }

    try {
        let resposta = await fetch(CAMINHO_JSON);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o arquivo JSON.");
        }

        let dados = await resposta.json();

        let bandas = dados.bandas.map(banda => ({
            id: crypto.randomUUID(),
            ...banda
        }));

        salvarBandas(bandas);

        return bandas;

    } catch (erro) {
        console.error("Erro ao inicializar bandas:", erro);
        return [];
    }
}