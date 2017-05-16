export function sameDate(date1: Date, date2: Date): boolean{
    return Math.abs(date1.getTime()-date2.getTime()) < 10;
}
export function sdkVersion(): string {
    return '1.0';
}