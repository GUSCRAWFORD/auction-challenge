import { StartUp } from './start-up';
import { MockStandardInput } from './start-up.spec';

const expectedAuctions = require('../path/to/test/input.json');
const expectedConfig =  require('../path/to/test/config.json');
const expectedOutput =  require('../output.json');
/*
### Running the auctions
4. The output of your program should be a JSON list of auction results printed to [stdout][stdout].
   - The result of each auction is a list of winning bids.
   - The contents of `output.json` are an example of valid output.
   - Ensure that when run as above, the **only** output of your program on stdout is the auction results.

   Sample config, inputs and expected output are included in this repo to help you test your submission.
 */
describe('Gus\'s Auction Challenge Tests', ()=>{
  let startUpService:StartUp;
  let stdin: NodeJS.ReadStream;
  let stdout: NodeJS.WriteStream;
  let stderr: NodeJS.WriteStream;
  let actual: string;
  beforeEach(()=>{
    actual = '';
    startUpService = new StartUp();
    startUpService.configuration = jest.fn(()=>Promise.resolve(expectedConfig));
    stdout = {
      write: jest.fn(str=>{
        actual += str;
        console.info(str);
        return true;
      })
    } as any;
    stderr = {
      write: jest.fn(str=>{
        console.error(str);
        return true;
      })
    } as any;
  })
  it('sample output matches actual output', async ()=>{
    stdin = new MockStandardInput([JSON.stringify(expectedAuctions)]) as any;
    
    await startUpService.run(stdin, stdout, stderr);

    expect(actual).toMatch(JSON.stringify(expectedOutput));
  });
});

