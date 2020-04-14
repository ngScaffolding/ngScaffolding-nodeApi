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
                retString = this.replaceAll(retString, `@@${key}##`, inputObject[key]); //escape(inputObject[key]));
            });
        }

        return retString;
    }

    public static clearRemainingPlaceholders(inputstring: string): string {
        let retVal = inputstring.replace(/'\@@(.+?)\##'/g, "''");
        retVal = retVal.replace(/\@@(.+?)\##/g, 'null');
        return retVal;
    }

    // Add case insensitive replace
    private static replaceAll(haystack: string, needle: string, replaceWith: string): string {
        // See http://stackoverflow.com/a/3561711/556609
        var esc = needle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var reg = new RegExp(esc, 'ig');
        return haystack.replace(reg, replaceWith);
    }

    private static escape(str: string): string {
        var replaced = str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
            switch (char) {
                case '\0':
                    return '\\0';
                case '\x08':
                    return '\\b';
                case '\x09':
                    return '\\t';
                case '\x1a':
                    return '\\z';
                case '\n':
                    return '\\n';
                case '\r':
                    return '\\r';
                case "'":
                    return "''";
                case '"':
                case '\\':
                case '%':
                    // prepends a backslash to backslash, percent, and double/single quotes
                    return '\\' + char;
            }
        });
        return replaced;
    }
}
