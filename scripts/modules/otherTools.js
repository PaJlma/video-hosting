// Функция склонения слов относительно числа
export function getNoun(number, one, two, five) {
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

// Функция случайного перемешивания массива
export function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

export function asyncCachingDecorator(callback) {
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