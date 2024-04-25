Usually the tool will store the rollback archives on the same S3 bucket.
But in some cases you might want to use different buckets.

In this case you need to provide both PROJECT + ARCHIVER parameters:

Here is an example of rollback action where you need to provide both S3 accesses:

- name: Archive folder and Upload to S3
    id: archivefolder
    uses: lionel-arnaud-deltatre/the-archiver@main
    with:
        actionType: "rollback-archive"
        version: ${{ env.SEMVER_VERSION }}
        appName: "myrepo"
        deviceType: "${{ github.event.inputs.device }}"
        environment: "${{ github.event.inputs.environment }}"
        folderPath: "dist"
    env:
        PROJECT_AWS_ACCESS_KEY_ID: ${{ secrets.PROJECT_AWS_ACCESS_KEY_ID }}
        PROJECT_AWS_SECRET_ACCESS_KEY: ${{ secrets.PROJECT_AWS_SECRET_ACCESS_KEY }}
        PROJECT_AWS_BUCKET_NAME: ${{ vars.PROJECT_BUCKET_NAME }}
        PROJECT_ROOT_FOLDER: ${{ vars.PROJECT_ROOT_FOLDER }} 
        PROJECT_S3_REGION: ${{ vars.PROJECT_S3_REGION }}

        ARCHIVER_AWS_ACCESS_KEY_ID: ${{ secrets.ARCHIVER_AWS_ACCESS_KEY_ID }}
        ARCHIVER_AWS_SECRET_ACCESS_KEY: ${{ secrets.ARCHIVER_AWS_SECRET_ACCESS_KEY }}
        ARCHIVER_BUCKET_NAME: ${{ vars.ARCHIVER_BUCKET_NAME }}
        ARCHIVER_S3_REGION: ${{ vars.ARCHIVER_S3_REGION }}

        GITHUB_TOKEN: ${{ secrets.ARCHIVER_PAT }}


The first section tells the tools where to rollback the application:
    PROJECT_AWS_ACCESS_KEY_ID: ${{ secrets.PROJECT_AWS_ACCESS_KEY_ID }}
    PROJECT_AWS_SECRET_ACCESS_KEY: ${{ secrets.PROJECT_AWS_SECRET_ACCESS_KEY }}
    PROJECT_AWS_BUCKET_NAME: ${{ vars.PROJECT_BUCKET_NAME }}
    PROJECT_ROOT_FOLDER: ${{ vars.PROJECT_ROOT_FOLDER }} 
    PROJECT_S3_REGION: ${{ vars.PROJECT_S3_REGION }}

The second part tells the tool where the archives are stored:
    ARCHIVER_AWS_ACCESS_KEY_ID: ${{ secrets.ARCHIVER_AWS_ACCESS_KEY_ID }}
    ARCHIVER_AWS_SECRET_ACCESS_KEY: ${{ secrets.ARCHIVER_AWS_SECRET_ACCESS_KEY }}
    ARCHIVER_BUCKET_NAME: ${{ vars.ARCHIVER_BUCKET_NAME }} 
    ARCHIVER_S3_REGION: ${{ vars.ARCHIVER_S3_REGION }}
