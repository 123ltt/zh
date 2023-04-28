<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch" :page-size="10">
      <template slot="header">
        <el-form ref="form" :model="form" size="mini" label-width="90px" class="no-message form-col" @submit.native.prevent="search">
          <el-row :gutter="10">
            <el-col :span="5">
              <el-form-item label="SKU" prop="sku">
                <el-input v-model="form.sku" placeholder="请输入" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="更新状态" prop="feedStatus">
                <el-select v-model="form.feedStatus" clearable filterable placeholder="请选择" class="g-w100" @change="search">
                  <el-option v-for="(value, key) in feedStatusOption" :key="key" :value="key" :label="value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="系统更新结果" prop="feedSystemStatus">
                <el-select v-model="form.feedSystemStatus" clearable filterable placeholder="请选择" class="g-w100" @change="search">
                  <el-option v-for="(value, key) in feedSystemStatusOption" :key="key" :value="key" :label="value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="平台更新结果" prop="feedPlatformStatus">
                <el-select v-model="form.feedPlatformStatus" clearable filterable placeholder="请选择" class="g-w100" @change="search">
                  <el-option v-for="(value, key) in feedSystemStatusOption" :key="key" :value="key" :label="value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
              <el-button size="mini" @click="resetForm('form')">清空</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </g-table>
  </basic-container>
</template>

<script>
import { batchfeedDetailList } from '@/api/common.js'
import { getMapLog } from '@/api/lmsCommon.js'
const formObj = () => {
  return {
    feedId: null,
    feedStatus: null,
    feedPlatformStatus: null,
    feedSystemStatus: null,
    sku: null,
    descs: 'create_time'
  }
}
export default {
  name: 'LmsCommonBatchLog',
  props: {
    feedId: { // listing id
      type: String,
      default: ''
    },
    feedStatusOption: {
      type: Object
    }
  },
  data() {
    return {
      userList: [],
      userListCache: [],
      feedSystemStatusOption: { 3: '成功', 4: '失败' },
      headers: [
        {
          label: 'SKU',
          prop: 'productSku',
          width: 100
        },
        {
          label: 'SPU',
          prop: 'productSpu',
          width: 100
        },
        {
          label: '平台SKU',
          prop: 'sellerSku',
          width: 100
        },
        {
          label: 'ITEM ID(平台广告ID)',
          prop: 'itemId'
        },
        {
          label: '更新类型',
          prop: 'feedType',
          formatter: (row, column, cellValue, index) => {
            return this.updateTypesOption[Number(row.feedType) - 1]
          },
          width: 100
        },
        {
          label: '更新内容',
          prop: 'feedContent'
        },
        {
          label: '更新状态',
          prop: 'feedStatus',
          formatter: (row, column, cellValue, index) => {
            return ['未开始', '进行中', '异常', '已完成'][row.feedStatus - 1]
          },
          width: 100
        },
        {
          label: '系统更新结果',
          prop: 'feedSystemStatus',
          formatter: (row, column, cellValue, index) => {
            if (row.feedSystemStatus === 3) {
              return `状态: 失败, 消息:${row.errorMsg}`
            } else {
              return '成功'
            }
          }
        },
        {
          label: '平台更新结果',
          prop: 'feedStatus',
          formatter: (row, column, cellValue, index) => {
            if (row.feedSystemStatus === 3) {
              return ''
            }
            const status = row.feedStatus === 3 ? '失败' : row.feedStatus === 4 ? '成功' : ''
            const msg = status ? `状态: ${status}, 消息：${row.resultMsg}` : ''
            return msg
          }
        }
      ],
      form: formObj(),
      updateTypes: {},
      operationTypes: {},
      updateTypesOption: []
    }
  },
  mounted() {
    this.$refs.table.load(1, this.form)
    this.getMapLog('UPDATE_TYPE').then(res => {
      this.updateTypesOption = Object.values(res)
      this.updateTypes = res
    })
  },
  methods: {
    getMapLog(value) {
      return getMapLog({ key: value }, 'data').then(res => res.data)
    },
    fetch({ current, size }, params) {
      params.feedId = this.feedId
      return batchfeedDetailList({ current, size }, params).then(res => {
        const data = res.data
        return {
          records: data.records, // 列表数据
          total: data.total, // 总记录数
          size: data.size // 每页最大记录数
        }
      })
    },
    search() {
      if (this.form.sku) {
        const skuList = this.form.sku.split(' ')
        this.form.skuList = skuList
      }
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, this.form)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = formObj()
      this.userList = []
      this.search()
      this.$nextTick(() => {
        this.userList = this.userListCache
      })
    }
  }
}
</script>

<style lang="scss">
.log-listing-content {
  width: 450px;
  max-height: 500px;
  overflow-y:auto;
  overflow-x: hidden;
  line-height: 20px;
}
</style>
