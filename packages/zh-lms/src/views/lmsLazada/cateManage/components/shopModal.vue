<template>
  <div>
    <!-- table模板 -->
    <div v-if="bool">
      <el-table
        size="mini"
        border
        stripe
        class="g-table g-table-dense"
        highlight-current-row
        :data="tableData"
      >
        <el-table-column label="修改内容" prop="content">
          <template v-slot="{row}">
            <g-text-ellipsis :max-length="20">{{ row.content }}</g-text-ellipsis>
          </template>
        </el-table-column>
        <el-table-column label="修改人" prop="optUser" />
        <el-table-column label="修改时间" prop="createTime" />
      </el-table>
      <el-pagination
        :current-page="page.current"
        :page-size="page.size"
        :total="page.total"
        style="text-align: right; padding-top: 18px"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增编辑模板 -->
    <el-form v-if="!bool" ref="table" label-width="150px" size="mini" :rules="rules" :model="form">
      <el-row :gutter="10">
        <el-col :span="20">
          <el-form-item v-if="type==='add'?true:false" label="店铺" prop="storeName">
            <el-select v-model="form.storeName" filterable style="width:100%">
              <el-option v-for="item in shopList" :key="item.candidateDisplayName" :value="item.displayName" :label="item.displayName" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="type==='add'?false:true" label="店铺" prop="storeName">
            <el-input v-model="form.storeName" placeholder="请输入" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="MY站点一级类目" prop="limitCategoryName">
            <el-select v-model="form.limitCategoryName" multiple style="width:100%" filterable clearable @change="getChangeData">
              <el-option v-for="item in cateList" :key="item.id" :value="item.name" :label="item.name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="已选择类目" prop="remark">
            <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <div style="text-align:right">
            <el-button size="mini" @click="cancel">取消</el-button>
            <el-button type="primary" size="mini" @click="save">保存</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getCategortLimitLog, limitSave, limitUpdate, getLevelCategory } from '@/api/lazada/cateComparison'
import { storeOptionsWithPlatformCode } from '@/api/sams'
import { deepClone } from '@/util/util'
export default {
  props: {
    type: String,
    rows: Object,
    bool: Boolean
  },
  data() {
    return {
      form: {
      },
      tableData: [],
      shopList: [],
      cateList: [
      ],
      rules: {
        storeName: [{ required: true, message: '店铺名为必填', trigger: 'change' }],
        limitCategoryName: [{ required: true, message: '类目名为必填', trigger: 'change' }]
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      }
    }
  },
  mounted() {
    if (!this.bool) {
      this.getResolve()
      this.getData()
    } else {
      this.onLoad()
    }
    if (this.type) {
      storeOptionsWithPlatformCode({ platformCode: 'LZ' }).then(res => {
        this.shopList = res.data
      })
    }
  },
  methods: {
    getResolve() {
      getLevelCategory('MY').then(res => {
        this.cateList = res.data
      })
    },
    getData() {
      if (this.type === 'edit') {
        this.form = deepClone(this.rows)
        this.$set(this.form, 'limitCategoryName', this.form.limitCategory.split(';'))
        this.getChangeData(this.rows.limitCategory.split(';'))
      } else {
        this.form = {}
      }
    },
    getChangeData(val) {
      this.form.remark = val.join(';')
    },
    // 获取日志列表
    onLoad() {
      this.loading = true
      getCategortLimitLog(this.page.current, this.page.size, this.rows.id)
        .then((data) => {
          // this.logList = []
          if (data.success && data.data) {
            const { records, total } = data.data
            this.tableData = records || []
            this.page.total = total
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 分页相关
    handleSizeChange(val) {
      this.page.size = val
      this.onLoad()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.onLoad()
    },
    cancel() {
      this.$parent.$emit('close')
    },
    // 新增编辑-所需字段
    save() {
      if (!this.form.limitCategoryName?.length) return this.$message.error('请填写必填项')
      const limitCategoryId = this.form.limitCategoryName.map(item => {
        return this.cateList.find(its => its.name === item)?.categoryId
      }).join(';')
      this.$set(this.form, 'limitCategoryId', limitCategoryId)
      this.$set(this.form, 'storeCode', this.shopList.find(item => this.form.storeName === item.displayName)?.candidateDisplayName)
      this.$set(this.form, 'limitCategory', this.form.limitCategoryName.join(';'))
      this.$refs.table.validate(valid => {
        if (valid) {
          if (this.type === 'add') {
            limitSave(this.form).then(res => {
              this.$message.success('新增成功')
              this.$parent.$emit('close', true)
            })
          } else {
            limitUpdate(this.form).then(res => {
              this.$message.success('修改成功')
              this.$parent.$emit('close', true)
            })
          }
        } else {
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item--mini.el-form-item{
  margin-bottom:10px;
}
</style>
