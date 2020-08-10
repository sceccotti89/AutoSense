FROM amazon/aws-cli

COPY scripts/ scripts/
RUN bash scripts/aws-configure.sh

FROM amazon/dynamodb-local

ENTRYPOINT ["java"]
CMD ["-jar", "DynamoDBLocal.jar", "-sharedDb"]