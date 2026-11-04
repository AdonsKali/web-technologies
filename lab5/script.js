const userName = prompt("Как вас зовут?", "Путешественник") || "Путешественник";
alert("Привет, " + userName + "! Сейчас посчитаем ваш маршрут.");
console.log("Старт расчёта маршрута для:", userName);

const distances = [420, 25, 180, 12, 320, 75, 540];
console.log("Исходный маршрут (км):", distances);

function findMaxDistance(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) if (arr[i] > max) max = arr[i];
    return max;
}

function filterLongRoutes(arr) {
    return arr.filter(d => d > 100);
}

function calculateTotalDistance(arr) {
    let total = 0;
    for (let i = 0; i < arr.length; i++) total += arr[i];
    return total;
}

function countShortRoutes(arr) {
    let count = 0, sum = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] <= 30) { count++; sum += arr[i]; }
    }
    return { count, sum };
}

function runRouteCalculation(arr) {
    const total = calculateTotalDistance(arr);
    const longRoutes = filterLongRoutes(arr);
    const longSum = calculateTotalDistance(longRoutes);
    const maxDistance = findMaxDistance(arr);
    const shortRoutes = countShortRoutes(arr);

    alert(userName + ", ваш маршрут длиной " + total + " км, из них " + longSum + " км – длинные перегоны.");
    console.log("Самый длинный перегон:", maxDistance, "км");
    console.log("Длинные перегоны (> 100 км):", longRoutes);
    console.log("Количество коротких перегонов (≤ 30 км):", shortRoutes.count);
    console.log("Суммарная длина коротких перегонов:", shortRoutes.sum, "км");
    if (total > 500) console.log("Рекомендуется разбить маршрут на 2–3 дня");
}
runRouteCalculation(distances);

document.addEventListener("DOMContentLoaded", function () {

    const skillsList = document.getElementById("skills-list");
    const skillsListWrapper = document.getElementById("skills-list-wrapper");
    const addBtn = document.getElementById("add-skill-btn");
    const clearBtn = document.getElementById("clear-skills-btn");
    const themeBtn = document.getElementById("theme-toggle");
    const toggleSkillsBtn = document.getElementById("toggle-skills-btn");
    const themeLabel = document.querySelector(".theme-label");

    function checkElement(el, selector) {
        if (!el) {
            console.error("Элемент не найден: " + selector);
            return false;
        }
        return true;
    }

    const allFound =
        checkElement(skillsList, "#skills-list") &&
        checkElement(skillsListWrapper, "#skills-list-wrapper") &&
        checkElement(addBtn, "#add-skill-btn") &&
        checkElement(clearBtn, "#clear-skills-btn") &&
        checkElement(themeBtn, "#theme-toggle") &&
        checkElement(toggleSkillsBtn, "#toggle-skills-btn");

    if (!allFound) return;

    function updateThemeLabel(isDark) {
        if (themeLabel) themeLabel.textContent = isDark ? "Светлая тема" : "Тёмная тема";
    }

    function saveSkills() {
        const items = document.querySelectorAll("#skills-list li");
        const arr = [];
        items.forEach(li => {
            if (li.dataset.name) arr.push(li.dataset.name);
        });
        localStorage.setItem("traveler-skills", JSON.stringify(arr));
    }

    function addSkillItem(name) {
        const li = document.createElement("li");
        li.className = "skill-item";
        li.dataset.name = name;
        li.appendChild(document.createTextNode(name + " "));

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.textContent = "Удалить";
        removeBtn.className = "btn-remove";

        removeBtn.addEventListener("click", function () {
            li.remove();
            saveSkills();
        });

        li.appendChild(removeBtn);
        skillsList.appendChild(li);
    }

    const savedTheme = localStorage.getItem("traveler-theme");
    const isDark = savedTheme === "dark";
    if (isDark) document.body.classList.add("dark-theme");
    updateThemeLabel(isDark);

    const savedSkills = localStorage.getItem("traveler-skills");
    if (savedSkills) {
        try {
            const arr = JSON.parse(savedSkills);
            skillsList.innerHTML = ""; 
            arr.forEach(name => addSkillItem(name));
        } catch (e) {
            console.error("Ошибка чтения навыков:", e);
        }
    } else {
        document.querySelectorAll("#skills-list .btn-remove").forEach(btn => {
            btn.addEventListener("click", function () {
                btn.closest("li").remove();
                saveSkills();
            });
        });
        saveSkills();
    }
    if (localStorage.getItem("traveler-skills-hidden") === "1") {
        skillsListWrapper.classList.add("invisible");
        toggleSkillsBtn.textContent = "Показать список навыков";
    }

    themeBtn.addEventListener("click", function () {
        const darkNow = document.body.classList.toggle("dark-theme");
        updateThemeLabel(darkNow);
        localStorage.setItem("traveler-theme", darkNow ? "dark" : "light");
    });

    addBtn.addEventListener("click", function () {
        const name = prompt("Название нового навыка:");
        if (name === null) return;
        const trimmed = name.trim();
        if (!trimmed) {
            alert("Название не может быть пустым.");
            return;
        }
        addSkillItem(trimmed);
        saveSkills();
    });

    clearBtn.addEventListener("click", function () {
        const items = document.querySelectorAll("#skills-list li");
        if (items.length === 0) {
            alert("Навыки уже удалены");
            return;
        }
        items.forEach(li => li.remove());
        saveSkills();
    });
    toggleSkillsBtn.addEventListener("click", function () {
        const hiddenNow = skillsListWrapper.classList.toggle("invisible");
        toggleSkillsBtn.textContent = hiddenNow ? "Показать список навыков" : "Скрыть список навыков";
        localStorage.setItem("traveler-skills-hidden", hiddenNow ? "1" : "0");
    });
});