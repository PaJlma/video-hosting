import readJSON from './modules/readJSON.js'

const subscribesBlock = document.querySelector('.sidebar__subscribes-place');
const subscribesShowAll = document.querySelector('#subscribes-show-all');
const DEFAULT_SUBSCRIBES_COUNT = 6; // Количество каналов на которые вы подписаны, показываемых изначально
const subscribersJSON = 'json/channels.json';

async function generateSidebarSubscribesDOM() {
    const subscribes = await readJSON(subscribersJSON);
    const subscribesArray = [];
    for(let subscribe of Object.values(subscribes)) {
        let {
            channelName, 
            channelAvatarPath, 
            channelIsConfirmed, 
            channelHasNewVideos, 
            channelIsLive
        } = subscribe;

        const channel = document.createElement('div');
        channel.classList.add('sidebar-case');
        channel.innerHTML = `
        <div class="sidebar-case">
            <img src="${channelAvatarPath}" alt="We got that butty, dude!" class="avatar">
            <p class="sidebar__text">${channelName}</p>
            <img src="${channelIsConfirmed ? 'images/status/confirmed.svg' : ''}" alt="" class="confirmed">
            <div class="subscribes__status-block">
                <img src="${channelIsLive ? 'images/status/online.svg' : ''}" alt="" class="subscribes__status">
                <img src="${channelHasNewVideos ? 'images/status/new.svg' : ''}" alt="" class="subscribes__status">
            </div>
        </div>`;

        subscribesArray.push(channel);
    };
    for (let index = DEFAULT_SUBSCRIBES_COUNT; index < subscribesArray.length; index++) {
        subscribesArray[index].style.display = 'none';
    };
    subscribesBlock.append(...subscribesArray);
};

function showAllSidebarSubscribesDOM() {
    const subscribesCases = subscribesBlock.querySelectorAll('.sidebar-case');
    for (let subscribeCase of subscribesCases) {
        subscribeCase.style.display = 'flex';
    };
    subscribesShowAll.style.display = 'none';
};

generateSidebarSubscribesDOM();
subscribesShowAll.addEventListener('click', showAllSidebarSubscribesDOM);