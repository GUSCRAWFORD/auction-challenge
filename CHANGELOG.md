# 🕖 CHANGELOG

**Sat Apr 24**

---

## Digesting Project

⏱ 13:12:54 EDT 2021 (~19m)

The goal of this challenge is to write a program that will run a simple auction, while enforcing data validity.

### Concepts

- `site`
  - `configuration` _which bidders are permitted to bid on ads on that site, and an auction 'floor' that bids must meet or exceed_
- `bidder`
  - `configuration`. _adjustment to be applied to each bid to account for the difference between how much the bidder claims that they'll pay, and how much they will actually pay, based on historical data_

### Running the auctions

1. _On start-up load `config.json` which lists all valid sites and bidders, and their configurations.
2. The program should then load the input (JSON) from standard input that contains a list of auctions to run.
   - Each auction lists the site
     - which ad units are being bid on
     - list of bids that have been requested on your behalf
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
4. The output of your program should be a JSON list of auction results printed to [stdout][stdout].
   - The result of each auction is a list of winning bids.
   - The contents of `output.json` are an example of valid output.
   - Ensure that when run as above, the **only** output of your program on stdout is the auction results.

### Inputs

- You may assume that all inputs will be well-formed.
- All numeric values will be 64-bit floats (as is default for JSON).

### Sample code and Dockerfiles

Sample config, inputs and expected output are included in this repo to help you test your submission.

Also included are some sample Dockerfiles for various languages, to be used for building and testing your submission. You may use any other language you are comfortable with, though keep in mind that the code will be reviewed by a developer.

Rename the appropriate template to `Dockerfile`, or create your own.

By using Docker, you can ensure that we are building and running your submission with the same toolchain as you.

### Evaluation

Your code will be first evaluated mechanically, running it through various test cases to check its correctness. Your code will be built and run using these commands:

```bash
$ docker build -t challenge .
$ docker run -i -v /path/to/test/config.json:/auction/config.json challenge < /path/to/test/input.json
```

**Please ensure that your submission can be run this way.**

If your build process requires additional steps, please note them near the top of your submission's README.md, but the end result must be a Docker image that can be run using the command above.

After running our tests, the code will be reviewed by a developer. This is an opportunity for you to demonstrate your knowledge of best practices, as well as your familiarity with your chosen language, and its library ecosystem.

[stdout](https://en.wikipedia.org/wiki/Standard_streams#Standard_output_(stdout))

---

## Setting up Workspace

⏱ 13:43:21 (~90m)

1. > Rename the appropriate template to `Dockerfile`, or create your own.
2. Initialize a node-package: `yarn init`
3. Add some helpful scripts
4. Run evaluation scenario
   - Expecting some failures:
     - Volume mappings
     - No start command etc.
5. Writing safe "start" command / entry point

---

## Adding Tests

⏱ 21:19:19 (~45m)

Organizes [reduced details of _Running the auctions_](#running-the-auctions) into an initial set of red-light tests and separations of concern I'm seeing.

**Sat Apr 24**

⏱ 00:33:11 (~90m)

Green-lights _start-up_ and _auctions::validateBid_ tests

⏱ 10:35:51 (~45m)

Green-lights remaining initial test set

🎯 Because of the way `ln -s` (one of the forms works) I royally mucked my docker service by creating some kind of loop of sym-links that caused it to hang on start.  I'm not counting time I took to _reinstall_ that and re-test this in it's finished context...

---

## Final Review

⏱ 12:25:06 (~90m)

1. Fixing some overall paths etc.
2. I mucked my docker and unit-tested my way through most of this
3. I finsihed some more practical work against the host-os
4. Finally re-installed my docker and tested from scratch

---

## Revision

1. After re-reading and noticing output.json is not a trick; I've adjust tests and the submission fails now 🤬
2. I (considering that the original input order of properties in the JSON form passed in may be reordered when stringifying) updated the tests to reflect a detail I missed and spent some extra time in final review (~60m)

---

## ⏱ (~440m) ~ 7 Hours

---

## Revision 2

> A few minor hiccups getting it running.
>
> 1. [TSC was not being installed](#tsc-not-installing) within the docker image. As a result no “dist” directory was being compiled. I fixed this and got it to run successfully.
> 2. Verbosity of NPM log level was breaking the auction check. I won’t hold this against the candidate. --silent attribute fixed the console output.
> 3. Application writing some event information to console that broke some tests. Easy enough to comment out. Again I won’t hold this against the candidate, commenting out logs easy enough to do.
>
> As far as the solution itself is concerned…
> 1. Initially only 2/7 test suites pass
> 2. Fixed bid flooring by changing an operator from “>” to “>=”. At this point I got 3/7 tests to pass
> 3. Bid adjustments were also failing. Although the adjustment is being calculated correctly there were two problems preventing the tests from passing. First the logic comparing bids to find the highest winning bid was comparing the adjusted value vs non adjusted values of two bids. When it should only be concerned with comparing both adjusted values. After attempting to fix this I noticed that the adjusted value property was being deleted before it could be used in subsequent compares. I fixed both of these and got 4/7 tests to pass.
> 4. Invalid bids are still being included in the results, even though the winning bids are at least sorted correctly. No bid filtering is present
> 5. Casting to any to get around undefined errors is a bit hacky.

### TSC not Installing

This is the effect of running npm install on my host system; I would expect the docker image to have installed _typescript_ and other dev-dependencies at this point in the image-building:

```sh
gus@GUS-PC:~/test-auction-challenge/auction-challenge$ npm install
npm WARN deprecated resolve-url@0.2.1: https://github.com/lydell/resolve-url#deprecated
npm WARN deprecated urix@0.1.0: Please see https://github.com/lydell/urix#deprecated
npm WARN deprecated request-promise-native@1.0.9: request-promise-native has been deprecated because it extends the now deprecated request package, see https://github.com/request/request/issues/3142
npm WARN deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
npm WARN deprecated har-validator@5.1.5: this library is no longer supported
npm WARN rm not removing /home/gus/test-auction-challenge/auction-challenge/node_modules/.bin/uuid as it wasn't installed by /home/gus/test-auction-challenge/auction-challenge/node_modules/uuid
npm WARN rm not removing /home/gus/test-auction-challenge/auction-challenge/node_modules/.bin/semver as it wasn't installed by /home/gus/test-auction-challenge/auction-challenge/node_modules/semver

> @guscrawford/auction-challenge@0.0.1 postinstall /home/gus/test-auction-challenge/auction-challenge
> rimraf ./dist && tsc && jest

 PASS  src/start-up.spec.ts
 PASS  src/index.spec.ts
  ● Console

    console.info
      [[{"bidder":"AUCT","unit":"banner","bid":35},{"bidder":"BIDD","unit":"sidebar","bid":60}]]

      at Object.stdout.write.jest.fn.str (src/index.spec.ts:29:17)

 PASS  src/auctions.spec.ts

Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        1.181 s, estimated 3 s
Ran all test suites.
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@^2.1.2 (node_modules/jest-haste-map/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN jest-config@26.6.3 requires a peer of ts-node@>=9.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN jsdom@16.5.3 requires a peer of canvas@^2.5.0 but none is installed. You must install peer dependencies yourself.
npm WARN ws@7.4.5 requires a peer of bufferutil@^4.0.1 but none is installed. You must install peer dependencies yourself.
npm WARN ws@7.4.5 requires a peer of utf-8-validate@^5.0.2 but none is installed. You must install peer dependencies yourself.

added 43 packages from 23 contributors, removed 55 packages, updated 485 packages and audited 531 packages in 28.993s
found 0 vulnerabilities
```

### Solution Issues

#### [Presumption] Between 2 and 3 of 7 Test Suites Pass

You are referring to end-to-end tests you guys have written _and not_ the unit-tests I included.

1. There are 3 suites and 15 tests
   1. The last submission I gave had all tests passing
2. Having to fix the bid-flooring logic greatly disappoints me personally; I should lose extra points for having coded the _right solution_ if you look at commit `038b2c70f2b6dd9d909a9d3f0fe1c994a7ea8703` and then _kind of needlessly changing this_ in a mad-freak-out of alterations rather early during revision and before starting work.


#### Bid adjustments were also failing...
> Although the adjustment is being calculated correctly there were two problems preventing the tests from passing. First the logic comparing bids to find the highest winning bid was comparing the adjusted value vs non adjusted values of two bids. When it should only be concerned with comparing both adjusted values. After attempting to fix this I noticed that the adjusted value property was being deleted before it could be used in subsequent compares. I fixed both of these and got 4/7 tests to pass.

1. "The logic ... to find the highest winning bid was comparing the adjusted value vs non adjusted values ..."
   - I added a breaking test based on that description 
2. I fixed both of these and got 4/7 tests to pass.
   - Other possible e2e tests I'm not considering:
     - I noticed reordering of properties etc.