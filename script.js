let fs = require('fs')
let request = require('request')
let axios = require('axios')
var mkdirp = require('mkdirp')


let errList = []
mkdirp('HI', err => {
    if (err) console.log(err)
    else DL(0)
});

function DL(i) {
    axios.get('http://traffic.libsyn.com/hellointernet/' + i + '.mp3')
        .then(res => {
            request
                .get(res.request.res.responseUrl)
                .on('error', err => {
                    console.log("ERROR: episode " + i)
                    errList.push(i)
                    next(i)
                })
                .pipe(fs.createWriteStream('HI/HI' + i + '.mp3'))
                .on('finish', () => {
                    console.log("succesfully downloaded episode " + i)
                    next(i)
                })
        }).catch(err => {
            console.log("ERROR: episode " + i)
            errList.push(i)
            next(i)
        })
}

function next(p) {
    p++
    if (p <= 101)
        DL(p)
    else {
        let o = "please manually download episodes:\n" + errList.join("\n ")
        console.log(o)
        let stream = fs.createWriteStream("errorList.txt")
        stream.once('open', fd => {
            stream.write(o)
            stream.end()
        })
    }
}
