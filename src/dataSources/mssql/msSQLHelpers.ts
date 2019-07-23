export class MSSQLHelpers {
    public static valueOrNull(input: any): string {
      if (!input || input.toString() === 'null') {
        return null;
      } else {
        return input;
      }
    }
    public static valueWithQuotesOrNull(input: any): string {
      if (!input || input.toString() === 'null') {
        return null;
      } else {
        return `'${input}'`;
      }
    }
  }
  