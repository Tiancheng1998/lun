console.log('Loading function');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const katex = require('markdown-it-katex');
const highlight = require('markdown-it-highlightjs');
const markdownIt = require('markdown-it')()
    .use(katex)
    .use(highlight);
const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

exports.handler = async(event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    for (const record of event.Records) {
        
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);
        
        // update metatable
        const paramsForMetaData = {
            Item: {
             "blogID": {
                S: record.dynamodb.Keys.blogID.S
             },
             "commentID-replyID": {
               S: record.dynamodb.Keys["commentID-replyID"].S
              }, 
             "author": {
               S: record.dynamodb.NewImage.author.S
              },
              "replyTo": {
                S: record.dynamodb.NewImage.replyTo.S
              },
              "createTime": {
                S: record.dynamodb.NewImage.createTime.S
              },
              "editTime": {
                S: record.dynamodb.NewImage.editTime.S
              }
            }, 
            ReturnConsumedCapacity: "TOTAL", 
            TableName: "MetaData"
        };
        try {
            await dynamodb.putItem(paramsForMetaData).promise()
        } catch (e) {
            throw e
        }


        // process and store in rendered table
        const input = record.dynamodb.NewImage.content.S
        
        markdownIt.set({
            html: true,
            xhtmlOut: true,
            breaks: true,
            linkify: true,
            typographer: true,
        });

        const result = DOMPurify.sanitize(markdownIt.render(input));

        console.log(result)

        const params = {
            Item: {
             "blogID": {
                S: record.dynamodb.Keys.blogID.S
             },
             "commentID-replyID": {
               S: record.dynamodb.Keys["commentID-replyID"].S
              }, 
             "author": {
               S: record.dynamodb.NewImage.author.S
              },
              "replyTo": {
                S: record.dynamodb.NewImage.replyTo.S
              },
              "createTime": {
                S: record.dynamodb.NewImage.createTime.S
              },
              "editTime": {
                S: record.dynamodb.NewImage.editTime.S
              },
              "content": {
                S: result
              }
            }, 
            ReturnConsumedCapacity: "TOTAL", 
            TableName: "RenderedComments"
        };
         
        try {
          await dynamodb.putItem(params).promise()
        } catch (e) {
          throw e
        }
    }
};