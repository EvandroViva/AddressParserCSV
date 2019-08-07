const csvFilePath='file.csv'

const fs = require('fs');
var path = require('path');


var filePath = path.join(__dirname, csvFilePath);
// Read CSV
var f = fs.readFileSync(filePath, {encoding: 'utf-8'}, 
    function(err){console.log(err);});

// Split on row
f = f.split("\n");

// Get first row for column headers
headers = f.shift().split(",")

var jsonArray = [];    
f.forEach(function(d){
    // Loop through each row
    tmp = {}
    row = d.split(",")
    for(var i = 0; i < headers.length; i++){
        tmp[headers[i].replace("\r","")] = row[i].replace("\r","");
    }
    // Add object to list
    jsonArray.push(tmp);
});

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
        var strings = streetNumber
        let numberString = strings.reduce(function (prev, number) { return parseInt(number) > parseInt(prev) ? number : prev }, strings[0] || "-1")
  
        newObj["streetNumber"] = numberString
  
        address = address.replace(numberString, "")
  
      } else {
  
        newObj["streetNumber"] = streetNumberMatch[1]
  
        address = address.replace(streetNumberMatch[0], "")
  
      }
      
  
      let regexAP = /,? [-|,]? (.*)/u
      let ap = regexAP.exec(address) || [];
  
      newObj["ap"] = (ap[1] || "none").replace(/[,-]/, "").trim()
  
      // console.log(ap);
      
      address = address.replace(ap[0], "")
  
      newObj["street"] = address
  
      return newObj
    })
  
    
  
  
    // 1. One way - if you want the results to be in double quotes and you have comas inside
    
    // choose another string to temporally replace commas if necessary
    let stringToReplaceComas = ';';
  
    var values = newArray.map((singleRow) => {
      var test = []
      Object.keys(singleRow).forEach(index => {
        var value = singleRow[index] || ""
        test.push(value)
      })
      return test
    })

  // let csvText = `"${newArray.join('"\n"').replace(/,/g, '","')}"`;
  // // or like this
    let csvText = `"${values.join('"\n"').split(',').join('","')}"`;

    
  
  csvText = csvText.replace(new RegExp(`${stringToReplaceComas}`, 'g'), ',');
  
  // // 2. Another way - if you don't need the double quotes in the generated csv and you don't have comas in rows' values
  // let csv = myObj.rows.join('\n')
  
  fs.writeFile('name.csv', csvText, 'utf8', function (err) {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.');
    } else {
      console.log('It\'s saved!');
    }
  });



