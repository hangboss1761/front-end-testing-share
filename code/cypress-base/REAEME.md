# 开始

```

```

## 并发执行

单个机器上的并发执行

```bash
yarn add cypress-multi-reporters cypress-parallel -D
```
```json
{
  "script": {
    "cypress:run": "cypress run --reporter json",
    "cypress:parallel": "cypress-parallel -s cypress:run -t 4 -d cypress/e2e",
  }
}
```