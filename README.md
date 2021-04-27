# Gus' Auction Challenge Submission

## 👟 Quick Overview

1. [`yarn` (`yarn install`)](#npm-i) or [`npm i`](#npm-i) should install some dev-dependencies and run unit-tests in the host _(see output from [output of `yarn`](#npm-i))_
2. [`sudo yarn evaluation:prep`](#yarn-evaluationprep) or `sudo npm run yarn evaluation:prep` (from a unix-like host OS, use appropriate _`sudo`_ elevator) **[See _Special Instructions_](#-special-instructions) _(see output from [`yarn evaluation:prep`](#yarn-evaluationprep))_
3. Run your test-docker build command (`docker build -t challenge .`) _(see output from [`yarn evaluation:build`](#yarn-evaluationbuild))_
4. Run your test-docker run command (`docker run -i -v /path/to/test/config.json:/auction/config.json challenge < /path/to/test/input.json`) _(see output from [`yarn evaluation:test`](#yarn-evaluationtest))_
5. See _git history_ and [🕖 CHANGELOG](./CHANGELOG.md) for notes and process

_Thanks for reviewing!_
   
## 🎯 Special Instructions

1. [Run "Evaluation Preperation"](#evaluationprep)
   - `sudo yarn evaluation:prep` _Symbolically links_ the **📁 path** folder in this source-control to the absolute path **/path** in your host.
   - _or_ `sudo npm run evaluation:prep` 

### `evaluation:prep`

In order to execute the verbatim evaulation test line; please execute this line from your *Unix-like* host with _root privilege_ (i.e. you may need to prefix with _sudo ln -s \`pwd\`/path /path_):

[⚠ See Possible Issues](#-possible-issues)

```bash
ln -s `pwd`/path /path
```

## 🧪 Unit Testing

`yarn test` or `npm test`

## 🧱 Possible Issues

- When running evaluation line you get output like: `docker: Error response from daemon: not a directory.` you may have run the direct line illustrated from the [evaluation:prep](#evaluationprep) explanation (more than once)&mdash;please use the _guarded_ script that avoids accidently re-running that line and creating an additional sym-link called _path_ inside _path_.

**This caused me to have to reinstall my docker** 😂
  
---

Original README _as provided_

# Auction Coding Challenge

One of the things that the Engineering team at Sortable works on is software that
runs ad auctions, either in the browser or server-side. The goal of this challenge
is to write a program that will run a simple auction, while enforcing data validity.

## Concepts

Sortable manages ads on many different websites. Each site has a different
configuration: which bidders are permitted to bid on ads on that site, and an
auction 'floor' that bids must meet or exceed.

Each bidder also has a configuration. For this challenge we have significantly
reduced the configuration to consist of an adjustment to be applied to each bid
to account for the difference between how much the bidder claims that they'll
pay, and how much they will actually pay, based on historical data.

## Running the auctions

On start-up, your program should load the config file (`config.json`) which lists
all valid sites and bidders, and their respective configurations.

The program should then load the input (JSON) from standard input that contains
a list of auctions to run. Each auction lists the site, which ad units are being
bid on, and a list of bids that have been requested on your behalf.

For each auction, you should find the highest valid bidder for each ad unit, after
applying the adjustment factor. An adjustment factor of -0.01 means that bids are
reduced by 1%; an adjustment of 0.05 would increase them by 5%. (Positive
adjustments are rare in real life, but possible.)
For example, a bid of $0.95 and an adjustment
factor of 0.05 (adjusted to $0.9975) will beat a bid of $1.10 with an adjustment
factor of -0.1 (adjusted to $0.99). When reporting the winners, use the bid
amounts provided by the bidder, rather than the adjusted values.

It is possible that a bidder will submit multiple bids for the same ad unit in
the same auction.

A bid is invalid and should be ignored if the bidder is not permitted to bid on
this site, the bid is for an ad unit not involved in this auction, the bidder
is unknown, or if the *adjusted* bid value is less than the site's floor.

An auction is invalid if the site is unrecognized, or there are no valid bids.
In the case of an invalid auction, just return an empty list of bids.

The output of your program should be a JSON list of auction results printed to [stdout][stdout].
The result of each auction is a list of winning bids. The contents of `output.json`
are an example of valid output. Ensure that when run as above, the **only** output
of your program on stdout is the auction results.

## Inputs

Ensuring that inputs are well-formed (e.g. all fields are present and are of the
expected types) is important, but also uninteresting. You may therefore assume
that all inputs will be well-formed. All numeric values will be 64-bit floats (as
is default for JSON).

## Sample code and Dockerfiles

Sample config, inputs and expected output are included in this repo to help you
test your submission.

Also included are some sample Dockerfiles for various languages, to be used for
building and testing your submission. You may use any other language you are
comfortable with, though keep in mind that the code will be reviewed by a developer.
Rename the appropriate template to `Dockerfile`, or create your own.
By using Docker, you can ensure that we are building and running your
submission with the same toolchain as you.

## Evaluation

Your code will be first evaluated mechanically, running it through various test cases
to check its correctness. Your code will be built and run using these commands:

```bash
$ docker build -t challenge .
$ docker run -i -v /path/to/test/config.json:/auction/config.json challenge < /path/to/test/input.json
```

**Please ensure that your submission can be run this way.**

If your build process requires additional steps, please note them near the top of
your submission's README.md, but the end result must be a Docker image that can be
run using the command above.

After running our tests, the code will be reviewed by a developer. This is an opportunity
for you to demonstrate your knowledge of best practices, as well as your familiarity
with your chosen language, and its library ecosystem.

[stdout]: https://en.wikipedia.org/wiki/Standard_streams#Standard_output_(stdout)

---

# 📃 Testing Log

## `npm i`

```sh
gus@GUS-PC:~/test-auction-challenge$ git clone https://github.com/GUSCRAWFORD/auction-challenge.git
Cloning into 'auction-challenge'...
remote: Enumerating objects: 163, done.
remote: Counting objects: 100% (128/128), done.
remote: Compressing objects: 100% (61/61), done.
remote: Total 163 (delta 71), reused 115 (delta 58), pack-reused 35
Receiving objects: 100% (163/163), 37.77 KiB | 1.35 MiB/s, done.
Resolving deltas: 100% (86/86), done.
gus@GUS-PC:~/test-auction-challenge$ cd auction-challenge/
gus@GUS-PC:~/test-auction-challenge/auction-challenge$ yarn
yarn install v1.16.0
info No lockfile found.
[1/4] Resolving packages...
warning jest > jest-cli > jest-config > jest-environment-jsdom > jsdom > request-promise-native@1.0.9: request-promise-native has been deprecated because it extends the now deprecated request package, see https://github.com/request/request/issues/3142
warning jest > jest-cli > jest-config > jest-environment-jsdom > jsdom > request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
warning jest > jest-cli > jest-config > jest-environment-jsdom > jsdom > request > har-validator@5.1.5: this library is no longer supported
warning jest > @jest/core > jest-haste-map > sane > micromatch > snapdragon > source-map-resolve > resolve-url@0.2.1: https://github.com/lydell/resolve-url#deprecated
warning jest > @jest/core > jest-haste-map > sane > micromatch > snapdragon > source-map-resolve > urix@0.1.0: Please see https://github.com/lydell/urix#deprecated
[2/4] Fetching packages...
info fsevents@2.3.2: The platform "linux" is incompatible with this module.
info "fsevents@2.3.2" is an optional dependency and failed compatibility check. Excluding it from installation.
[3/4] Linking dependencies...
[4/4] Building fresh packages...

success Saved lockfile.
$ rimraf ./dist && tsc && jest
 PASS  src/start-up.spec.ts
 PASS  src/auctions.spec.ts
 PASS  src/index.spec.ts
  ● Console

    console.info
      [[{"bidder":"AUCT","unit":"banner","bid":35},{"bidder":"BIDD","unit":"sidebar","bid":60}]]

      at Object.stdout.write.jest.fn.str (src/index.spec.ts:29:17)


Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        3.317 s
Ran all test suites.
Done in 15.65s.
```

## `yarn evaluation:prep`

```sh
gus@GUS-PC:~/test-auction-challenge/auction-challenge$ sudo yarn evaluation:prep
yarn run v1.16.0
$ (ls /path && echo "Symbolic link path already exists") || (echo "Creating symbolic link '/path' to '`pwd`/path'" && ln -s `pwd`/path /path)
ls: cannot access '/path': No such file or directory
Creating symbolic link '/path' to '/home/gus/test-auction-challenge/auction-challenge/path'
Done in 0.12s.
```

## `yarn evaluation:build`

Should run the test command from [Evaluation](#evaluation): `docker build -t challenge .`

```sh
gus@GUS-PC:~/test-auction-challenge/auction-challenge$ yarn evaluation:build
yarn run v1.16.0
$ docker build -t challenge .
[+] Building 8.0s (11/11) FINISHED
 => [internal] load build definition from Dockerfile                                                                                                                                                                                                                       0.6s
 => => transferring dockerfile: 38B                                                                                                                                                                                                                                        0.0s
 => [internal] load .dockerignore                                                                                                                                                                                                                                          0.9s
 => => transferring context: 34B                                                                                                                                                                                                                                           0.0s
 => [internal] load metadata for docker.io/library/node:12                                                                                                                                                                                                                 2.6s
 => [auth] library/node:pull token for registry-1.docker.io                                                                                                                                                                                                                0.0s
 => [1/5] FROM docker.io/library/node:12@sha256:609103746810535f5a3a987a26ba4ce95d96225d28e9d6228faa5aa331980f37                                                                                                                                                           0.0s
 => [internal] load build context                                                                                                                                                                                                                                          0.6s
 => => transferring context: 116.09kB                                                                                                                                                                                                                                      0.2s
 => CACHED [2/5] WORKDIR /usr/src/app                                                                                                                                                                                                                                      0.0s
 => CACHED [3/5] COPY package.json .                                                                                                                                                                                                                                       0.0s
 => CACHED [4/5] RUN npm install                                                                                                                                                                                                                                           0.0s
 => [5/5] COPY . .                                                                                                                                                                                                                                                         1.2s
 => exporting to image                                                                                                                                                                                                                                                     2.0s
 => => exporting layers                                                                                                                                                                                                                                                    1.1s
 => => writing image sha256:2c57a463a9d05bb8c428cf6199041645c306490e6732c1f9d986eb4ca8e31f74                                                                                                                                                                               0.1s
 => => naming to docker.io/library/challenge                                                                                                                                                                                                                               0.1s

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
Done in 8.78s.
```

## `yarn evaluation:test`

Should run the run command from [Evaluation](#evaluation): `docker run -i -v /path/to/test/config.json:/auction/config.json challenge < /path/to/test/input.json`

```sh
gus@GUS-PC:~/test-auction-challenge/auction-challenge$ yarn evaluation:test
yarn run v1.16.0
$ docker run -i -v /path/to/test/config.json:/auction/config.json challenge < /path/to/test/input.json

> @guscrawford/auction-challenge@0.0.1 prestart /usr/src/app
> (ls ./dist && echo "Skipping build") || (echo "Build not found..." && tsc)

ls: cannot access './dist': No such file or directory
Build not found...

> @guscrawford/auction-challenge@0.0.1 start /usr/src/app
> node ./cli

[[{"bidder":"AUCT","unit":"banner","bid":35},{"bidder":"BIDD","unit":"sidebar","bid":60}]]
Done in 5.97s.
```