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
    home.href = '#';

    const login = document.createElement('a');
    login.classList.add('nav-base__link');
    login.id = 'destaque';
    login.textContent = 'Fazer login';
    login.dataset.link = 'login';
    login.href = '#';

    const barraPesquisa = document.createElement('input');
    barraPesquisa.classList.add('nav-base__pesquisar');
    barraPesquisa.type = 'text';
    barraPesquisa.placeholder = 'Digite o nome da banda';
    barraPesquisa.setAttribute('aria-label', 'Pesquisar banda');

    const svgNS = 'http://www.w3.org/2000/svg';

    const svg = document.createElementNS(svgNS, 'svg');
    svg.classList.add('nav-base__svg');
    svg.setAttribute('viewBox', '0 -0.5 25 25');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('xmlns', svgNS);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Ícone de pesquisa');

    const g1 = document.createElementNS(svgNS, 'g');
    g1.setAttribute('id', 'SVGRepo_bgCarrier');
    g1.setAttribute('stroke-width', '0');

    const g2 = document.createElementNS(svgNS, 'g');
    g2.setAttribute('id', 'SVGRepo_tracerCarrier');
    g2.setAttribute('stroke-linecap', 'round');
    g2.setAttribute('stroke-linejoin', 'round');

    const g3 = document.createElementNS(svgNS, 'g');
    g3.setAttribute('id', 'SVGRepo_iconCarrier');

    const path1 = document.createElementNS(svgNS, 'path');
    path1.setAttribute('fill-rule', 'evenodd');
    path1.setAttribute('clip-rule', 'evenodd');
    path1.setAttribute(
        'd',
        'M7.30524 15.7137C6.4404 14.8306 5.85381 13.7131 5.61824 12.4997C5.38072 11.2829 5.50269 10.0233 5.96924 8.87469C6.43181 7.73253 7.22153 6.75251 8.23924 6.05769C10.3041 4.64744 13.0224 4.64744 15.0872 6.05769C16.105 6.75251 16.8947 7.73253 17.3572 8.87469C17.8238 10.0233 17.9458 11.2829 17.7082 12.4997C17.4727 13.7131 16.8861 14.8306 16.0212 15.7137C14.8759 16.889 13.3044 17.5519 11.6632 17.5519C10.0221 17.5519 8.45059 16.889 7.30524 15.7137V15.7137Z'
    );
    path1.setAttribute('stroke', 'currentColor');
    path1.setAttribute('stroke-width', '1.5');
    path1.setAttribute('stroke-linecap', 'round');
    path1.setAttribute('stroke-linejoin', 'round');

    const path2 = document.createElementNS(svgNS, 'path');
    path2.setAttribute(
        'd',
        'M11.6702 7.20292C11.2583 7.24656 10.9598 7.61586 11.0034 8.02777C11.0471 8.43968 11.4164 8.73821 11.8283 8.69457L11.6702 7.20292ZM13.5216 9.69213C13.6831 10.0736 14.1232 10.2519 14.5047 10.0904C14.8861 9.92892 15.0644 9.4888 14.9029 9.10736L13.5216 9.69213ZM16.6421 15.0869C16.3492 14.7943 15.8741 14.7947 15.5815 15.0879C15.2888 15.381 15.2893 15.8559 15.5824 16.1485L16.6421 15.0869ZM18.9704 19.5305C19.2637 19.2369 19.7386 19.2365 20.0313 19.5296C20.3239 19.8227 20.3233 20.297 20.0301 20.5896L18.9704 19.5305ZM11.8283 8.69457C12.5508 8.61801 13.2384 9.02306 13.5216 9.69213L14.9029 9.10736C14.3622 7.83005 13.0496 7.05676 11.6702 7.20292L11.8283 8.69457ZM15.5824 16.1485L18.9704 19.5305L20.0301 18.4689L16.6421 15.0869L15.5824 16.1485Z'
    );
    path2.setAttribute('fill', 'currentColor');

    g3.append(path1, path2);
    svg.append(g1, g2, g3);

    nav.append(home, login, barraPesquisa, svg);
    header.append(logo, nav);

    return header;
}
