<template>
  <!-- 冻结详情 -->
  <div v-loading="loading" style="width:100%;height:100%">
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <template slot="header">
        <el-form label-width="80px" size="mini" class="no-message">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="businessType" label="业务类型">
                <el-select v-model="submit.businessType" clearable placeholder="请选择" filterable>
                  <el-option v-for="item in businessTypeList" :key="item.code" :label="item.desc" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="businessCode" label="业务单号">
                <el-input v-model.trim="submit.businessCode" clearable placeholder="请填写" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="btnBox">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="initialization">查询</el-button>
                <el-button icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </g-table>

  </div>
</template>

<script>
import { getFreezeDetail, getType } from '@/api/stock/view.js'
import { deepClone } from '@/util/util'

export default {
  name: 'FreezeDetails',
  props: {
    id: String
  },
  data() {
    return {
      loading: false,
      submit: {
        stockId: this.id,
        businessType: '',
        businessCode: ''
      },
      businessTypeList: [],
      submitData: {},
      // 表格数据
      headers: [
        {
          label: '业务类型',
          prop: 'businessType.desc',
          showOverflowTooltip: true,
          minWidth: '150px',
          align: 'center'
        },
        {
          label: '业务单号',
          prop: 'businessCode',
          showOverflowTooltip: true,
          minWidth: '200px',
          align: 'center'
        },
        {
          label: '冻结数量',
          prop: 'freezeQty',
          showOverflowTooltip: true,
          minWidth: '150px',
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.getDetail()
    this.initialization()
  },
  methods: {
    getDetail() {
      this.loading = true
      getType('FREEZE').then(res => {
        this.businessTypeList = res.data
        this.loading = false
      })
    },
    // 初始化数据
    fetch({ current, size }, params) {
      return getFreezeDetail(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    initialization() {
      this.submitData = deepClone(this.submit)
      this.$refs.table.load(1, this.submitData)
    },
    reset() {
      this.submit.businessType = ''
      this.submit.businessCode = ''
      this.initialization()
    }
  }
}
</script>
<style lang="scss" scoped>
.btnBox{
  ::v-deep .el-form-item__content{
    margin-left: 10px!important;
  }
}
</style>
