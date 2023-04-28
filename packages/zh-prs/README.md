# zh-prs
> 注意：该项目无法独立允许，需要在saber项目中引入使用

## 使用方法
#### 下面操作全部在zh-prs项目中
1. 将该项目克隆到本地，并执行`npm install`安装依赖
2. **安装依赖后执行命令`npm link`**
> 注意：如果此项目地址发生变化，需要重新执行`npm link`

#### 下面操作全部在saber项目中
3. 到saber项目，找到package.json，在`dependencies`字段中添加
```json
{
  "zh-prs": "git+http://devops:Onw2OYq0N1mqV3aHj14Z@gitlab.zehui.local/front-end/zh-prs.git#master"
}
```
4. 在`src/router`文件夹中找到对应平台的文件（SaaS租户对应saas.js，平台服务中心对应platform.js）添加`import * as prs from 'zh-prs'`，并在`subs`数组中添加导入的`prs`
5. 如果是开发模式**执行命令`npm link zh-prs`**，否则可以直接执行`npm install`
6. 启动脚本：SaaS平台执行`npm run serve-saas`，服务中心执行`npm run serve`
> 注意：每次执行`npm install`需要重新执行`npm link zh-prs`

## 相关npm命令
- `npm install`：可简写`npm i`，根据package.json安装依赖
- `npm link`：可简写`npm ln`，进行软链（可以简单理解为将A项目作为一个全局依赖，包名为package.json中的name，然后在B项目中通过`npm link 包名`将A作为一个依赖包使用）
- `npm upgrade xxx`：升级依赖包