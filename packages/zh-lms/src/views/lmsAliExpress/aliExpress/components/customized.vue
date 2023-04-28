<template>
  <el-table v-if="list.length"
            :data="list"
            row-key="rowKey"
            border
            stripe
            highlight-current-row
            class="form-table g-table g-table-dense mt-2"
  >
    <!-- class="form-table g-table g-table-dense mt-2" -->
    <el-table-column :label="data.names" prop="skuProperty" width="100" />
    <el-table-column v-if="data.customizedName" label="自定义名称" prop="skuProperty" width="200">
      <template slot-scope="{ row }">
        <span v-if="isReadOnly" class="d-inline-block pt-2 pb-2 min-h24">{{ row.customizedName }}</span>
        <el-input v-else v-model="row.customizedName" @blur="(event) => addNameHandle(event, row)" />
      </template>
    </el-table-column>
    <el-table-column v-if="data.customizedPic" label="属性图 " prop="skuProperty" width="100">
      <template slot-scope="{ row }">
        <g-thumb :width="40"
                 :height="40"
                 :url="row.customizedPic"
                 :class="isReadOnly ? '' : 'cursor-pointer'"
                 @click.native="addImageHandle(row)"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// import { deepClone } from '@/util/util'
// import ImgShowList from './picture/imgShowList.vue'
import attrPic from './picture/attrPic.vue'
export default {
  name: 'Customized',
  props: {
    data: Object,
    baseProductInfo: Object,
    customized: Object,
    isReadOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      imgShowList: []
    }
  },
  watch: {
    data: {
      handler(data) {
        // 当前属性不为空
        this.list = []
        if (data.value?.length) {
          data.value.forEach(val => {
            const row = { }
            data.valueJson.find(item => {
              if (item.id === val) {
                row.attributeId = data.attributeId
                row.skuProperty = item.label
                row.skuPropertyId = val
                // 自定义属性名
                if (data.customizedName) {
                  row.customizedName = this.customized[val] ? this.customized[val].customizedName : ''
                }
                // 自定义属性图片
                if (data.customizedPic) {
                  row.customizedPic = this.customized[val] ? this.customized[val].customizedPic : ''
                }
              }
            })
            this.list.push(row)
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 编辑自定义属性名
    addNameHandle(event, row) {
      const customizedName = event.target.value
      this.$emit('update:customized', Object.assign({}, this.customized, {
        [row.skuPropertyId]: {
          ...row,
          changed: 'customizedName',
          customizedName
        }
      }))
    },
    translate(index) {
      const row = this.list[index]
      this.$emit('updateCustomized', row.skuPropertyId, row)
    },
    // 选择图片库事件
    addImageHandle(row) {
      if (this.isReadOnly) return
      const { imgShowList } = this.baseProductInfo
      this.imgShowList = imgShowList.map(item => {
        return {
          imageUrl: item.imageUrl,
          isCheck: row.customizedPic === item.imageUrl
        }
      })
      this.$modal({
        title: '图片库',
        component: attrPic,
        padding: '20px 0 20px 20px',
        minHeight: '300px',
        width: '754px',
        data: {
          imgShowListByPms: this.imgShowList
        },
        callback: (imageUrls) => {
          if (imageUrls) {
            const customizedPic = imageUrls.length ? imageUrls[0] : ''
            row.customizedPic = customizedPic
            const obj = Object.assign({}, this.customized, {
              [row.skuPropertyId]: {
                ...row,
                changed: 'customizedName',
                customizedPic
              }
            })
            this.$emit('update:customized', obj)
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.cursor-pointer{
  cursor: pointer;
}
.min-h24{
  min-height: 24px;
}
</style>
