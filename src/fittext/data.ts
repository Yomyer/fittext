export class FitTextData {
    public static offsetLineHeight = 2;
    public innerHTML?: string;
    public fontSize?: number;
    public lineHeight?: number;

    constructor(ele) {
        this.fontSize = parseInt(getComputedStyle(ele).fontSize, 10);
        this.lineHeight = parseInt(getComputedStyle(ele).lineHeight, 10);
        this.innerHTML = ele.innerHTML;

        if (isNaN(this.lineHeight)) {
            this.lineHeight = parseInt(getComputedStyle(ele).fontSize, 10) + FitTextData.offsetLineHeight;
        }
    }
}
