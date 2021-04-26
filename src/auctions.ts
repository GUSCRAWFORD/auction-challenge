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
    bidders: {[key:string]:Bidder} = {};
    sites: {[key:string]:Site} = {};
    siteBidders: {[key:string]:{[key:string]:boolean}} = {};
    constructor(
        protected stdin: NodeJS.ReadStream,
        protected stderr: NodeJS.WriteStream,
        protected startUpConfiguration: StartUpConfiguration
    ) {
        for (let bidder of startUpConfiguration.bidders) {
            this.bidders[bidder.name] = bidder;
        }
        for (let site of startUpConfiguration.sites) {
            this.sites[site.name] = site;
            site.bidders.forEach(bidder=>{
                const siteBidder = this.siteBidders[site.name] || (this.siteBidders[site.name] = {});
                siteBidder[bidder] = true;
            });
        }
    }
    async read(): Promise<Auction[]> {
        const auctionsInput = await Auctions.readStream(this.stdin);
        return JSON.parse(auctionsInput);
    }
    /**
     * Find the highest valid bidder **for each ad unit**, after applying the adjustment factor:
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
        const highestValidBidPerAdUnit :{
            /** Index of ad-units */
            [key:string]:Partial<Bidder&Bid>
            
        } = {};
        const validBids = auction.bids.map(
            bid=>{
                if (
                    this.validateBid(
                        this.sites[auction.site],
                        auction.units,
                        this.adjust(this.bidders[bid.bidder], bid)
                    )
                ) {
                    const highestValidBidForAdUnit = highestValidBidPerAdUnit[bid.unit];
                    if (
                        !highestValidBidForAdUnit
                        || (bid as any).adjusted > (highestValidBidForAdUnit.bid as number)
                    ) {
                        delete bid.adjusted;
                        highestValidBidPerAdUnit[bid.unit] = bid
                        return bid;
                    }
                }
            }
        ).filter(bid=>bid);
        validBids.sort((a, b)=> (a as any).bid<(b as any).bid?-1:((a as any).bid>(b as any).bid?1:0) );
        return validBids;
    }
    /**
     * Apply the adjustment factor:
     * - `-0.01` means that bids are reduced by 1%
     * - `0.05` would increase them by 5%.
     * @param bid 
     * @param bidder 
     */
    adjust(bidder:Bidder, bid:Bid):Bid&{adjusted:number} {
        if (bidder) {
            bid.adjusted = bid.bid + (bid.bid * bidder.adjustment);
        } else {
            bid.adjusted = bid.bid;
        }
        return bid as any;
    }
    /**
     * `true` if _valid_ falsy otherwise
     * A bid is invalid and should be ignored if:
     *  - the bidder is not permitted to bid on this site
     *  - the bid is for an ad unit not involved in this auction
     *  - the bidder (or site) is unknown
     *  - the *adjusted* bid value is less than the site's floor
     * - An auction is invalid if:
     *  - the site is unrecognized
     *  - there are no valid bids
     *  - In the case of an invalid auction, just return an empty list of bids.
     * @param bid 
     */
    validateBid(site:Site, adUnits:AdUnit[], bid:Bid&{adjusted:number}) {
        if (site && site.name) {
            const siteMap = this.siteBidders[site.name];
            if (siteMap) {
                const bidder = this.bidders[bid.bidder];
                if (bidder) {
                    if (siteMap[bidder.name]) {
                        if (adUnits.find(a=>a===bid.unit)){
                            const valid = bid.adjusted > site.floor;
                            if (!valid) {
                                this.stderr.write(`Ignoring bid: Adjusted bid is lower than floor of auction-site  "${site.name}" (${site.floor}): ${bid.adjusted}`);
                            }
                            return valid;
                        }
                        this.stderr.write(`Ignoring bid: Unauthorized ad-unit for auction: "${bid?.unit?bid.unit:bidder?.toString()}"`);
                        return false;
                    }
                    this.stderr.write(`Ignoring bid: Unauthorized bidder for auction-site "${site.name}": "${bidder?.name?bidder.name:bidder?.toString()}"`);
                    return false;
                }
                this.stderr.write(`Ignoring bid: Unkown bidder: "${bid?.bidder?bid.bidder:bidder}"`);
                return false;
            }
        }
        this.stderr.write(`Ignoring bid: Unkown site: "${site?.name?site.name:site}"`);
        return false;
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
    /** The adjusted bid based on configuration */
    adjusted?:number;
}