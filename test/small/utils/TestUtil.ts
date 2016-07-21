export function sameDate(date1: Date, date2: Date): boolean{
    return Math.abs(date1.getTime()-date2.getTime()) < 10;
}