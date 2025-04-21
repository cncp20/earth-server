const WebSocket = require("ws");

class ws {

	static init(server) {
		// 创建实例
		this.ws = new WebSocket.Server({ server, path: "/weight" });
		this.ws.on("connection", async (ws, request) => {
			try {
				const obj = { message: "连接成功", code: 200 };
				ws.send(JSON.stringify(obj));
                let count = 0;
                setInterval(() => {
                    if (count === 5) {
                        ws.send(JSON.stringify({
                            code: 1,
                            type: 2,
                            weight: 40
                        }));
                    } else if (count === 8) {
                        ws.send(JSON.stringify({
                            code: 1,
                            type: 8,
                            weight: 55
                        }));
                    } else {
                        ws.send(JSON.stringify({
                            code: 0,
                            message: "当前无体重数据"
                        }));
                    }
                    count++;
                }, 5000);
			} catch (error) {
				console.log("websocket connection error", error);
				return ws.close();
			}
		});
	}
}
module.exports = ws;
