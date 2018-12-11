import { Observable } from 'rxjs';
import { Options } from 'request';

const request = require('request');
const winston = require('../config/winston');

const KumulosResponseCode = {
    SUCCESS: 1,
    NOT_AUTHORIZED: 2,
    NO_SUCH_METHOD: 4,
    NO_SUCH_FORMAT: 8,
    ACCOUNT_SUSPENDED: 16,
    INVALID_REQUEST: 32,
    UNKNOWN_SERVER_ERROR: 64,
    DATABASE_ERROR: 128
};

interface KumulosResponse {
    responseCode: number;
    responseMessage: string;
    payload: any;
    requestedMethod: string;
    requestedFormat: string;
    timestamp: number;
    requestReceivedTime: number;
    maxAllowedRequestTime: number;
    requestProcessingTime: number;
  }
  

export class KumulosDataService {
    private static readonly apiKey = '81a0d051-0d32-4d26-ad17-e45b6e9de6cc';
    private static readonly encodedPassword =
      'Basic ODFhMGQwNTEtMGQzMi00ZDI2LWFkMTctZTQ1YjZlOWRlNmNjOmk1NlZyVnRoRkJvajhINkRzeG5Qc2o0R05Ia1hIZDZsVFJCSQ==';

    private static apiHome = `https://api.kumulos.com/b2.2/${KumulosDataService.apiKey}`;
 

    public static callFunction(name: string, token: string, params: any): Observable<any> {
        return new Observable<any>(observer => {
            var paramString = '';
            for (let key in params) {
                if (params[key]) {
                    paramString = paramString + `params[${key}]=${params[key]}&`;
                } else {
                    paramString = paramString + `params[${key}]=&`;
                }
            }
            // Add in token
            if (token) {
                paramString = paramString + `params[token]=${token}`;
            }

            // Remove last & if necessary
            if (paramString.substring(paramString.length - 1, paramString.length) === '&') {
                paramString = paramString.slice(0, -1);
            }

            var options :Options = {
                url: `${this.apiHome}/${name}.json`,
                body: paramString,
                method: 'post',
                headers: {}
              };

              options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
              options.headers['Authorization'] = this.encodedPassword;


            request(options, (err, res, body) => {
                let reqVal = res.request.req.toCurl();
                  if (err) {
                    observer.error(err);
                  } else{
                    const kumulosResp = JSON.parse(res.body) as KumulosResponse;
                                if (kumulosResp && kumulosResp.responseCode === KumulosResponseCode.SUCCESS) {
                                    // Notify Caller of data
                                    observer.next(kumulosResp.payload);
                                    observer.complete();
                                } else {
                                    // Something gone wrong
                                    winston.error(`Kumulos call Failed: ${kumulosResp.responseMessage}`,
                                     'KumulosDataService');
                                    observer.error(kumulosResp.responseMessage);
                                    observer.complete();
                                }
                  }
                });

            // this.http
            //     .post<KumulosResponse>(`${this.apiHome}/${name}.json`, paramString, {
            //         headers: new HttpHeaders().set('Content-Type', )
            //           .set('Authorization', this.encodedPassword)
            //     })
            //     .subscribe(
            //         values => {
            //             const kumulosResp = values as KumulosResponse;
            //             if (kumulosResp && kumulosResp.responseCode === KumulosResponseCode.SUCCESS) {
            //                 // Notify Caller of data
            //                 observer.next(kumulosResp.payload);
            //                 observer.complete();
            //             } else {
            //                 // Something gone wrong
            //                 this.log.error(`Kumulos call Failed: ${kumulosResp.responseMessage}`,
            //                  'KumulosDataService');
            //                 observer.error(kumulosResp.responseMessage);
            //                 observer.complete();
            //             }
            //         },
            //         err => {
            //             observer.error(err);
            //             observer.complete();
            //         }
            //     );
        });
    }
}
