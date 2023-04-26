let backgroundedSidebarMenu = document.querySelector('.sidebar-menu-backgrounded__button');
let backgroundedSidebar = document.querySelector('.sidebar-menu-backgrounded');

backgroundedSidebarMenu.addEventListener('click', () => {
    if (backgroundedSidebar.classList.contains('able')) {
        backgroundedSidebar.classList.remove('able');
        backgroundedSidebar.classList.add('disable');
    } else {
        backgroundedSidebar.classList.remove('disable');
        backgroundedSidebar.classList.add('able');
    }
});