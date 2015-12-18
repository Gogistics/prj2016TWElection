# Project for 2016 TW Election

### Text Anaylsis of Tweets, Posts, and Plurks regarding 2016 TW Election

##### Programming Languages, libraries, modules, or tools are going to use for analysis:
*Programming Languages:* Python and JavaScript (Node.js)

*Libraries and Modules:* jieba (Python) and hanzi (npm) for analyzing traditinal chinese, and Natural (npm) for analyzing English

*Tools for working with MongoDB:* pymongo (Python), monk (npm), mongoose (npm), or mongodb (npm)

##### Analysis steps are as following:

1. build the global dictinary for 2016 TW Election with NLP tools listed above
2. calculate the frequency
2. build the tag object (in JSON format) based on the global dictionary
3. mark the tag object with the corresponding timestamp
4. visualize the data and the structure built previously with D3

##### Advance Analysis with TensorFlow
EX:
http://www.wildml.com/2015/12/implementing-a-cnn-for-text-classification-in-tensorflow/
https://github.com/dennybritz/cnn-text-classification-tf/blob/master/data_helpers.py
