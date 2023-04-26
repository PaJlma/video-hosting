const mainBlock = document.querySelector('.video');
const textarea = document.querySelector('.commentaries__text-area');
const submitButton = document.querySelector('.commentaries__submit');
const commentariesBlock = document.querySelector('.commentaries');
const input = document.querySelector('.commentaries__text-area');
const commentariesCounter = document.querySelector('.commentaries__count');
const commentariesCount = document.querySelectorAll('.commentaries__case').length;
const videoTitle = document.querySelector('.video__title');
const videoLikes = document.querySelector('#video_likes');
const videoDislikes = document.querySelector('#video_dislikes');
const descriptionField = document.querySelector('.description__text');
const subscribersCountField = document.querySelector('.channel__subscribers');
const channelNameField = document.querySelector('.channel__name');
const channelAvatarField = document.querySelector('.channel__avatar');
const videoField = document.querySelector('.vs-video');
const viewsField = document.querySelector('.views__text');
const videoSidebars = document.querySelectorAll('.video-sidebar');
const dateField = document.querySelector('#video-time');
const videoJSON = 'json/videos.json';
const channelJSON = 'json/channels.json';

const rawURLParams = window.location.search
const videoID = rawURLParams.slice(rawURLParams.indexOf('=')+1)

// Функция склонения слов относительно числа
function getNoun(number, one, two, five) {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
        return five;
    }
    n %= 10;
    if (n === 1) {
        return one;
    }
    if (n >= 2 && n <= 4) {
        return two;
    }
    return five;
};

function asyncCachingDecorator(callback) {
    const cache = new Map();
    return async function(argument) {
        if (cache.has(argument)) {
            return cache.get(argument);
        } else {
            const result = await callback.call(this, argument);
            cache.set(argument, result);
            return result;
        };
    };
};

// Функция чтения JSON файла
async function readJSON(filePath) {
    const response = await fetch(filePath);
    if (response.status === 200) {
        return response.json();
    } else {
        throw new Error('Error. Response status is not 200.');
    };
};

// Функция, позволяющая сделать комментарий
function madeCommentary(commentaryText) {
    if(commentaryText.length > 0) {
        const div = document.createElement('div');
        div.className = "commentaries__case";
        div.innerHTML = `<a href="#" class="commentaries__a"><img src="../images/user.png" alt="avatar" class="commentaries__avatar"></a>
                    <div class="commentaries__block">
                        <div class="commentaries__info">
                            <a href="#" class="commentaries__a"><p class="commentaries__nick">Гость</p></a>
                            <p class="commentaries__time">Только что</p>
                        </div>
                        <p class="commentaries__text">${commentaryText}</p>
                        <div class="commentaries__reputation">
                            <img src="../images/like.svg" alt="like" class="commentaries__like">
                            <img src="../images/dislike.svg" alt="dislike" class="commentaries__dislike">
                            <button class="commentaries__answer">Ответить</button>
                        </div>
                    </div>`;
        commentariesBlock.append(div);
        input.value = '';
        const commentariesCount = document.querySelectorAll('.commentaries__case').length

        commentariesCounter.innerHTML = `${commentariesCount} ${getNoun(commentariesCount, 'комментарий', 'комментария', 'комментариев')}`;
    }
}

// Функция случайного перемешивания массива
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Функция возвращающая дату в формате "1 Января 2023 год"
function getfullDate(videoTime) {
    const timeArr = videoTime.split(' ');
    const year = timeArr[0];
    let month = timeArr[1];
    const day = timeArr[2];

    const months = {
        1: 'января',
        2: 'февраля',
        3: 'марта',
        4: 'апреля',
        5: 'мая',
        6: 'июня',
        7: 'июля',
        8: 'августа',
        9: 'сентября',
        10: 'октября',
        11: 'ноября',
        12: 'декабря',
    }

    return `${day} ${months[month]} ${year} год`;
}

function showTime(videoTime) {
    const now = new Date()
    let videoTimeArr = videoTime.split(" ").map(Number);

    let videoDate = new Date(videoTimeArr[0], videoTimeArr[1]-1, videoTimeArr[2], videoTimeArr[3], videoTimeArr[4], videoTimeArr[5]);

    let diffMs = now - videoDate;

    let timeAgo = {
        seconds: Math.floor(diffMs / 1000),
        get minutes() { return Math.floor(this.seconds / 60) },
        get hours() { return Math.floor(this.minutes / 60) },
        get days() { return Math.floor(this.hours / 24) },
        get weeks() { return Math.floor(this.days / 7) },
        get months() { return Math.floor(this.weeks / 4) },
        get years() { return Math.floor(this.months / 12) },

        get timeToShow() {
            if (this.years != 0) {
                return `${this.years} лет`
            } else if (this.months > 0) {
                return `${this.months} месяцев`
            } else if (this.weeks > 0) {
                return `${this.weeks} недель`
            } else if (this.days > 0) {
                return `${this.days} дней`
            } else if (this.hours > 0) {
                return `${this.hours} часов`
            } else if (this.minutes > 0) {
                return `${this.minutes} минут`
            } else {
                return `${this.seconds} секунд`
            }
        }
    };
    const {timeToShow} = timeAgo;

    return timeToShow;
}

async function generateViewPage() {
    const videosObject = await readJSON(videoJSON);
    const channelsObject = await readJSON(channelJSON);

    fillValuesIntoHTMLDOM(videosObject, channelsObject);
    generateCommentariesDOM(videosObject);
    videoSidebars[0].append(...generateVideoSidebarCasesDOM(videosObject, channelsObject));
    videoSidebars[1].append(...generateVideoSidebarCasesDOM(videosObject, channelsObject));
    // Изменение высоты блока ввода комментария относительно написанного кол-ва строк
    textarea.addEventListener('keydown', function () {
        this.style.cssText = 'height:auto; padding:9px';
        this.style.cssText = 'height:' + this.scrollHeight + 'px';
    })

    // Сделать комментарий, нажимая кнопку
    submitButton.addEventListener('click', () => {
        let commentaryText = input.value
        madeCommentary(commentaryText);
    });
};

async function fillValuesIntoHTMLDOM(videoObject, channelObject) {
    let {
        title, 
        description, 
        likesCount, 
        dislikesCount, 
        videoPath, 
        viewsCount, 
        channelID, 
        videoTime
    } = videoObject[videoID];
    description = description.replaceAll(`\n`, `<br>`);
    videoField.src = videoPath; // Ссылка на видео
    videoTitle.innerHTML = title; // Название видео
    dateField.innerHTML = getfullDate(videoTime) // Дата выхода видео
    videoLikes.innerHTML = likesCount; // Количество лайков
    videoDislikes.innerHTML = dislikesCount; // Количество дизлайков
    descriptionField.innerHTML = description; // Описание видео
    viewsField.innerHTML = `${viewsCount} ${getNoun(viewsCount, 'просмотр', 'просмотра', 'просмотров')}`; // Количество просмотров
    commentariesCounter.innerHTML = `${commentariesCount} ${getNoun(commentariesCount, 'комментарий', 'комментария', 'комментариев')}`; // Количество комментариев

    let {
        subscribersCount, 
        channelAvatarPath, 
        channelName,
    } = channelObject[channelID];
    subscribersCountField.innerHTML = `${subscribersCount} ${getNoun(subscribersCount, 'подписчик', 'подписчика', 'подписчиков')}`;
    channelAvatarField.src = channelAvatarPath;
    channelNameField.innerHTML = channelName;
}

function generateCommentariesDOM(videoObject) {
    if (videoObject[videoID]?.commentaries !== undefined) {
        Object.defineProperty(videoObject[videoID].commentaries, "count", {enumerable: false});
        for(let commentary of Object.values(videoObject[videoID].commentaries)) {
            let {
                nick, 
                avatarPath, 
                timeAgo, 
                text
            } = commentary;
            let commentaryElement = document.createElement('div');
            commentaryElement.classList.add('commentaries__case');
            commentaryElement.innerHTML = `
                            <a href="#" class="commentaries__a"><img src="${avatarPath}" alt="avatar" class="commentaries__avatar"></a>
                            <div class="commentaries__block">
                                <div class="commentaries__info">
                                    <a href="#" class="commentaries__a"><p class="commentaries__nick">${nick}</p></a>
                                    <p class="commentaries__time">${timeAgo} назад</p>
                                </div>
                                <p class="commentaries__text">
                                    ${text}
                                </p>
                                <div class="commentaries__reputation">
                                    <img src="../images/like.svg" alt="like" class="commentaries__like">
                                    <img src="../images/dislike.svg" alt="dislike" class="commentaries__dislike">
                                    <button class="commentaries__answer">Ответить</button>
                                </div>
                            </div>`;
            commentariesBlock.append(commentaryElement);
        };
    };
};

function generateVideoSidebarCasesDOM(videoObject, channelObject) {
    let videoSidebarCases = [];
    for (let value of Object.keys(videoObject)) {
        let {
            previewPath, 
            title, 
            viewsCount, 
            timeAgo, 
            channelID, 
            ID, 
            videoTime
        } = videoObject[value];
    
        if (value === videoID) {
            continue
        } else {
            let {channelName} = channelObject[channelID];
            let videoSidebarCase = document.createElement('a');
            videoSidebarCase.classList.add('video-sidebar__a');
            videoSidebarCase.href = `?id=${ID}`
            videoSidebarCase.innerHTML = `
                <div class="video-sidebar__case case">
                    <img src="${previewPath}" alt="video" class="case__img">
                    <div class="case__text-block">
                        <p class="case__title">${title}</p>
                        <p class="case__channel">${channelName}</p>
                        <div class="case__views-block">
                            <div class="case__views">${viewsCount} ${getNoun(viewsCount, 'просмотр', 'просмотра', 'просмотров')}</div>
                            <div class="case__views">${showTime(videoTime)} назад</div>
                        </div>
                    </div>
                </div>`

            videoSidebarCases.push(videoSidebarCase);
        }
    }
    return shuffle(videoSidebarCases);
}

generateViewPage();