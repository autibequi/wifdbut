const Koa = require('koa');
const app = new Koa();

const Router = require('koa-router');
const router = new Router();
const queue = require('./src/queue');

// Middlewares
app.use(koaBody({
    strict: false,
}));

app.use(bodyParser({
    enableTypes: ['json'],
    jsonLimit: '2mb',
    strict: true,
    onerror(err, ctx) {
        ctx.throw('body parse error', 422);
    },
}));

// Create Instances Endpoint
// This endpoint will create a BPMN process which
// can be called to create an incident.
router.post('/create-process', async (ctx) => {
    const { bpmnFile } = ctx.body;

    await createProcess(bpmnFile);

});

// Create Instances Endpoint
// This endpoint will create a incident based on a process.
router.post('/process-definition/:processId/start', async (ctx) => {
    const { processId } = ctx.params;
    const { variables, businessKey } = ctx.body;

    // Initiate Process
    await utils.sendTo(processId, variables);
});

// Fetch a task
// This endpoint will be used by the external task to fetch a 
// task to be executed
// /external-task/fetchAndLock"
router.get('/external-task/fetchAndLock', async (ctx) => {
    const { queue } = ctx.body;

    // Initiate Process
    await utils.getOne(queue);
});

// Update Incident
// After the task is executed this endpoint will be caled to 
// update the incident and set it to be digested by the engine
router.post('/external-task/:id/complete', async (ctx) => {
    const { id } = ctx.params;

    // Initiate Process
    await queue.ack(id);
});

// Error Incident
// This endpoint is similar to the update incident but is called
// in case of something going wrong
router.post('/external-task/:id/failure', async (ctx) => {
    const { id } = ctx.params;

    // Initiate Process
    await queue.nack(id);
});

// Start Server
app.use(router.routes());
app.listen(3000, () => console.log(`${green('[   API   ]')} Running on port ${port}`)); 