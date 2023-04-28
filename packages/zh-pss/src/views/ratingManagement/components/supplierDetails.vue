<template>
  <div>
    <el-card>
      <div slot="header">
        <span>基本信息</span>
      </div>
      <section class="basic">
        <el-form size="mini" label-width="100px" class="no-message">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="供应商名称">
                <el-input :value="detailData.supplierName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商得分">
                <el-input :value="detailData.score" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商等级">
                <el-input :value="detailData.level" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section>
    </el-card>
    <el-card>
      <div slot="header">
        <span>评级记录</span>
      </div>
      <section class="record">
        <el-table
          :data="recordData"
          max-height="400px"
          stripe
          style="width: 100%"
          class="g-table"
          size="mini"
          border
        >
          <el-table-column
            prop="gradeFrom"
            label="评级来源"
            align="center"
            min-width="130"
          />
          <el-table-column
            prop="score"
            label="评级积分"
            align="center"
            min-width="120"
          />
          <el-table-column
            prop="updateTime"
            label="评级时间"
            align="center"
            min-width="200"
          />
          <el-table-column
            prop="level"
            label="供应商等级"
            align="center"
            min-width="100"
          />
        </el-table>
      </section>
      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          :current-page="page.current"
          :page-sizes="[10, 40, 50, 80]"
          :page-size="page.size"
          :total="page.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { getDetail } from '@/api/ratingManagement/supplierRating.js'
export default {
  name: 'SupplierDetails',
  props: {
    detailData: Object // 父传子的表格参数
  },
  data() {
    return {
      recordData: [],
      detailType: '',
      //   分页参数,
      page: {
        current: 1,
        total: 1,
        size: 10
      },
      loading: false
    }
  },
  mounted() {
    this.getData(this.detailData.supplierId)
  },
  methods: {
    getData(val) {
      this.loading = true
      const obj = { supplierId: val }
      getDetail(this.page.current, this.page.size, obj).then(res => {
        if (res.code === 200) {
          const data = res.data
          this.recordData = data.records
          this.loading = false
        } else {
          this.loading = false
          this.$message.error('加载失败!')
        }
      })
    },
    // 点击分页
    handleSizeChange(val) {
      this.page.size = val
      this.page.current = 1
      this.initialization(this.page.current, this.page.size, this.searchData)
    },
    // 点击页码跳转
    handleCurrentChange(val) {
      this.page.current = val
      this.initialization(this.page.current, this.page.size, this.searchData)
    }
  }
}
</script>

<style lang='scss' scoped>
*{
    box-sizing: border-box;
}

.block {
        text-align: right;
        margin-top: 20px;
        }
</style>
