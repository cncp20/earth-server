const planets = [
	{ name: "水星", className: "mercury" },
	{ name: "金星", className: "venus" },
	{ name: "地球", className: "earth" },
	{ name: "火星", className: "mars" },
	{ name: "木星", className: "jupiter" },
	{ name: "土星", className: "saturn" },
	{ name: "天王星", className: "uranus" },
	{ name: "海王星", className: "neptune" },
	{ name: "月球", className: "moon" },
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
});

function setMid(index, weight=0) {
	const planet = planets[index];
	const mid = document.querySelector(".mid");
	mid.style.backgroundImage = `url('./images/${planet.className}.png')`;
	const midLabel = document.querySelector(".mid-label-left");
	midLabel.innerText = planet.name;
	const midWeight = document.querySelector(".mid-weight");
	midWeight.innerText = weight + "";
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
            <div class="planet ${planet.className}">
                <div class="planet-label">
                    <div class="planet-label-left">${planet.name}</div>
                    <div class="planet-label-right">
                        我≈${weightMap[planet.className] || 0}kg
                    </div>
                </div>
            </div>
        `;

		// 添加到太阳系
		solarSystem.appendChild(planetElement);
	});
}

function setAnimation() {
	let i = 0;
	timer = setInterval(() => {
		const astronaut = document.querySelector(".astronaut");
        astronaut.style.display = "block"; // 显示宇航员
		const previousElement = document.querySelector(`.ani${i - 1}`); // 获取上一个元素
		if (previousElement) {
			previousElement.classList.remove(`ani${i - 1}`); // 移除上一个类名
		}
		if (astronaut) {
			astronaut.classList.add(`ani${i}`); // 添加当前类名
			astronaut.style.transform = degMap[i]; // 设置旋转角度
			i++;
			if (i > 6) {
				// 假设有 5 个动画步骤
				clearInterval(timer); // 停止定时器
			}
		}
	}, 4000);
}
function clearAnimation() {
    clearInterval(timer);
    timer = null;
    const astronaut = document.querySelector(".astronaut");
    astronaut.style.transform = "rotate(-90deg)";
    astronaut.style.display = "none";
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
	socket.onmessage = (event) => {
		// 处理接收到的消息
		const data = JSON.parse(event.data);
		if (data.code === 0) {
            clearOther();
            setMid(2);
	        setOther(2);
            clearAnimation();
		} else if (data.code === 1) {
            clearOther();
            setMid(2);
	        setOther(2);
            playAudio('/audio/start.mp3')
        } else if (data.code === 2) {
            clearOther();
            let type = data.type
            setMid(type, data.weight[planets[type].className]);
	        setOther(type, data.weight);
            playAudio('/audio/success.mp3');
            setAnimation();
        }
	};
}
