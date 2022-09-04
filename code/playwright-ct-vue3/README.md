# Playwright Component Testing

## Getting started

[安装VS Code插件](https://playwright.dev/docs/getting-started-vscode)，方便好用的开发、调试工具
[下载依赖的二进制浏览器文件](https://playwright.dev/docs/browsers)，安装依赖时默认会进行下载，如果该步骤有问题，可参考链接中的其他方式进行处理（国内下载速度慢）

```bash
# 安装依赖
yarn install

# 运行组件测试，提交代码时，请运行它确保所有测试通过
yarn ct-test

# 查看组件测试报告
npx playwright show-report

# 静态检查&自动fix
yarn lint
```