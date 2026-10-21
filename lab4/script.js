let userName = prompt("Как вас зовут?", "Путешественник");
alert("Привет, " + userName + "! Сейчас посчитаем ваш маршрут.");
console.log("Старт расчёта маршрута для:", userName);


const distances = [420, 25, 180, 12, 320, 75, 540];
console.log("Исходный маршрут (км):", distances);


function findMaxDistance(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}


function filterLongRoutes(arr) {
    return arr.filter(function (d) {
        return d > 100;
    });
}


function calculateTotalDistance(arr) {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    return total;
}

let shortCount = 0;
let shortSum = 0;

for (let i = 0; i < distances.length; i++) {
    if (distances[i] <= 30) {
        shortCount++;
        shortSum += distances[i];
    }
}

const total = calculateTotalDistance(distances);
const longRoutes = filterLongRoutes(distances);
const longSum = calculateTotalDistance(longRoutes);
const maxDistance = findMaxDistance(distances);

alert(
    userName + ", ваш маршрут длиной " + total + " км, из них " +
    longSum + " км – длинные перегоны."
);

console.log("Самый длинный перегон:", maxDistance, "км");
console.log("Длинные перегоны (> 100 км):", longRoutes);
console.log("Количество коротких перегонов (≤ 30 км):", shortCount);
console.log("Суммарная длина коротких перегонов:", shortSum, "км");

if (total > 500) {
    console.log("Рекомендуется разбить маршрут на 2–3 дня");
}