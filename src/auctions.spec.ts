import { Auctions } from "./auctions";

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

    beforeEach(()=>auctionsService = new Auctions({} as any, {write:jest.fn(out=>out)} as any, expectedConfig));
    it ('finds the highest valid bidder for each ad unit, after applying the adjustment factor.', ()=>{
        auctionsService = new Auctions({} as any, {write:jest.fn(out=>/*out*/console.warn(out))} as any, expectedConfig) 
        expect(
            auctionsService.process({
                "site": "houseofcheese.com",
                "units": ["banner", "sidebar"],
                "bids": [
                    {
                        "bidder": "AUCT",
                        "unit": "banner",
                        "bid": 35
                    },
                    {
                        "bidder": "BIDD",
                        "unit": "sidebar",
                        "bid": 60
                    },
                    {
                        "bidder": "AUCT",
                        "unit": "sidebar",
                        "bid": 55
                    }
                ]
            })
        ).toEqual([
            {
                "bidder": "AUCT",
                "unit": "banner",
                "bid": 35
            },
            {
                "bidder": "BIDD",
                "unit": "sidebar",
                "bid": 60
            },
        ]);
    });
    it('never compares the adjusted value vs a non adjusted values of two bids', ()=>{
        auctionsService = new Auctions({} as any, {write:jest.fn(out=>/*out*/console.warn(out))} as any, {
            "sites": [
                {
                    "name": "houseofcheese.com",
                    "bidders": ["AUCT", "BIDD"],
                    "floor": 1
                }
            ],
            "bidders": [
                {
                    "name": "AUCT",
                    "adjustment": -0.5
                },
                {
                    "name": "BIDD",
                    "adjustment": 0
                }
            ]
        });
        expect(
            auctionsService.process({
                "site": "houseofcheese.com",
                "units": ["banner", "sidebar"],
                "bids": [
                    {
                        "bidder": "AUCT",
                        "unit": "banner",
                        "bid": 60
                    },
                    {
                        "bidder": "BIDD",
                        "unit": "banner",
                        "bid": 40
                    }
                ]
            })
        ).toEqual([
            {
                "bidder": "BIDD",
                "unit": "banner",
                "bid": 40
            }
        ]);
    });
    it('reports bids\'s properties in order: bidder, bid, unit', ()=>{
        expect(JSON.stringify(
            auctionsService.reportBid({
                unit: "banner",
                bidder:"any",
                bid: 0
            })
        )).toBe(JSON.stringify({
            bidder:"any",
            bid: 0,
            unit: "banner"
        }));
    })
    it('makes negative adjustments', async ()=>{
        expect(
            auctionsService.adjust(
                {
                    "name": "AUCT",
                    "adjustment": -0.01
                },
                {
                    "bidder": "AUCT",
                    "unit": "banner",
                    "bid": 100
                }
            )
        ).toEqual(
            {
                "bidder": "AUCT",
                "unit": "banner",
                "bid": 100,
                "adjusted": 99
            }
        );
    });
    it('makes positive adjustments', async ()=>{
        expect(
            auctionsService.adjust(
                {
                    "name": "AUCT",
                    "adjustment": 0.01
                },
                {
                    "bidder": "AUCT",
                    "unit": "banner",
                    "bid": 100
                }
            )
        ).toEqual(
            {
                "bidder": "AUCT",
                "unit": "banner",
                "bid": 100,
                "adjusted": 101
            }
        );
    });
    it('accepts multiple-bids',()=>{
        expect(
            auctionsService.process({
                "site": "houseofcheese.com",
                "units": ["banner", "sidebar"],
                "bids": [
                    {
                        "bidder": "AUCT",
                        "unit": "banner",
                        "bid": 35
                    },
                    {
                        "bidder": "BIDD",
                        "unit": "sidebar",
                        "bid": 60
                    },
                    {
                        "bidder": "AUCT",
                        "unit": "sidebar",
                        "bid": 55
                    },
                    {
                        "bidder": "BIDD",
                        "unit": "sidebar",
                        "bid": 54
                    },
                    {
                        "bidder": "BIDD",
                        "unit": "sidebar",
                        "bid": 49
                    }
                ]
            })
        ).toEqual([
            {
                "bidder": "AUCT",
                "unit": "banner",
                "bid": 35
            },
            {
                "bidder": "BIDD",
                "unit": "sidebar",
                "bid": 60
            }
        ]);
    });
    describe('ignores invalid bid', ()=>{
        it('because bidder is not permitted on given site', async ()=>{
            auctionsService = new Auctions({} as any, {write:jest.fn(out=>out/*console.warn(out)*/)} as any, {
                "sites": [
                    {
                        "name": "houseofcheese.com",
                        "bidders": ["BIDD"],
                        "floor": 32
                    }
                ],
                "bidders": [
                    {
                        "name": "AUCT",
                        "adjustment": -0.0625
                    },
                    {
                        "name": "BIDD",
                        "adjustment": 0
                    }
                ]
            });
            expect(auctionsService.validateBid(
                {
                    "name": "houseofcheese.com",
                    "bidders": ["BIDD"],
                    "floor": 32
                },
                ["banner"],
                auctionsService.adjust(
                    {
                        "name": "AUCT",
                        "adjustment": -0.0625
                    },
                    {
                        "bidder": "AUCT",
                        "unit": "banner",
                        "bid": 35
                    }
                )
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
                auctionsService.adjust(
                    {
                        "name": "AUCT",
                        "adjustment": -0.0625
                    },
                    {
                        "bidder": "AUCT",
                        "unit": "sidebar",
                        "bid": 70
                    }
                )
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
                auctionsService.adjust(
                    null as any,
                    {
                    "bidder": "JAMESBOND",
                    "unit": "sidebar",
                    "bid": 35
                    }
                )
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
                    "unit": "banner",
                    "bid": 35,
                    "adjusted": 30
                }
            )).toBe(false);
            const adjusted = auctionsService.adjust(
                    {
                        "name": "AUCT",
                        "adjustment": -0.0625
                    },
                    {
                        "bidder": "AUCT",
                        "unit": "sidebar",
                        "bid": 35
                    }
                );
            // From example input
            expect(auctionsService.validateBid(
                {
                    "name": "houseofcheese.com",
                    "bidders": ["AUCT","BIDD"],
                    "floor": 32
                },
                ["sidebar"],
                adjusted
            )).toBe(true);

            // From failing test
            expect(auctionsService.validateBid(
                {
                    "name": "houseofcheese.com",
                    "bidders": ["AUCT","BIDD"],
                    "floor": 32
                },
                ["banner"],
                auctionsService.adjust(
                    {
                        "name": "BIDD",
                        "adjustment": 0
                    },
                    {
                        "bidder": "BIDD",
                        "unit": "banner",
                        "bid": 1
                    }
                )
            )).toBe(false);

            expect(auctionsService.validateBid(
                {
                    "name": "houseofcheese.com",
                    "bidders": ["AUCT","BIDD"],
                    "floor": 32
                },
                ["sidebar"],
                {
                    "bidder": "AUCT",
                    "unit": "sidebar",
                    "bid": 35,
                    "adjusted": 32
                }
            )).toBe(true);
        });
    });
    describe('returns empty list of bids for an invalid auction', ()=>{
        it('because the site is not recognized', async ()=>{
            expect(
                auctionsService.process({
                    "site": "houseofcheeze.com",
                    "units": ["banner", "sidebar"],
                    "bids": [
                        {
                            "bidder": "AUCT",
                            "unit": "banner",
                            "bid": 35
                        },
                        {
                            "bidder": "BIDD",
                            "unit": "sidebar",
                            "bid": 60
                        },
                        {
                            "bidder": "AUCT",
                            "unit": "sidebar",
                            "bid": 55
                        }
                    ]
                })
            ).toEqual([]);
        });
        it('there are no valid bids', async ()=>{
            expect(
                // The Price is right!
                auctionsService.process({
                    "site": "houseofcheese.com",
                    "units": ["banner", "sidebar"],
                    "bids": [
                        {
                            "bidder": "AUCT",
                            "unit": "banner",
                            "bid": 1
                        },
                        {
                            "bidder": "BIDD",
                            "unit": "sidebar",
                            "bid": 1
                        },
                        {
                            "bidder": "AUCT",
                            "unit": "sidebar",
                            "bid": 1
                        }
                    ]
                })
            ).toEqual([]);
        });
    });
});