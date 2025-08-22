// NumberToWords.ts
const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const thousands = ["", "Thousand", "Lakh", "Crore"];

function numberToWords(num: number): string {
    if (num === 0) return "Zero";

    let words = "";

    const getBelowHundred = (n: number): string => {
        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 10];
        return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    };

    const getBelowThousand = (n: number): string => {
        let str = "";
        if (Math.floor(n / 100) > 0) {
            str += ones[Math.floor(n / 100)] + " Hundred ";
            n %= 100;
        }
        if (n > 0) {
            str += getBelowHundred(n);
        }
        return str.trim();
    };

    const parts: string[] = [];
    let i = 0;

    while (num > 0) {
        const chunk = num % 1000;
        if (chunk > 0) {
            const chunkWords = getBelowThousand(chunk);
            parts.unshift(chunkWords + (thousands[i] ? " " + thousands[i] : ""));
        }
        num = Math.floor(num / 1000);
        i++;
    }

    words = parts.join(" ").replace(/\s+/g, " ").trim();

    return words;
}

export default numberToWords;
