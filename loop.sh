#!/bin/zsh
# opencode 永动循环驱动：抄 lanren 工具 → 实现 → 测试 → build → playwright 验证 → push → 更新状态
# 用法: ./loop.sh [最大轮数，默认无限]
cd "$(dirname "$0")" || exit 1

STATE=docs/loop-state.md
PLAN=docs/plans/2026-08-20-code-category-loop.md
MAX=${1:-0}
i=0

while true; do
  remaining=$(grep -c "| todo |" "$STATE")
  blocked=$(grep -c "| blocked |" "$STATE")
  echo "=== 第 $((i+1)) 轮 | 剩余 todo: $remaining | blocked: $blocked ==="
  [ "$remaining" -eq 0 ] && echo "✅ 全部完成" && break
  if [ "$MAX" -gt 0 ] && [ "$i" -ge "$MAX" ]; then echo "已达最大轮数 $MAX"; break; fi

  opencode run "读取 $STATE 找到第一个 todo 状态的工具，按 $PLAN 的 9 步 loop 执行：playwright 抄录 lanren 原站行为→实现 lib+组件→vitest→npm run build→commit+push→等 Vercel 部署后 playwright 验证线上→更新状态为 deployed。禁止提问；报错自行修复重试；单工具失败 3 次标记 blocked 换下一个。上下文快满时立即收尾退出，状态文件保证下轮续跑。"

  i=$((i+1))
  sleep 5
done
