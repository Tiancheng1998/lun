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

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    for (const record of event.Records) {
        
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);
        
        const input = record.dynamodb.NewImage.content.S
        console.log(input)
        
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
                S: "1"
             },
             "commentID-replyID": {
               S: "1-0"
              }, 
             "author": {
               S: "Tony"
              },
              "mentionedID": {
                S: "mmln"
              },
              "createTime": {
                S: "10:00"
              },
              "editTime": {
                S: "12:00"
              },
              "content": {
                S: result
              }
            }, 
            ReturnConsumedCapacity: "TOTAL", 
            TableName: "RenderedComments"
        };
        dynamodb.putItem(params, (err, data) => {
            callback(err, null)
        })
        
        // try {
        //   await dynamodb.putItem(params).promise()
        // } catch (e) {
        //   console.log(e.message)
        // }
    }
    // return `Successfully processed ${event.Records.length} records.`;
    // return context.logStreamName
};