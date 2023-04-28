// import readJSON from './modules/readJSON.js'
import { shuffle, getNoun, asyncCachingDecorator } from './modules/otherTools.js';
import { showTime } from './modules/timeTools.js';

const videosBlock = document.querySelector('.videos'); // Блок div, в котором находятся строчки с видео
const videosRows = document.getElementsByClassName('videos__row'); // Сама строчка
const videosJSON = '../json/videos.json' // Путь к JSON файлу

async function readJSON(filePath) {
    const response = await fetch(filePath);
    if (response.status === 200) {
        return response.json();
    } else {
        throw new Error('Error. Response status is not 200.');
    };
};

async function generateVideosBlocks() {
    readJSON = asyncCachingDecorator(readJSON);
    const videosObject = await readJSON(videosJSON);
    const videoBlocks = [];
    for (let key of Object.keys(videosObject)) {
        const {
            previewPath,
            channelAvatarPath,
            title,
            channelName,
            channelIsConfirmed,
            viewsCount,
            likesCount,
            videoTime
        } = videosObject[key];

        const videoBlock = document.createElement('a');
        videoBlock.className = 'video-block__a';
        videoBlock.href = `view.html?id=${key}`;
        videoBlock.innerHTML = `
            <div class="video-block">
                <img src="${previewPath}" alt="preview" class="video-block__video-preview">
                <div class="videos__information">
                    <img src="${channelAvatarPath}" alt="avatar" class="avatar">
                    <div>
                        <p class="video-block__name">${title}</p>
                        <div class="videos__channel-block">
                            <p class="channel">${channelName}</p>
                            <img src="${channelIsConfirmed ? 'images/status/confirmed.svg' : ''}" alt="" class="confirmed">
                        </div>
                    </div>
                </div>
                <div class="video-block__statistic">
                    <p class="video-block__views">${viewsCount} ${getNoun(viewsCount, 'просмотр', 'просмотра', 'просмотров')}</p>
                    <p class="video-block__likes">${likesCount} ${getNoun(likesCount, 'лайк', 'лайка', 'лайков')}</p>
                    <p class="video-block__time">${showTime(videoTime)} назад</p>
            </div>`;
        videoBlocks.push(videoBlock);
    };
    return shuffle(videoBlocks);
};

async function appendVideosIntoARowDOM(count) {
    const videosArray = await generateVideosBlocks();

    const videoRows = document.querySelectorAll('.videos__row');
    videoRows.forEach(entry => entry.remove());
    for (let videoID = 0, videosCount = videosArray.length; videoID < videosArray.length, videosCount > 0;) {
        if (videosCount >= count) {
            const row = document.createElement('div');
            row.className = 'videos__row';
            for (let i = 0; i < count; i++, videoID++, videosCount--) {
                row.append(videosArray[videoID]);
            };
            videosBlock.append(row);
        } else {
            const row = document.createElement('div');
            row.className = 'videos__row';
            const breakMoment = count - (count - videosCount);
            for (let i = 0; i < breakMoment; i++, videoID++, videosCount--) {
                row.append(videosArray[videoID]);
            };
            videosBlock.append(row);
        };
    };
};

function dynamicAdaptedRowsLoadingDOM() {
    let count;
    const width = window.innerWidth;
    if (width > 1870 && !videosBlock.classList.contains('count4')) {
        count = 4;
        videosBlock.classList.remove('count3', 'count2', 'coun1');
        videosBlock.classList.add('count4');
        appendVideosIntoARowDOM(count);
    } else if (width <= 1870 && width > 1550 && !videosBlock.classList.contains('count3')) {
        count = 3;
        videosBlock.classList.remove('count4', 'count2', 'count1');
        videosBlock.classList.add('count3');
        appendVideosIntoARowDOM(count);
    } else if (width <= 1550 && width > 1200 && !videosBlock.classList.contains('count2')) {
        count = 2;
        videosBlock.classList.remove('count3', 'count4', 'count1');
        videosBlock.classList.add('count2');
        appendVideosIntoARowDOM(count);
    } else if (width <= 1200 && !videosBlock.classList.contains('count1')) {
        count = 1;
        videosBlock.classList.remove('count3', 'count2', 'count4');
        videosBlock.classList.add('count1');
        appendVideosIntoARowDOM(count);
    };
};

dynamicAdaptedRowsLoadingDOM();
window.addEventListener('resize', dynamicAdaptedRowsLoadingDOM);