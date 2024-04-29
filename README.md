# soterius-the-archiver

Soterius will help you archiving your builds in S3 and retrieve these builds anytime (like appCenter).
The main feature is to provide rollback possibility for hosted apps.

Soterus will create the rollback workflow for you after each deployment and push it to yoru repo.

The rollback worflow will not only provide you the zipped build you selected, but will also redploy the build to S3.
(like Octopus)

See docs folder for more details and how to implement it
