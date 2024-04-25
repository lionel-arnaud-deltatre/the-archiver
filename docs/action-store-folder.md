This action is used to store a folder to the vault

Example:

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
        ARCHIVER_AWS_ACCESS_KEY_ID: ${{ secrets.ARCHIVER_AWS_ACCESS_KEY_ID }}
        ARCHIVER_AWS_SECRET_ACCESS_KEY: ${{ secrets.ARCHIVER_AWS_SECRET_ACCESS_KEY }}
        ARCHIVER_BUCKET_NAME: ${{ vars.ARCHIVER_BUCKET_NAME }}
        ARCHIVER_S3_REGION: ${{ vars.ARCHIVER_S3_REGION }}
        ARCHIVER_ROOT_FOLDER: ${{ vars.ARCHIVER_ROOT_FOLDER }}

        GITHUB_TOKEN: ${{ secrets.ARCHIVER_PAT }}

"with" parameters:
    - actionType: "store-folder"
    - version: <version of the build with format "x.x.x">
    - appName: <name of the project/target>
    - deviceType: <type of target (web, webtv, android ...)>
    - environment: <environment of the build (test/staging/prod)>
    - folderPath: <folder to be zipped and archived>

"env" parameters:
    - ARCHIVER_AWS_ACCESS_KEY_ID: <AWS access key where the archive will be saved>
    - ARCHIVER_AWS_SECRET_ACCESS_KEY: <AWS access secret where the archive will be saved>
    - ARCHIVER_BUCKET_NAME: <S3 bucket name where the archive will be saved>
    - ARCHIVER_S3_REGION: <S3 bucket region where the archive will be saved> (optional*)
    - ARCHIVER_ROOT_FOLDER: <folder path where archives will be stored> (optional*)

    - GITHUB_TOKEN: mandatory for the tool to be able to commit the rollback workflow

* optional: values from the .env file are used if not provided