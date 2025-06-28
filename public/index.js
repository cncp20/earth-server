const planets = [
	{ name: "水星", className: "mercury", hasStand: false },
	{ name: "金星", className: "venus", hasStand: false },
	{ name: "地球", className: "earth", hasStand: false },
	{ name: "火星", className: "mars", hasStand: false },
	{ name: "木星", className: "jupiter", hasStand: false },
	{ name: "土星", className: "saturn", hasStand: false },
	{ name: "天王星", className: "uranus", hasStand: false },
	{ name: "海王星", className: "neptune", hasStand: false },
	{ name: "月球", className: "moon", hasStand: false },
];
const degMap = {
	0: "rotate(-64.3deg)",
	1: "rotate(-38.6deg)",
	2: "rotate(-13deg)",
	3: "rotate(13deg)",
	4: "rotate(38.6deg)",
	5: "rotate(64.3deg)",
	6: "rotate(90deg)",
};

let socket = null;
let timer = null;


document.addEventListener("DOMContentLoaded", function () {
	setMid(2);
	setOther(2);
    openWs();
    initClick()
});
function initClick() {
    const btn = document.querySelector("#btn");
    btn.addEventListener("click", () => {
        let audio = new Audio('/audio/start.mp3');
        audio.muted = true;
        audio.play();
        audio.addEventListener("ended", () => {
            audio = null; // 销毁对象
        });
        btn.style.display="none";
    })
}

function setMid(index, weight) {
	const planet = planets[index];
    if (weight === undefined) {
        weight = 0
    } else {
        planet.hasStand = true;
    }
	const mid = document.querySelector(".mid");
	mid.style.backgroundImage = `url('./images/${planet.className}.png')`;
	const midLabel = document.querySelector(".mid-label-left");
	midLabel.innerText = planet.name;
	const midWeight = document.querySelector(".mid-weight");
	midWeight.innerText = `${index === 2 ? '=' : '≈'}${weight}`;
	if (index === 5) {
		mid.style.boxShadow = "none";
	}
}
function clearOther() {
    const solarSystem = document.querySelector(".solar-system");
    solarSystem.innerHTML = "";
}
function setOther(index, weightMap = {}) {
	const solarSystem = document.querySelector(".solar-system");
	let otherPlanets = planets.filter((_, i) => i !== index);
	otherPlanets.forEach((planet, index) => {
		const planetElement = document.createElement("div");
		planetElement.className = `planet-body rotate${index}`;
		planetElement.innerHTML = `
            <div class="planet">
                <div class="planet-img ${planet.className} ${planet.hasStand ? 'has-stand' : ''}"></div>
                <div class="planet-label ${planet.hasStand ? 'has-stand' : ''}">
                    <div class="planet-label-left">${planet.name}</div>
                    <div class="planet-label-right">
                        我${planet.className==="earth" ? "=" : "≈"}${planet.hasStand && weightMap[planet.className] ? weightMap[planet.className] : 0}kg
                    </div>
                </div>
            </div>
        `;

		// 添加到太阳系
		solarSystem.appendChild(planetElement);
	});
}
// 宇航员动画
// function setAnimation() {
// 	let i = 0;
// 	timer = setInterval(() => {
// 		const astronaut = document.querySelector(".astronaut");
//         astronaut.style.display = "block"; // 显示宇航员
// 		const previousElement = document.querySelector(`.ani${i - 1}`); // 获取上一个元素
// 		if (previousElement) {
// 			previousElement.classList.remove(`ani${i - 1}`); // 移除上一个类名
// 		}
// 		if (astronaut) {
// 			astronaut.classList.add(`ani${i}`); // 添加当前类名
// 			astronaut.style.transform = degMap[i]; // 设置旋转角度
// 			i++;
// 			if (i > 6) {
// 				// 假设有 5 个动画步骤
// 				clearInterval(timer); // 停止定时器
// 			}
// 		}
// 	}, 4000);
// }
function clearAnimation() {
    clearInterval(timer);
    timer = null;
    const astronaut = document.querySelector(".astronaut");
    astronaut.style.transform = "rotate(-90deg)";
    astronaut.style.display = "none";
    for (let i = 0; i < 7; i++) {
        const previousElement = document.querySelector(`.ani${i}`); // 获取上一个元素
        if (previousElement) {
            previousElement.classList.remove(`ani${i}`); // 移除上一个类名
        }
    }
}
function playAudio(url) {
    let audio = new Audio(url);
    audio.muted = true;
    audio.play();
    setTimeout(() => {
        audio.muted = false;
    }, 0);
    audio.addEventListener("ended", () => {
        audio = null; // 销毁对象
    });
}
function openWs() {
	socket = new WebSocket(`ws://${window.location.host}/weight`);
    let newPlant = 2;
	socket.onmessage = (event) => {
		// 处理接收到的消息
		const data = JSON.parse(event.data);
		if (data.code === 0) {
            // 没人在上面或者正在移动到其他称上
            clearOther();
            setMid(newPlant);
	        setOther(newPlant);
            // clearAnimation();
		} else if (data.code === 1) {
            newPlant = 2;
            clearOther();
            planets.forEach((planet) => {
                planet.hasStand = false;
            });
            setMid(newPlant);
	        setOther(newPlant);
            playAudio('/audio/start.mp3')
            // clearAnimation();
        } else if (data.code === 2) {
            // clearAnimation();
            clearOther();
            let type = data.type
            newPlant = type;
            setMid(type, data.weight[planets[type].className]);
	        setOther(type, data.weight);
            if (type === 2) {
                playAudio('/audio/success.mp3');
            }
            // setAnimation();
        }
	};
}
