/**
 * Asyncronously read all of standard-in resolving on an EOF signal
 * @param stdin (optionally) provide an alternate `ReadStream` (or mock for testing)
 */
export function gulpStandardInput(stdin?:NodeJS.ReadStream) {
    return new Promise(
        (resolve, reject)=>{
            try {
                let streamed = '';
                stdin?.on('data', (chunk) => streamed += `${chunk}`);
                stdin?.on('end', ()=> resolve(streamed));
                stdin?.on('error', (e)=>reject(e));
            } catch(e) {
                reject(e);
            }
        }
    )
}

export interface AuctionDomainEntity {
    name: string;
}

/**
 * An auction site
 * @example
 * {
 *    "sites": [
 *        {
 *            "name": "houseofcheese.com",
 *            "bidders": ["AUCT", "BIDD"],
 *            "floor": 32
 *        }
 *    ],
 *    ...
 * }
 */
export interface Site extends AuctionDomainEntity {
    bidders:any[];
    floor: number;
}
/**
 * An auction site
 * @example
 * {
 *    ...,
 *    "bidders": [
 *        {
 *            "name": "AUCT",
 *            "adjustment": -0.0625
 *        },
 *        {
 *            "name": "BIDD",
 *            "adjustment": 0
 *        }
 *    ]
 * }
 */
export interface Bidder extends AuctionDomainEntity {
    adjustment: number;
}