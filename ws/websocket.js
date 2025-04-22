const WebSocket = require("ws");

class ws {

	static init(server) {
		// 创建实例
		this.ws = new WebSocket.Server({ server, path: "/weight" });
		this.ws.on("connection", async (ws, request) => {
            const weightMap = {
                "mercury": 0.37,
                "venus": 0.98,
                "earth": 1,
                "mars": 0.38,
                "jupiter": 2.64,
                "saturn": 1.15,
                "uranus": 0.93,
                "neptune": 	1.22,
                "moon": 0.16,
            }
			try {
				const obj = { message: "连接成功", code: 200 };
				ws.send(JSON.stringify(obj));

                setTimeout(() => {
                    let obj = {}
                        Object.entries(weightMap).map(([key, value]) => {
                            obj[key] = (value * 50).toFixed(0)
                            return {
                                name: key,
                                value: Math.floor(Math.random() * 100) + 1,
                                weight: value
                            }
                        })
                        ws.send(JSON.stringify({
                            code: 2,
                            type: 2,
                            weight: obj
                        }));
                }, 5000);
                setTimeout(() => {
                    ws.send(JSON.stringify({
                                code: 0
                            }));
                }, 10000);
                setTimeout(() => {
                    let obj = {}
                        Object.entries(weightMap).map(([key, value]) => {
                            obj[key] = (value * 50).toFixed(0)
                            return {
                                name: key,
                                value: Math.floor(Math.random() * 100) + 1,
                                weight: value
                            }
                        })
                        ws.send(JSON.stringify({
                            code: 2,
                            type: 4,
                            weight: obj
                        }));
                }, 20000);
                // let count = 0;
                // setInterval(() => {
                //     if (count === 2) {
                //         let obj = {}
                //         Object.entries(weightMap).map(([key, value]) => {
                //             obj[key] = (value * 50).toFixed(0)
                //             return {
                //                 name: key,
                //                 value: Math.floor(Math.random() * 100) + 1,
                //                 weight: value
                //             }
                //         })
                //         ws.send(JSON.stringify({
                //             code: 2,
                //             type: 2,
                //             weight: obj
                //         }));
                //     } else if (count === 1) {
                //         ws.send(JSON.stringify({
                //             code: 1
                //         }));
                //     } else {
                //         ws.send(JSON.stringify({
                //             code: 0
                //         }));
                //     }
                //     count++;
                // }, 3000);
			} catch (error) {
				console.log("websocket connection error", error);
				return ws.close();
			}
		});
	}
}
module.exports = ws;
