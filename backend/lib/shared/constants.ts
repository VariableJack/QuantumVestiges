const LAMBDA_FUNCTIONS: { name: string, method: string }[] = [
    { name: 'franchises', method: 'get' },
    { name: 'games', method: 'get' },
]

const TABLES: any[] = [
    {
        tableName: 'franchises',
        partitionKey: { name: 'franchise_id', type: dynamodb.AttributeType.NUMBER },
    },
    {
        tableName: 'games',
        partitionKey: { name: 'game_id', type: dynamodb.AttributeType.NUMBER },
        localSecondaryIndexes: [
            {
                indexName: 'franchise_id',
                sortKey: { name: 'franchise_id', type: dynamodb.AttributeType.NUMBER },
            },
        ],
    },
]
export {
    LAMBDA_FUNCTIONS,
    TABLES,
}