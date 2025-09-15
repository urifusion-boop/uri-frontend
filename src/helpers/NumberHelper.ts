export class NumberHelper {
  static addSuffix(num: number) {
    if (num % 100 >= 11 && num % 100 <= 13) {
      return num + "th";
    }

    switch (num % 10) {
      case 1:
        return num + "st";
      case 2:
        return num + "nd";
      case 3:
        return num + "rd";
      default:
        return num + "th";
    }
  }

  static roundDownToTwoSignificantFigures(number: number) {
    if (isNaN(number) || !isFinite(number)) return 0;
    if (number === 0) return 0;

    return Number(number.toPrecision(2));
  }
  static formatNumber(num: number) {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num.toLocaleString();
  }
}
