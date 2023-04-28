<template>
  <basic-container v-loading="loading">
    <el-card class="cardBox">
      <div slot="header" style="heigt:20px;line-height:20px;">
        <span style="font-weight: 600;">基本信息</span>
        <div style="float: right">
          <el-button size="mini" type="primary" @click="$emit('close')">返回</el-button>
          <el-button size="mini" type="primary" @click="define">保存</el-button>
        </div>
      </div>
      <el-form ref="rulesForm" :model="openData" size="mini" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item prop="checkOrg" label="需求方货主" :rules="{ required: true, message: '请输入需求方货主', trigger: 'change' }">
              <el-cascader v-model="openData.checkOrg" placeholder="请选择" style="width:50%" :disabled="!isAdd" :options="orgList" clearable collapse-tags filterable @change="getproductOwner" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="rqmtUserId" label="需求人" :rules="{ required: true, message: '请输入需求人', trigger: 'change' }">
              <g-select v-model="openData.rqmtUserId" :disabled="!isAdd" style="width:50%;" :items="userList" key-field="id" label-field="name" value-field="id" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item prop="destWarehouseId" label="目的仓库" :rules="{ required: true, message: '请输入目的仓库', trigger: 'change' }">
              <g-select v-model="openData.destWarehouseId" :disabled="!isAdd" style="width:50%;" :items="warehouseList" key-field="id" label-field="warehouseName" value-field="id" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="expectArrivalTime" label="期望到货时间" :rules="{ required: true, message: '请输入期望到货时间', trigger: 'change' }">
              <el-date-picker v-model="openData.expectArrivalTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" style="width:50%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="caozuo">
      <div slot="header">
        <span style="font-weight: 600;">需求产品</span>
      </div>
      <el-form size="mini" :model="goodsData" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item prop="productSku">
              <span slot="label"><span class="redStar">* </span>产品编码</span>
              <el-input v-model.trim="goodsData.productSku" clearable placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="btnBox">
              <el-button type="primary" size="mini" @click="addProduct()">添加</el-button>
              <el-button type="primary" size="mini" @click="download()">下载模板</el-button>
              <el-button type="primary" size="mini" @click="importBtn()">批量导入</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="goodsTable" size="mini" max-height="600px" stripe style="width: 100%" border class="g-table">
        <el-table-column prop="productSku" label="产品编码" align="center" min-width="100" />
        <el-table-column prop="productImg" label="产品图片" align="center" width="75">
          <template slot-scope="scope">
            <g-thumb class="d-table-cell" :url="scope.row.productImg" />
          </template>
        </el-table-column>
        <el-table-column prop="category" label="产品类目" align="center" min-width="150" />
        <el-table-column prop="productName" label="产品名称" align="center" min-width="300" show-overflow-tooltip />
        <el-table-column prop="rqmtQty" label="需求数量" align="center" min-width="150">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.rqmtQty" v-input.numeric.positive size="mini" clearable placeholder="请输入正整数" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" min-width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="removeBtn(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 导入-dialog -->
    <el-dialog
      :visible.sync="uploadVisible"
      :append-to-body="true"
      title="上传需求商品"
      top="50px"
      width="28%"
      style="overflow:hidden;"
      @close="importClose"
    >
      <div style="height: 246px;width:100%">
        <div class="file">
          <el-button type="primary" size="mini" @click.stop="importExc">导入</el-button>
        </div>
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :on-exceed="handleExceed"
          :on-change="handleChange"
          :limit="1"
          :multiple="false"
          :http-request="httpRequest"
          :accept="acceptType"
          action="#"
          class="upload-demo"
          drag
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text"><em>点击选择文件</em></div>
          <div slot="tip" class="el-upload__tip">提示：一次只能上传一个.xls/.xlsx文件</div>
        </el-upload>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>

import { downloadTemplate, addOneRqmtProduct, save, getUpdateDetail, importTable, update } from '@/api/purchaseDemand/stock.js'
import { dowloadExc, debounce } from '@/util/util'
import { getUserListWithAuth, getOrgTree } from '@/api/commonApi.js'
export default {
  name: 'SalesRulesDetail',
  props: {
    isAdd: Boolean,
    editData: Object,
    warehouseList: Array
  },
  data() {
    return {
      loading: false,
      openData: {
        checkOrg: [],
        demanderId: '',
        rqmtUserId: '',
        destWarehouseId: '',
        expectArrivalTime: '',
        demanderPath: '',
        requirementProductDTOList: []
      },
      orgList: [],
      userList: [],
      goodsData: {
        productSku: ''
      },
      goodsTable: [],
      acceptType: "['.xls', '.xlsx']",
      uploadVisible: false // 导入
    }
  },
  mounted() {
    this.getData()
    this.dealWith()
  },
  methods: {
    findChildren(arr) {
      arr.children.forEach(ele => {
        if (!ele.hasChildren) {
          this.orgList.push({
            value: ele.id,
            label: ele.title,
            disabled: true
          })
        } else {
          const chidrenArr = []
          ele.children.forEach(e => {
            chidrenArr.push({
              value: e.id,
              label: e.title
            })
          })
          this.orgList.push({
            value: ele.id,
            label: ele.title,
            children: chidrenArr
          })
        }
      })
    },
    getData() {
      getOrgTree().then(res => {
        res.data.forEach(item => {
          if (item.category === '1') {
            if (item.hasChildren) {
              this.findChildren(item)
            }
          } else if (item.category === '2') {
            if (item.hasChildren) {
              this.findChildren(item)
            }
          }
        })
      })
    },
    addProduct() {
      if (this.goodsData.productSku) {
        let isOk = true
        this.goodsTable.forEach(item => {
          if (item.productSku === this.goodsData.productSku) {
            this.$message.error('该产品已存在！')
            isOk = false
          }
        })
        if (isOk) {
          const obj = { productSku: this.goodsData.productSku }
          addOneRqmtProduct(obj).then(res => {
            const obj = res.data[0]
            obj.rqmtQty = 0
            obj.id = ''
            this.goodsTable.unshift(obj)
            this.goodsData.productSku = ''
          })
        }
      } else {
        this.$message.error('请先输入产品编码！')
      }
    },
    removeBtn(val) {
      this.goodsTable.splice(val.$index, 1)
    },
    getproductOwner(val) {
      this.openData.rqmtUserId = ''
      this.userList = []
      getUserListWithAuth(val[val.length - 1]).then(res => {
        this.userList = res.data.records
      })
    },
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.goodsTable.length === 0) {
            this.$message.error('请添加需求产品的信息！')
          } else {
            this.openData.requirementProductDTOList = []
            let isOk = true
            this.goodsTable.forEach(item => {
              if (item.rqmtQty === 0) {
                isOk = false
              } else {
                const obj = {
                  rqmtQty: item.rqmtQty,
                  productSku: item.productSku,
                  id: item.id
                }
                this.openData.requirementProductDTOList.push(obj)
              }
            })
            if (!isOk) {
              this.$message.error('请添加需求产品的数量！')
            } else {
              this.openData.demanderId = this.openData.checkOrg[this.openData.checkOrg.length - 1]
              this.openData.demanderPath = this.openData.checkOrg.join(',')
              if (this.isAdd) {
                save(this.openData).then(() => {
                  this.$emit('close', true)
                  this.$message({
                    type: 'success',
                    message: '操作成功!'
                  })
                })
              } else {
                update(this.openData).then(() => {
                  this.$emit('close', true)
                  this.$message({
                    type: 'success',
                    message: '操作成功!'
                  })
                })
              }
            }
          }
        }
      })
    },
    dealWith() {
      if (!this.isAdd) {
        this.loading = true
        getUpdateDetail(this.editData.id).then(res => {
          const data = res.data
          this.openData.demanderId = data.demanderId
          getUserListWithAuth(this.openData.demanderId).then(res => {
            this.userList = res.data.records
          })
          this.openData.demanderPath = data.demanderPath
          this.openData.checkOrg = this.openData.demanderPath.split(',')
          this.openData.id = data.id
          this.openData.rqmtUserId = data.rqmtUserId + ''
          this.openData.destWarehouseId = data.destWarehouseId + ''
          this.openData.expectArrivalTime = data.expectArrivalTime
          data.requirementProductVOList.forEach(item => {
            item.rqmtQty = +item.rqmtQty
          })
          this.goodsTable = data.requirementProductVOList
          this.loading = false
        })
      }
    },
    // 模板下载
    download: debounce(function() {
      downloadTemplate().then(res => {
        const name = '需求商品导入通用模板.xlsx'
        if (res.size) {
          dowloadExc(res, name)
        }
      }).catch(() => {
        this.$message.error('请求异常，导出失败！')
      })
    }),
    // 导入模板
    importBtn() {
      this.uploadVisible = true
    },
    importClose() {
      this.$refs.uploadRef.clearFiles()// 清除文件
    },
    handleExceed(files, fileList) {
      this.$set(fileList[0], 'raw', files[0])
      this.$set(fileList[0], 'name', files[0].name)
      this.$refs.uploadRef.handleStart(files[0])// 选择文件后的赋值方法
      this.file = fileList[0].raw
    },
    handleChange(file, fileList) {
      fileList.length = 1
      this.file = file.raw
    },
    importExc() {
      this.$refs.uploadRef.submit()
    },
    // 上传
    httpRequest(event) {
      const loading = this.$loading({
        lock: true,
        text: '正在拼了老命的请求中。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$message.success('正在上传中，请稍等...')
      importTable({ file: this.file }).then(res => {
        if (res.code === 200) {
          const data = res.data
          data.forEach(item => {
            for (let i = 0; i < this.goodsTable.length; i++) {
              if (this.goodsTable[i].productSku === item.productSku) {
                this.goodsTable.splice(i, 1)
              }
            }
            const obj = JSON.parse(JSON.stringify(item))
            obj.id = ''
            this.goodsTable.unshift(obj)
          })
          this.$message.success('上传成功')
          this.uploadVisible = false
        }
        loading.close()
      }).catch(() => {
        loading.close()
        this.$message.error('上传失败')
      })
    },
    // 文件上传成功时的钩子
    successImg(res, file, fileList) {
      this.imgfileList = fileList
    }

  }
}
</script>

<style lang="scss" scoped>
*{
  font-size: 12px;
}
.header{
    height: 50px;
    line-height: 50px;
  }
::v-deep .el-form-item{
  margin-bottom: 10px!important;
}
.redStar{
  color: red;
  font-size: 12px;
}
.cardBox{
  ::v-deep .el-card__body{
    padding-bottom: 0;
  }
}
.hiddenWord{
    display: -webkit-box;
    overflow: hidden;
    white-space: normal !important;
    text-overflow: ellipsis;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical
}
.btnBox{
        ::v-deep .el-form-item__content{
            margin-left: 20px!important;
        }
    }
  ::v-deep .el-dialog__body{
    padding-top: 10px;
    padding-bottom: 40px;
}
.file{
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
</style>
