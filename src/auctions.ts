import { Site, Bidder, gulpStandardInput } from ".";
import { StartUpConfiguration } from "./start-up";
/**
 * @example
 * [
 *     {
 *         "site": "houseofcheese.com",
 *         "units": ["banner", "sidebar"],
 *         "bids": [
 *             {
 *                 "bidder": "AUCT",
 *                 "unit": "banner",
 *                 "bid": 35
 *             },
 *             {
 *                 "bidder": "BIDD",
 *                 "unit": "sidebar",
 *                 "bid": 60
 *             },
 *             {
 *                 "bidder": "AUCT",
 *                 "unit": "sidebar",
 *                 "bid": 55
 *             }
 *         ]
 *     }
 * ]
 */
export class Auctions {
    static readStream = gulpStandardInput;
    bidders = new Map<string, Bidder>();
    sites = new Map<string, Site>();
    siteBidders = new Map<string, Map<string, boolean>>();
    constructor(
        protected stdin: NodeJS.ReadStream,
        protected startUpConfiguration: StartUpConfiguration
    ) {
        for (let bidder of startUpConfiguration.bidders) {
            this.bidders.set(bidder.name, bidder);
        }
        for (let site of startUpConfiguration.sites) {
            this.sites.set(site.name, site);
            site.bidders.forEach(bidder=>this.siteBidders.set(site.name, new Map<string, boolean>().set(bidder, true)));
        }
    }
    async read(): Promise<Auction[]> {
        const auctionsInput = await Auctions.readStream(this.stdin);
        return JSON.parse(auctionsInput);
    }
    /**
     * Find the highest valid bidder for each ad unit, after applying the adjustment factor:
     * - `-0.01` means that bids are reduced by 1%
     * - `0.05` would increase them by 5%.
     * 
     * _Positive adjustments are rare in real life, but possible._
     * - i.e. bid of $`0.95` and an adjustment factor of `0.05` (adjusted to $`0.9975`) **>** bid of $`1.10` with an adjustment factor of `-0.1` (adjusted to $`0.99`).
     * 
     * - Reports the bid amounts provided by the bidder, rather than the adjusted values.
     * - It is possible for a bidder to submit multiple bids for the same ad unit in the same auction.
     * @param auction 
     */
    process(auction:Auction) {
        const highestBidders = new Map<string, Bidder>();
        for (let _bid of auction.bids) {

        }
    }
    /**
     * Apply the adjustment factor:
     * - `-0.01` means that bids are reduced by 1%
     * - `0.05` would increase them by 5%.
     */
    adjust(bid:Bid) {
        const bidder = this.bidders.get(bid.bidder);
        if (bidder) {
            const adjustmentFactor = 1 + bidder.adjustment;
            bid.adjusted = bid.bid > 0 ? bid.bid * adjustmentFactor : bid.bid / adjustmentFactor;
        }
        return bid;
    }
    /**
     * `true` if _valid_ falsy otherwise
     * A bid is invalid and should be ignored if:
     *  - the bidder is not permitted to bid on this site
     *  - the bid is for an ad unit not involved in this auction
     *  - the bidder (or site) is unknown
     *  - the *adjusted* bid value is less than the site's floor
     * @param bid 
     */
    validateBid(site:Site, addUnits:AdUnit[], bid:Bid) {
        const bidder = this.bidders.get(bid.bidder);
        const siteMap = this.siteBidders.get(site.name);
        if (
            bidder
            && siteMap
            && siteMap.get(bidder.name)
            && addUnits.find(a=>a===bid.unit)
        ) {
            return !(bid.adjusted && bid.adjusted < site.floor)
        }
        return false;
    }
    /**
    * - An auction is invalid if:
    *  - the site is unrecognized
    *  - there are no valid bids
    *  - In the case of an invalid auction, just return an empty list of bids.
    * @param auction 
    */
   validate(auction:Auction) {

   }
}
export type AdUnit = "banner"|"sidebar";
export interface Auction  {
    /** i.e. `"houseofcheese.com"` */
    "site": string,
    /**i.e. `["banner", "sidebar"]` */
    "units": AdUnit[];
    "bids": Bid[]
}

export interface Bid  {
    /** i.e. `"AUCT"` */
    "bidder": string;
    /**i.e. `"banner"` */
    "unit": AdUnit;
    /** i.e. `55` */
    "bid": number;
    /** If a bid has been adjusted, that value is stored separately so the original bid can be reported */
    adjusted?:number;
}