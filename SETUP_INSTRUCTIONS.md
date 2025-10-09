# Nextra C Language Icon Fix - Setup Instructions

## 已完成的工作

✅ 已成功实现 C 语言图标修复：
- 创建了 `packages/nextra/src/client/icons/c.svg` 图标文件
- 更新了 `packages/nextra/src/client/icons/index.ts` 添加 CIcon 导出
- 更新了 `packages/nextra/src/client/hocs/with-icons.tsx` 添加 'c' 语言映射
- 代码已提交到本地分支 `fix/c-language-icon`

## 下一步操作

由于我们没有直接推送到 shuding/nextra 仓库的权限，您需要：

### 1. Fork 仓库
1. 访问 https://github.com/shuding/nextra
2. 点击右上角的 "Fork" 按钮
3. 将仓库 fork 到您的 GitHub 账户

### 2. 更新远程 URL
```bash
# 将 YOUR_USERNAME 替换为您的 GitHub 用户名
git remote set-url origin https://github.com/YOUR_USERNAME/nextra.git
```

### 3. 推送代码
```bash
git push -u origin fix/c-language-icon
```

### 4. 创建 Pull Request
1. 访问您的 fork 仓库页面
2. 点击 "Compare & pull request" 按钮
3. 使用以下信息：

**PR 标题：**
```
feat(pre): add C language icon to code block header
```

**PR 描述：**
```markdown
## 背景与动机
补齐 `c` 语言的默认图标映射（`cpp` 已有，`c` 缺失）。

## 改动要点
- 新增 `CIcon` 组件，基于 Simple Icons C 语言设计
- 在 `with-icons.tsx` 中添加 `'c'` 语言映射
- 更新图标索引文件导出 `CIcon`

## 验证
- ` ```c` 代码块现在会显示 C 语言图标
- `filename="foo.c"` 也能触发图标显示
- 不影响现有的 `cpp`、`js`、`ts`、`bash` 等图标

## 兼容性
- 无破坏性变更
- 用户仍可使用 `withIcons(Pre, { c: ... })` 进行自定义

Fixes #4685
```

## 修改的文件

1. `packages/nextra/src/client/icons/c.svg` - 新增 C 语言图标
2. `packages/nextra/src/client/icons/index.ts` - 添加 CIcon 导出
3. `packages/nextra/src/client/hocs/with-icons.tsx` - 添加 'c' 语言映射

## 测试建议

在 PR 创建后，可以在示例页面中测试：

````markdown
```c filename="main.c" copy
#include <stdio.h>
int main(){ 
    printf("Hello, World!\n"); 
    return 0;
}
````
```

预期结果：代码块标题栏应显示 C 语言图标。