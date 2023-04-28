# 下拉内容使用虚拟滚动
> 用于替代`ElSelect`组件。使用场景：下拉选项很多导致页面卡顿时可用（少量也可使用）

## 单选使用示例
```html
<template>
  <g-select v-model="value" :items="list" key-field="id" label-field="name" value-field="id" />
</template>

<script>
export default {
  data() {
    return {
      list: this.getData(),
      value: 1 // 默认选中id为1的选项
    }
  },
  methods: {
    // 生成1万条数据
    getData() {
      return [...new Array(10000)].map((item, index) => {
        const name = Number(String(Math.random()).slice(2)).toString(32)
        return { id: index, name: name.repeat(3) }
      })
    }
  }
}
</script>
```

## 多选使用示例
```html
<template>
  <g-select v-model="values" :items="list" key-field="id" label-field="name" value-field="id" multiple />
</template>

<script>
export default {
  data() {
    return {
      list: this.getData(),
      values: [1, 2] // 默认选中id为1和2的选项
    }
  },
  methods: {
    // 生成1万条数据
    getData() {
      return [...new Array(10000)].map((item, index) => {
        const name = Number(String(Math.random()).slice(2)).toString(32)
        return { id: index, name: name.repeat(3) }
      })
    }
  }
}
</script>
```

## 自定义label 使用示例
```html
<template>
  <g-select v-model="value" :items="list" key-field="id" :label-field="getLabel" />
</template>

<script>
export default {
  data() {
    return {
      list: this.getData(),
      value: 1 // 默认选中id为1的选项
    }
  },
  methods: {
    // 生成1万条数据
    getData() {
      return [...new Array(10000)].map((item, index) => {
        const name = Number(String(Math.random()).slice(2)).toString(32)
        return { id: index, name: name.repeat(3) }
      })
    },
    // 自定义label
    getLabel(data) {
      return data.id + ' - ' + data.name
    }
  }
}
</script>
```

## props
- `items` `{Array}` 下拉列表的数据
- `keyField` `{String}` 必填项。每条数据的唯一值对应的字段名（**很重要**）
- `labelField` `{String | Function}` 下拉选项显示的内容对应的字段名。默认`label`。如果传入的是函数，则函数接受的参数为items的元素
- `valueField` `{String}` 选中返回的值。默认为`keyField`字段的值
- `itemHeight` `{Number}` 下拉选项的高度（每项的高度）。默认`30`（单位像素）
- `itemTitle` `{Boolean}` 下拉选项是否添加title属性。默认`false`
- `multiple` `{Boolean}` 是否多选。多选v-model返回的是数组。默认`false`
- `isCheckedAll` `{Boolean}` 是否显示全选按钮。默认`false`（**只有`multiple`为`true`时才生效**）
- `placeholder` `{String}` 占位符。默认`请选择`
- `disabled` `{Boolean}` 是否禁用。默认`false`
- `dropdownWidth` `{String}` 设置下拉框的宽度（需含单位）。默认为输入框的宽度。为 `auto` 时会根据内容**大概**计算长度
- `dropdownMinWidth` `{String}` 设置下拉框最小宽度（需含单位）。默认`12em`
- `loading` `{Boolean}` 设置是否显示loading。默认`false`。可配合`keyword`事件。
- `placement` `{String}` 菜单弹出位置，可选值有`top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`。默认`bottom`
- `readonly` `{Boolean}` 是否只读，只读状态不能勾选。默认`false`

## 事件
- `change` 勾选或取消勾选选项时触发。接收参数`(data, selectedList)`，`data`为当前点击选项的数据，`selectedList`已勾选的列表
- `remove-tag` 多选模式下移除tag时触发。接收参数`(data, selectedList)`，`data`为当前移除项的数据，`selectedList`已勾选的列表
- `clear` 清空勾选内容时触发
- `visible-change` 下拉框出现/隐藏时触发。接收参数`(visible)`，出现则为 true，隐藏则为 false
- `keyword` 如果设置该事件监听，则下拉框中输入关键词会执行`$emit('keyword', inputStr)`。此时GSelect组件内不做过滤处理