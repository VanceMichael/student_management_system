# 学生信息管理系统 - 管理后台前端
# 使用多阶段构建，支持 ARM64 和 AMD64 跨平台

# 阶段1: 构建阶段（如果需要构建步骤）
FROM --platform=$BUILDPLATFORM node:20-alpine AS builder

WORKDIR /app

# 复制项目文件
COPY . .

# 如果有需要构建的步骤（如npm build），在这里执行
# 当前项目是纯静态文件，无需构建步骤

# 阶段2: 运行阶段
# 使用官方 nginx 镜像，支持多平台（ARM64/AMD64）
FROM nginx:1.25-alpine

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 删除默认的 nginx 静态文件
RUN rm -rf ./*

# 从构建阶段复制静态文件
COPY --from=builder /app/index.html .
COPY --from=builder /app/css ./css
COPY --from=builder /app/js ./js

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 设置文件权限
RUN chmod -R 755 /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
