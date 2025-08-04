// src/types/html2pdf.d.ts
declare module "html2pdf.js" {
    interface Html2CanvasOptions {
        scale?: number;
        useCORS?: boolean;
        allowTaint?: boolean;
        [key: string]: unknown;
    }

    interface JsPDFOptions {
        unit?: string;
        format?: string | [number, number];
        orientation?: "portrait" | "landscape";
        [key: string]: unknown;
    }

    interface PageBreakOptions {
        mode?: Array<"avoid-all" | "css" | "legacy">;
        [key: string]: unknown;
    }

    interface Html2PdfOptions {
        margin?: number[] | number;
        filename?: string;
        image?: { type?: string; quality?: number;[key: string]: unknown };
        html2canvas?: Html2CanvasOptions;
        jsPDF?: JsPDFOptions;
        pagebreak?: PageBreakOptions;
        [key: string]: unknown;
    }

    interface Html2PdfInstance {
        set: (opts: Html2PdfOptions) => Html2PdfInstance;
        from: (element: HTMLElement | string) => Html2PdfInstance;
        toPdf: () => Html2PdfInstance;
        get: (key: string) => Promise<unknown>;
        save: () => Promise<void>;
    }

    function html2pdf(): Html2PdfInstance;
    export default html2pdf;
}
