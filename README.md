# twitter-cabinet
Processing and visualizing the 2016 candidates' Twitter followings

## Goal
We set out to survey the Twitter followers of each of the top four candidates to answer the question “What would the policies look like if each candidate replaced his/her presidential cabinet with his/her Twitter followers?”

### Usage

To mine data, checkout the [twitter-miner repo](https://github.com/SIRHAMY/twitter-miner).

To run topic classification and sentiment analysis:

##### Topic Classification

You must have a JSON file in the same format as the output of twitter-miner's Feed Scraper.

run `python topicClassifier.py INPUTFEEDFILE.json -w OUTPUTTOPICFILE.json`

##### Sentiment Analysis

You must have a JSON file in the same format as the output of twitter-cabinet's Topic Classifier.

run `python sentimentScanner.py INPUTTOPICFILE.json -w OUTPUTSENTIMENTFILE.json`

### Mined Data

Raw Twitter feeds and tweets mined prior to data cleaning on our end. Returned tweets do not include retweets or replies.

* Raw Feeds - 344,522
* Raw Tweets - 2,086,736
