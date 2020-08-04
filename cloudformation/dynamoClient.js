// import entire SDK
const fs = require('fs');
const AWS = require('aws-sdk');
const config = require('./config.json');

AWS.config.update(config);

AWS.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
      console.log("Access key:", AWS.config.credentials.accessKeyId);
      console.log("Region: ", AWS.config.region);
    }
});

const input = fs.readFileSync('./input.md', {encoding:'utf8', flag:'r'});

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const params = {
    Item: {
     "blogID": {
        S: "1"
     },
     "commentID-replyID": {
       S: "1-2"
      }, 
     "author": {
       S: "Michael"
      },
      "mentionedID": {
        S: "Tony"
      },
      "createTime": {
        S: "10:00"
      },
      "editTime": {
        S: "12:00"
      },
      "content": {
        S: "Fourier Transform"
      }
    }, 
    ReturnConsumedCapacity: "TOTAL", 
    TableName: "RawComments"
};

dynamodb.putItem(params, (err, data) => {
    console.log(err)
})



