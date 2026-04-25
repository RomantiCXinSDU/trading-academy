# 贡献指南

感谢你对观澜交易学堂的关注！我们欢迎任何形式的贡献。

## 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [提交规范](#提交规范)
- [报告 Bug](#报告-bug)
- [功能建议](#功能建议)

## 行为准则

- 友善、尊重地交流
- 接受建设性的批评
- 关注于代码本身，而非个人

## 如何贡献

### 🐛 报告 Bug

提交 Issue 前请先搜索是否已有相同问题。使用 Bug 报告模板提交。

### 💡 功能建议

使用功能建议模板提交，详细描述你想添加的功能和使用场景。

### 📝 改进文档

文档改进和代码贡献同样重要，包括修复错别字、补充说明、翻译等。

### 🔧 提交代码

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feat/amazing-feature`
3. 提交修改：`git commit -m 'feat: add amazing feature'`
4. 推送到分支：`git push origin feat/amazing-feature`
5. 提交 Pull Request

## 开发流程

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 确保代码通过类型检查
npm run build

# 4. 确保代码符合规范
npm run lint
```

## 提交规范

本仓库使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `style` | 样式或格式变更 |
| `refactor` | 代码重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具链变更 |

示例：
```
feat: add RSI indicator detail page
fix: correct position sizing calculation
docs: update README with new screenshots
```

## 报告 Bug

提交 Bug 报告时请包含：

- 清晰的标题
- 复现步骤
- 期望行为与实际行为
- 浏览器环境
- 截图（如适用）

## 功能建议

提交功能建议时请描述：

- 功能解决了什么问题
- 预期的使用方式
- 参考实现（如有）

---

再次感谢你的贡献！🎉
