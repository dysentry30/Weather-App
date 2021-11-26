let weather = [];
let title = "";
let firstWeather;
const selector = (elt) => {
    return {
        focus: () => {
            document.querySelector(elt).focus();
        },
        addClass: (className) => {
            document.querySelector(elt).classList.add(className);
        },
        setAtribute: (key, value) => {
            document.querySelector(elt).setAttribute(key, value);
        },
        removeClass: (className) => {
            document.querySelector(elt).classList.remove(className);
        },
        innerHTML: (stringHTML) => {
            document.querySelector(elt).innerHTML = stringHTML;
        },
        textContent: (string) => {
            document.querySelector(elt).textContent = string;
        },
        addEventListener: (type, callback) => {
            document
                .querySelector(elt)
                .addEventListener(type, (e) => callback(e));
        },
        style: document.querySelector(elt).style,
        value: document.querySelector(elt).value,
    };
};
const selectors = (elt) => {
    return {
        forEach: (callback) => {
            document.querySelectorAll(elt).forEach((e) => callback(e));
        },
        addEventListener: (type, callback) => {
            document
                .querySelectorAll(elt)
                .addEventListener(type, (e) => callback(e));
        },
    };
};

const myFetch = async ({url, body}) => {
    let result;
    if (body) {
        result = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Host: "https://weather-app-simple-clone.herokuapp.com/",
                // "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(...body),
        }).then((resolve) => resolve.json());
    } else {
        result = await fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Host: "https://weather-app-simple-clone.herokuapp.com/",
                // "Access-Control-Allow-Origin": "*",
            },
        }).then((resolve) => resolve.json());
    }
    return result;
};

const headerShowData = (title, object, f = false) => {
    let temp = 0;
    selector("#location").textContent(`${title} now`);
    selector("#state").textContent(object.weather_state_name);
    selector("#header-img").setAtribute(
        "src",
        `./assets/${object.weather_state_name}.jpg`
    );
    if (f) {
        temp = Math.floor((9 / 5) * object.the_temp + 32);
        selector("#temp").textContent(`${Math.floor(temp)} ℉`);
    } else {
        selector("#temp").textContent(`${Math.floor(object.the_temp)} ℃`);
    }
};

const cardsShowData = (object, f = false) => {
    let html = "";
    object.forEach((weather) => {
        let date = new Date(weather.created).toLocaleTimeString();
        let temp = "";
        if (f) {
            temp = `${Math.floor((9 / 5) * weather.the_temp + 32)} ℉`;
        } else {
            temp = `${Math.floor(weather.the_temp)} ℃`;
        }
        html += `<div class="card">
        <img
            src="./assets/${weather.weather_state_name}.jpg"
            alt="${weather.weather_state_name}"
            class="content-img"
        />
        <div class="card-content">
            <h6 class="state">${weather.weather_state_name}</h6>
            <h4 class="temp">${temp}</h4>
            <h6 id="location">${date}</h6>
        </div>
    </div>`;
    });
    selector(".main-content").innerHTML(html);
};

selector(".settingBtn").addEventListener("click", (e) => {
    selector(".background").style.left = "0%";
    setTimeout(() => {
        selector(".sidebar").style.left = "80%";
    }, 400);
});

selector(".close").addEventListener("click", (e) => {
    selector(".sidebar").style.left = "100%";
    setTimeout(() => {
        selector(".background").style.left = "100%";
    }, 400);
});

selector("#tempCheckbox").addEventListener("click", (e) => {
    const checked = e.target.checked;
    if (checked) {
        headerShowData(title, firstWeather, checked);
        cardsShowData(weather, checked);
    } else {
        headerShowData(title, firstWeather);
        cardsShowData(weather, checked);
    }
});

selector("#search-btn").addEventListener("click", (e) => {
    selector(".search-content").style.top = "30px";
    setTimeout(() => {
        selector("#search").focus();
    }, 820);
    selector("#search").addEventListener("blur", (e) => {
        selector(".search-content").style.top = "-200px";
    });
});

selector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    selector(".loading").style.display = "";
    setTimeout(() => {
        selector(".loading").style.opacity = "1";
    }, 100);
    const query = selector("#search").value.trim().toString();
    const [location] = await myFetch({
        url: `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${query}`,
    });
    if (location) {
        getWeather(location.woeid);
        selector(".search-content").style.top = "-200px";
    } else {
        selector(".search-content").style.top = "-200px";
        selector(".loading").style.opacity = "0";
        setTimeout(() => {
            selector(".loading").style.display = "none";
        }, 820);
        selector("#error-msg").style.top = "50%";
        setTimeout(() => {
            selector("#error-msg").style.top = "150%";
        }, 4000);
        // alert(`${query} does not exist`);
    }
});

const getWeather = (id) => {
    myFetch({
        url: `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${id}/`,
    }).then((response) => {
        const weathers = response.consolidated_weather.reverse();
        firstWeather = weathers.shift();
        weather = weathers;
        title = response.title;
        headerShowData(response.title, firstWeather);
        cardsShowData(weathers);
        selector(".loading").style.opacity = "0";
        setTimeout(() => {
            selector(".loading").style.display = "none";
        }, 820);
    });
};

let initialID = 1047378;
getWeather(1047378);
