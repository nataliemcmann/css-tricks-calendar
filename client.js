console.log('script sourced');

//function for calendar element
//it will take an object as an argument 
function calendarElement(settings={}) {
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
    )

    /* Padding adds a string to another string so the result matches
    a desired length.  In this case, because months have at max two 
    numerical characters, the months 1-9 need a zero before them to 
    match the spacing of 10-12*/
    const pad = (val) => (val + 1).toString().padStart(2, '0');
    
    //function will return this upon render
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
            <!-- The year is displayed next to it as an italicized -->
            <i>${year}</i>
        </time>
        <!-- Unorder list of weekday names -->
        <ul>${weekdays(config.info.firstDay, locale).map(name => `
            <!-- Each weekday has a long month title but abbreviated render-->
            <li>
                <abbr title="${name.long}">${name.short}</abbr>
            </li>`).join('')}
        </ul>        

    </div>
    `
};

//if no date is in the settings object, we render the default date
const date = config.date ? new Date(config.date) : today;

/* Now we implement the international locale api that is built into JS
in this code block, if config.info does not already exist, we grab the 
weekInfor from Intl.Locale information based off of the locale that the
config object grabs
*/
if (!config.info) config.info = new Intl.Locale(config.locale).weekInfo || {
    /* by default we'll set the calendar to USA, meaning the first day 
    is Sunday */
    firstDay: 7,
    //and the weekend is Saturday/Sunday
    weekend: [6, 7]
}; 

//now we create a render function that takes our date and config information
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
};


//helper function to call all versions of the weekdays
const weekdays = (firstDay, locale) => {
    const date = new Date(0);
    const arr = [...Array(7).keys()].map(i => {
        date.setDate(5 + i)
        return {
            long: new Intl.DateTimeFormat([locale], { weekday: 'long'.format(date),
            
        })
        }
    })
}





