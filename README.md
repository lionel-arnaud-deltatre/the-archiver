# soterius-the-archiver

## why use Docker
to avoid installing the dependencies of the action in the project repo calling the action

## set the archiver AWS keys in your project
Because the archiver scripts are executed in the project scope, you need to set repository secrets and variables

*repository secrets:*
    - ARCHIVER_AWS_ACCESS_KEY_ID
    - ARCHIVER_AWS_SECRET_ACCESS_KEY

*repository variables:*
    - ARCHIVER_BUCKET_NAME: name of the bucket to store the acrhives
    - ARCHIVER_S3_REGION:   region of the bucket (optional)
    - ARCHIVER_ROOT_FOLDER: root folder on the bucket (optional)

