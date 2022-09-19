# 开始

安装依赖

```bash
yarn install
```

通过open mode运行测试

```bash
yarn cypress:open
```

组件测试
```bash
yarn cypress:run-ct
```

## 查看报告
运行测试后，将会生成HTML报告在`cypress/reports/html`目录下。

html报告通过`cypress-mochawesome-reporter`生成。

## 并发执行
单个机器上的并发执行

```bash
yarn add cypress-multi-reporters cypress-parallel -D
```
```json
{
  "script": {
    "parallel-script": "cypress run -C cypress.parallel-config.ts",
    "cypress:parallel": "cypress-parallel -s parallel-script -t 4 -d cypress/e2e",
  }
}
```
> 单个机器上运行`yarn cypress:parallel`的时候无法生成HTML报告

## 持续集成

[Github Action](https://github.com/features/actions)是Github推出的一款简单易用的软件工作流自动化服务，对于托管在Github上的Public repositories完全免费，Private repositories免费使用但限制存储空间与运行时间。


这里我们将会展示怎么使用Github Actions进行持续集成，以及如何使用[github pages](https://docs.github.com/en/pages)来展示HTML报告。

### Cypress

Cypress官方提供的并发执行需要配合[Cypress dashboard](https://docs.cypress.io/guides/dashboard/introduction)使用，dashboard免费版的功能受限且无法私有化部署

官方提供的并发功能中，并发执行时用例的拆分策略无法控制，具体策略参考这个[文档](https://docs.cypress.io/guides/guides/parallelization#Balance-strategy)，当你的用例过少也使用并发执行的话，可能所有的用例都会被分配到一个机器中执行了。

官方对此的答复：https://github.com/cypress-io/cypress/issues/2520 （暂时不提供其他官方支持，通过付费您可以得到更好的使用体验）

这里有一些不依赖dashboard的解决方案：
- [Cypress Parallelisation Without Cypress Dashboard](https://stackoverflow.com/questions/61973532/cypress-parallelisation-without-cypress-dashboard)
- [sorry-cypress](https://github.com/sorry-cypress/sorry-cypress)- 类似Cypress dashboard的服务，开源免费支持测试报告、并发执行、私有部署等。它的升级版https://currents.dev/收费。
