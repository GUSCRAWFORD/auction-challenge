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

---

## ⏱ (~380m) ~ 6 Hours