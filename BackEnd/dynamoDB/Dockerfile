FROM amazon/aws-cli

ARG AWS_ACCESS_KEY=""
ARG AWS_SECRET_ACCESS_KEY=""

COPY scripts/ scripts/
RUN bash scripts/aws-configure.sh ${AWS_ACCESS_KEY} ${AWS_SECRET_ACCESS_KEY}

FROM amazon/dynamodb-local

ENTRYPOINT ["java"]
CMD ["-jar", "DynamoDBLocal.jar", "-sharedDb"]