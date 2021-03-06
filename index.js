var currentRawData = "";

var daysLabel = document.getElementById("days");
var hoursLabel = document.getElementById("hours");
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");

var lastServiceLabel = document.getElementById("last-service");
var serviceCountLabel = document.getElementById("service-count");
var totalSeconds = 0;
var firework = JS_FIREWORKS.Fireworks({
        id : 'fireworks-canvas',
        hue : 120,
        particleCount : 50,
        delay : 0,
        minDelay : 20,
        maxDelay : 40,
        boundaries : {
            top: 50,
            bottom: 240,
            left: 50,
            right: 590
        },
        fireworkSpeed : 2,
        fireworkAcceleration : 1.05,
        particleFriction : .95,
        particleGravity : 1.5
    });

function start(initSeconds, lastService, serviceCount) {
    setupFirework();
    totalSeconds = initSeconds
    lastServiceLabel.innerHTML = lastService;
    serviceCountLabel.innerHTML = serviceCount;
    setInterval(setTime, 1000);
    setData();
}

function setupFirework() {
    var canvas = document.getElementById('fireworks-canvas');
    canvas.style.top = (window.innerHeight - canvas.height) + 'px';
    canvas.style.left = (window.innerWidth - canvas.width) / 2 + 'px';
}

function setData() {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() { 
        if (request.readyState == 4 && request.status == 200){
            var rawData = request.responseText;
            if (rawData !== currentRawData) {
                var result = JSON.parse(rawData);

                totalSeconds = getSeconds(new Date() - new Date(result.release_day));
                lastServiceLabel.innerHTML = result.last_service;
                serviceCountLabel.innerHTML = result.services_count;

                if (result.last_service === "Evrika.IB.OrganizationDispatcherService" || result.last_service === "Evrika.Domain.Staff.Service") {
                    setupFirework();
                    firework.start();
                } else {
                    firework.stop();
                }

                currentRawData = rawData;
            }
        }
    }

    request.open("GET", "https://raw.githubusercontent.com/evrikaclock/evrikaclock.github.io.db/master/db.json", true);
    request.send(null);

    setTimeout(setData, 60 * 1000);
}

function getSeconds(date) {
    return Math.floor(date / 1000);
}

function setTime() {
    ++totalSeconds;

    var parts = normalizeTime(totalSeconds);

    daysLabel.innerHTML = pad(parts[0]);
    hoursLabel.innerHTML = pad(parts[1]);
    minutesLabel.innerHTML = pad(parts[2]);
    secondsLabel.innerHTML = pad(parts[3]);
}

function normalizeTime(totalSeconds) {
    var days = Math.floor(totalSeconds / 86400);
    totalSeconds = totalSeconds % 86400;

    var hours = Math.floor(totalSeconds / 3600);
    totalSeconds = totalSeconds % 3600;

    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;

    return [days, hours, minutes, seconds];
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}