#!/usr/bin/env node
const { StartUp } = require('./dist/start-up');
new StartUp().run(process.stdin, process.stdout, process.stderr).then(()=>process.exit(0)).catch(()=>process.exit(1));