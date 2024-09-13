# 使用官方 Node.js 镜像作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖项
RUN npm install

# 复制应用程序代码
COPY . .

# 暴露应用程序运行端口
EXPOSE 8000

# 启动命令
CMD ["node", "server.js"]
