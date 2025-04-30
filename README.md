# GamerParadise
A custom portal to various utilities and calculators for various games, along with personally developed games

## Setup -- this module is a WiP
For the backend, you need to have at least one AWS account created and set up. As all of the backend stacks will running on services with a free tier, you shouldn't need to worry about the costs unless you experience significant traffic.
Two different ways to set up your infrastructure are mentioned here:
- Single AWS account that hosts everything, but the account needs to be set up to segregate between the infrastructure for your Development, Pre-Production, and Production environment
- Multiple AWS accounts, one for each of your desired environments (Develkopment, Pre-Production, Production)

For the purposes of this project and GitHub Repo, a single account will be set up, but all of the deployment scripts (`backend/deploy.sh` and `frontend/deploy.sh`) will be able to support multiple AWS accounts

### Setting up your Windows environment (**WINDOWS ONLY**)
1. If your "Windows Subsystems for Linux" (WSL) is not already enabled, ensure it is, as all scripts have been designed to run in a Linux-like system.
2. Restart your computer.
3. Install any Linux distribution.

### Setting up your AWS account
Once your account has been created, follow these steps to set it up for use:
1. Visit the Identity and Access Management (IAM) console
2. Create a new IAM Role with CloudFormation permissions - WIP
3. Save the AWS Access Key ID and AWS Secret Access Key ID - these will be used in the next step

### Within your Linux or MacOS terminal
1. Run the `aws configure` command. When prompted, enter the following information
 - AWS Access Key ID - saved from when you where setting up your IAM role
 - AWS Secret Access Key - saved from when you where setting up your IAM role
 - Region - this will be your desired region for all of your infrastructure
    - [RECOMMENDED] Choose the AWS region closest to where you live
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
region = us-west-1
output = None

[devo]
region = us-west-1
output = None

[pre-prod]
region = us-west-1
output = None

[prod]
region = us-west-1
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

