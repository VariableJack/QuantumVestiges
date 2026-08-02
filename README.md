# Quantum Vestiges
A custom portal to various utilities and calculators for various games, along with personally developed games

## Setup
For the backend, you need to have at least one AWS account created and set up.
Two different ways to set up your infrastructure are mentioned here:
- Single AWS account that hosts everything, but the account needs to be set up to segregate between the infrastructure for your Development, Pre-Production, and Production environment
- Multiple AWS accounts, one for each of your desired environments (Development, Pre-Production, Production)

### Setting up your AWS account
Once your account has been created, follow these steps to set it up for use:
1. Visit the Identity and Access Management (IAM) console
2. Create a new IAM User with CloudFormation permissions
3. Create an AWS Access Key, saving the AWS Access Key ID and AWS Secret Access Key ID - these will be used in the next step

### Common
1. Install a Git CLI for your OS
2. Install NPM (Node Package Manager)
3. Install a "global"
2. Run the `aws configure` command. When prompted, enter the following information
 - AWS Access Key ID - saved from when you where setting up your IAM role
 - AWS Secret Access Key - saved from when you where setting up your IAM role
 - Region - this will be your desired region for all of your infrastructure
 - Default output - "None"
2. Run the `install.sh` script:
 - Due to how Linux paths are set by default, it can be run via `./install.sh`

### If multiple AWS accounts are set up (e.g. one account for each development stage)
Go through the "Setting up your AWS account" section once for each account
- When setting up the AWS configuration and credentials, under "~/.aws/config" and "~/.aws/credentials", one profile *should* be set for each environment, alongside the "[default]" profile, like so:
- This can also be done via `aws configure --profile __your_stage_here__` - replace the `__your_stage_here__` with your actual stage name, e.g. `devo`

Sample configuration file
```
[default]
region = us-west-2
output = None

[devo]
region = us-west-2
output = None

[pre-prod]
region = us-west-2
output = None

[prod]
region = us-west-2
output = None
```

Sample credentials file
```
[default]
aws_access_key_id = SOME_ACCESS_KEY
aws_scret_access_key = SOME_SECRET_ACCESS_KEY

[devo]
aws_access_key_id = SOME_ACCESS_KEY
aws_scret_access_key = SOME_SECRET_ACCESS_KEY

[pre-prod]
aws_access_key_id = SOME_ACCESS_KEY
aws_scret_access_key = SOME_SECRET_ACCESS_KEY

[prod]
aws_access_key_id = SOME_ACCESS_KEY
aws_scret_access_key = SOME_SECRET_ACCESS_KEY
```

- Ref AWS CLI link - https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html

### Setting up your local workspace
1. Find a desired folder or create a new folder to hold this project's files
2. Clone this GitHub repo into the desired folder
3. Create a `.env` file with the following template:

```
default.account-id = 'your_account_id_here'
default.region     = 'your_region_here'
```

If specific stages require different environment variables, add them as such:
```
devo.account-id        = 'an_account_id'
devo.region            = 'a_region_here'

pre-prod.account-id    = 'an_account_id'
pre-prod.region        = 'a_region_here'

prod.account-id        = 'an_account_id'
prod.region            = 'a_region_here'
```

### Backend -- Work in Progress
Open a CLI window and go to the `GamerParadise/backend` folder, then run `npm run deploy`, which will deploy all stacks to your AWS account

If you wish to deploy only a subset of the stacks, e.g. just the Devolopment, Pre-Production, or Production stacks, run one of the following:
1. `npm run deploy-devo` - Deploys all Development stacks and nothing else
2. `npm run deploy-pre-prod` - Deploys all Pre-Production stacks and nothing else
3. `npm run deploy-prod` - Deploys all Production stacks and nothing else

### Front end
Open a new CLI window and go to  the `GamerParadise/frontend` folder, then run `npm start`

## Notes
Core scripts as follows are provided:
1. `install.sh` - Installs all required dependencies and prepares both the backend and frontend by installing necessary NPM dependencies
2. `backend/deploy.sh` - Deploys your desired infrastructure and backend stack(s)

Additional scripts and files as follows have been provided for convenience:
1. `clean.sh` - Removes all of the auto-generated files and folders (`node_modules`, `package-lock.json`)
2. `uninstall.sh` - Uninstalls all dependencies installed by the install script and runs the clean script
3. `.gitignore` - Preset list of files that are to be avoided when saving your own changes

