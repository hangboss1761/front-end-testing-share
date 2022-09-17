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

## 使用GitHub Actions持续集成