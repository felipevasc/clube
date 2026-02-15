#!/usr/bin/env bash
set -euo pipefail

tmux has-session -t clube-codex 2>/dev/null || tmux new -d -s clube-codex -n run

# Use a stable target (window index 1 if exists, else 0)
if tmux list-windows -t clube-codex 2>/dev/null | grep -q "^1:"; then
  TARGET="clube-codex:1.0"
else
  TARGET="clube-codex:0.0"
fi

tmux send-keys -t "$TARGET" C-c || true
sleep 0.2

tmux send-keys -t "$TARGET" "cd /mnt/c/dev/clube" C-m
sleep 0.2

tmux send-keys -t "$TARGET" "codex exec --full-auto < tmp/prompt_prod_full.txt" C-m

echo "started"
