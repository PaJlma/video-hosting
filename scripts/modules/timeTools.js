// Функция возвращающая дату в формате "1 Января 2023 год"
export function getfullDate(videoTime) {
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

export function showTime(videoTime) {
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