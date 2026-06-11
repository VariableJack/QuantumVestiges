#!/bin/bash
rm -rf ./bin
rm -rf ./cdk.out
cp -r ./lib ./bin
cp ../.env .

declare -A environmentVariables
environments=("default" "devo" "pre-prod" "prod")

setEnvironmentVariables() {
    ACCOUNT="$1_ACCOUNT"
    REGION="$1_REGION"

    environmentVariables["$ACCOUNT"]=$(eval "cat .env | grep '$1.account_id' | sed -r 's/$1.account_id=(.*)/\1/g'")
    environmentVariables["$REGION"]=$(eval "cat .env | grep '$1.region' | sed -r 's/$1.region=(.*)/\1/g'")

    if [[ "$1" != "default" && ${environmentVariables["$ACCOUNT"]} -eq '' ]]; then
        environmentVariables["$ACCOUNT"]=${environmentVariables["default_ACCOUNT"]}
    fi
    if [[ "$1" != "default" && ${environmentVariables["$REGION"]} -eq '' ]]; then
        environmentVariables["$REGION"]=${environmentVariables["default_REGION"]}
    fi
}

for environment in "${environments[@]}"
do
    setEnvironmentVariables $environment
    if [[ "$1" != "default" ]]; then
        sed -i "s/'${environment}-account-id'/${environmentVariables[${environment}_ACCOUNT]}/" bin/cdk.ts
        sed -i "s/'${environment}-region'/${environmentVariables["${environment}_REGION"]}/" bin/cdk.ts
    fi
done

rm -rf .env

cdk synth

read -p "Press any key to continue" x