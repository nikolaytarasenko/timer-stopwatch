window.onload = function() {
    init();
};

function init() {
    let tabLinks = document.querySelectorAll('.tab-links');
    let tabsContent = document.querySelectorAll('.tab-content');

    // add a listener to tabs
    Array.from(tabLinks).forEach(tab => {
        tab.addEventListener('click', selectTabHandler);
    });

    // tab click event implementation
    function selectTabHandler(e) {
        if (e.target.classList.contains('tab-links')) {
            let target = e.target;

            Array.from(tabLinks).forEach(tab => {
                tab.classList.remove('active');
            });

            target.classList.add('active');

            const activeTab = Array.from(tabsContent).find(tab => tab.id === target.dataset.name);

            Array.prototype.forEach.call(tabsContent, function(tab) {
                tab.classList.add('js-hidden');
            });

            activeTab.classList.remove('js-hidden');
        }
    }
}

// get control form and inputs
const form = document.querySelector('.timer-controls');

const inputHours = document.getElementById('timer-hours');
const inputMinutes = document.getElementById('timer-minutes');
const inputSeconds = document.getElementById('timer-seconds');

// get timer outputs
const hours = document.querySelector('.timer-output-hours');
const minutes = document.querySelector('.timer-output-minutes');
const seconds = document.querySelector('.timer-output-seconds');

// add a listeners to control form
form.addEventListener('input', controlsInputHandler);
form.addEventListener('focusout', controlsBlurHandler);
form.addEventListener('keypress', controlsInputValidate);

// inputs validation
function controlsInputValidate(e) {
    let pattern = /[0-9]/;

    if (!e.key.match(pattern)) e.preventDefault();
}

// display of values entered in settings
function controlsInputHandler(e) {
    switch(e.target.id) {
        case 'timer-hours':
            hours.textContent = e.target.value;
            break;
        case 'timer-minutes':
            minutes.textContent = e.target.value;
            break;
        case 'timer-seconds':
            seconds.textContent = e.target.value;
            break;
    }
}

// filling fields when the focus is lost
function controlsBlurHandler(e) {
    if (e.target.value.length === 0) {
        e.target.value = '00';
        controlsInputHandler(e);
    } else if (e.target.value.length === 1) {
        e.target.value = '0' + e.target.value;
        controlsInputHandler(e);
    }
}

// timer buttons implementation
let startButton = document.getElementById('timer-start');
let stopButton = document.getElementById('timer-stop');
let resetButton = document.getElementById('timer-reset');

startButton.addEventListener('click', startTimer);

// start timer
function startTimer() {
    let currHours = +hours.textContent;
    let currMinutes = +minutes.textContent;
    let currSeconds = +seconds.textContent;

    if (inputHours.value.length === 0 && inputMinutes.value.length === 0 && inputSeconds.value.length === 0) {
        alert('enter at least one value');
        return false;
    } else if (inputHours.value === '00' && inputMinutes.value === '00' && inputSeconds.value === '00') {
        alert('enter at least one value');
        return false;
    } else {
        inputHours.setAttribute('disabled', 'true');
        inputMinutes.setAttribute('disabled', 'true');
        inputSeconds.setAttribute('disabled', 'true');

        // get the remaining time
        function getTimeRemaining(endtime) {
            const t = Date.parse(endtime) - Date.parse(new Date());
            const seconds = Math.floor((t / 1000) % 60);
            const minutes = Math.floor((t / 1000 / 60) % 60);
            const hours = Math.floor((t / (1000 * 60 * 60)));
            const days = Math.floor(t / (1000 * 60 * 60 * 24));
            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        }

        function initializeTimer(deadline) {

            function updateTimer() {
                let total = getTimeRemaining(deadline);

                hours.textContent = String(total.hours).length === 2 ? ('0' + total.hours).slice(-2) : ('0' + total.hours).slice(-3);
                minutes.textContent = ('0' + total.minutes).slice(-2);
                seconds.textContent = ('0' + total.seconds).slice(-2);

                if (total.total === 0) {
                    clearInterval(interval);
                    document.querySelector('.timer-wrapper').style.color = 'silver';
                    startButton.setAttribute('disabled', 'true');
                }
            }

            updateTimer();
            let interval = setInterval(updateTimer, 1000);

            // stop timer
            stopButton.addEventListener('click', function() {
                stopTimer(interval);
            });

            // reset timer
            resetButton.addEventListener('click', function() {
                stopTimer(interval);
                resetTimer(hours, minutes, seconds);
                inputHours.removeAttribute('disabled');
                inputMinutes.removeAttribute('disabled');
                inputSeconds.removeAttribute('disabled');
                startButton.removeAttribute('disabled');
                document.querySelector('.timer-wrapper').style.color = '#000000';
            });
        }

        // create deadline
        let deadline = new Date();
        deadline.setHours(deadline.getHours() + currHours);
        deadline.setMinutes(deadline.getMinutes() + currMinutes);
        deadline.setSeconds(deadline.getSeconds() + currSeconds);

        // first timer initialization
        initializeTimer(deadline);
    }
}

// stop timer function
function stopTimer(interval) {
    clearInterval(interval);
}

// reset timer function
function resetTimer(hours, minutes, seconds) {
    hours.textContent = inputHours.value = '00';
    minutes.textContent = inputMinutes.value= '00';
    seconds.textContent = inputSeconds.value = '00';
}