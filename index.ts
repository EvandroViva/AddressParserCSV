// var stdin = process.openStdin();

// stdin.addListener("data", function(d) {
//     // note:  d is an object, and when converted to a string it will
//     // end with a linefeed.  so we (rather crudely) account for that  
//     // with toString() and then trim() 
//     console.log("you entered: [" + 
//         d.toString().trim() + "]");
//   });

const csvFilePath='file.csv'
const csv=require('csvtojson')
var stringify = require('csv-stringify');
const fs = require('fs');

async function test()  {
// Async / await usage
const jsonArray=await csv({
    delimiter: ";"
}).fromFile(csvFilePath);

var newArray = jsonArray.map((obj) => {
    var newObj = obj
    var address = obj["address"]

    let regexCEP = /[0-9]{5}-?[0-9]{3}/;
    let cep = regexCEP.exec(address) || [];
    newObj["CEP"] = cep[0] || "none"

    address = address.replace(regexCEP, "")

    let regexStreetNumber1 = /n° ([0-9]{0,3}\.?[0-9]{1,3})/g;
    let streetNumberMatch = regexStreetNumber1.exec(address);


    if (streetNumberMatch == null) {

        let regexStreetNumber2 = /([0-9]{0,3}\.?[0-9]{1,3})/g;
        let streetNumber = address.match(regexStreetNumber2) || [];
        var strings = streetNumber as [string]
        let numberString = strings.reduce (function (prev, number) { return parseInt(number) > parseInt(prev) ? number : prev }, strings[0] || "-1")

        newObj["streetNumber"] = numberString

        address = address.replace(numberString, "")

    } else {

        newObj["streetNumber"] = streetNumberMatch[1]

        address = address.replace(streetNumberMatch[0], "")

    }
    

    let regexAP = /,? [-|,]? (.*)/u
    let ap = regexAP.exec(address) || [];

    newObj["ap"] = (ap[1] || "none").replace(/[,-]/,"").trim()

    // console.log(ap);
    
    address = address.replace(ap[0], "")

    newObj["street"] = address

    return newObj
})

 
stringify(newArray,{
    header: true,
    // columns: ['year', 'phone']
  }, function(err, output) {
    fs.writeFile('name.csv', output, 'utf8', function(err) {
      if (err) {
        console.log('Some error occured - file either not saved or corrupted file saved.');
      } else {
        console.log('It\'s saved!');
      }
    });
  });

 }

 test()