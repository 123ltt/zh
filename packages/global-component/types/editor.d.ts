import { GComponent } from './GComponents'

export declare class PEditor extends GComponent {
  /**
   * 文本内容
   */
  textContent: string;
  /**
   * 上传图片的方法
   */
  httpRequest: Function;
  /**
   * 上传图片的api地址
   */
  uploadUrl: string;
  /**
   * 设置编辑区域的高度。默认`300`
   */
  height: number;
  /**
   * 是否禁用编辑器（只读）。默认`false`。禁用时，工具栏只会显示全屏按钮且内容不可编辑。
   */
  disabled: boolean;
  /**
   * 忽略粘贴内容中的图片。默认`true`
   */
  pasteIgnoreImg: boolean;
  /**
   * 自定义配置
   */
  customConfig: {[key: string]: any};
}