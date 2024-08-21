import { monthNames, daysInWeek, ticksInDay, weekDaysAbbreviaions } from "../constants/TimeConstants";

/**
 * Для данной даты возвращает строку в формате число месяц ("1 января")
 * @param {Date} date 
 * @returns {String}
 */
export function getTheDateAndMonthString(date) {
    const day = date.getDate();
    const month = monthNames[date.getMonth()];

    return `${day} ${month}`;
}

/**
 * Для данной даты возвращает строку в формате число день недели (1 Пн)
 * @param {Date} date
 * @returns {String}
 */
export function getTheDateAndDayString(date) {
    const dateDay = date.getDate();
    const weekDay = weekDaysAbbreviaions[date.getDay()];

    return `${weekDay} ${dateDay}`
}

/**
 * Для данной даты возвращает строку в формате число (31)
 * @param {Date} date
 * @returns {String}
 */
export function getTheDate(date) {
    return getTheDateAndDayString(date ).split(' ')[1];
}

/**
 * Для данной даты возвращает денб недели формате абр. (ПТ)
 * @param {Date} date
 * @returns {String}
 */
export function getTheWeekDay(date) {
    return getTheDateAndDayString(date).split(' ')[0];
}

/**
   * Вовзращает номер дня недели в российском формате
   * @param {Date} date
   * @returns {Number} 1 - понедельник, 2 - второник ..., 7 - воскресенье
   */
export function getDateDayLocalNumber(date) {
    return date.getDay() === 0 ? daysInWeek : date.getDay();
}

/**
 * Возвращает дату начала дня данной даты
 * @param {Date} date
 * @returns {Date} 
 */
export function getDayStart(date) {
    const _date = new Date(date.getTime());
    _date.setHours(0, 0, 0, 0);
    return _date;
}

/**
 * Возвращает дату конца дня данной даты
 * @param {Date} date
 * @returns {Date} 
 */
export function getDayFinish(date) {
    const _date = new Date(date.getTime());
    _date.setHours(23, 59, 59, 999);
    return _date;
}

/**
 * Для данной даты получает неделю, к которой принадлежит эта дата, и возвращает начало k-ого дня этой недели 
 * @param {Date} date
 * @param {Number} k 1..7
 * @returns {Date}
 */
export function getTheDateOfTheKthDayOfTheDateWeek(date, k) {
    date = getDayStart(date);
    const shift = (k - getDateDayLocalNumber(date)) * ticksInDay;

    return new Date(date.getTime() + shift);
}

/**
 * Получения свойств недели, к которой принадлежит дата
 * @param {Date} date 
 * @returns {{ startDate: Date, finishDate: Date, daysList: [Date]}}
 */
export function getDateWeekProperty(date) {
    const startDate = getTheDateOfTheKthDayOfTheDateWeek(date, 1);
    const finishDate = getDayFinish(getTheDateOfTheKthDayOfTheDateWeek(date, 7));

    const daysList = new Array(daysInWeek);

    for (let i = 0; i < daysList.length; i++) {
        daysList[i] = new Date((startDate.getTime() + i * ticksInDay));
    }

    return {
        startDate, finishDate, daysList
    }
}

/**
 * Получения списка неделей внутри месяца
 * @param {Date} date
 * @returns {Array<getDateWeekProperty()>}
 */
export function getMonthWeeks(date) {
    let start = new Date(date.getFullYear(), date.getMonth());

    const res = [];

    while (true) {
        const tmp = getDateWeekProperty(start);

        if (tmp.startDate.getMonth() !== date.getMonth() && tmp.finishDate.getMonth() !== date.getMonth()) {
            break
        }

        res.push(tmp);
        start = new Date(start.getTime() + daysInWeek * ticksInDay);
    }

    return res;
}