<template>
  <el-form ref="ruleForm" v-loading="loading" :model="params" :rules="ruleValidate" label-width="120px" size="mini">
    <div class="bigBox">
      <el-row :gutter="10" class="inputBox">
        <el-col :span="24">
          <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'change' }" prop="supplierId" label="供应商名称">
            <g-select v-model="params.supplierId" style="width:100%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" @change="supperlierChange" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'change' }" prop="goodsId" label="商品名称">
            <el-select v-model="params.goodsId" style="width:100%" :disabled="!isAdd" filterable @change="pictureChange">
              <el-option v-for="item in goodsList" :key="item.goodsId" :value="item.id" :label="item.goodsName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="goodsCode" label="商品编码">
            <el-input v-model="params.goodsCode" style="width:100%" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :rules="{ required: true, message: '不能为空', trigger: 'blur' }" prop="reason" label="黑名单原因">
            <el-input v-model="params.reason" type="textarea" style="width:100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="imgBox">
        <el-image style="width: 60%;" :src="url?url:'https://img.zcool.cn/community/017bcb58b4db5fa801219c7719b5ff.jpg@1280w_1l_2o_100sh.jpg'" :preview-src-list="[url?url:'https://img.zcool.cn/community/017bcb58b4db5fa801219c7719b5ff.jpg@1280w_1l_2o_100sh.jpg']" />
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="saves">确 定</el-button>
      <el-button icon="el-icon-circle-close" size="mini" @click="$parent.$emit('close')">关 闭</el-button>
    </div>

  </el-form>

</template>
<script>
import { save, update, supplier, getGoods, getPicture } from '@/api/basicManagement/blacklistOfSuppliers'
import { deepClone } from '@/util/util'
export default {
  name: 'BlackEdit',
  props: {
    isAdd: Boolean,
    editData: Object
  },
  data() {
    return {
      url: '',
      getId: '',
      blackEdit: false,
      loading: false,
      params: {
        supplierId: '',
        id: '',
        goodsCode: '',
        reason: '',
        goodsId: ''
      },
      supplierList: [],
      goodsList: [],
      ruleValidate: {

      }
    }
  },
  created() {
    this.getSuppliers()
  },
  methods: {
    // 供应商改变
    supperlierChange(val) {
      if (val) {
        this.$delete(this.params, 'goodsId')
        this.$delete(this.params, 'goodsCode')
        this.url = ''
        getGoods(val.supplierId).then(res => {
          this.goodsList = res.data
        })
      } else {
        this.goodsList = []
      }
    },
    // 供应商接口获取
    getSuppliers() {
      this.loading = true
      supplier().then(res => {
        this.supplierList = res.data
        this.dealWith()
        this.loading = false
      })
    },
    // 改变图片
    pictureChange(val) {
      if (val) {
        getPicture(val).then(res => {
          this.url = res.data.mainPicture
          this.$set(this.params, 'goodsCode', res.data.goodsCode)
        })
      }
    },
    dealWith() {
      if (!this.isAdd) {
        this.editData.supplierId = this.editData.supplierId + ''
        if (this.editData.supplierId) {
          getGoods(this.editData.supplierId).then(res => {
            this.goodsList = res.data
          })
        }
        if (this.editData.goodsId) {
          getPicture(this.editData.goodsId).then(res => {
            this.url = res.data.mainPicture
          })
        } else {
          this.editData.goodsId = ''
        }
        this.getId = this.editData.id
        this.params = deepClone(this.editData)
      } else {
        this.url = ''
      }
    },
    saves() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const row = {
            reason: this.params.reason,
            goodsCode: this.params.goodsCode,
            supplierId: this.params.supplierId,
            goodsId: this.params.goodsId
          }
          if (this.isAdd) {
            this.loading = true
            save(0, row).then(res => {
              if (res.code === 200) {
                this.$parent.$emit('close', true)
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
              }
            })
          } else {
            this.loading = true
            update(this.getId, row).then(res => {
              if (res.code === 200) {
                this.$parent.$emit('close', true)
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.footer {
        margin-top: 10px;
      text-align: right;
      padding-right: 20px;
    }
.bigBox{
  width: 100%;
  display: flex;
  align-items: flex-start;
  .inputBox{
    width: 60%;
  }
  .imgBox{
    width: 40%;
    display: flex;
    justify-content: center;
    align-items:flex-start;
  }
}

</style>
