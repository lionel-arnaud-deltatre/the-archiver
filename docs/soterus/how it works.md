## low dependency
The tool is trying to use as much as shell commands as possible.
This is why you will see some tools being installed directly in the Docker (see dockerFile)
(aws cli, zip, unzip)

## init the action
The action is using Docker so the project where this action is called will not need any extra dependencies
(expecially the gh core library)

## when the action is called
The entry point of the tool is the src/index.js

This is where the actionType is checked and the corresponding src/action will be called.

## Actions
Each action like (StoreToVault) has a "execute command" that will eventually run steps
Each step will typically call some shell commands (was, zip, unzip ...)

## testing locally
For convenience, you can build the tool locally and add S3 credentials in the .env file
You can test things by modifying/adding code in src/test folder 
