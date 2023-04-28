# dom字体颜色
##  使用
```html
<template>
  <div>
     <el-table-column slot="slotStatus" label="状态" :width="orderType==='all'||orderType==='audit'?140:'auto'">
      <template slot-scope="row">
        <span v-color:[row.status]="color">{{ row.statusStr }}</span>
        <span v-color="'text-primary'">{{ row.statusStr }}</span>
      </template>
    </el-table-column>
  </div>
</template>

<script>
export default {
  data() {
    return {
      color:"red.blue.#fff"
    }
  },
}
</script>
```



## 可用的颜色
- `{color}` 有gray,green,red,blue,yellow等默认值 （可扩展新增#***）

