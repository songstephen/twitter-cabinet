// functions

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}

function renderTweets(sort, candidate) {
    $('#' + candidate + '-tweets').empty();
    for (var i = 0; i < 10; i++) {
        if (candidate == 'sanders') {
            if (sort == 'pos') tweet = sanders_pos_sorted[i];
            else if (sort == 'neu') tweet = sanders_neu_sorted[i];
            else if (sort == 'neg') tweet = sanders_neg_sorted[i];
        } else if (candidate == 'clinton') {
            if (sort == 'pos') tweet = clinton_pos_sorted[i];
            else if (sort == 'neu') tweet = clinton_neu_sorted[i];
            else if (sort == 'neg') tweet = clinton_neg_sorted[i];
        } else if (candidate == 'trump') {
            if (sort == 'pos') tweet = trump_pos_sorted[i];
            else if (sort == 'neu') tweet = trump_neu_sorted[i];
            else if (sort == 'neg') tweet = trump_neg_sorted[i];
        } else if (candidate == 'cruz') {
            if (sort == 'pos') tweet = cruz_pos_sorted[i];
            else if (sort == 'neu') tweet = cruz_neu_sorted[i];
            else if (sort == 'neg') tweet = cruz_neg_sorted[i];
        }
        $('#' + candidate + '-tweets').append('<div class="column" id="' + candidate + '-tweet' + (i + 1) + '"></div>');
        twttr.widgets.createTweet(tweet.tweetID, $("#" + candidate + "-tweet" + (i + 1))[0], 
          {
            conversation : 'none',    // or all
            cards        : 'hidden',  // or visible 
            theme        : 'light'    // or dark
          });
    }
}

// page setup

var topic = decodeURIComponent($.urlParam('topic').replace(/\+/g, '%20'));
$(".topic").html(topic);
$('.menu .item').tab('change tab', 'sanders');
$('.ui.dropdown').dropdown({
    action: 'activate',
    onChange: function(value, text, $selectedItem) {
        sort = value.split('-')[1];
        candidate = value.split('-')[0];
        renderTweets(sort, candidate);
    }
});

// sanders

$.getJSON("data/BernieSandersSentimentPretty.json", function(data){ // this had to be cleaned

    var sanders_tweets = [];
    var sanders_tweets_neg = [];
    var sanders_tweets_neu = [];
    var sanders_tweets_pos = [];
    var sanders_neg = 0;
    var sanders_neu = 0;
    var sanders_pos = 0;

    for (var i = 0; i < data.collection.length; i++) {
        tweet = data.collection[i];
        if (tweet.topic == topic) {
            sanders_tweets.push(tweet);
            sanders_tweets_neg.push(tweet);
            sanders_tweets_neu.push(tweet);
            sanders_tweets_pos.push(tweet);
            sanders_neg += tweet.sentiment['neg'];
            sanders_neu += tweet.sentiment['neu'];
            sanders_pos += tweet.sentiment['pos'];
            $("#sanders-num").html("Analyzed " + sanders_tweets.length + " tweets from Sanders's followers");
        }
    }

    sanders_neg /= sanders_tweets.length;
    sanders_neu /= sanders_tweets.length;
    sanders_pos /= sanders_tweets.length;
    sanders_neg_sorted = sanders_tweets_neg.sort(function(a, b){return b.sentiment.neg-a.sentiment.neg});
    sanders_neu_sorted = sanders_tweets_neu.sort(function(a, b){return b.sentiment.neu-a.sentiment.neu});
    sanders_pos_sorted = sanders_tweets_pos.sort(function(a, b){return b.sentiment.pos-a.sentiment.pos});

    $('#sanders-pos-bar').progress({
        text: {
            active: 'Positive: ' + Math.round(sanders_pos * 10000) / 100
        },
        percent: sanders_pos * 100
    });
    $('#sanders-neu-bar').progress({
        text: {
            active: 'Neutral: ' + Math.round(sanders_neu * 10000) / 100
        },
        percent: sanders_neu * 100
    });
    $('#sanders-neg-bar').progress({
        text: {
            active: 'Negative: ' + Math.round(sanders_neg * 10000) / 100
        },
        percent: sanders_neg * 100
    });

    renderTweets('neg', 'sanders');
    
});

// clinton

$.getJSON("data/HillaryClintonSentimentPretty.json", function(data){ // this had to be cleaned

    var clinton_tweets = [];
    var clinton_tweets_neg = [];
    var clinton_tweets_neu = [];
    var clinton_tweets_pos = [];
    var clinton_neg = 0;
    var clinton_neu = 0;
    var clinton_pos = 0;

    for (var i = 0; i < data.collection.length; i++) {
        tweet = data.collection[i];
        if (tweet.topic == topic) {
            clinton_tweets.push(tweet);
            clinton_tweets_neg.push(tweet);
            clinton_tweets_neu.push(tweet);
            clinton_tweets_pos.push(tweet);
            clinton_neg += tweet.sentiment['neg'];
            clinton_neu += tweet.sentiment['neu'];
            clinton_pos += tweet.sentiment['pos'];
            $("#clinton-num").html("Analyzed " + clinton_tweets.length + " tweets from Clinton's followers");
        }
    }

    clinton_neg /= clinton_tweets.length;
    clinton_neu /= clinton_tweets.length;
    clinton_pos /= clinton_tweets.length;
    clinton_neg_sorted = clinton_tweets_neg.sort(function(a, b){return b.sentiment.neg-a.sentiment.neg});
    clinton_neu_sorted = clinton_tweets_neu.sort(function(a, b){return b.sentiment.neu-a.sentiment.neu});
    clinton_pos_sorted = clinton_tweets_pos.sort(function(a, b){return b.sentiment.pos-a.sentiment.pos});

    $('#clinton-pos-bar').progress({
        text: {
            active: 'Positive: ' + Math.round(clinton_pos * 10000) / 100
        },
        percent: clinton_pos * 100
    });
    $('#clinton-neu-bar').progress({
        text: {
            active: 'Neutral: ' + Math.round(clinton_neu * 10000) / 100
        },
        percent: clinton_neu * 100
    });
    $('#clinton-neg-bar').progress({
        text: {
            active: 'Negative: ' + Math.round(clinton_neg * 10000) / 100
        },
        percent: clinton_neg * 100
    });

    renderTweets('neg', 'clinton');
    
});

// trump

$.getJSON("data/realDonaldTrumpSentimentPretty.json", function(data){ // this had to be cleaned

    var trump_tweets = [];
    var trump_tweets_neg = [];
    var trump_tweets_neu = [];
    var trump_tweets_pos = [];
    var trump_neg = 0;
    var trump_neu = 0;
    var trump_pos = 0;

    for (var i = 0; i < data.collection.length; i++) {
        tweet = data.collection[i];
        if (tweet.topic == topic) {
            trump_tweets.push(tweet);
            trump_tweets_neg.push(tweet);
            trump_tweets_neu.push(tweet);
            trump_tweets_pos.push(tweet);
            trump_neg += tweet.sentiment['neg'];
            trump_neu += tweet.sentiment['neu'];
            trump_pos += tweet.sentiment['pos'];
            $("#trump-num").html("Analyzed " + trump_tweets.length + " tweets from Trump's followers");
        }
    }

    trump_neg /= trump_tweets.length;
    trump_neu /= trump_tweets.length;
    trump_pos /= trump_tweets.length;
    trump_neg_sorted = trump_tweets_neg.sort(function(a, b){return b.sentiment.neg-a.sentiment.neg});
    trump_neu_sorted = trump_tweets_neu.sort(function(a, b){return b.sentiment.neu-a.sentiment.neu});
    trump_pos_sorted = trump_tweets_pos.sort(function(a, b){return b.sentiment.pos-a.sentiment.pos});

    $('#trump-pos-bar').progress({
        text: {
            active: 'Positive: ' + Math.round(trump_pos * 10000) / 100
        },
        percent: trump_pos * 100
    });
    $('#trump-neu-bar').progress({
        text: {
            active: 'Neutral: ' + Math.round(trump_neu * 10000) / 100
        },
        percent: trump_neu * 100
    });
    $('#trump-neg-bar').progress({
        text: {
            active: 'Negative: ' + Math.round(trump_neg * 10000) / 100
        },
        percent: trump_neg * 100
    });

    renderTweets('neg', 'trump');
    
});

// cruz

$.getJSON("data/tedcruzSentimentPretty.json", function(data){ // this had to be cleaned

    var cruz_tweets = [];
    var cruz_tweets_neg = [];
    var cruz_tweets_neu = [];
    var cruz_tweets_pos = [];
    var cruz_neg = 0;
    var cruz_neu = 0;
    var cruz_pos = 0;

    for (var i = 0; i < data.collection.length; i++) {
        tweet = data.collection[i];
        if (tweet.topic == topic) {
            cruz_tweets.push(tweet);
            cruz_tweets_neg.push(tweet);
            cruz_tweets_neu.push(tweet);
            cruz_tweets_pos.push(tweet);
            cruz_neg += tweet.sentiment['neg'];
            cruz_neu += tweet.sentiment['neu'];
            cruz_pos += tweet.sentiment['pos'];
            $("#cruz-num").html("Analyzed " + cruz_tweets.length + " tweets from Cruz's followers");
        }
    }

    cruz_neg /= cruz_tweets.length;
    cruz_neu /= cruz_tweets.length;
    cruz_pos /= cruz_tweets.length;
    cruz_neg_sorted = cruz_tweets_neg.sort(function(a, b){return b.sentiment.neg-a.sentiment.neg});
    cruz_neu_sorted = cruz_tweets_neu.sort(function(a, b){return b.sentiment.neu-a.sentiment.neu});
    cruz_pos_sorted = cruz_tweets_pos.sort(function(a, b){return b.sentiment.pos-a.sentiment.pos});

    $('#cruz-pos-bar').progress({
        text: {
            active: 'Positive: ' + Math.round(cruz_pos * 10000) / 100
        },
        percent: cruz_pos * 100
    });
    $('#cruz-neu-bar').progress({
        text: {
            active: 'Neutral: ' + Math.round(cruz_neu * 10000) / 100
        },
        percent: cruz_neu * 100
    });
    $('#cruz-neg-bar').progress({
        text: {
            active: 'Negative: ' + Math.round(cruz_neg * 10000) / 100
        },
        percent: cruz_neg * 100
    });

    renderTweets('neg', 'cruz');
    
});