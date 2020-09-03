# lun
"Lun" is a serverless comment system based on AWS designed for personal blogs
![lun architecture](https://github.com/Tiancheng1998/lun/blob/master/lun%20architecture.jpg)

To fully utilize AWS's free-tier capacity, we designed a serveless backend system that relies on AWS Lambda functions for processing. While the raw content DynamoDB table stores the original markdown documents, it also acts as a backend API that triggers the chain of event to update the database and send notifications. In this way, we effectively eliminate the need of a server or API Gateway.

Load comments:
- webpage gets the metadata of the blog from the metadata table (#comments, #responses, timestamps, etc.)
- webpage gets the content of the comments that will be rendered from the processed table in HTML format
- webpage loads the content

Edit or create comments:
- user writes content in markdown and uploads to the raw table
- dynamo stream receives the update record and triggers the lambda function
- lambda update the metadata table
- lambda converts the raw content in markdown to HTML and update the processed table
- lambda retrieves the relevant user info and send notification to users
