# 全局表格组件
> 自带分页、自动调整表格高度、表头拖拽排序、自定义列、列筛选数据

## 示例
假设后端返回的数据格式为：
```json
{
  "data": {
    "records": [
      { "id": 1, "name": "张三", "age": 20 },
      { "id": 2, "name": "王二", "age": 22 },
      { "id": 3, "name": "李四", "age": 38 },
    ],
    "total": 100,
    "pageSize": 3
  }
}
```

查看示例：
- [基本使用](examples/gtable/basic.vue)
- [使用默认插槽](examples/gtable/slot.vue)
- [使用headers + 自定义插槽](examples/gtable/headers-and-slot.vue)
- [拖拽+自定义列](examples/gtable/drag-and-custom-columns.vue)。可以在 `global-components` 项目中启动项目查看效果（demo对应的文件为 `src/views/table.vue`）
- [列表增加过滤功能](examples/gtable/filter.vue)

## Props
- `rowKey` `{String}` 列表数据中具有唯一性的字段名，未设置则默认取索引
- `headers` `{Array}` 自定义表头，支持的属性请参考 [Table-column Attributes](https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes) 。额外支持的两个属性：
  - `headers[].slot` `{Boolean}` 是否启用自定义具名插槽。默认`false`
  - `headers[].slotName` `{String}` 具名插槽的名称。与模板中的`slot="slotName"`对应。（具体参考示例3）
  - `headers[].label` `{String}` 如果需要用到自定义列，则每项都需要 `label` 字段（用于在配置界面显示名称）
  - `headers[].group` `{String}` 可选参数。如果需要将所有的列进行分组显示可配置该字段。自定义列时 根据 `group` 将表头进行分组
  - `headers[].visible` `{Boolean}` 是否显示该列。默认 `true`
  - `headers[].filter` `{Boolean}` 是否启用过滤（筛选）功能。默认 `false`。使用自定义插槽时设置 `filter:true` 是**不生效的**，需要使用 `GTableColumnHeader` 组件，具体使用请查看 [示例代码](examples/gtable/filter.vue#L22)。
- `fetch` `{Function}` 提供给GTable组件调用的方法
  - **参数**：调用该方法时会传入两个参数： 
    - `page` `{Object}` 其中包含两个属性：`current`(当前页码) 和 `size`(当前每页数量)
    - `params` `{any}` 对应外部通过调用`load(pageIndex, params)`方法传入的第二个参数
  - **返回值**：返回值必须是Promise，且数据结构为`{ records: [], total: 0, size: 10 }`
    - `records` `{Array}` 列表数据
    - `total` `{Number}` 总条数
    - `size` `{Number}` 非必须。每页最多条数。
- `pageShow` `{Boolean}` 是否显示分页。默认`true`
- `pageSize` `{Number}` 默认每页数量。默认`15`
- `pageSizes` `{Array}` 每页显示个数选择器的选项设置。默认`[10, 15, 20, 50, 100]`
- `pageLayout` `{String}` 组件布局，子组件名用逗号分隔。默认`total, sizes, prev, pager, next, jumper`
- `pagerCount` `{Number}` 页码按钮的数量，当总页数超过该值时会折叠。大于等于 5 且小于等于 21 的奇数。默认`7`
- `size` `{String}` 表格显示尺寸。默认`small`
- `diffHeight` `{Number}` 可能因某些原因导致高度计算有误，可以通过该参数补充。默认`10`，默认10px为basic-container组件的上内边距
- `fixedHeight` `{Boolean}` 是否通过js计算高度，使表格固定高度。默认`true`
- `immediate` `{Boolean}` 组件创建是否自动获取数据（即执行`this.load(1)`）。默认`false`
- 默认支持`ElTable`的所有属性，[详情见](https://element.eleme.cn/#/zh-CN/component/table#table-attributes)
- `dense` `{Boolean}` 是否启用紧凑内容（减少单元格内边距和行间距）。默认`false`
- `showOrder` `{Boolean}` 是否在首列添加序号（序号会根据当前数据索引、页码、每页数量进行计算）。默认`false`
- `draggable` `{Boolean}` 表头是否支持拖拽排序。默认 `false`。**启用拖拽功能 `headers` 属性需要使用 `.sync` 修饰符。**
- `customColumn` `{Object}` 自定义列的设置页面 的配置（即 popover 左侧区域的配置，详见 customColumn.vue 文件）
  - `cols` `{Number}` 每行显示的个数。默认 `3`
  - `itemWidth` `{String}` 每个的宽度。默认 `100px`

## slot 插槽
- 默认插槽。**如果设置了`headers`属性，则默认插槽失效**。使用方法参考示例2
- `header` 位于表格上面。通常放搜索条件。使用方法参考示例3
- `footer-left` 位于分页左侧。通常放按钮，如：全选、批量备注。使用方法参考示例3
- `custom-column-body` 自定义列配置页面（popover层）的左侧部分。可通过 `v-slot:custom-column-body="{data}"` 中的 `data` 得到表头 (即 `headers`)

## 方法
- `load( pageIndex, params )`。使用方法参照示例3
  - `pageIndex` `{Number}` 必填。需要显示的页码。默认`1`。小于1则使用当前的页码
  - `params` `{any}` 选填。需要传递给`fetch`方法的第二个参数。如果未传入该参数，则继续使用上次传入的params
- `updateTableHeight()` 更新表格的高度。当header slot内容的高度发生变化时可以通过调用该方法重置高度

## 事件
- `rendered` 列表每次渲染完成触发。得到的参数为列表数据，对应`this.$refs.table.tableList`
- 支持ElTable所有的事件，[详情见](https://element.eleme.cn/#/zh-CN/component/table#table-events)

## GTableColumnHeader 组件
在使用**过滤功能** 且 需要用到**自定义插槽**，这时 GTableColumnHeader组件 就可以排上用场。具体使用请查看 [示例](examples/gtable/filter.vue)

props：
- `label` `{String}` 列头表头
- `prop` `{String}` 该列对应数据的字段名

> 注意：_**GTableColumnHeader 组件只能在GTable中使用**_
>
> 另外，自定义插槽中直接配置 `filter: true` 是不生效的，如：<br>
> `{slot: true, slotName: 'title', label: '标题', filter: true}` ，<br>
> 需要通过 `GTableColumnHeader` 组件配合使用，具体使用请查看 [示例代码](examples/gtable/filter.vue#L22)

## 其他说明
#### `load`方法使用场景：
- 初始化加载数据（必须在mounted生命周期中执行） `this.$refs.table.load(1)`
- 根据条件搜索时 `this.$refs.table(1, conditions)`
- 保留搜索条件和当前页码刷新列表 `this.$refs.table(0)`
- 根据当前确定的搜索条件跳转到第2页 `this.$refs.table(2)`
- 清空搜索条件并跳转到第3页 `this.$refs.table(3, null)`。（注意：只会清空GTable组件中缓存的params）

#### 在组件中获取GTable中的列表数据：
目前只能通过 `this.$refs.table.tableList` 获取
