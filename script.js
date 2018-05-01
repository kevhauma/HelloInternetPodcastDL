let fs = require('fs')
let request = require('request')
let axios = require('axios')
let mkdirp = require('mkdirp')
let ffmetadata = require("ffmetadata");
let alt_filenames = require("./alt_filenames.json")
let errList = []
let titleFile
fs.readFile('./titles.txt', 'utf8', function (err, data) {
    titleFile = data.replace(/\n/g, '').split(";")
})

mkdirp('HI', err => {
    if (err) console.log(err)
    else DL(1)
});

function DL(i) {
    let filename = i + ""

    if (alt_filenames[i])
        filename = alt_filenames[i]

    axios.get('http://traffic.libsyn.com/hellointernet/' + filename + '.mp3')
        .then(res => {
            request
                .get(res.request.res.responseUrl)
                .on('error', err => {
                    console.log("ERROR: episode " + i)
                    errList.push(i)
                    next(i)
                })
                .pipe(fs.createWriteStream('HI/HI' + i + ": " + titleFile[i] + '.mp3'))
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
