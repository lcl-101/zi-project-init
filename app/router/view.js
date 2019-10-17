const viewRouter = require('koa-router')();
const viewHandlers = require('../controllers/view');
// test
viewRouter.get('/test', viewHandlers.Test);

module.exports = viewRouter;
