const Koa = require('koa'); // 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示
const router = require('koa-router')(); // 注意require('koa-router')返回的是函数:
const views = require('koa-views');
const path = require('path');
const render = require('koa-ejs');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const logger = require('./utils/logger');

// bodyParser //解析request的body
app.use(bodyParser());

// routes
const viewRouter = require('./router/view');
// apiRouter
const apiRouter = require('./router/api');

//static -> dist
app.use(static(
  path.join(__dirname,'../dist')
));

// 配置模板文件目录和后缀名
// app.use(views(__dirname + '../dist', {
//   extension: 'html'
// }))
render(app, {
  root: path.join(__dirname, '../dist'),
  layout: '',
  viewExt: 'html',
  cache: false,
  debug: false
});

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
  const start = new Date();
  let ms;
  try {
    await next();
    ms = new Date() - start;
    logger.logResponse(ctx, ms);
  } catch (err) {
    ms = new Date() - start;
    logger.logError(ctx, err ,ms);
  }
  if(ctx.status == '404'){
    await ctx.render('views/404/404');
  }
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
});

// add router middleware:
app.use(viewRouter.routes(), viewRouter.allowedMethods());
app.use(apiRouter.routes(), apiRouter.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  logger.logError(ctx, err);
  console.error('server error', err, ctx);
});

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');
