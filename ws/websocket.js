const WebSocket = require("ws");
const data = require("./test.json");
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

                
                let arr = data["weight_data"] || []
                let hasPerson = arr.filter(item => item.note === "1");
                if (hasPerson.length){
                    // 有人在上面
                    if (arr[0].status === "0") {
                        // 正在称重
                        ws.send(JSON.stringify({
                            code: 1
                        }));
                    } else if (arr[0].status === "1") {
                        // 数值稳定称重完成
                        let earth = arr.find(item => item.id === "dq_weight")
                        let weight = earth.weight / 1000; //kg
                        let id = arr.find(item => item.note === "1").id
                        let type = "";
                        if (id === "dq_weight") {
                            type = "earth";
                        } else if (id === "Venus1") {
                            type = "venus";
                        } else {
                            type = id.toLowerCase();
                        }
                        let obj = {}
                        Object.entries(weightMap).map(([key, value]) => {
                            obj[key] = (value * weight).toFixed(0)
                        })
                        ws.send(JSON.stringify({
                            code: 2,
                            type: Object.keys(weightMap).findIndex(item => item === type),
                            weight: obj
                        }));
                    }

                } else{
                    // 没人在上面
                    ws.send(JSON.stringify({
                        code: 0
                    }));
                }
			} catch (error) {
				console.log("websocket connection error", error);
				return ws.close();
			}
		});
	}
}
module.exports = ws;
