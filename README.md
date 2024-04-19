# the-archiver

## set the archiver AWS keys in your project
Because the archiver scripts are executed in the project scope, you need to add the 2 AWS keys as repository secrets:
- ARCHIVER_AWS_ACCESS_KEY_ID
- ARCHIVER_AWS_SECRET_ACCESS_KEY

These are used to access the S3 bucket where archives are stored
