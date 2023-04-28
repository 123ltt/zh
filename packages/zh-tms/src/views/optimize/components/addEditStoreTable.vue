<template>
  <div>
    <el-row type="flex">
      <el-col :span="14">

        <el-radio-group v-model="storeTypePre" size="mini">
          <el-radio-button v-for="item in storeTypeList" :key="item.dictKey" ref="buttonref" :label="item.dictKey" @click.native="changeButton($event,item.dictKey)">{{ item.dictValue }}</el-radio-button>
        </el-radio-group>
      </el-col>

      <el-col v-if="storeTypePre!=='1'" :span="8">
        <span>店铺编码:</span>
        <g-select
          v-model.trim="storeId"
          :items="itemListPre"
          key-field="storeCode"
          value-field="storeCode"
          :label-field="getLabel"
          style="width:60% !important"
          class="m-3"
          placeholder="请选择"
          multiple
        />
        <el-button size="mini"
                   type="primary"
                   @click="addStore()"
        >添加</el-button>

      </el-col>
    </el-row>
    <el-table v-if="storeTypePre!=='1'" v-tableScroll="dropDowm" border stripe :data="tableDataPre" class="g-table" height="300">
      <el-table-column
        type="index"
        width="50"
        label="序号"
      />
      <el-table-column label="租户ID" prop="tenantId" />
      <el-table-column label="店铺编码" prop="storeCode" />
      <el-table-column label="平台" prop="platformName" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <auto-button auto-confirm @confirm="deleteStore(row.storeCode)">删除</auto-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import autoButton from './autoButton'
import {
  getAllTenantPlatformStore, dictionary
} from '@/api/common.js'
export default {
  name: 'AddEditTable',
  components: { autoButton },
  // 下拉加载指令
  directives: {
    tableScroll: {
      bind(el, binding) {
        let dom = el.querySelector('.el-table__body-wrapper')
        el.tableScrollFn = function() {
          if (this.scrollHeight - this.scrollTop - this.clientHeight <= 0) {
            binding.value()
          }
        }
        dom.addEventListener('scroll', el.tableScrollFn)
        dom = undefined
      },
      unbind(el) {
        const tbody = el.querySelector('.el-table__body-wrapper')
        tbody.removeEventListener('scorll', el.tableScrollFn)
        el.tableScrollFn = undefined
      }
    }
  },
  props: {
    storeType: {
      type: String,
      default: ''
    },
    platformCode: {
      type: [String, Array],
      default: ''
    },
    storeVoList: {
      type: Array,
      default: () => []
    },
    platformAllList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 店铺列表
      storeTypeList: [],
      storeTypePre: '',

      storeId: [],
      // 店铺编码列表
      itemList: [],
      // 已通过平台过滤的list
      itemListPre: [],
      tableData: [],
      // 用于滚动加载数据
      tableDataPre: [],
      index: 1,
      watchIndex: 1,
      tenantPlatformList: []

    }
  },
  watch: {
    storeType: {
      handler(val) {
        this.storeTypePre = val
      },
      immediate: true
    },
    // 店铺类型初次加载后切换
    storeTypePre() {
      this.watchIndex++
      if (this.watchIndex >= 3) {
        this.storeId = []
        this.tableData = []
        this.tableDataPre = []
        this.changeTableData()
      }
    },
    platformCode: {
      handler(val) {
        if (Array.isArray(val) && this.itemList.length) {
          this.storeType === '1' && this.allStoreCb()

          // 获取下拉 数据
          this.itemListPre = []
          val.forEach(platform => {
            this.itemListPre.push(...this.itemList.filter(item => item.platformCode === platform))
          })

          // 批量删除平台下的店铺  返回存在平台的店铺
          if (this.tableData.length) {
            const res = []
            val.forEach(platform => {
              res.push(...this.tableData.filter(item => item.platformCode === platform))
            })
            this.tableData = res
            this.tableDataPre = this.tableData.slice(0, 6 * this.index)
            this.$emit('storeDTOList', this.tableData)
          }
        } else {
          this.tableData = []
          this.tableDataPre = []
          this.itemListPre = this.itemList.filter(item => {
            return item.platformCode === val
          })
        }
      },
      deep: true,
      immediate: true
    },
    // 初次加载分页
    storeVoList: {
      handler(val) {
        this.tableData = JSON.parse(JSON.stringify(val))
        if (!Array.isArray(this.platformCode)) {
          this.tableData.forEach(item => {
            item.platformName = this.itemList.find(item => item.platformCode === this.platformCode)?.platformName
          })
        }
        this.tableDataPre = this.tableData.slice(0, 6 * this.index)
      },

      immediate: true
    }

  },
  created() {
    this.getData()
  },

  methods: {
    allStoreCb() {
      const res = []
      Array.isArray(this.platformCode) && this.platformCode.forEach(platform => {
        res.push(
          this.tenantPlatformList.find(item => item.platformCode === platform) ??
          this.platformAllList.find(item => item.platformCode === platform)
        )
      })
      this.$emit('allStoreCb', res)
      this.tableData = []
    },
    changeButton(e, value) {
      if (this.tableData.length) {
        e.preventDefault()
        this.$refs.buttonref[value - 1].focus = true
        this.$confirm('此操作将会清空原数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.storeTypePre = value
          this.$emit('changeStoreType', value)
        }).catch(() => {

        })
      } else {
        this.$emit('changeStoreType', value)
      }
    },

    getData() {
      dictionary('common_store_type').then(res => {
        this.storeTypeList = res.data
      })
      // 扁平化数据
      getAllTenantPlatformStore().then(res => {
        res.data.forEach(item => {
          const obj = {}
          obj.tenantId = item.tenantId
          obj.tenantName = item.tenantName;
          (item.platformWithStoreVOList.length > 0) && item.platformWithStoreVOList.forEach(storeList => {
            obj.platformName = storeList.platformName
            obj.platformCode = storeList.platformCode
            if (storeList.stores.length > 0) {
              storeList.stores.forEach((stores, index) => {
                index === 0 && this.tenantPlatformList.push({ ...obj })
                obj.storeCode = stores.code
                this.itemList.push({ ...obj })
              })
            } else {
              // 暂且考虑到有些数据还没有店铺的但是有平台的数据
              obj.storeCode = ''
              this.tenantPlatformList.push({ ...obj })
            }
          })
          if (this.storeType === '1' && this.itemList.length) {
            this.allStoreCb()
          }
        })
      })
    },
    getLabel(item) {
      return `${item.storeCode}(${item.tenantId})`
    },
    // 添加店铺
    addStore() {
      this.storeId.length || this.$message.warning('请选择店铺编码')
      // var bools = []
      for (const i of this.itemListPre) {
        var bool

        this.storeId.forEach(elem => {
          if (i.storeCode === elem) {
            bool = this.tableData.some(itemPre => {
              return itemPre.storeCode === elem
            })
            // bools.push(bool)
            if (!bool) {
              this.tableData.unshift(i)
              this.tableDataPre.unshift(i)
            }
          }
        })
      }
      // bools.includes(true) && this.$message.warning('信息添加重复,已过滤')
      this.changeTableData()
      this.storeId = []
    },
    // 表格变动后提交的数据
    changeTableData() {
      this.storeType === '1'
        ? this.allStoreCb()
        : this.$emit('storeDTOList', this.tableData)
    },
    // 下拉加载
    dropDowm() {
      this.index++
      if (this.index * 6 <= this.tableData.length - 1) {
        this.tableDataPre = this.tableDataPre.concat(this.tableData.slice((this.index - 1) * 6, this.index * 6))
      } else {
        this.tableDataPre = this.tableDataPre.concat(this.tableData.slice((this.index - 1) * 6, this.index * 6))
        this.$message.warning('到底啦,没有更多数据可加载')
      }
    },
    // 删除
    deleteStore(storeCode) {
      this.tableData = this.tableData.filter(item => {
        return item.storeCode !== storeCode
      })
      this.tableDataPre = this.tableDataPre.filter(item => {
        return item.storeCode !== storeCode
      })
      this.changeTableData()
    }

  }
}
</script>

<style lang="scss" scoped>
.g-select{
  margin-top:0px!important
}
</style>
