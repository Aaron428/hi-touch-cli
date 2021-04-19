'use strict';

module.exports = core;

/**
 * require支持：.js/.node/.json
 * .js: module.exports = {} OR exports
 * .json: json.prase
 * .node: C++插件
 * other: js 引擎进行解析
 */
const path = require('path');
const commander = require('commander');
const semver = require('semver');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const colors = require('colors/safe');
// const init = require('@touch-cli/init');
const exec = require('@touch-cli/exec');
const log = require('@touch-cli/log');
const pkg = require('../package.json');
const constants = require('./constants');

let args = undefined;

const program = new commander.Command();

function core() {
  try{
    prepare();
    registerCommand();
  }catch(err) {
    log.error(err.message)
  }
}

// 准备函数
function prepare() {
  checkPkgVersion();
  checkNodeVersion();
  checkUserHome();
  checkEnv();
  // checkInputArg()
  // checkGlobalUpdate()
}

// 获取脚手架版本
function checkPkgVersion() {
  log.info('cli', pkg.version)
}

// 检查执行 node 的版本
function checkNodeVersion () {
  const currentNodeVersion = process.version;
  const lowest_node_version = constants.LOWEST_NODE_VERSION;
  // node 版本太低了
  if (!semver.gte(currentNodeVersion, lowest_node_version)) {
    throw new Error(
      colors.red(
        `touch-cli 需要安装${lowest_node_version}以上版本的Node.js，请自行升级！`
      )
    );
  }
  

}

// 检查用户是否为root
function checkRoot() {
  const rootCheck = require('root-check');
  rootCheck()
}

// 检查能否获取用户主目录
function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前用户不存在主目录！'))
  }
}

// 检查用户环境变量
function checkEnv() {
  const dotEnv = require('dotenv');
  const dotEnvPath = path.resolve(userHome, '.env');
  if (pathExists(dotEnvPath)) {
    dotEnv.config({ path: dotEnvPath });
  }
  createDefaultEnvConfig()
}

// 设置默认环境变量 process.env.CLI_HOME_PATH
function createDefaultEnvConfig() {
  const cliConfig = {
    home: userHome
  };
  cliConfig['cliHome'] = path.join(
    userHome,
    process.env.CLI_HOME || constants.DEFAULT_CLI_HOME
  );

  process.env.CLI_HOME_PATH = cliConfig.cliHome;

}

// 检查是否需要更新
function checkGlobalUpdate() {
  const currentVersion = pkg.version;
  const pkgName = pkg.name;

  const {getNpmInfo} = require('@touch-cli/get-npm-info');
  getNpmInfo(pkgName);
}

// 命令注册
function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .option('-tp, --targetPath <targetPath>', '是否启用本地调试文件路径', '');

// 注册 init 命令
  program
    .command('init [projectName]')
    .option('-f, --force', '是否强制初始化项目')
    .action(exec);

  // 监听是否开启debug
  program.on('option:debug', function() {
    log.level = program._optionValues.debug ? 'verbose' : 'info';
  });

  // 监听 targetPath
  program.on("option:targetPath", function() {
    process.env.CLI_TARGET_PATH = program._optionValues.targetPath
  });

  // 检测未知命令
  program.on('command:*', function(obj) {
    const availableCommands = program.command.map(cmd => cmd.name());
    console.log(color.red('未知命令：' + obj[0]));
    console.log(colors.red('可用命令：' + availableCommands.join(',')));
  });

  // 默认命令
  if(process.argv.length < 1) {
    program.outputHelp();
    console.log()
  }
  
  program.parse(process.argv)
}

// 检查用户入参，如果存在debug，则修改log level
function checkInputArg() {
  const minimist = require('minimist');
  args = minimist(process.argv.slice(2));
  checkArgs()
}

function checkArgs() {
  log.level = args.debug ? 'verbose': 'info'
}
