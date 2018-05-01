let fs = require('fs')
let request = require('request');
let axios = require('axios')
var mkdirp = require('mkdirp');


// path exists unless there was an error

let errList = []
mkdirp('HI', function (err) {
    DL(0)
});

function DL(i) {
    axios.get('http://traffic.libsyn.com/hellointernet/' + i + '.mp3')
        .then(function (res) {
            request
                .get(res.request.res.responseUrl)
                .on('error', function (err) {
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
        let o = "please manually download episodes: " + errList.join(", ")
        console.log(o)
        var stream = fs.createWriteStream("errorList.txt");
        stream.once('open', function (fd) {
            stream.write(o);
            stream.end();
        })
    }
}
