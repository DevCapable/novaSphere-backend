export class AppNumberHelper {
  static generateAppNumber(prefix: string = 'APP-'): string {
    const uniqueNo = Math.floor(
      Math.random() * 9000000000 + 1000000000,
    ).toString(); // Generates a 10-digit number
    return `${prefix}${uniqueNo}`;
  }

  static generateRandomCode(length: number = 8): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static parseAndFormatNumber(value: any): string | null {
    if (typeof value === 'string') {
      value = value.replace(/,/g, '');
    }
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? null : parsedValue.toFixed(2);
  }
}
