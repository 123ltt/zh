import { GComponent } from './GComponents'

interface IImage {
  url: string;
  name: string;
  primary: boolean;
}

export declare class PUploadImage extends GComponent {
  /**
   * 图片列表
   * 必须使用`sync`修饰符
   */
  images: IImage[];
  /**
   * 上传图片的地址
   */
  action: string;
  /**
   * 自定义上传请求方法
   */
  httpRequest: Function;
  /**
   * 图片的大小。默认为`0`不限制
   */
  size: number;
  /**
   * 限制图片的尺寸 `[宽, 高]`。默认不限制
   */
  dimension: [number, number];
  /**
   * 当前是否有图片正在上传中
   * 必须使用`sync`修饰符
   */
  uploading: boolean;
  /**
   * 最大允许上传个数。默认不限制
   */
  limit: number;
  /**
   * 是否支持多选文件。默认单个文件选择
   */
  multiple: boolean;
  /**
   * 是否禁用（即是否只读）
   */
  disabled: boolean;
  /**
   * 是否需要主图功能。默认`true`
   */
  primary: boolean;
  /**
   * 是否启用拖拽排序。默认`false`
   */
  dragable: boolean;
  /**
   * 是否显示删除按钮。默认`true`
   */
  isRemove: boolean;
  /**
   * 是否显示设置主图按钮。默认`true`
   */
  isPrimary: boolean;
  /**
   * 是否显示查看原图按钮
   */
  isRaw: boolean;
  /**
   * 是否显示图片名。默认`true`
   */
  isFilename: boolean;
  /**
   * 是否启用预览图。默认`true`
   */
  isPreview: boolean;
}