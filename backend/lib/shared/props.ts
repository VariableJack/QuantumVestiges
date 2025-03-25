import { StackProps } from 'aws-cdk-lib'

interface Props extends StackProps {
    stage: string,
}

export { Props }