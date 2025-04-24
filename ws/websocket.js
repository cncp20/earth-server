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
                let nowType = null;
                let tmpWeight = 0;
				this.client.on("message", (topic, payload) => {


                    let data = JSON.parse(payload.toString());
					let arr = data["weight_data"] || [];
					let currentPlant = arr.filter((item) => item.note === "1");
					if (currentPlant.length===1) {
						// 有人在上面
                        let {id, status} = currentPlant[0];
						if (id === "dq_weight" && status === "0") {
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
						} else {
							// 数值稳定称重完成
                            console.log(2, payload.toString());
                            nowStatus = 2;
                            let weight = 0;
                            let type = "";
                            if (id === "dq_weight") {
                                type = "earth";
                            } else if (id === "Venus1") {
                                type = "venus";
                            } else {
                                type = id.toLowerCase();
                            }
                            if (nowType !== type) {
                                // 星球切换了才发送消息给前端
                                nowType = type;
                                if (id === "dq_weight") {
                                    weight = currentPlant[0].weight / 1000; //kg
                                    tmpWeight = weight;
                                    setTimeout(() => {
                                        tmpWeight = 0;
                                        nowType = null;
                                    }, 30000);
                                } else {
                                    weight = tmpWeight;
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
						// 没人在上面或者正在移动
                        if (nowStatus !== 0 && !tmpWeight) {
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
