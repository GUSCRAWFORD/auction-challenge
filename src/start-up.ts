import { promisify } from 'util';
import { readFile} from 'fs';
import { join as xpath } from 'path';
import { Bidder, Site } from '.';
import { Auctions } from './auctions';
const readFileAsync = promisify(readFile);
/**
 * Implements 'startup' related routines
 * Set a mock-implementation on `StartUp.readFile` for testing to avoid file-reads
 */
export class StartUp {
    static defaultConfigFile = process.env.AUCTIONS_DEFAULT_CONFIG_FILE || "config.json";
    static defaultConfigPath = process.env.AUCTIONS_DEFAULT_CONFIG_PATH || "/auction";
    static readFile = readFileAsync;
    /**
     * 
     * @param configPath 
     * @param configFile 
     * @example
     * {
     *    "sites": [
     *        {
     *            "name": "houseofcheese.com",
     *            "bidders": ["AUCT", "BIDD"],
     *            "floor": 32
     *        }
     *    ],
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
     *}
     */
    async configuration(configPath= StartUp.defaultConfigPath, configFile=StartUp.defaultConfigFile):Promise<StartUpConfiguration> {
        try {
            const configuration = `${await StartUp.readFile(xpath(configPath, configFile))}`;
            return JSON.parse(configuration);
        } catch (e) {
            throw new StartUpError(e, StartUpErrorMessage.noConfig);
        }
    }
    /**
     * Process the auctions read from stdin
     * - Load the configuration
     * - Read stdin
     * - `Auctions::process(...)`
     * @param stdin 
     */
    async run(stdin:NodeJS.ReadStream, stdout: NodeJS.WriteStream, stderr: NodeJS.WriteStream) {
        try {
            const auctionsService = new Auctions(stdin, stderr, await this.configuration());
            const auctionsToRun = await auctionsService.read();
            const processedAuctions = auctionsToRun.map(auction=>auctionsService.process(auction));
            stdout.write(JSON.stringify(processedAuctions)+'\n', e=>stderr.write(`${e?.message}\n`));
            return processedAuctions;
        } catch (e) {
            stderr.write(e.message+'\n');
            throw e;
        }
    }
}
export interface StartUpConfiguration {
    sites:Site[],
    bidders:Bidder[]
}
export class StartUpError extends Error {
    constructor(public inner?:Error, message?:StartUpErrorMessage) {
        super(message + (inner?` (${inner?.message})`:''));
        this.stack = (this.stack || '') + inner?.stack;
    }
}

export enum StartUpErrorMessage {
    noConfig = "Can't find config."
}