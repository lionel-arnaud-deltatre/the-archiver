# soterius-the-archiver

## Origin of Soterius
`Soterius originates from Indo – Greek mythology. Soter (Σωτήρ “Saviour, Deliverer”) was the personification or daimon of safety, preservation and deliverance from harm.`

This is the current name of the tool, but can be changed in the .env-sample

This tools can be invoked through different actions set in GH actions:
When calling this action, you can specify the `actionType` which will tell the tool what to do.

Each `actionType` comes with a "signature" (variables and env vars), check the docs folder to know more

Example
  - name: Archive folder and Upload to S3
    id: archivefolder
    uses: lionel-arnaud-deltatre/the-archiver@main
    with:
        actionType: "store-folder"
        version: ${{ env.SEMVER_VERSION }}
        appName: "myrepo"
        deviceType: "${{ github.event.inputs.device }}"
        environment: "${{ github.event.inputs.environment }}"
        folderPath: "dist"
    env:
        ARCHIVER_AWS_ACCESS_KEY_ID: ${{ secrets.PROJECT_AWS_ACCESS_KEY_ID }}
        ARCHIVER_AWS_SECRET_ACCESS_KEY: ${{ secrets.PROJECT_AWS_SECRET_ACCESS_KEY }}
        ARCHIVER_BUCKET_NAME: ${{ vars.PROJECT_BUCKET_NAME }}
        ARCHIVER_S3_REGION: ${{ vars.PROJECT_S3_REGION }}


## why use Docker
to avoid installing the dependencies of the action in the project repo calling the action

