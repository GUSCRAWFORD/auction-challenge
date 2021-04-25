import { promisify } from 'util';
import { readFile} from 'fs';
import { join as xpath } from 'path';
import { Bidder, Site } from '.';
const readFileAsync = promisify(readFile);
/**
 * Implements 'startup' related routines
 * Set a mock-implementation on `StartUp.readFile` for testing to avoid file-reads
 */
export class StartUp {
    static defaultConfigFile = "config.json";
    static defaultConfigPath = "auctions";
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
    async configuration(configPath= StartUp.defaultConfigPath, configFile=StartUp.defaultConfigFile):Promise<{
        sites:Site[],
        bidders:Bidder[]
    }> {
        try {
            const configuration = `${await StartUp.readFile(xpath(configPath, configFile))}`;
            return JSON.parse(configuration);
        } catch (e) {
            throw new StartUpError(e, StartUpErrorMessage.noConfig);
        }
    }
}

export class StartUpError extends Error {
    constructor(public inner?:Error, message?:StartUpErrorMessage) {
        super(message);
        this.stack = (this.stack || '') + inner?.stack;
    }
}

export enum StartUpErrorMessage {
    noConfig = "Can't find config."
}