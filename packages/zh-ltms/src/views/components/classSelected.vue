<template>
  <div class="w-100">
    <!-- 三级联动 -->
    <el-cascader
      v-model="cacheValue"
      :options="realList"
      :props="options.prop"
      filterable
      :style="{ width: width || defaultWidth }"
      clearable
      collapse-tags
      @change="becomeThree"
    />
  </div>

</template>
<script>
export default {
  name: 'CommonSelectedBox',
  props: {
    value: [String, Number, Array],
    width: {
      type: String,
      required: false
    },
    list: {
      type: Array,
      required: true
    },
    options: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      cacheValue: '',
      defaultWidth: '85%',
      realList: [],
      result: []
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        if (newVal !== this.cacheValue) {
          //  编辑初始化数据
          if (!oldVal.length) {
            if (this.name === 'logisticsProperty') {
              this.cacheValue = newVal && this.initProperty(newVal)
            } else if (this.name === 'startShipment') {
              this.cacheValue = newVal && this.initShipment(newVal)
            }
          }
          this.becomeThree(this.cacheValue)
        }
      }
    },
    list: {
      handler(v) {
        if (this.value !== this.cacheValue) {
          if (this.name === 'logisticsProperty') {
            this.cacheValue = this.value && this.initProperty(this.value)
          } else if (this.name === 'startShipment') {
            this.cacheValue = this.value && this.initShipment(this.value)
          }
        }
        this.initData(v)
      },
      immediate: true
    }

  },

  methods: {
    initData(val) {
      this.realList = this.deleteChildren(val, this.options.childLabel)
    },
    deleteChildren(arr, childName) {
      arr.forEach(item => item[childName]?.length
        ? this.deleteChildren(item[childName], childName)
        : delete item[childName])
      return arr
    },
    initProperty(val) {
      const result = []
      function searchParentId(list, key, newArray = []) {
        const newList = list.filter(item => item.parentId + '' === key + '')
        !newList[0] ? !newArray[0]
          ? result.push([key])
          : result.push(Array.from(new Set([...newArray])))
          : newList.forEach(item => {
            const array = [...newArray, key, item.logisticsPropertyId]
            searchParentId(list, item.logisticsPropertyId, array)
          })
      }
      Array.isArray(val) && val.forEach((item, i, arr) => {
        if (item.parentId === 0) {
          searchParentId(arr, item.logisticsPropertyId)
        }
      })
      return result
    },
    initShipment(val) {
      const result = []
      function getParentCode(list, code) {
        for (const i in list) {
          if (list[i].code + '' === code + '') return [code]
          if (list[i].warehouseChildVOList) {
            const node = getParentCode(list[i].warehouseChildVOList, code)
            if (node !== undefined) {
              return node.concat(list[i].code)
            }
          }
        }
      }

      Array.isArray(val) && val.forEach(item => {
        result.push((getParentCode(this.list, item.startShipmentCode) || []).reverse())
      })
      return result
    },

    becomeThree(val) {
      this.$emit('input', val)
      this.$emit('init', val)
    }

  }
}
</script>
<style lang="scss" scoped>
.w-100{
  width:100%
}
</style>
