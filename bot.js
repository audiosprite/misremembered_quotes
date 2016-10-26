var request = require('request');
var Twit = require('twit');

var T = new Twit({
  consumer_key:         'eSx3w2bdTgoF1fcDvCbTcdXJD',
  consumer_secret:      'Xme1NBCpxSSmCFtsE7SPth02L6TqkA5WsEA4c0XtlvE42gQ1hK',
  access_token:         '791364185124929538-qKSkmXtenUyPYAaDqNGrKN1nablzKVw',
  access_token_secret:  'ETM5hPluRf7pgDIR71iJhq9rcTk4TzMclQpAdpWbSOeta',
  timeout_ms:           60*1000
})

var quoteApi = {
    url: 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous',
    headers: {
        'X-Mashape-Key': 'qd2UyseSeymshXYk8px5uHFxEDhLp1FKGqajsnmuwSGzCJLpvh',
        'Accept': 'application/json'
    }
}

var word = {
    url: 'https://wordsapiv1.p.mashape.com/words/',
    headers: {
        'X-Mashape-Key': 'qd2UyseSeymshXYk8px5uHFxEDhLp1FKGqajsnmuwSGzCJLpvh',
        'Accept': 'application/json'
    }
}

request.get(quoteApi, function(err, res, body){
    let info = JSON.parse(body);
    var fullquote = info.quote + " - " + info.author;
    var author = info.author;
    console.log(fullquote);
    if (fullquote.length > 140) throw new Error('too long');
    var quoteArr = info.quote.split(" ");
    var wordToAlter = Math.floor(Math.random() * (quoteArr.length + 1));
    word.url = 'https://wordsapiv1.p.mashape.com/words/' + quoteArr[wordToAlter] + '/rhymes';
    console.log(word.url);

    // compare part of speech eg 'definite article'
    // request.get(word, function(err, res, body){
    //     let info = JSON.parse(body);
    //     console.log(info.results);
    // })

    request.get(word, function(err, res, body){
        let info = JSON.parse(body);
        // console.log(info.rhymes);
        console.log(info.rhymes.all[0]);
        if (info.rhymes.all[0]){
            var rhymeToReplace = Math.floor(Math.random() * (info.rhymes.all.length + 1));
            quoteArr[wordToAlter] = info.rhymes.all[rhymeToReplace];
            var finalQuote = quoteArr.join(" ") + " - " + author;
            T.post('statuses/update', {status: finalQuote }, function(err, data, res){
                console.log(data);
            })
        }
    })
});