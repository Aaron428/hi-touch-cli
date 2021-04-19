'use strict';
const path = require('path');
const pkgDir = require('pkg-dir').sync;
const {isObject} = require('@touch-cli/utils');
const formatPath = require('@touch-cli/format-path');

class Package {
  constructor(options) {
    if (!options) {
      throw new Error('class Package\'s options is required');
    }
    if (!isObject(options)) {
      throw new Error('class Package\'s options must be a object');
    }

    // package 路径
    this.targetPath = options.targetPath;
    // // package 本地缓存路径
    // this.storePath = options.storePath
    // package name
    this.packageName = options.name;
    // package version
    this.packageVersion = options.version;
  }
  // 判断package 是否存在
  exist() {}

  // 安装package
  install() {}

  //
  update() {}

  // 获取入口文件的目录
  getRootFilePath() {
    // 1. 获取package.json所在的目录 pkg-dir
    const packageDir = pkgDir(this.targetPath);
    if(packageDir) {
      // 2. 读取package.json require()
      const pkgFile = require(path.resolve(packageDir, 'package.json'));
      // 3. 获取main/lib - path
      if (pkgFile && pkgFile.main) {
        // 4. 路径的兼容
        return formatPath(path.resolve(packageDir, pkgFile.main));
      }
    }
    return null;
  }
}

module.exports =Package;

