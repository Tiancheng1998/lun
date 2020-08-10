// import entire SDK
// const fs = require('fs');
// const AWS = require('aws-sdk');
// const config = require('./config.json');

// const config = {
//     "region": "us-east-2",
//     "endpoint": "https://dynamodb.us-east-2.amazonaws.com"
// }

AWS.config.region = 'us-east-2'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-2:f93bf2dd-c36c-4816-94cf-3d2ce02bc7fb',
});

// AWS.config.getCredentials(function(err) {
//     if (err) console.log(err.stack);
//     // credentials not loaded
//     else {
//       console.log("Access key:", AWS.config.credentials.accessKeyId);
//       console.log("Region: ", AWS.config.region);
//     }
// });


const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
document.getElementById("submitButton").onclick = function uploadComment() {
    console.log(12345677)
    const input = document.getElementById('textBox').value
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
          "replyTo": {
            S: "1-0"
          },
          "createTime": {
            S: "10:00"
          },
          "editTime": {
            S: "12:00"
          },
          "content": {
            S: input
          }
        }, 
        ReturnConsumedCapacity: "TOTAL", 
        TableName: "RawComments"
    };
    
    // dynamodb.putItem(params, (err, data) => {
    //     console.log(err)
    // })
    dynamodb.putItem(params).promise().then().catch(err => {
        console.log(err)
        return false
    })

}

function loadComments() {
    const queryParams = {
        KeyConditionExpression: "blogID = :idVal", 
        ExpressionAttributeValues: {
            ":idVal": {
                S: "1"
            }
        },
        Select: "ALL_ATTRIBUTES", 
        TableName: "MetaData"
    };

    dynamodb.query(queryParams).promise().then((data) => {
        keys = []
        data.Items.forEach(element => {
            keys.push({
                "blogID": {
                    S: "1"
                },
                "commentID-replyID": {
                    S: "1-2"
                },
            })
        });
        keys.slice(0,2)
        console.log(keys)
        const getParams = {
            RequestItems: {
                "RenderedComments": {
                    Keys: keys,
                    ProjectionExpression: "content"
                }
            }
        }
        return dynamodb.batchGetItem(getParams).promise()
    }).then(data =>{
        console.log(data)
        document.getElementById('lun').innerHTML += "\n<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.3/styles/github.min.css'>\
        <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css'>"
        document.getElementById('rendered').innerHTML += data.Responses.RenderedComments[0].content.S
    }).catch((err) => {
        console.log(err)
    })
}

loadComments()
