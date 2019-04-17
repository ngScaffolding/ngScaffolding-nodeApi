export interface InputAndRows {
  inputDetails: any;
  rows: any[];
}

export class DataSourceHelper {
  public static prepareInputAndRows(inputDetails: string, rows: string): InputAndRows {
    let returnValues = {
      inputDetails: {},
      rows: []
    };

    // Make an array of our input details
    if (rows) {
      if (rows.startsWith('[') && rows.endsWith(']')) {
        returnValues.rows = JSON.parse(rows);
      } else {
        returnValues.rows.push(JSON.parse(rows));
      }
    }

    if (returnValues.rows.length === 0) {
      returnValues.rows.push({});
    }

    // Decode Input if JSON string
    if (inputDetails && (typeof inputDetails === 'string')) {
      returnValues.inputDetails = JSON.parse(inputDetails);
    } else {
      returnValues.inputDetails = inputDetails;
    }
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
