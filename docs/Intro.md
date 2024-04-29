## Origin of Soterius
`Soterius originates from Indo – Greek mythology. Soter (Σωτήρ “Saviour, Deliverer”) was the personification or daimon of safety, preservation and deliverance from harm.`

(This is the current name of the tool, but can be changed in the .env-sample)

### The purpose
The goal of this action is to provide the easiest way for developers to store the builds they are deploying.
Soterus acts like an archiver that can store your builds in the "Vault" (S3) and serve them back to you when needed.

The builds are stored as zip files in Soterus S3.

The extra feature of Soterus is to be able to rollback hosted apps to a version that is stored in the vault.
For this Soterus will build a rollback workflow after deployment and commit it to the project repo

Non-hosted apps wont have a rollback but a "download" worflow created to fetch a previous build from the Vault.


## How to Implement Soterus 
To use Soterus you need to add 1 action in your project workflow.
You need to provide a list of parameters so Soterus will:
- store your build safely in S3
- create a download/rollback workflow as a new Github Action
- commit that new/updated workflow into your repository


## Available actions in Soterus
When using this action, you can specify the `actionType` which will tell the tool what to do.

When invoking this action you have then 3 actionType possible:
- store-folder-with-rollback: used for hosted apps
- store-folder-with-download: used for packaged apps (you need to store multiple files)
- store-file-with-download: used for packaged apps (you need to store only 1 file)

see docs folder for more details
