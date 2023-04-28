<!-- 个性化配置 -->
<template>
  <basic-container v-loading="loading" class="packageConfig">
    <el-form ref="addEdit" label-width="120px" size="mini" :model="formData" :rules="rules">

      <el-table :data="formData.detailDTOS"
                stripe
                border
                size="mini"
                class="mx-3 w-95 mb-4 g-table g-table-dense"
      >
        <el-table-column label="国家" prop="countryCode" align="center">
          <template v-slot="scope">
            <g-select v-if="!isDetail"
                      v-model="scope.row.countryCode"
                      :items="countryList"
                      key-field="countryNameShort"
                      :label-field="getLabel"
                      value-field="countryNameShort"
                      placeholder="请选择"
                      :item-title="true"
                      style="width:100%"
            />
            <span v-else>
              {{ countryObj[scope.row.countryCode] }}
            </span>
          </template>

        </el-table-column>

        <el-table-column label="属性" width="500px" align="center">
          <template slot-scope="slot">
            <el-cascader v-model="slot.row.property"
                         :options="propertyList"
                         size="mini"
                         :props="propertyOpt.prop"
                         clearable
                         filterable
                         :disabled="isDetail"
                         style="width:100%"
            />

          </template>
        </el-table-column>

        <el-table-column v-if="!isDetail" width="100" align="center">
          <template slot="header">
            <i class="el-icon-circle-plus icon-color text-primary fs-2" @click="addColumn" />
          </template>
          <template v-slot="slot">
            <i class="el-icon-remove icon-del fs-2 text-danger" @click="delColumn(slot.$index)" />
          </template>
        </el-table-column>
      </el-table>

      <div v-if="!isDetail" class="text-end">
        <el-button size="mini" @click="cancel()">取消</el-button>
        <el-button size="mini" type="primary" @click="save">保存</el-button>
      </div>

    </el-form></basic-container>
</template>
<script>
import {
  getCountryList,
  logisticsProperty
} from '@/api/common'

import {
  findProductCustomerList,
  saveUpdateCustomer
} from '@/api/channelInformation'
export default {
  name: 'ProductConfig',
  props: {
    row: Object,
    id: String,
    channelCode: String,
    isDetail: Boolean
  },
  data() {
    return {
      loading: false,
      countryList: [],
      countryObj: {},
      result: [],
      propertyList: [],
      propertyOpt: {
        prop: {
          multiple: true,
          value: 'id',
          label: 'propertyName'
        }
      },
      formData: {
        detailDTOS: []
      },
      rules: {}
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    getLabel(item) {
      return `${item.countryNameCn} ${item.countryName}(${item.countryNameShort})`
    },
    deleteChildren(arr) {
      arr.forEach(item => item.children?.length
        ? this.deleteChildren(item.children)
        : delete item.children)
      return arr
    },
    getData() {
      Promise.all([
        getCountryList(),
        logisticsProperty(),
        findProductCustomerList(
          { channelCode: this.channelCode }
        )
      ]).then(res => {
        this.countryList = res[0].data
        res[0].data.forEach(item => {
          this.countryObj[item.countryNameShort] = `${item.countryNameCn} ${item.countryName}(${item.countryNameShort})`
        })
        this.propertyList = this.deleteChildren(res[1].data)
        if (res[2].data.length) {
          this.formData.detailDTOS = res[2].data.map(item => {
            const result = this.initProperty(item)
            const params = {
              id: item.id,
              property: result,
              countryCode: item.countryCode
            }
            this.$set(params, 'property', result)
            return params
          })
        }
      })
    },

    addColumn() {
      const item = { countryCode: '', property: '', list: [] }
      this.formData.detailDTOS.push(item)
    },

    delColumn(i) {
      this.formData.detailDTOS.splice(i, 1)
    },

    initProperty(item) {
      const result = []
      Array.isArray(item.limits) && item.limits.forEach((item, i, arr) => {
        if (item.parentId === 0) {
          searchParentId(arr, item.logisticsPropertyId)
        }
      })

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
      return result
    },

    changeCb(val) {
      const list = []
      val && val.forEach(item => {
        item.reduce((pre, next) => {
          if (!this.hasIncludes(list, [pre, next])) list.push([pre, next])
          return next
        }, 0)
      })
      return list.map(item => ({
        parentId: item[0],
        logisticsPropertyId: item[1]
      }))
    },

    hasIncludes(list, arr) {
      return !!list.filter(item => item[0] === arr[0] && item[1] === arr[1])?.length
    },

    cancel(refreshPage) {
      this.$parent.$emit('close', refreshPage)
    },
    // 保存操作
    save() {
      this.$refs.addEdit.validate(validate => {
        if (validate) {
          console.log(this.formData.detailDTOS)
          const emptyIndex = this.formData.detailDTOS.findIndex((item, index) =>
            (!item.countryCode && !item.property.length))
          if (emptyIndex !== -1) {
            return this.$message.error(`注意：第${emptyIndex + 1}行的信息未填写！`)
          }
          const errorIndex = this.formData.detailDTOS.findIndex((item, index) =>
            (!item.countryCode && item.property.length) || (item.countryCode && !item.property.length))
          if (errorIndex !== -1) {
            return this.$message.error(`注意：第${errorIndex + 1}行的信息为必填选项，请保证数据完整！`)
          }
          const limits = this.formData.detailDTOS
            .map(item => {
              const r = this.changeCb(item.property).map(e => {
                return {
                  id: item.id || '',
                  channelCode: this.channelCode,
                  logisticsPropertyId: e.logisticsPropertyId,
                  parentId: e.parentId
                }
              })
              return {
                id: item.id || '',
                channelCode: this.channelCode,
                countryCode: item.countryCode,
                limits: r
              }
            })

          const params = {
            limits,
            channelCode: this.channelCode
          }

          this.loading = true
          saveUpdateCustomer(params).finally(() => {
            this.loading = false
          }).then(res => {
            this.$message.success(res.msg)
            this.cancel(1)
          })
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.packageConfig{
  &.basic-container{
    min-width:600px!important;
    .w-90{
      width:90%
    }
    .w-95{
      width:95%
    }
  }
}

// ::v-deep .el-cascader__tags .el-tag:first-child{
//   max-width:50%!important;
// }

::v-deep .el-cascader__search-input{
margin:0 0 0 10px;
 }

</style>
