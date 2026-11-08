export function criarHeaderBase() {
    const header = document.createElement("header");
    header.classList.add("header-base");

    const logo = document.createElement("div");
    logo.classList.add("logo");

    const tituloContainer = document.createElement("div");
    tituloContainer.classList.add("titulo__container");

    const titulo1 = document.createElement("h1");
    titulo1.classList.add("logo__titulo", "logo__titulo--primary");
    titulo1.textContent = "Band";

    const titulo2 = document.createElement("h1");
    titulo2.classList.add("logo__titulo", "logo__titulo--secondary");
    titulo2.textContent = "Hub";

    const imagem = document.createElement("img");
    imagem.classList.add("logo__imagem");
    imagem.src = "/BandHub/public/assets/images/logo.png";
    imagem.alt = "Logo do site";

    tituloContainer.append(titulo1, titulo2);
    logo.append(tituloContainer, imagem);

    const nav = document.createElement("nav");
    nav.classList.add("nav-base");

    const links = [
        {
            texto: "Home",
            destino: "/BandHub/index.html",
            identificador: "index"
        },
        {
            texto: "Favoritos",
            destino: "/BandHub/public/modules/favoritos.html",
            identificador: "favoritos"
        },
        {
            texto: "Fazer login",
            destino: "/BandHub/public/modules/login.html",
            identificador: "login"
        },
        {
            texto: "Cadastrar-se",
            destino: "/BandHub/public/modules/cadastroUsuario.html",
            identificador: "cadastro"
        }
    ];

    links.forEach(item => {
        const link = document.createElement("a");

        link.classList.add("nav-base__link");
        link.textContent = item.texto;
        link.href = item.destino;
        link.dataset.link = item.identificador;

        if (item.identificador === "cadastro") {
            link.id = "destaque";
        }

        nav.append(link);
    });

    header.append(logo, nav);

    return header;
}