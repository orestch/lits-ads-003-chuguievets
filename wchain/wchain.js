"use strict";

var fs = require("fs");

var readInput = function(fileName) {
    var fileLines = fs.readFileSync(fileName).toString().split("\n");
    var wordCount = parseInt(fileLines[0], 10);
    var words = fileLines.slice(1, wordCount + 1);
    return words;
};

var solve = function(words) {
    var maxWordLength = 50;

    // Generates all possible words with one less letter from the specified word.
    var generateSmallerWords = function(word) {
        var smallerWords = [];
        for (var removalIndex = 0; removalIndex < word.length; removalIndex++) {
            smallerWords.push(word.substring(0, removalIndex) + word.substring(removalIndex + 1, word.length));
        }
        return smallerWords;
    };

    // Splitting the words into buckets according to their lengths.
    var buckets = [];
    for (var i = 0; i <= maxWordLength; i++) {
        buckets.push({});
    }
    words.forEach(function(word) {
        buckets[word.length][word] = 1;
    });

    // Iterating through every length bucket.
    for (var i = 2; i <= maxWordLength; i++) {

        // Iterating through every word in this bucket.
        Object.keys(buckets[i]).forEach(function(word) {

            // For this word, we'll generate all possible words with one less letter, and
            // check whether the previous bucket contains any of these smaller words.
            var maxChainLengthForSmallerWord = 0;
            generateSmallerWords(word).forEach(function(smallerWord) {
                if (buckets[i - 1].hasOwnProperty(smallerWord)) {
                    maxChainLengthForSmallerWord = Math.max(maxChainLengthForSmallerWord, buckets[i - 1][smallerWord]);
                }
            });

            // Using our new word, we can get a chain 1 item longer.
            buckets[i][word] = maxChainLengthForSmallerWord + 1;
        });
    }

    // The maximum length chain does not necessarily start with the smallest word
    // or end with the longest one, so we'll scan all buckets and find the maximum.
    var maxChainLength = 0;
    buckets.forEach(function(bucket) {
        Object.keys(bucket).forEach(function(word) {
            maxChainLength = Math.max(maxChainLength, bucket[word]);
        });
    });

    return maxChainLength;
};

var writeOutput = function(fileName, maxChainLength) {
    fs.writeFileSync(fileName, maxChainLength);
};

var inputFileName = process.argv[2] || "wchain.in";
var outputFileName = process.argv[3] || "wchain.out";

var words = readInput(inputFileName);
var maxChainLength = solve(words);
writeOutput(outputFileName, maxChainLength);
