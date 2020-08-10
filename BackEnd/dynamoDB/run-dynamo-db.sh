#!bin/bash

# Builds and runs the dynamo-db docker container.
docker build . -t dynamo-db
docker run -d -p 8500:8000 dynamo-db

# Waits 3 seconds to let the container runs up.
# This should not be necessary, but in case you see error messages regarding missing tables
# you can uncomment this line and try again.
#sleep 3s

# Generates a new table.
sh scripts/create-table.sh