# soterius-the-archiver

## Origin of Soterius
`Soterius originates from Indo – Greek mythology. Soter (Σωτήρ “Saviour, Deliverer”) was the personification or daimon of safety, preservation and deliverance from harm.`

This is the current name of the tool, but can be changed in the .env-sample


## why use Docker
to avoid installing the dependencies of the action in the project repo calling the action


## set the archiver AWS keys in your project
Because the archiver scripts are executed in the project scope, you need to set repository secrets and variables

*repository secrets:*
    - PROJECT_AWS_ACCESS_KEY_ID             (used for rollback)
    - PROJECT_AWS_SECRET_ACCESS_KEY         (used for rollback)
    - ARCHIVER_AWS_ACCESS_KEY_ID            (used to archive)
    - ARCHIVER_AWS_SECRET_ACCESS_KEY        (used to archive)

*repository variables:*
    - PROJECT_AWS_BUCKET_NAME:  name of the bucket where the project is deployed (used for rollback)
    - PROJECT_S3_REGION:        region of the project bucket (optional)
    - PROJECT_ROOT_FOLDER:      root folder where the project is deployed

    - ARCHIVER_BUCKET_NAME:     name of the bucket to store the acrhives
    - ARCHIVER_S3_REGION:       region of the bucket (optional, will use value from .env if not provided)
    - ARCHIVER_ROOT_FOLDER:     root folder on the bucket (optional, will use value from .env if not provided)

