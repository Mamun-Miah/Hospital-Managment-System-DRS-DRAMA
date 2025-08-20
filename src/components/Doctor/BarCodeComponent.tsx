"use client";
import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface BarcodeProps {
    value: string;
    width?: number;
    height?: number;
}

export default function Barcode({ value, width = 0.5, height = 25 }: BarcodeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            JsBarcode(canvasRef.current, value, {
                format: "CODE128",
                lineColor: "#000000",
                width,
                height,
                displayValue: false, // hide human-readable text
                margin: 0,
            });
        }
    }, [value, width, height]);

    return <canvas ref={canvasRef}></canvas>;
}
