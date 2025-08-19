"use client";
import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface BarcodeProps {
    value: string;
    width?: number;
    height?: number;
}

export default function Barcode({ value, width = 2, height = 50 }: BarcodeProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (svgRef.current) {
            JsBarcode(svgRef.current, value, {
                format: "CODE128",
                lineColor: "#000000",
                width,
                height,
                displayValue: false, // hide human-readable text
                margin: 0,
            });
        }
    }, [value, width, height]);

    return <svg ref={svgRef}></svg>;
}
