export function gulpStandardInput(stdin?:NodeJS.ReadStream) {
    return new Promise(
        (resolve, reject)=>{
            try {
                let streamed = '';
                stdin?.on('data', (chunk) => streamed += `${chunk}`);
                stdin?.on('end', ()=> resolve(streamed));
                stdin?.on('error', (e)=>reject(e));
            } catch(e) {
                reject(e);
            }
        }
    )
}