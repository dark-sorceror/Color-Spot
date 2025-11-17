import { useEffect, useRef } from "react";

import "./App.css";

function App() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        async function initCamera() {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: 1100, 
                    height: 700 
                },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        }

        initCamera();
    }, []);

    return (
        <div className="wrapper">
            <h1>Color Spot</h1>
            <video ref={ videoRef } autoPlay playsInline />
            <canvas ref={ canvasRef } style={{ display: "none" }} />
            <div className="color">Color</div>
        </div>
    );
}

export default App;
