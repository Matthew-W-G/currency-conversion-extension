var originalText = " ";

//captures selected/highlighted text, then send it to base-determiner function
function originalValue (info) {
  return function (info) {
    var originalText = info.selectionText;
    detectBase(originalText);
  }
}


//variable for accessing exchange rate api
var ratesURL = "";

//identify currency symbols to detect currency base
function detectBase(text) {
    ratesURL = "https://api.exchangeratesapi.io/latest";
    if(text.includes("€")) {
        fetchURL(ratesURL, text);
    }
    else if(text.includes("$") ) {
        ratesURL = ratesURL + "?base=USD";
        fetchURL(ratesURL, text);
    }
    else if(text.includes("£") ) {
        ratesURL = ratesURL + "?base=GBP";
        fetchURL(ratesURL, text);
    }
}



function fetchURL(url, text) {
    //accesses data and then puts it into proper json formmatting
    alert("yoyo");
    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            console.log(data);
            //alert(data.rates["CAD"]);
            var x;   //for iterating through data
             var currency = new Array();
            var exRate = new Array();     
            for(x in data.rates) {
                currency.push(x);
                exRate.push(data.rates[x]);
            }
            convertAgainst(currency, exRate, text);
        })
        .catch(err => console.log(err));  //error handling  
} 

//takes in original highlighted text, eliminates extraneous letters and symbols
//irrelevant to the value, and converts all commas to periods to ensure a succesful
//float parsing
function filterToValue(text) {
    text = text.replace(/[^0-9\.]/g,'');
    return parseFloat(text);
}

function convertAgainst(currency, exRate, text) {
    var message = ""; 
    var baseValue = filterToValue(text);
    var convertedValue;
    var i;
    for(i = 0; i < currency.length; i++) {
        convertedValue = baseValue * parseFloat(exRate[i]);
        message += currency[i] + ":" + convertedValue.toString() + "\n";
    }
    alert(message);
}






//creates the context menu following a double/hold click that opens the option
//to get the currency box
chrome.contextMenus.create ({
  "title": "Convert Currency",
  "type": "normal",
  "contexts": ["selection"],
  "onclick": originalValue ()
});

