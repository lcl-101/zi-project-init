const { compileStr, uncompileStr } = require('../utils/util');
// login
module.exports.login = async function (ctx, next) {
  let resData = {
    status: 1,
    data: '',
    message: null,
    errType: null
  };
  let params = ctx.request.body //获取post提交的数据;
  if(params.username != 'longsyc'){
    resData.status = 0;
    resData.data = '';
    resData.message = '用户名错误';
    resData.errType = 1001;
  }else if(params.password != 'long5546') {
    resData.status = 0;
    resData.data = '';
    resData.message = '密码错误';
    resData.errType = 1002;
  }else {
    resData.status = 1;
    const token = await compileStr('ddsdfeee33433');
    resData.data = {
      username: params.username,
      passsword: params.passsword,
      token: token
    }
  }
  ctx.body = resData;
}
// userInfo
module.exports.userInfo = async function (ctx, next) {
  let resData = {
    status: 1,
    data: '',
    message: null,
    errType: null
  };
  let params = ctx.query //获取post提交的数据;
  const token = await uncompileStr(params.token);
  if(token == 'ddsdfeee33433') {
    resData.status = 1;
    resData.data = {
      roles: ['admin'],
      name: 'lcl-101',
      avatar: 'lcl-101'
    }
  }else {
    resData.status = 0;
    resData.data = '';
    resData.message = '网络问题';
    resData.errType = 1003;
  }
  ctx.body = resData;
}
// loginOut
module.exports.loginOut = async function (ctx, next) {
  let resData = {
    status: 1,
    data: '',
    message: null,
    errType: null
  };
  ctx.body = resData;
}
