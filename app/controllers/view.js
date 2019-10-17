// Admin
module.exports.Test = async function (ctx, next) {
  await ctx.render('views/test/test');
};
