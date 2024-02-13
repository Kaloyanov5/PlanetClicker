const planetButton = document.getElementById("sun");
const clicksText = document.getElementById("clicks");
const sePerSecText = document.getElementById("per-second");
const multiplyClicksButton = document.getElementById("multiplies-per-click");
const resetButton = document.getElementById("reset-btn");
const saveButton = document.getElementById("save-btn");
const gameSaved = document.getElementById("game-saved");
const confirmResetDialog = document.getElementById("confirm-reset-dialog");
const cancelResetButton = document.getElementById("cancel-btn")
const confirmResetButton = document.getElementById("confirm-btn")
const buyMercuryBtn = document.getElementById("buy-mercury");
const buyVenusBtn = document.getElementById("buy-venus");
const buyEarthBtn = document.getElementById("buy-earth");
const buyMoonBtn = document.getElementById("buy-moon");

let planets = JSON.parse(localStorage.getItem("planets")) || {
    mercury: {
        unlocked: false,
        cost: 500,
        sePerSec: 1
    },
    venus: {
        unlocked: false,
        cost: 2500,
        sePerSec: 10
    },
    earth: {
        unlocked: false,
        cost: 12500,
        sePerSec: 100
    },
    moon: {
        unlocked: false,
        cost: 62500,
        sePerSec: 1000
    }
};

console.log(planets);

const mercuryCostElement = document.getElementById("mercury-cost");
const mercurySePerSecElement = document.getElementById("mercury-se-per-second");

mercuryCostElement.textContent = planets.mercury.cost;
mercurySePerSecElement.textContent = planets.mercury.sePerSec;

const venusCostElement = document.getElementById("venus-cost");
const venusSePerSecElement = document.getElementById("venus-se-per-second");

venusCostElement.textContent = planets.venus.cost;
venusSePerSecElement.textContent = planets.venus.sePerSec;

const earthCostElement = document.getElementById("earth-cost");
const earthSePerSecElement = document.getElementById("earth-se-per-second");


earthCostElement.textContent = planets.earth.cost;
earthSePerSecElement.textContent = planets.earth.sePerSec;

const moonCostElement = document.getElementById("moon-cost");
const moonSePerSecElement = document.getElementById("moon-se-per-second");

moonCostElement.textContent = planets.moon.cost;
moonSePerSecElement.textContent = planets.moon.sePerSec;


let playerStats = {
    solarEnergy: JSON.parse(localStorage.getItem("clicksData")) || 0,
    solarEnergyPerClick: JSON.parse(localStorage.getItem("sePerClickData")) || 1,
    perSecond: JSON.parse(localStorage.getItem("sePerSec")) || 0,
    seRequiredToMultiply: JSON.parse(localStorage.getItem("multiplyCostData")) || 200
};

let lastAutoSaveTime = Date.now();
const AUTO_SAVE_INTERVAL = 600000;

const saveData = () => {
    localStorage.setItem("clicksData", JSON.stringify(playerStats.solarEnergy));
    localStorage.setItem("sePerClickData", JSON.stringify(playerStats.solarEnergyPerClick));
    localStorage.setItem("multiplyCostData", JSON.stringify(playerStats.seRequiredToMultiply));
    localStorage.setItem("sePerSec", JSON.stringify(playerStats.perSecond));
    localStorage.setItem("planets", JSON.stringify(planets));

    gameSaved.style.display = "block";
    setInterval(() => {gameSaved.style.display="none"}, 3000);
}

const updateClicks = () => {
    clicksText.textContent = `${playerStats.solarEnergy.toLocaleString()}`;
}
updateClicks();

const updateUpgrades = () => {
    multiplyClicksButton.setAttribute("title", `SE/click: ${playerStats.solarEnergyPerClick * 2}; Cost: ${playerStats.seRequiredToMultiply} SE`);
}   
updateUpgrades();

const reset = () => {
    playerStats.solarEnergy = 0;
    playerStats.solarEnergyPerClick = 1;
    playerStats.perSecond = 0;
    playerStats.seRequiredToMultiply = 200;

    planets = {
        mercury: {
            unlocked: false,
            cost: 500,
            sePerSec: 1
        },
        venus: {
            unlocked: false,
            cost: 2500,
            sePerSec: 10
        },
        earth: {
            unlocked: false,
            cost: 12500,
            sePerSec: 100
        },
        moon: {
            unlocked: false,
            cost: 62500,
            sePerSec: 1000
        }
    };

    updateClicks();
    updateUpgrades();
    updateSePerSecText();
    saveData();
    loadPlanets();
}

const multiplyClicks = () => {
    playerStats.seRequiredToMultiply *= 10;
    playerStats.solarEnergyPerClick *= 2;

    updateUpgrades();
}

const updatePlanetDisplay = (planetName) => {
    const element = document.getElementById(planetName);
    if (planets[planetName].unlocked){
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}

const updateSePerSecText = () => {
    sePerSecText.textContent = playerStats.perSecond.toLocaleString();
    playerStats.perSecond = playerStats.perSecond;
}

updateSePerSecText();

const addSePerSecToSe = () => {
    playerStats.solarEnergy += playerStats.perSecond;
    updateClicks();
}

const loadPlanets = () => {
    for (const planetName in planets) {
        const element = document.getElementById(planetName);
        const planet = planets[planetName];
        const buttons = {
            mercury: buyMercuryBtn,
            venus: buyVenusBtn,
            earth: buyEarthBtn,
            moon: buyMoonBtn
        };
    
        if (element) {
          if (planet.unlocked) {
            element.style.display = "block";
            buttons[planetName].disabled = true;
          } else {
            element.style.display = "none";
            buttons[planetName].disabled = false;
          }
        } else {
          console.warn(`Element with ID "${planetName}" not found.`);
        }
    }
}

loadPlanets();

const buyPlanet = (planetName) => {
    const planet = planets[planetName]
    
    if (planet.unlocked){
        alert("You already own this planet!");
        return;
    };

    if (playerStats.solarEnergy < planet.cost){
        alert("You don't have enough Solar Energy!");
        return;
    };

    planets[planetName].unlocked = true;
    playerStats.solarEnergy -= planets[planetName].cost;
    updateClicks();
    updatePlanetDisplay(planetName);

    playerStats.perSecond += planets[planetName].sePerSec;
    updateSePerSecText();

    saveData();

    const buttons = {
        mercury: buyMercuryBtn,
        venus: buyVenusBtn,
        earth: buyEarthBtn,
        moon: buyMoonBtn
    };
    buttons[planetName].disabled = true;
}

planetButton.addEventListener("click", () => {
    playerStats.solarEnergy += playerStats.solarEnergyPerClick;
    updateClicks();
});

multiplyClicksButton.addEventListener("click", () => {
    if (playerStats.solarEnergy < playerStats.seRequiredToMultiply){
        alert("You don't have enough Solar Energy!");
    } else{
        playerStats.solarEnergy -= playerStats.seRequiredToMultiply;
        updateClicks();
        multiplyClicks();
        saveData();
    }
});

resetButton.addEventListener("click", () => {
    const statsDifference = playerStats.solarEnergy != 0;

    if (statsDifference){
        confirmResetDialog.showModal();
    } else{
        reset();
    }
});

cancelResetButton.addEventListener("click", () => confirmResetDialog.close());

confirmResetButton.addEventListener("click", () => {
    confirmResetDialog.close();
    reset();
})

window.setInterval(() => {
    if (Date.now() - lastAutoSaveTime >= AUTO_SAVE_INTERVAL){
        saveData();
        lastAutoSaveTime = Date.now();
    }
}, AUTO_SAVE_INTERVAL);

saveButton.addEventListener("click", () => {
    saveData();
})

window.onbeforeunload = () => {
    saveData();
};

window.setInterval(() => {
    addSePerSecToSe();
}, 1000);

buyMercuryBtn.addEventListener("click", () => buyPlanet("mercury"))
buyVenusBtn.addEventListener("click", () => buyPlanet("venus"))
buyEarthBtn.addEventListener("click", () => buyPlanet("earth"))
buyMoonBtn.addEventListener("click", () => buyPlanet("moon"));