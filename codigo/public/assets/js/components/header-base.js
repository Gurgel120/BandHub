export function criarHeaderBase(imagemCaminho) {
    const header = document.createElement('header');
    header.classList.add('header-base');

    const logo = document.createElement('div');
    logo.classList.add('logo');

    const tituloContainer = document.createElement('div');
    tituloContainer.classList.add('titulo__container');

    const titulo1 = document.createElement('h1');
    titulo1.classList.add('logo__titulo', 'logo__titulo--primary');
    titulo1.textContent = 'Band';

    const titulo2 = document.createElement('h1');
    titulo2.classList.add('logo__titulo', 'logo__titulo--secondary');
    titulo2.textContent = 'Hub';

    const imagem = document.createElement('img');
    imagem.classList.add('logo__imagem');
    imagem.src = `${imagemCaminho}logo.png`;
    imagem.alt = 'Logo do site';

    tituloContainer.append(titulo1, titulo2);
    logo.append(tituloContainer, imagem);

    const nav = document.createElement('nav');
    nav.classList.add('nav-base');

    const home = document.createElement('a');
    home.classList.add('nav-base__link');
    home.textContent = 'Home';
    home.dataset.link = 'index';
    home.href = 'index.html';

    const favoritos = document.createElement('a');
    favoritos.classList.add('nav-base__link');
    favoritos.textContent = 'Favoritos';
    favoritos.dataset.link = 'favoritos';
    favoritos.href="public/modules/favoritos.html";

    const login = document.createElement('a');
    login.classList.add('nav-base__link');
    login.textContent = 'Fazer login';
    login.dataset.link = 'login';
    login.href = 'public/modules/login.html';

    const cadastro = document.createElement('a')
    cadastro.classList.add('nav-base__link')
    cadastro.id='destaque';
    cadastro.textContent='Cadastrar-se';
    cadastro.dataset.cadastro='cadastro';
    cadastro.href='public/modules/cadastroUsuario.html'


    nav.append(home,favoritos, login,cadastro);
    header.append(logo, nav);

    return header;
}
