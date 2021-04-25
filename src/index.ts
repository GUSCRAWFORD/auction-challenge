console.info('Your app starts...');
gulpStandardInput().then(
    (input)=>console.log(`Your app runs:\n${input}`)
).catch(
    (e)=>console.error(e)
);
function gulpStandardInput() {
    return new Promise(
        (resolve, reject)=>{
            try {
                let streamed = '';
                process.stdin.on('data', (chunk) => streamed += `${chunk}`);
                process.stdin.on('end', ()=> resolve(streamed));
                process.stdin.on('error', (e)=>reject(e));
            } catch(e) {
                reject(e);
            }
        }
    )
}