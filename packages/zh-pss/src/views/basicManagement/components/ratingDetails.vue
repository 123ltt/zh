<template>
  <div v-loading="loading">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form size="mini" label-width="100px" class="no-message">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="等级名称">
              <el-input :value="detail.name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="起始分值">
              <el-input :value="detail.beginScore" disabled>
                <template slot="prepend">大于</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="截止分值">
              <el-input :value="detail.endScore" disabled>
                <template slot="prepend">小于或等于</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人">
              <el-input :value="detail.createUserName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-input :value="detail.createTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后修改人">
              <el-input :value="detail.updateUserName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="最后修改时间">
              <el-input :value="detail.updateTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
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
          align="center"
          show-overflow-tooltip
          min-width="300"
        />
      </el-table>
    </el-card>

  </div>
</template>

<script>
import { getDetail } from '@/api/basicManagement/ratingRules.js'
export default {
  name: 'RatingDetails',
  props: {
    detailData: Object// 父传子的表格参数
  },
  data() {
    return {
      detail: {},
      recordData: [],
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
        const data = res.data
        this.detail = data
        this.recordData = data.history
        this.loading = false
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
