# GlobalLaunch AI - 跨境出海决策专家

这是一个基于 **Google Gemini 3** 模型的智能决策辅助应用，专为中国硬件出海企业设计。它能提供专家级的选品建议（Expert Analysis）和目标市场用户仿真（Persona Simulation）。

## 核心功能

1.  **专家决策模式**：基于六维雷达图（物流、成本、竞争、合规等）评估产品出海可行性。
2.  **用户仿真模式**：模拟特定国家（如美国、日本）用户的真实反馈和吐槽。

## 本地开发 (Development)

1.  安装依赖：
    ```bash
    npm install
    ```

2.  设置环境变量：
    在根目录创建 `.env` 文件，并填入您的 Google Gemini API Key：
    ```env
    API_KEY=AIzaSy...您的密钥...
    ```
    > 注意：由于这是一个纯前端项目，Key 会在构建时注入到代码中。请勿将包含 Key 的代码发布到公共仓库。

3.  启动开发服务器：
    ```bash
    npm run dev
    ```

## 部署 (Deployment)

推荐使用 **Vercel** 进行一键部署：

1.  将代码推送到 GitHub（确保 `.env` 文件被 `.gitignore` 忽略，不要上传）。
2.  在 [Vercel](https://vercel.com) 导入该项目。
3.  在 Vercel 的 **Settings > Environment Variables** 中添加：
    *   **Key**: `API_KEY`
    *   **Value**: `您的 Google Gemini API Key`
4.  点击 **Deploy**。

## 构建 (Build)

如果您需要手动构建静态文件：

```bash
npm run build
```

构建产物将位于 `dist/` 目录下。

## 技术栈

*   React 18 + TypeScript
*   Vite (Build Tool)
*   Tailwind CSS (Styling)
*   @google/genai (AI Model SDK)
"# global-launch-ai" 
