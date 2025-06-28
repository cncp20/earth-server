setTimeout(() => {
    ws.send(
        JSON.stringify({
            code: 0,
        })
    );
    setTimeout(() => {
        ws.send(
            JSON.stringify({
                code: 1,
            })
        );
        setTimeout(() => {
            ws.send(
                JSON.stringify({
                    code: 2,
                    type: 2,
                    weight: {
                        mercury: "10",
                        venus: "20",
                        earth: "30",
                        mars: "40",
                        jupiter: "50",
                        saturn: "60",
                        uranus: "70",
                        neptune: "80",
                        moon: "90",
                    },
                })
            );
            setTimeout(() => {
                ws.send(
                    JSON.stringify({
                        code: 2,
                        type: 4,
                        weight: {
                            mercury: "10",
                            venus: "20",
                            earth: "30",
                            mars: "40",
                            jupiter: "50",
                            saturn: "60",
                            uranus: "70",
                            neptune: "80",
                            moon: "90",
                        },
                    })
                );
                setTimeout(() => {
                    ws.send(
                        JSON.stringify({
                            code: 2,
                            type: 5,
                            weight: {
                                mercury: "10",
                                venus: "20",
                                earth: "30",
                                mars: "40",
                                jupiter: "50",
                                saturn: "60",
                                uranus: "70",
                                neptune: "80",
                                moon: "90",
                            },
                        })
                    );
                    setTimeout(() => {
                        ws.send(
                            JSON.stringify({
                                code: 2,
                                type: 7,
                                weight: {
                                    mercury: "0",
                                    venus: "0",
                                    earth: "0",
                                    mars: "0",
                                    jupiter: "0",
                                    saturn: "0",
                                    uranus: "0",
                                    neptune: "0",
                                    moon: "0",
                                },
                            })
                        );
                        setTimeout(() => {
                            ws.send(
                                JSON.stringify({
                                    code: 1,
                                })
                            );
                        }, 5000);
                    }, 5000);
                }, 5000);
            }, 7000);
        }, 7000);
    }, 5000);
}, 1000);

