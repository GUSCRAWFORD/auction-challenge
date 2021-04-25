import { Auctions } from "./auctions";

const expectedAuctions = require('../path/to/test/input.json');
const expectedConfig =  require('../path/to/test/config.json');
/*
3. For each auction, you should find the highest valid bidder for each ad unit, after
applying the adjustment factor.
   - An adjustment factor of -0.01 means that bids are
reduced by 1%;
   - an adjustment of 0.05 would increase them by 5%. (Positive adjustments are rare in real life, but possible.)
     - For example, a bid of $0.95 and an adjustment factor of 0.05 (adjusted to $0.9975) will beat a bid of $1.10 with an adjustment factor of -0.1 (adjusted to $0.99).
   - When reporting the winners, use the bid amounts provided by the bidder, rather than the adjusted values.
   - It is possible that a bidder will submit multiple bids for the same ad unit in the same auction.
   - A bid is invalid and should be ignored if:
     - the bidder is not permitted to bid on this site
     - the bid is for an ad unit not involved in this auction
     - the bidder is unknown
     - the *adjusted* bid value is less than the site's floor
   - An auction is invalid if:
     - the site is unrecognized
     - there are no valid bids
     - In the case of an invalid auction, just return an empty list of bids.
*/
let auctionsService: Auctions;
describe('Gus\'s Auction Challenge Auction Behavior', ()=>{

    it('makes negative adjustments', async ()=>{
        expect(false).toBe(true);
    });
    it('makes positive adjustments', async ()=>{
        expect(false).toBe(true);
    });
    describe('under multiple-bids',()=>{
        it('loads \'config.json\'', async ()=>{
            expect(false).toBe(true);
        });
        it('reads stdin for auctions', async ()=>{
            expect(false).toBe(true);
        });
    });
    describe('ignores invalid bid', ()=>{
        beforeEach(()=>auctionsService = new Auctions({} as any, expectedConfig));
        it('because bidder is not permitted on given site', async ()=>{
            expect(auctionsService.validateBid(
                {
                    "name": "houseofcheese.com",
                    "bidders": ["BIDD"],
                    "floor": 32
                },
                ["banner"],
                {
                    "bidder": "AUCT",
                    "unit": "banner",
                    "bid": 35
                }
            )).toBe(false);
        });
        it('because bid is for an ad unrelated to given auction', async ()=>{
            expect(auctionsService.validateBid(
                {
                    "name": "houseofcheese.com",
                    "bidders": ["AUCT","BIDD"],
                    "floor": 32
                },
                ["banner"],
                {
                    "bidder": "AUCT",
                    "unit": "sidebar",
                    "bid": 35
                }
            )).toBe(false);
        });
        it('because bidder is unknown', async ()=>{
            expect(auctionsService.validateBid(
                {
                    "name": "houseofcheese.com",
                    "bidders": ["AUCT","BIDD"],
                    "floor": 32
                },
                ["banner"],
                {
                    "bidder": "JAMESBOND",
                    "unit": "sidebar",
                    "bid": 35
                }
            )).toBe(false);
        });
        it('because adjustment is less than given site floor', async ()=>{
            expect(auctionsService.validateBid(
                {
                    "name": "houseofcheese.com",
                    "bidders": ["AUCT","BIDD"],
                    "floor": 32
                },
                ["banner"],
                {
                    "bidder": "AUCT",
                    "unit": "sidebar",
                    "bid": 35,
                    "adjusted": 30
                }
            )).toBe(false);
        });
    });
    describe('returns empty list of bids for an invalid auction', ()=>{
        it('because the site is not recognized', async ()=>{
            expect(false).toBe(true);
        });
        it('there are no valid bids', async ()=>{
            expect(false).toBe(true);
        });
    });
});