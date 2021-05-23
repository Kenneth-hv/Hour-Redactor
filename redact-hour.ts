// Created by Kenneth Herrera Valverde - 2021

// Defines the words used to generate the minute text
const MINUTE_NUMBERS = {
    1: 'uno',
    2: 'dos',
    3: 'tres',
    4: 'cuatro',
    5: 'cinco',
    6: 'seis',
    7: 'siete',
    8: 'ocho',
    9: 'nueve',
    10: {
        default: 'diez', // For the default value = 10
        comp: 'dieci' // For the composition values = 1X
    },
    11: 'once',
    12: 'doce',
    13: 'trece',
    14: 'catorce',
    15: 'quince',
    20: {
        default: 'veinte', // For the default value = 20
        comp: 'veinti' // For the composition values = 2X
    },
    30: 'treinta',
    40: 'cuarenta',
    50: 'cincuenta',
};

// Defines the words used to generate the hour text
const HOUR_NUMBERS = ['una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'];

// Defines the special cases that bypass the default method
const SPECIAL_CASES = {
    // Those that require hour and minute
    hours: {
        12: {
            0: {
                am: 'Es media noche',
                pm: 'Es medio día'
            }
        },
        1: {
            0: {
                am: 'Es la una en punto de la mañana',
                pm: 'Es la una en punto de la noche'
            }
        },
    },
    // Those that require only the minute
    minutes: {
        0: 'en punto',
        15: 'y cuarto',
        30: 'y media',
    }
};

// For word composition
const AND = 'y';

// Parses an hour with format [hours]:[minutes][am/pm]
function parseHour(hourStr: string): { hour: number, minute: number, pm: boolean } {
    // Lower cases the hourStr
    hourStr = hourStr.toLowerCase();
    // Defines the regular expression for validation 
    const regex = /(1[0-2]|[1-9]):[0-5][0-9](am|pm)$/
    // If the hour string does NOT comply with the regular expression, return null
    if (hourStr.search(regex) != 0) return null;

    // Splits the hour string in lower (before the colon) and upper (after the colon)
    const [lower, upper] = hourStr.split(':');

    // Filters the lower and upper parts with regular expression and extracts the hours, minutes and if it's pm
    const hour = parseInt(lower.match(/[0-9]+/)[0]);
    const minute = parseInt(upper.match(/[0-9]+/)[0]);
    const pm = upper.search(/pm/) != -1;

    // Returns an object with values hour (number), minute (number) and pm (boolean)
    return { hour: hour, minute: minute, pm: pm }
}

// Generates a number text that corresponds to the minutes parameter
function getMinutes(minutes: number): string {
    // If it's a special case return it
    let string = SPECIAL_CASES.minutes[minutes];
    if (string) return string;

    // If it's a direct number defined on the MINUTE_NUMBERS and DOES NOT require composition, return it
    // The value can be on MINUTE_NUMBERS[minutes]?.default or in MINUTE_NUMBERS[minutes]
    string = MINUTE_NUMBERS[minutes]?.default || MINUTE_NUMBERS[minutes];
    if (string) return `${AND} ${string}`;

    // Otherwise, a composition is required

    // The last number left to right
    const minuteUnit = minutes % 10;
    // Using the value of multiple of 10 from the minutes
    // If it has a value in MINUTE_NUMBERS that has .comp
    if (MINUTE_NUMBERS[minutes - minuteUnit]?.comp) {
        // The result is the .comp value from MINUTE_NUMBERS and adds the value from MINUTE_NUMBERS for minuteUnit
        string = `${AND} ${MINUTE_NUMBERS[minutes - minuteUnit]?.comp}${MINUTE_NUMBERS[minuteUnit]}`;
    } else {
        // Othewise, is the value in MINUTE_NUMBERS and the value from MINUTE_NUMBERS for minuteUnit with a AND in between
        string = `${AND} ${MINUTE_NUMBERS[minutes - minuteUnit]} ${AND} ${MINUTE_NUMBERS[minuteUnit]}`;
    }

    // Return the corresponding text ie: 21 -> y veintiuno, 45 -> y cuarenta y cinco
    return string;
}

// Generates a number text that corresponds to the hours parameter
function getHours(hours: number): string {
    // Returns the value from HOUR_NUMBERS at hour minus 1 to index a zero-based array
    return HOUR_NUMBERS[hours - 1];
}

// Generates the redacted text from an hour
function redactHour(hourStr: string) {
    // Parses the hourStr
    const hour = parseHour(hourStr);

    // If the result is null, the hour is not valid
    if (!hour) return 'Hora no válida.';

    // Handles the special cases
    // If there is a special case for the hour:minute am/pm, return it
    let specialCase = SPECIAL_CASES.hours[hour.hour]?.[hour.minute]?.[hour.pm ? 'pm' : 'am'];
    if (specialCase) return specialCase;

    // Joins the results from the getHours(...) and getMinutes(...)
    let result = `Son las ${getHours(hour.hour)} ${getMinutes(hour.minute)}`;

    // Adds the value whether it is morning, afternoon or night
    if (hour.pm && hour.hour >= 6) {
        result += ' de la noche';
    } else if (hour.pm) {
        result += ' de la tarde';
    } else {
        result += ' de la mañana';
    }

    // Return the redacted hour
    return result;
}

// Examples of use
// console.log(redactHour('12:23pm'));
// console.log(redactHour('12:01pm'));
// console.log(redactHour('12:00pm'));
// console.log(redactHour('1:01pm'));

console.log(redactHour(process.argv[2]));