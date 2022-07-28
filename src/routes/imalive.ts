import fs from 'fs';

const setParameters = (myHTML: any, params: any) => {
    //return myHTML.toString().replace('<% titulo %>', JSON.stringify(params.titulo));
    return myHTML.toString().split('<% titulo %>').join(JSON.stringify(params.titulo));
}

const readFilePromise = (path: string, opts = 'utf8') =>
  new Promise((resolve, reject) => {
    fs.readFile(path, opts, (err: any, data: any) => {
        if (err) {
            console.log('Error de carga de archivo: ', path, err)
            reject(err)
      } 
      else resolve(data)
    })
  })

const showImAlive = (htmlFile: string, params: string) => {
    return async function (req: any, res: any) {
        readFilePromise(htmlFile)
        .then( (html) =>  { 
            res.status(200).send(setParameters(html, params)) 
        } )
        .catch((e) => {             
            res.status(200).send('Error de carga de archivo: '+ htmlFile) 
        });
    }
}
module.exports = {
    showImAlive
}