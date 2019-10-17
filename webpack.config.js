const webpack = require('webpack');
const path = require('path');
var glob = require('glob');
const HTMLWebpackPlugin = require('html-webpack-plugin');  //依据一个简单的index.html模板，生成一个自动引用你打包后的JS文件的新index.html
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');  //代码压缩
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //把css单独抽离出来打包
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'); //把抽离出来的css打包压缩(webpack 3.x 安装 optimize-css-assets-webpack-plugin@3.2.0)
const CleanWebpackPlugin = require('clean-webpack-plugin'); //用于在构建前清除dist目录中的内容
const bundleAnalyzerReport = process.env.npm_config_report || false;  //依赖收集插件

const vendor = [
  'react',
  'react-dom',
  'react-router',
  'react-redux',
  'redux',
  'redux-thunk',
  'nprogress'
];

//生成环境
var NODE_ENV = process.env.NODE_ENV;
var isProduction = NODE_ENV ==='production' ? true : false;

//获取项目路径
const ROOT_PATH = path.resolve(__dirname);
const PATH_DIST = path.resolve(__dirname,'dist');
const PATH_VIEW = path.resolve(__dirname,'src/views');
const SRC_VIEW = path.resolve(__dirname,'src/module');

var entryTpl = {}; //存放模板对象 用于跟入口js对应
var plugins = []; //存放动态生成的插件数组

//入口html
const enterHtml = glob.sync(PATH_VIEW + '/*/*.html');
enterHtml.forEach(function(filePath){
  var entryPath = path.dirname(filePath);
  entryPath = entryPath.substring(entryPath.lastIndexOf('/')+1);
  var filename = filePath.substring(filePath.lastIndexOf('/')+1,filePath.lastIndexOf('.'));
  var conf = {
    template: filePath,
    filename: 'views/' + entryPath + '/'+filename + '.html',
    chunks:['babel-polyfill','vender',filename]    //chunks就是你在entry定义的入口的key
  };
  plugins.push(new HTMLWebpackPlugin(conf));
  entryTpl[filename] = filePath;
});

//js
const enterJsFile = glob.sync(SRC_VIEW + '/*/*.js');
const enterJs = {};
enterJsFile.forEach(function(filePath){
  var filename = filePath.substring(filePath.lastIndexOf('/')+1,filePath.lastIndexOf('.'));
  if(filename in entryTpl){
    enterJs[filename] = filePath;
  }
});

//css
var ExCSS = '';
var ExLess = '';
if(isProduction){
  ExCSS = new ExtractTextPlugin("[name]/[name].[contenthash].css");
  ExLess = new ExtractTextPlugin("[name]/[name].[contenthash].css");
  const OptimizeCSSAssets = new OptimizeCSSPlugin();
  const UglifyJSPlugins = new UglifyJSPlugin({
    uglifyOptions:{
      warnings: false,
      ie8: true,
      output: {
        comments: false,  // remove all comments
      },
      compress: {
        warnings: false
      },
    },
    sourceMap: true
  });

  plugins.push(OptimizeCSSAssets,UglifyJSPlugins);
}else {
  ExCSS = new ExtractTextPlugin('[name]/[name].css');
  ExLess = new ExtractTextPlugin('[name]/[name].css');
}


const CommonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({  //提取出第三方库到vendor.bundle.js
    name: ['vender'],
    filename:'[name]/[name].[hash].js',
    // children:true,
    minChunks: Infinity
});

const DefinePlugin = new webpack.DefinePlugin({ //设置环境变量
    "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
});

const CleanWebpackPluginnews = new CleanWebpackPlugin(['dist/**/*.js','dist/index/*'],{
    root: __dirname,       　　　　　　　　　　//根目录
    verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
    dry:      false        　　　　　　　　　　//启用删除文件
});

var cssIdentName = isProduction ? '[hash:base64:10]' : '[path][name]-[local]';

if(bundleAnalyzerReport){
  const  BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerPort: 8080,
      generateStatsFile: false
    })
  );
}

module.exports = {
  entry:Object.assign(enterJs,{
    'vender': vendor,
    'babel-polyfill':'babel-polyfill'
  }),
  output:{
    path:PATH_DIST,
    filename:isProduction?'[name]/[name].[chunkhash].bundle.js':'[name]/[name].bundle.js',
    chunkFilename:isProduction?'[name]/[name].[chunkhash].bundle.js':'[name]/[name].bundle.js'
  },
  devtool: (isProduction ? '' : 'source-map'),
  devServer:{
    contentBase:"./dist",
    historyApiFallback: true,
    inline: true,
    open: true,
    proxy:{
      '/api': {
        target: 'https://lcl101.cn',
        secure: true,
  			changeOrigin: true,
  			logLevel: 'error'
      }
    }
  },
  module:{
    rules:[
      {
        test:/(\.jsx|\.js)$/,
        use:{
          loader:'babel-loader'
        },
        exclude:/node_modules/
      },
      {
        test:/\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test:/\.less$/,
        use:ExtractTextPlugin.extract({
            fallback:"style-loader",
            use:[{
                loader:"css-loader",
                options:{
                  modules:true,
                  localIdentName: cssIdentName
                }
            },{
                loader:"less-loader",
                options:{
                  modules:true,
                  localIdentName: cssIdentName
                }
            }]
        })
      },
      {
        test: /\.(png|jpg|gif|JPG|woff|woff2|svg|ttf|eot)$/,
        use:[
          {
            loader:'url-loader',
            options:{
              limit: 8192,
              name:'common/img/[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  resolve: { //定义能够被打包的文件，文件后缀名
      extensions: ['.js','.jsx','.json','.css']
  },
  plugins:[
    CommonsChunkPlugin,
    ExCSS,
    ExLess,
    DefinePlugin
    // CleanWebpackPluginnews
  ].concat(plugins)
};
