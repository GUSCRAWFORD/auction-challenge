import { gulpStandardInput } from "./index";
import { StartUp } from "./start-up";

const expectedAuctions = require('../path/to/test/input.json');
const expectedConfig =  require('../path/to/test/config.json');
/** Only execute the jest tests once */
let SPEC_RUN = false;
/*
1. _On start-up load `config.json` which lists all valid sites and bidders, and their configurations.
2. The program should then load the input (JSON) from standard input that contains a list of auctions to run.
   - Each auction lists the site
     - which ad units are being bid on
     - list of bids that have been requested on your behalf
*/
if (!SPEC_RUN) {
    SPEC_RUN = true;
    describe('Gus\'s Auction Challenge Start-up Tests', ()=>{
        let mockStandardInput;
        let startUpService: StartUp;
        beforeEach(()=>{
            StartUp.readFile = jest.fn((path:any)=>{
                expect(path).toBe(`${StartUp.defaultConfigPath}/${StartUp.defaultConfigFile}`);
                return Promise.resolve(Buffer.from(JSON.stringify(expectedConfig))) as any;
            });
            startUpService = new StartUp();
        });
        it('loads \'config.json\'', async ()=>{
            const actualConfig = await startUpService.configuration();
            expect(actualConfig).toEqual(expectedConfig);
        });
        it('reads stdin for auctions', async ()=>{
            const expectedAuctionsInput = JSON.stringify(expectedAuctions, null, '  ');
            mockStandardInput = new MockStandardInput([expectedAuctionsInput]);
            const actual = await gulpStandardInput(mockStandardInput as any);
            expect(actual).toBe(expectedAuctionsInput);
        });
    });
}
export class MockStandardInput {
    constructor(protected streamQueue:string[]) { }
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