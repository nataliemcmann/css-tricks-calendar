console.log('script sourced');

//function for calendar element
//it will take an object as an argument 
function calendarElement(settings={}) {
    //render function that takes our date and config information
    //as arguments
    const render = (date, locale)  => {
        //get the month from the configured date
        const month = date.getMonth();
        //get the year from the configured date
        const year = date.getFullYear();
        //get the number of days in that month based off of the year and month
        const numberOfDays = new Date(year, month + 1, 0).getDate();
        //Boolean to check whether today's date is in the month that is about to be 
        //rendered
        const renderToday = (year === config.today.year) && (month === config.today.month);

        return `
        <!-- First div is the calendar wrapper -->
        <div 
            aria-label="calendar" 
            class="calendar-wrapper" 
            data-firstday="${ config.info.firstDay }"
        >
            <!-- The time element specifies the month heading -->
            <time datetime="${year}-${(pad(month))}">
                ${new Intl.DateTimeFormat(locale, { month: 'long'}).format(date)}
                <!-- The year is displayed next to it as italicized -->
                <i>${year}</i>
            </time>
            <!-- Unordered list of weekday names -->
            <ul>${weekdays(config.info.firstDay, locale).map(name => `
                <!-- Each weekday has a long month title but abbreviated render-->
                <li>
                    <abbr title="${name.long}">${name.short}</abbr>
                </li>`).join('')}
            </ul>        
    
        </div>
        `
    };
};

//helper elements 

//create a ref for current date
const today = new Date();

/* configuration that is combined with settings parameter
to determine the style of the calendar based on the 
locale of the html lang tag (if it exists) 
the lang will determine what style of calendar to render
(because everywhere has different "starts" to the week) */
const config = Object.assign(
    {
        //grab lang, default to US if none
        locale: (document.documentElement.getAttribute('lang' || 'en-US')),
        //get today
        today: {
            //get the date
            day: today.getDate(),
            //the month
            month: today.getMonth(),
            //the year
            year: today.getFullYear(),
        }
    }, settings
);

//if no date is in the settings object, we render the default date
const date = config.date ? new Date(config.date) : today;

/* Now we implement the international locale api that is built into JS
in this code block, if config.info does not already exist, we grab the 
weekInfo from Intl.Locale information based off of the locale that the
config object grabs
*/
if (!config.info) config.info = new Intl.Locale(config.locale).weekInfo || {
    /* by default we'll set the calendar to USA, meaning the first day 
    is Sunday */
    firstDay: 7,
    //and the weekend is Saturday/Sunday
    weekend: [6, 7]
}; 

/* Padding adds a string to another string so the result matches
    a desired length.  In this case, because months have at max two 
    numerical characters, the months 1-9 need a zero before them to 
    match the spacing of 10-12*/
const pad = (val) => (val + 1).toString().padStart(2, '0');


/* helper function to call all versions of the weekdays (long & short)
it takes firstDay from our config.info and the config.locale to determine
the names of the days of the week */
const weekdays = (firstDay, locale) => {
    //sets the date to Dec 31 1969 (unclear why)
    const date = new Date(0);
    //creates an array with seven indices and maps through it
    const arr = [...Array(7).keys()].map(i => {
        //sets day to a new day based on the current index
        date.setDate(5 + i)
        return {
                //an object is created that contains the 
                //full name of the day of the week
                long: new Intl.DateTimeFormat([locale], 
                    { weekday: 'long'.format(date),
                //and abbreviated name of the day of the week
                short: new Intl.DateTimeFormat([locale], 
                    { weekday: 'short'}).format(date)
            })
        }
    })
    //this last loop shifts the first day of the week to the front
    for (let i = 0; i < 8 - firstDay; i++) arr.splice(0, 0, arr.pop());
    return arr;
}

/* Helper function to get the numbers of the weeks based off the day numbers*/
function getWeekNumber(cur) {
    /* create a date that contains the milliseconds since the epoch 
     from the cur provided */
    const date = new Date(cur.getTime());
    //set the hours to 0 
    date.setHours(0, 0, 0, 0);
    /* sets the date to a day by adding 3 to the day that date currently is
    and subtracting the remainder of the day of the week divided by 7
    */
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    //create week from the year of the new date on the first month on the 4th day
    const week = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(
        ((date.getTime() - week.getTime())/ 86400000 - 3 + 
        (week.getDay() + 6) % 7) / 7);
}





