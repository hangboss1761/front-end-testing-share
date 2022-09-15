# Component And E2E testing

## Getting started

[安装VS Code插件](https://playwright.dev/docs/getting-started-vscode)，方便好用的开发、调试工具
[下载依赖的二进制浏览器文件](https://playwright.dev/docs/browsers)，安装依赖时默认会进行下载，如果该步骤有问题，可参考链接中的其他方式进行处理（国内下载速度慢）

```bash
# 安装依赖
yarn install

# 运行所有测试，提交代码时，请运行它确保所有测试通过
yarn all-test

# 运行E2E测试
yarn e2e-test

# 运行组件测试
yarn ct-test

# 查看E2E测试报告
npx playwright show-report

# 查看组件测试报告
npx playwright show-report playwright-report-ct

# 静态检查&自动fix
yarn lint
```
## 持续集成（使用GitHub action）

新建一个名字为`gh-pages`的分支

配置

新建文件与目录

github action配置

## 相关仓库

- [Vue vben admin](https://github.com/vbenjs/vue-vben-admin) - 部分用例使用了它的在线Demo作为被测试的Web应用