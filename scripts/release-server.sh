#!/bin/sh
# 发布个人主页：本机构建，把 dist/ 同步到服务器，由知识库网关（eliauk-usagi-kb 的 deploy/gateway/blog-routes.conf）托管。
#   USAGI_SERVER=root@<服务器 IP> scripts/release-server.sh
#
# - 只发布已提交的内容：工作区有未提交改动时拒绝发布，线上版本总能对应到一次提交。版本记录在服务器的 deploy/blog/RELEASE。
# - 在本机构建：构建时生成的 OG 分享图需要中文字体，本机（macOS）自带。
# - 同步用 --delay-updates，文件全部传完才统一替换，访问中途不会拿到新旧混杂的页面；网关只读挂载该目录，无需重启。
# 服务器目录默认 /opt/usagi-kb/deploy/blog，可用 USAGI_BLOG_DIR 修改。
set -eu

: "${USAGI_SERVER:?请设置 USAGI_SERVER，例如 USAGI_SERVER=root@1.2.3.4}"
dir="${USAGI_BLOG_DIR:-/opt/usagi-kb/deploy/blog}"
cd "$(dirname "$0")/.."

[ -z "$(git status --porcelain)" ] || {
  echo "工作区有未提交的改动，先提交再发布" >&2
  exit 1
}

echo "▶ 构建（类型检查 + 静态输出）"
pnpm build

release="$(mktemp /tmp/usagi-blog-release.XXXXXX)"
trap 'rm -f "$release"' EXIT
printf '%s\n' "$(git log -1 --format='%h %cd %s' --date=format:'%F %T')" \
  "发布于 $(date '+%F %T')，分支 $(git branch --show-current)，发布人 $(git config user.name)" >"$release"

echo "▶ 同步 dist/ 到 $USAGI_SERVER:$dir/site/"
ssh "$USAGI_SERVER" "mkdir -p '$dir/site'"
rsync -az --delete --delay-updates dist/ "$USAGI_SERVER:$dir/site/"
ssh "$USAGI_SERVER" "cat > '$dir/RELEASE'" <"$release"

echo "▶ 检查 IP 入口（公开访问，应返回 200）"
code="$(ssh "$USAGI_SERVER" "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8082/")"
[ "$code" = 200 ] || {
  echo "8082 返回 ${code}，网关可能还没有加载个人主页入口：先发布知识库网关（eliauk-usagi-kb 的 deploy/release-server.sh）" >&2
  exit 1
}
echo "✔ 发布完成：$(head -1 "$release")"
