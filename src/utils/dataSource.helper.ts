export interface InputAndRows {
  inputDetails: any;
  rows: any[];
}

export class DataSourceHelper {
  public static prepareInputAndRows(inputDetails: object, rows: object[]): InputAndRows {
    let returnValues = {
      inputDetails: {},
      rows: []
    };

    if (rows) {
      returnValues.rows = rows;
    } else {
      returnValues.rows = [];
    }

    // If empty, make sure there is always one
    if (returnValues.rows.length === 0) {
      returnValues.rows.push({});
    }

    returnValues.inputDetails = inputDetails;
    return returnValues;
  }

  public static replaceValuesInString(inputString: string, inputObject: any): string {
    let retString = inputString;

    if (inputObject) {
      Object.keys(inputObject).forEach(key => {
        retString = this.replaceAll(retString, `@@${key}@@`, inputObject[key]);
      });
    }

    return retString;
  }

  // Add case insensitive replace
  private static replaceAll(haystack: string, needle: string, replaceWith: string): string {
    // See http://stackoverflow.com/a/3561711/556609
    var esc = needle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return haystack.replace(reg, replaceWith);
  }
}
