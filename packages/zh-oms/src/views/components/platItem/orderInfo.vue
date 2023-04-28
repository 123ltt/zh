<template>
  <el-table-column label="订单信息">
    <div slot-scope="scope" @mouseover="()=>{isActive = scope.$index}" @mouseleave="()=>{isActive = -1}">
      <g-list-group label-width="80px" label-align="center">
        <g-list-group-item v-for="(item,index) in itemData" :key="index" :label="item.label">
          <Copy v-if="item.type==='copy'" :id="scope.row[item.key]" ref="copy" :cursor="true" :index="scope.$index" :active="isActive" @toDetails="toOrderDetails(scope.row[item.key],item.url,item.key,item.dyRouter,scope.row)" />
          <g-text-ellipsis v-if="item.type==='text'">{{ scope.row[item.key] }}</g-text-ellipsis>
        </g-list-group-item>
      </g-list-group>
    </div>
  </el-table-column>
</template>

<script>
import Copy from '../copy/index.vue'
export default {
  components: {
    Copy
  },
  props: {
    itemData: Array
  },
  data() {
    return {
      isActive: -1
    }
  },
  methods: {
    toOrderDetails(id, url, key, dyRouter = false, row) {
      const obj = {}
      if (Array.isArray(dyRouter)) {
        url += '/-'
        dyRouter.forEach(item => {
          url += `/${row[item]}`
        })
      }
      if (!obj[key]) {
        obj[key] = id
      }
      this.$newPage({
        path: url,
        data: obj
      })
    }
  }
}
</script>
