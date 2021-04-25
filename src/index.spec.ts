import { gulpStandardInput } from './index';
/*
### Running the auctions
4. The output of your program should be a JSON list of auction results printed to [stdout][stdout].
   - The result of each auction is a list of winning bids.
   - The contents of `output.json` are an example of valid output.
   - Ensure that when run as above, the **only** output of your program on stdout is the auction results.
 */
let mockStandardInput:MockStandardInput;
describe('Gus\'s Auction Challenge Tests', ()=>{
    it('runs', async ()=>{
        const expected = "test input"
        mockStandardInput = new MockStandardInput([expected])
        try {
            const actual = await gulpStandardInput(mockStandardInput as any);
            expect(actual).toBe(expected);
        } catch (e) {
            throw e;
        }
    });
});

class MockStandardInput {
    constructor(protected streamQueue:string[]) {

    }
    protected finished?:()=>void;
    /**
     * Create `MockStandardInput` with a preset queue of test input
     */
    on = jest.fn(
        (eventName:'data'|'end', callback:(data?:Buffer)=>void)=>{
            if (eventName === 'data') {
                callback(Buffer.from(this.streamQueue.pop() as string));
            } else {
                this.finished = callback;
            }
            if (this.streamQueue.length === 0 && this.finished) {
                this.finished();
            }
        }
    )
}