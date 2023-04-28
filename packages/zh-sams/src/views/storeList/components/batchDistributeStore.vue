<template>
  <div class="basic-container-box">
    <el-form ref="formObjRef" v-loading="loading" :model="formObj" size="mini">
      <el-row>
        <el-col :span="24">
          <span class="el-form-item__label">分配销售</span>
          <el-select ref="searchSeller" v-model="formObj.sellerIdList" filterable multiple default-first-option clearable placeholder="请选择" size="mini" style="margin-left:0;width:400px" @focus="handlerSellerId">
            <el-option v-for="(item,index) in waitAssignedSellerListOption" :key="index" :label="item.name" :value="item.seller" />
          </el-select>
        </el-col>
        <el-col :span="24">
          <span class="el-form-item__label">店铺名</span>
          <div class="el-form-item__content">已分配销售人员</div>
        </el-col>
        <template v-if="formObj.assignedSellerList&&formObj.assignedSellerList.length">
          <el-col v-for="(item,index) in formObj.assignedSellerList" :key="index" v-loading="loading" :span="24">
            <div class="el-form-item">
              <span class="el-form-item__label">{{ item.storeName }}</span>
              <div class="btn-box">
                <el-button v-for="(sitem,sindex) in item.sellerList" :key="sindex" class="mb10" size="mini" :disabled="!sitem.isPermitted">{{ sitem.name }}<i v-if="sitem.isPermitted" class="el-icon-circle-close fz20" @click="delAssignedSeller(item,sitem,sindex)" /></el-button>
              </div>
            </div>
          </el-col>
        </template>
      </el-row>
      <div class="footer" style="text-align: right">
        <el-button size="medium" @click="doclose">取消</el-button>
        <el-button size="medium" type="primary" @click="saveBatchAssign">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { saveBatchAssign, batchGetAssignSellerList } from '@/api/storeList'
export default {
  name: 'BatchDistributeStore',
  props: {
    item: {
      type: Object
    },
    sellerType: {
      type: Number
    },
    checkedIds: {
      type: Array,
      request: true
    }
  },
  data() {
    return {
      loading: false,
      formObj: {
        waitAssignedSellerList: [],
        assignedSellerList: [],
        customerServiceName: '',
        sellerIdList: []
      },
      waitAssignedSellerListOption: []
    }
  },
  created() {
    this.batchGetAssignSellerList()
  },
  methods: {
    handlerBlurSeller(val) {

    },
    handlerSellerId(val) {
      this.formObj.assignedSellerList.forEach(item => {
        if (item.sellerList == null) {
          item.sellerList = []
        }
      })
      this.$refs.searchSeller.$refs.input.blur = () => {
        const currentList = this.handlerSearchComp()
        this.formObj.assignedSellerList.forEach(item => {
          currentList.forEach(citem => { // 当前选中的list
            citem.companyIdList.forEach(aitem => { // 组织list
              if (aitem === item.organizationId) { // 组织id
                if (item.sellerList.length === 0) {
                  citem.isPermitted = citem.isPermitted == null ? true : citem.isPermitted
                  item.sellerList.push(citem)
                } else {
                  let isBoolean = true
                  item.sellerList.forEach(list => { // 已分配的list的销售
                    if (list.seller === citem.seller) {
                      isBoolean = false
                    }
                  })
                  if (isBoolean) {
                    citem.isPermitted = citem.isPermitted == null ? true : citem.isPermitted
                    item.sellerList.push(citem)
                  }
                }
              } else {
                let shopsName = []
                shopsName.push(item.storeName)
                shopsName = shopsName.join(',')
                let sale = []
                sale.push(citem.name)
                sale = sale.join(',')
                this.$confirm(`店铺${shopsName}和销售${sale}，的所属组织不一致不允许分配?`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  closeOnClickModal: false
                })
              }
            })
          })
        })
        this.formObj.sellerIdList = []
      }
    },
    handlerSearchComp(val) {
      const arrList = []
      this.formObj.sellerIdList.forEach(acc => { // 当前选中 ['']
        this.waitAssignedSellerListOption.forEach(item => { // 未分配的列表 [{}]
          if (acc === item.seller) { // 拿到当前选择的详细信息
            arrList.push(item)
          }
        })
      })
      return arrList
    },
    // 删除
    delAssignedSeller(list, item, index) {
      this.formObj.assignedSellerList.forEach(acc => {
        if (list.storeId === acc.storeId) {
          acc.sellerList.forEach(att => {
            if (att.seller === item.seller) {
              acc.sellerList.splice(index, 1)
            }
          })
        }
      })
    },
    // 获取数据
    batchGetAssignSellerList() {
      this.loading = true
      batchGetAssignSellerList(this.checkedIds).then(res => {
        this.loading = false
        const data = res.data
        this.waitAssignedSellerListOption = data.waitAssignedSellerList // 待分配的销售列表
        this.formObj.assignedSellerList = data.assignedSellerList // 已分配的销售列表
      }).finally(() => {
        this.loading = false
      })
    },
    // 保存
    saveBatchAssign() {
      this.loading = true
      const arr = []
      this.formObj.assignedSellerList.forEach(acc => {
        const obj = {}
        obj.storeId = acc.storeId
        obj.sellerIdList = []
        acc.sellerList.forEach(att => {
          obj.sellerIdList.push(att.seller)
        })
        arr.push(obj)
      })
      saveBatchAssign(arr).then(res => {
        this.loading = false
        this.$message.success(res.msg)
        this.doclose()
      }).finally(() => {
        this.loading = false
      })
    },
    doclose() {
      this.$parent.$emit('close', true)
    }
  }

}
</script>

<style scoped>
.ml12{
  margin-left: 12px;
  min-height:36px;
}
.mb10{
  margin-bottom: 6px;
}
.form-label{
  width:88px;
  text-align:right;
  display:block
}
.el-button{
  margin-right: 10px;
}
.el-button+.el-button{
  margin-left: 0;
  margin-right: 10px !important;
}
.fz20{
  font-size: 12px;
  margin-left: 4px;
}
.el-form-item{
  display: flex;
  margin-bottom: 0;
}
.el-form-item__label{
  min-width: 10em;
  max-width: 15em;
  font-size: 14px;
  line-height: 30px;
  text-align: left;
}
.el-form-item__content{
  line-height: 30px;
}
.btn-box{
  display: inline-block;
  margin:0 6px 4px 0;
}
</style>
