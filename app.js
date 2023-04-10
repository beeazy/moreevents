const express = require('express');
const app = express();
const fs = require('fs');

app.get('/events', function (req, res) {
    fs.readFile(__dirname + "/" + "kmEvents.json", 'utf8', function (err, data) {
        // console.log("data", data);

        res.end( data );
    });
})

const server = app.listen(8081, function(){
    const host = server.address().address
    const port = server.address().port

    console.log("app listening at http://%s:%s", host, port)
})
