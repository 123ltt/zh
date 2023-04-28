<template>
  <div v-loading="loading">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">基本信息</span>
      </div>
      <el-form size="mini" label-width="100px" class="no-message">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="考核项归类">
              <el-input :value="detail.evalTypeDictValue" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考核项序号">
              <el-input :value="detail.evalNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内容序号">
              <el-input :value="detail.contentNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="评审内容">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :value="detail.evalContent" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人">
              <el-input :value="detail.createUserName" disabled />
            </el-form-item>
          </el-col>
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
          <el-col :span="12">
            <el-form-item label="最后修改时间">
              <el-input :value="detail.updateTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">评审标准</span>
      </div>
      <el-table
        :data="recordData"
        max-height="400px"
        stripe
        size="mini"
        class="g-table"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="standardItem"
          label="评审标准项"
          show-overflow-tooltip
          align="center"
          width="400"
        />
        <el-table-column
          prop="score"
          label="标准项分值"
          align="center"
          min-width="70"
        />
        <el-table-column
          prop="standardNo"
          label="标准项序号"
          align="center"
          min-width="70"
        />
      </el-table>
    </el-card>

  </div>
</template>

<script>
import { getDetail, getreviewList } from '@/api/basicManagement/factoryVisitAssessment.js'
export default {
  name: 'FactoryDetail',
  props: {
    classified: Array,
    detailData: Object // 父传子的表格参数
  },
  data() {
    return {
      detail: {},
      recordData: [],
      loading: false
    }
  },
  mounted() {
    this.getData(this.detailData)
  },
  methods: {
    getData(val) {
      this.loading = true
      getDetail(val.id).then(res => {
        const data = res.data
        this.classified.forEach(item => {
          // eslint-disable-next-line eqeqeq
          if (item.dictKey == data.evalType) {
            data.evalTypeDictValue = item.dictValue
          }
        })
        this.detail = data
        this.loading = false
      })
      const contentId = val.id
      getreviewList(contentId).then((res) => {
        const data = res.data
        this.recordData = data.records
      })
    }
  }
}
</script>

<style lang='scss' scoped>
*{
    box-sizing: border-box;
}
.openBox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  translate: all 1s;
  background: rgba($color: #000000, $alpha: 0.5);
  .addBox {
    box-sizing: border-box;
    width: 700px;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 5px;
    .header {
      box-sizing: border-box;
      padding: 0 20px;
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #cccccc;
      .title {
        font-size: 14px;
      }
    }
    .main {
      width: 100%;
      padding-top: 10px;
      .mainHeader{
          width: 100%;
          height: 30px;
          line-height: 30px;
          padding-left: 10px;
          background-color: #409eff;
          color: #fff;
      }
      .basic{
          width: 100%;
          // padding:20px ;
          overflow: hidden;
          span{
              display: inline-block;
          }
          .introduce{
              width: 120px;
              display: inline-block;
          }
      }
      .record{
          // padding: 20px;
          ::v-deep .el-table td, .el-table th{
              padding: 5px 0;
          }
      }
    }
  }
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
</style>
