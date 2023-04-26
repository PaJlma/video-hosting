let sidebar = document.querySelector('.activating-sidebar');
let headerMenu = document.querySelector('.header__menu');

headerMenu.addEventListener('click', () => {
    if (sidebar.classList.contains('able')) {
        sidebar.classList.remove('able');
        sidebar.classList.add('disable');
    } else {
        sidebar.classList.remove('disable');
        sidebar.classList.add('able');
    }
});