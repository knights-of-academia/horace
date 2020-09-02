// TODO Documentation.

const monthsData = require('../data/monthsData.js');
const errors = require('../helpers/remindErrors.js')

function resetSecondsAndMilliseconds(date) {
    date.setMilliseconds(0);
    date.setSeconds(0);

    return date;
}

function addToDate(date, amountToAdd, whatToAdd) {
    let result = new Date(resetSecondsAndMilliseconds(date));

    switch (whatToAdd) {
        case 'minute':
        case 'minutes':
            result.setMinutes(result.getMinutes() + amountToAdd);
            break;
        case 'hour':
        case 'hours':
            result.setHours(result.getHours() + amountToAdd);
            break;
        case 'day':
        case 'days':
            result.setDate(result.getDate() + amountToAdd);
            break;
        case 'month':
        case 'months':
            result.setMonth(result.getMonth() + amountToAdd);
            break;
        case 'year':
        case 'years':
            result.setFullYear(result.getFullYear() + amountToAdd);
            break;
        default:
            throw new errors.NonmatchingInputValidationError('The unit (minutes, hours, ...) could\'nt be parsed correctly.');
    }

    return result;
}

function parseDateForListing(date) {
    let whichDay = date.getDate();

    let whichMonth = '';
    for (let month in monthsData) {
        if (monthsData[month]['number'] === date.getMonth()) {
            whichMonth = monthsData[month]['fullname'];
        }
    }

    let whichHour = date.getHours();
    let amOrPm;
    if (whichHour === 0) {
        whichHour = 12;
        amOrPm = 'AM';
    } else if (whichHour <= 12) {
        amOrPm = 'AM';
    } else {
        whichHour -= 12;
        amOrPm = 'PM';
    }

    let whichMinute = date.getMinutes().toString();
    if (whichMinute.length === 1) {
        whichMinute = '0' + whichMinute;
    }

    return `${whichHour}:${whichMinute} ${amOrPm} on ${whichMonth} ${whichDay}`;
}

module.exports.resetSecondsAndMilliseconds = resetSecondsAndMilliseconds;
module.exports.addToDate = addToDate;
module.exports.parseDateForListing = parseDateForListing;