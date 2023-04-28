import Vue from 'vue'
import PUploadImage from './upload-image'
import PUploadFile from './upload-file'
import PEditor from './editor'
import { GComponent } from './GComponents'

/**
 * 图片上传组件
 */
export class UploadImage extends PUploadImage { }

/**
 * 文件上传组件
 */
export class UploadFile extends PUploadFile { }

/**
 * 富文本框编辑器
 */
export class Editor extends PEditor { }

/** 条件组件 */
export class Conditions extends GComponent { }

/**
 * oss图片水印配置
 */
export class OssWatermark extends GComponent { }

/** 点击输入框显示tree */
export class InputTree extends GComponent { }

/**
 * 检测链接是否属于oss
 */
export interface checkIsOssLink {
  /**
   * 判断是否属于oss链接
   */
  isOss: (url: string) => Promise<boolean>;
}

/**
 * 解析平台图片链接，根据宽高转成小图或大图
 */
export declare function platformLink(url: string, width = 50, height = 50, quality = 90): string;

/**
 * 解析oss图片链接，根据宽高转成小图或大图
 */
export declare function ossLink(url: string, width = 50, height = 50, quality = 90): string;

/**
 * 在context中找出第一个 组件名为name 的子组件
 */
export declare function findComponent(context: Vue, componentName: string): Vue
