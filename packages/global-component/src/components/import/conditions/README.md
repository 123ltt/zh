# 条件生成组件

## 使用示例
```html
<template>
  <conditions v-model="cond"
              :conditions-request="conditionsRequest"
              :values-request="valuesRequest"
    />
</template>

<script>
import { Conditions } from 'global-components'
import { getConditions, getConditionValues } from '@/api/oms/conditions'

export default {
  components: { Conditions },
  data() {
    return {
      conditionsRequest: getConditions,
      valuesRequest: getConditionValues,
      cond: {}
    }
  }
}
</script>
```

## Conditions组件
#### Props
- `conditionsRequest` `{Promise<{label:string;value:string;type:number;operatorList:{label:string;value:string}[]}[]>}` 必填。请求条件列表数据（请参考下面的数据格式示例）
- `valuesRequest(value, type)` `{Promise<{label:string;value:string}[]>}` 必填。条件对应的可选值（请参考下面的数据格式示例）
- `currencyRequest()` `{Promise<{label:string;value:string}[]>}` 如果有类型为5，则必填。币种下拉选项（数据格式与valuesRequest一致）
- `group` `{boolean}` 是否需要支持组。默认`true`
- `nodeTypeKey` `{string}` 自定义节点类型字段名。默认`nodeType`
- `childrenKey` `{string}` 自定义子节点类型字段名。默认`children`
- `operatorKey` `{string}` 自定义操作符字段名。默认`operator`
- `fieldKey` `{string}` 自定义条件取值的字段名。默认`field`
- `ruleKey` `{string}` 自定义单个条件所属的字段名。默认`rule`
- `allowEmpty` `{boolean}` 是否允许删除所有条件。默认`false`
- `disabled` `{boolean}` 是否禁用。默认`false`
- `extendsField` `{object}` 扩展字段。格式为`{ [type]: object }`，如：给类型为5扩展字段 `{ 5: {a: ''} }`。**注意：目前只支持类型5**

#### 方法
- `validate` 校验表单。返回布尔值。通过`true`，不通过`false`
- `clearValidate` 清除校验
- `updateValuesSelect` 更新取值列表（只更新type为3的列表）

## ConditionsGroup组件
#### Props
- `data` `{{rules:CONDITION.ConditionItem[],nodeType:string;operator:string}}` 接收的值
- `conditionOptions` `{{label:string;value:string;type:number;operatorList:{label:string;value:string}[]}[]}` 条件列表数据
- `valuesRequest(value, type)` `{Promise<{label:string;value:string}[]>}` 必填。条件对应的可选值。
- `currencyRequest()` `{Promise<{label:string;value:string}[]>}` 如果有类型为5，则必填。币种下拉选项（数据格式与valuesRequest一致）
- `group` 同`Conditions`组件
- `nodeTypeKey` 同`Conditions`组件
- `childrenKey` 同`Conditions`组件
- `operatorKey` 同`Conditions`组件
- `fieldKey` 同`Conditions`组件
- `ruleKey` 同`Conditions`组件
- `allowEmpty` 同`Conditions`组件
- `disabled` `{boolean}` 是否禁用。默认`false`

#### 事件
- `change(data)` `data`为当前组的数据

## 数据格式示例 
1. Conditions组件 `v-model`的数据格式（默认格式）
```json
{
  "operator": "",
  "children": [
    {
      "rule": {
        "field": "channelCode",
        "operator": "",
        "value": ""
      },
      "nodeType": "item"
    },
    {
      "operator": "",
      "children": [
        {
          "rule": {
            "field": "",
            "operator": "",
            "value": ""
          },
          "nodeType": "item"
        },
        {
          "rule": {
            "field": "",
            "operator": "",
            "value": ""
          },
          "nodeType": "item"
        }
      ],
      "nodeType": "group"
    },
    {
      "rule": {
        "field": "",
        "operator": "",
        "value": ""
      },
      "nodeType": "item"
    }
  ],
  "nodeType": "group"
}
```

2. `conditionsRequest`方法返回的数据格式
```json
[
  {
    "label": "收货国家",
    "value": "receiveCountryCode",
    "type": 3,
    "operatorList": [
      {
        "label": "包含",
        "value": "in"
      },
      {
        "label": "不包含",
        "value": "notin"
      }
    ]
  },
  {
    "label": "创建时间",
    "value": "crateTime",
    "type": 2,
    "operatorList": [
      {
        "label": "等于",
        "value": "equal"
      },
      {
        "label": "不等于",
        "value": "notequal"
      }
    ]
  }
]
```

3. `valuesRequest`方法返回的数据格式

下拉列表：
```json
[
  {
    "label": "4PX-S小包平邮WISH",
    "value": "TEST1"
  },
  {
    "label": "4PX-S小包挂号WISH",
    "value": "TEST2"
  }
]
```
级联：
```json
[
  {
    "label": "4PX-S小包平邮WISH",
    "value": "TEST1",
    "children": [
      {
        "label": "小包平邮WISH",
        "value": "TEST2",
      }
    ]
  },
  {
    "label": "4PX-S小包挂号WISH",
    "value": "TEST2"
  }
]
```