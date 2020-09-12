const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const daynames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
let data;
let lat;
let lon;
let settingsShown = false;
let forecastData;
function getLocation() {
    $("#loader").show();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    console.log(`Latitude: ${lat}`);
    console.log(`Longitude: ${lon}`);
    $("#loader").hide();
    getDegrees();
}

function getDegrees(city) {
    let link;
    if (city) {
        link = `http://api.openweathermap.org/data/2.5/weather?&units=metric&q=${city}&appid=77242eeb9b98429295635122f921980d`;
    }
    else {
        link = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&units=metric&lon=${lon}&appid=77242eeb9b98429295635122f921980d`;
    }
    $.get(link, (info) => {
        data = info;
        $("#info").show();
        $("#temperature").html(data.main.temp);
        getDate();
        getArea();
        getForecast();
        $("#loader").hide();
    })
}

function getArea() {
    $("#area").html(data.name)
}

function getDate() {
    let d = new Date();
    $("#date").html(`${daynames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`);
}

function getForecast() {
    $("#forecasttitle").show();
    $("#forecast").show();
    forecastLink = `https://api.openweathermap.org/data/2.5/onecall?units=metric&lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=77242eeb9b98429295635122f921980d`
    $.get(forecastLink, (info) => {
        forecastData = info;
        getImages();
    })
}

function getImages() {
    let now = new Date;
    let today = now.toLocaleDateString();
    let tomorrow = new Date(now.getTime() + 86400000).toLocaleDateString();
    for (let i = 0; i < 8; i++) {
        let time = new Date(forecastData.daily[i].dt * 1000);
        let image = `http://openweathermap.org/img/wn/${forecastData.daily[i].weather[0].icon}@2x.png`;
        $(`#forecasticon${i + 1}`).attr("src", image);
        $(`#forecasthigh${i + 1}`).html(`${forecastData.daily[i].temp.max}°C`);
        $(`#forecastlow${i + 1}`).html(`${forecastData.daily[i].temp.min}°C`);
        if (time.toLocaleDateString() === today) {
            $(`#forecastdate${i + 1}`).html("Today");
        }
        else if (time.toLocaleDateString() === tomorrow) {
            $(`#forecastdate${i + 1}`).html("Tomorrow");
        }
        else {
            $(`#forecastdate${i + 1}`).html(daynames[time.getDay()])
        }
    }

}

function toggleMenu() {
    if (settingsShown) {
        $("#myDropdown").fadeToggle("slow");
        $("#settingstooltiptext").show();
        $("#info").css('filter', 'blur(0px)');
    }
    else {
        $("#myDropdown").fadeToggle("slow");
        $('#myDropdown').css('display', 'flex'); 
        $("#settingstooltiptext").hide();
        $("#info").css('filter', 'blur(5px)');

    }
    settingsShown = !settingsShown;
}

getLocation();

$("#search").on('keypress', function (e) {
    if (e.key === 'Enter') {
        $("#loader").show();
        getDegrees($("#search").val());
        $("#search").val("")
        setTimeout(() => {
            $("#forecast").hide();
            $("#forecasttitle").hide();
        }, 500);
    }
});