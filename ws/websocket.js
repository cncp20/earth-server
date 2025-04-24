const WebSocket = require("ws");
const config = require("./config.json");
const mqtt = require("mqtt");

class ws {
	static init(server) {
		const weightMap = {
			mercury: 0.37,
			venus: 0.98,
			earth: 1,
			mars: 0.38,
			jupiter: 2.64,
			saturn: 1.15,
			uranus: 0.93,
			neptune: 1.22,
			moon: 0.16,
		};
        this.client = mqtt.connect(
            `mqtt://${config.host}:${config.port}`,
            {
                clientId: "nodejs-mqtt-client",
                username: config.username,
                password: config.password
            }
        );
        console.log("mqtt 连接中...");
        let isConnected = false;
        this.client.on("connect", () => {
            if (!isConnected) {
                isConnected = true;
                console.log("mqtt 连接成功");
                this.client.subscribe(config.topic);
            }
        });
		// 创建实例
		this.ws = new WebSocket.Server({ server, path: "/weight" });
		this.ws.on("connection", async (ws, request) => {
			ws.send(JSON.stringify({ message: "ws连接成功", code: 200 }));

			try {
                let nowStatus = 0;
				this.client.on("message", (topic, payload) => {
                    let data = JSON.parse(payload.toString());
					let arr = data["weight_data"] || [];
					let hasPerson = arr.filter((item) => item.note === "1");
					if (hasPerson.length) {
						// 有人在上面
						if (arr[0].status === "0") {
							// 正在称重
                            if (nowStatus === 0) {
                                console.log(1, payload.toString());
                                nowStatus = 1;
                                ws.send(
                                    JSON.stringify({
                                        code: 1,
                                    })
                                );
                            }
						} else if (arr[0].status === "1") {
							// 数值稳定称重完成
                            if (nowStatus !== 2) {
                                console.log(2, payload.toString());
                                nowStatus = 2;
                                let earth = arr.find(
                                    (item) => item.id === "dq_weight"
                                );
                                let weight = earth.weight / 1000; //kg
                                let id = arr.find((item) => item.note === "1").id;
                                let type = "";
                                if (hasPerson.length === 2) {
                                    id = hasPerson[1].id;
                                }
                                if (id === "dq_weight") {
                                    type = "earth";
                                } else if (id === "Venus1") {
                                    type = "venus";
                                } else {
                                    type = id.toLowerCase();
                                }
                                let obj = {};
                                Object.entries(weightMap).map(([key, value]) => {
                                    obj[key] = (value * weight).toFixed(0);
                                });
                                ws.send(
                                    JSON.stringify({
                                        code: 2,
                                        type: Object.keys(weightMap).findIndex(
                                            (item) => item === type
                                        ),
                                        weight: obj,
                                    })
                                );
                            }
						}
					} else {
						// 没人在上面
                        if (nowStatus !== 0) {
                            console.log(0, payload.toString());
                            nowStatus = 0;
                            ws.send(
                                JSON.stringify({
                                    code: 0,
                                })
                            );
                        }
					}
				});
			} catch (error) {
				console.log("websocket connection error", error);
				return ws.close();
			}
		});
        this.ws.on("close", () => {
            console.log("ws 断开连接");
            this.client.end();
        });
	}
}
module.exports = ws;
