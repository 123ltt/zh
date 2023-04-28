<template>
  <div v-loading="loading">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form size="mini" label-width="120px" class="no-message">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="规则名称">
              <el-input :value="detail.nameDictValue" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则类型">
              <el-input :value="detailType" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则分值">
              <el-input :value="detail.score" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则说明">
              <el-input :value="detail.description" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">操作记录</span>
      </div>
      <el-table
        :data="recordData"
        max-height="400px"
        stripe
        class="g-table"
        size="mini"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="updateUserName"
          label="操作人"
          align="center"
          min-width="100"
        />
        <el-table-column
          prop="updateTime"
          label="操作时间"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="opRecord"
          label="操作记录"
          show-overflow-tooltip
          align="center"
          min-width="300"
        />
      </el-table>
    </el-card>

  </div>
</template>

<script>
import { getDetail } from '@/api/basicManagement/assessmentRules.js'
export default {
  name: 'AssessDetails',
  props: {
    rulesType: Array,
    detailData: Object // 父传子的表格参数
  },
  data() {
    return {
      detail: {},
      recordData: [],
      detailType: '',
      loading: false
    }
  },
  mounted() {
    this.getData(this.detailData.id)
  },
  methods: {
    getData(val) {
      this.loading = true
      getDetail(val).then(res => {
        if (res.code === 200) {
          const data = res.data
          this.detail = data
          this.rulesType.forEach(item => {
            // eslint-disable-next-line eqeqeq
            if (this.detail.type == item.dictKey) {
              this.detailType = item.dictValue
            }
          })
          this.recordData = data.history
          this.loading = false
        } else {
          this.loading = false
          this.$message.error('加载失败!')
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
*{
    box-sizing: border-box;
}
.closeBtn {
  cursor: pointer;
  &:hover{
    color: #409eff;
  }
  i {
    size: 16px;
  }
}
.cardBox{
  ::v-deep .el-card__body{
    padding-bottom: 0;
  }
}
</style>
