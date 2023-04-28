
namespace CONDITION {
  type BaseItem = {
    label: string;
    value: string;
  }

  type ConditionItem = BaseItem & {
    /** 值对应的表单类型： 1文本框，2日期选择框，3下拉列表 */
    type: number;
    /** 操作符列表 */
    operatorList: IBaseItem[];
  }

  /** 条件列表 */
  type ConditionList = () => Promise<ConditionItem[]>;
}
