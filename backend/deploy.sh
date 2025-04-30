#!/bin/bash

npm install

declare -A environmentVariables
environments=("default" "devo" "pre-prod" "prod")

setEnvironmentVariables() {
	ACCOUNT="$1_ACCOUNT"
	REGION="$1_REGION"
	
    environmentVariables["$ACCOUNT"]=$(eval "cat .env | grep '$1.account_id' | sed -r 's/$1.account_id=(.*)/\1/g'")
    environmentVariables["$REGION"]=$(eval "cat .env | grep '$1.region' | sed -r 's/$1.region=\"(.*)\"/\1/g'")

	if [[ "$1" != "default" && ${environmentVariables["$ACCOUNT"]} -eq '' ]]; then
        environmentVariables["$ACCOUNT"]=${environmentVariables["default_ACCOUNT"]}
	fi
	if [[ "$1" != "default" && ${environmentVariables["$REGION"]} -eq '' ]]; then
        environmentVariables["$REGION"]=${environmentVariables["default_REGION"]}
	fi
}

for environment in "${environments[@]}"
do
    echo "----"
    setEnvironmentVariables $environment
	echo "${environment^} account: ${environmentVariables["default_ACCOUNT"]}"
	echo "${environment^} region: ${environmentVariables["default_REGION"]}"
done
echo "----"

# npm run list 2>&1 | grep 'Supply a stack id' | sed -r 's/Supply a stack id \((.*)\) to display its template./\1/' > output

declare -A environmentsToStacks

environmentsToStacks["devo"]=""
environmentsToStacks["pre-prod"]=""
environmentsToStacks["prod"]=""
IFS=',' read -ra stacks <<< $(cat output)
for stack in "${stacks[@]}"
do
    stack=$(echo $stack | sed -r 's/\s*(.*)\s*/\1/')
	if [[ $(echo $stack | grep 'Stack-devo') != '' ]]; then
	    environmentsToStacks["devo"]="$stack "${environmentsToStacks["devo"]}
	fi
	if [[ $(echo $stack | grep 'Stack-pre-prod') != '' ]]; then
	    environmentsToStacks["pre-prod"]="$stack "${environmentsToStacks["pre-prod"]}
	fi
	if [[ $(echo $stack | grep 'Stack-prod') != '' ]]; then
	    environmentsToStacks["prod"]="$stack "${environmentsToStacks["prod"]}
	fi
done

environmentsToStacks["devo"]=$(echo ${environmentsToStacks["devo"]} | sed -r 's/(.*) $/\1/g')
environmentsToStacks["pre-prod"]=$(echo ${environmentsToStacks["pre-prod"]} | sed -r 's/(.*) $/\1/g')
environmentsToStacks["prod"]=$(echo ${environmentsToStacks["prod"]} | sed -r 's/(.*) $/\1/g')

echo 'Found the following stacks for the input arguments:'

[[ $# -eq 0 || $(echo $@ | sed 's/.*devo.*/devo/g') -eq 'devo' ]] && shouldDeployDevo=true
[[ $# -eq 0 || $(echo $@ | sed 's/.*pre-prod.*/pre-prod/g') -eq 'pre-prod' ]] && shouldDeployPreprod=true
[[ $# -eq 0 || $(echo $@ | sed 's/[^-]*?[^-]prod.*/prod/g') -eq 'prod' ]] && shouldDeployProd=true

if [[ $shouldDeployDevo ]]; then
echo "'${environmentsToStacks["devo"]}'"
aws 
fi
if [[ $shouldDeployPreprod ]]; then
echo "'${environmentsToStacks["pre-prod"]}'"
fi
if [[ $shouldDeployProd ]]; then
echo "'${environmentsToStacks["prod"]}'"
fi

cp ../.env .

rm -rf output
rm -rf .env
