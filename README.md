# Simple batch process

A simple batch job that retrieves a CSV file from a URL and imports orders into a database.
Schema of the database could be found here `./brandy/schema.sql`.
In case when customer doesn't exist in the database order import is skipped.
CSV file structure: orderId,customerId,item,quantity


File is retrieved using stream to ensure that we don't need to scale memory when file size grew.
After line is read - it's parsed, validated and published to message queue.
Message queue allows us to:
1. make sure that time to handle message from the stream is low
2. control the number of concurrent writes to database - number of pre-fetched messages from queue


Application is structured into two main modules:
1. `app/consume` which retrieves file and publish to message queue
2. `app/import` which consume from queue and upload to database

These modules share common clients: logger, mysql, redis, rabbit;
But they are independent and could be easily separated into two different applications.
It might make sense for *import* module to be scaled horizontally which is supported


## Tests

Unit test files are located next to the tested module/file.
Integration tests are moved out to `/test` folder.


## Run integration tests
RabbitMQ, Redis and MySql are required to run integration tests
Them could be easily spin up using Docker. Please check docker-compose.yml and docker-compose.override.yml


### Run tests in local environment
In case you prefer to run integration tests using local version of node please do
* copy .env-template to .testenv
* set all variables
* `docker-compose up -d brandy cache mq`
* `npm test`

### Run tests in docker environment
`docker-compose -f docker-compose.yml run --rm app ./docker-wait.sh npm test`
