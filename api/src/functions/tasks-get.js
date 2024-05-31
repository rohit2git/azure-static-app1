const { app } = require('@azure/functions');
const mongoClient = require("mongodb").MongoClient;

app.http('tasks-get', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'tasks',
    handler: async (request, context) => {
        
        context.log(`Http function processed request for url "${request.url}"`);

        const header = request.headers.get('x-ms-client-principal');

        const encoded = Buffer.from(header, 'base64');
        const decoded = encoded.toString('ascii');
        const user = JSON.parse(decoded);

        const client = await mongoClient.connect(process.env.COSMOSDB_CONNECTION_STRING);

        const database = client.db("static-apps-cosmos-db");

        const response = await database.collection("tasks").find({
            userId: user.userId
        });
        
        const tasks = await response.toArray();

        return { 
            body: JSON.stringify(tasks),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
});

