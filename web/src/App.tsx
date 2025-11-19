import { useEffect, useRef, useState } from "react";

import "./App.css";

function App() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [color, setColor] = useState<string, null>(null);

    useEffect(() => {
        async function initCamera() {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 1100,
                    height: 700,
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        }

        initCamera();
    }, []);

    async function handleClick(e: React.MouseEvent) {
        const video = videoRef.current!;
        const canvas = canvasRef.current!;
        const rect = video.getBoundingClientRect();

        const scaleX = video.videoWidth / rect.width;
        const scaleY = video.videoHeight / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(video, 0, 0);

        const base64 = canvas.toDataURL("image/png");

        try {
            const res = await fetch("http://localhost:8000/color", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image: base64,
                    x,
                    y,
                }),
            });

            if (!res.ok) {
                const errText = await res.text().catch(() => "");

                throw new Error(`${errText}`);
            }

            const data = await res.json().catch(() => {
                throw new Error("Invalid JSON in response");
            });

            console.log("ok", data);

            setColor(`${data.r}, ${data.g}, ${data.b}`);
        } catch (error) {
            error instanceof Error
                ? console.log(error.message)
                : console.log(error);
        }
    }

    return (
        <div className="wrapper">
            <h1>Color Spot</h1>
            <video ref={ videoRef } autoPlay playsInline onClick={ handleClick } />
            <canvas ref={ canvasRef } style={{ display: "none" }} />
            {color && 
                <div className="color">{ color }</div>
            }
        </div>
    );
}

export default App;
