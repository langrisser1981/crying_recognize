var fs = require('fs'); 
var parse = require('csv-parse');

var csvData=[];
fs.createReadStream('data.csv')
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        console.log(csvrow);
        //do something with csvrow
        csvData.push(csvrow);        
    })
    .on('end',function() {
      //do something wiht csvData
      console.log(csvData);
    });
