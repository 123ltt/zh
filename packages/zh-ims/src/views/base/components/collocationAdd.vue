<template>
  <!-- 虚拟仓库信息新增 -->
  <el-form ref="rulesForm" v-loading="loading" size="mini" :model="openData" label-width="120px" :rules="rules">
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">虚拟仓配置</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item prop="warehouseName" label="虚拟仓名称">
            <el-input v-model.trim="openData.warehouseName" clearable placeholder="请输入" :disabled="!isAdd" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="warehouseCode" label="虚拟仓代码" :rules="{ required: true, message: '请输入虚拟仓代码', trigger: 'blur' }">
            <el-input v-model.trim="openData.warehouseCode" placeholder="请输入" :disabled="!isAdd" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="countryCode" label="所属国家">
            <el-select v-model="openData.countryCode" clearable placeholder="请选择" filterable :disabled="!isAdd" style="width:100%" @input="changeCountryCode">
              <el-option v-for="item in countryList" :key="item.id" :label="item.showName" :value="item.countryCode" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="cardBox">
      <div slot="header">
        <span style="font-weight: 600;">对应实体仓</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-table :data="formTable" size="mini" max-height="350px" stripe style="width: 100%" border>
            <el-table-column prop="status" label="仓库名称" align="center" min-width="100">
              <template slot-scope="scope">
                <el-select v-model="scope.row.warehouseId" placeholder="请先选择国家！" filterable size="mini" @input="change(scope.row.warehouseId,scope)">
                  <el-option v-for="item in newWarehouseList" :key="item.id" :label="item.warehouseName" :value="item.id" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="warehouseCode" label="仓库代码" align="center" min-width="80">
              <template slot-scope="scope">
                <el-input v-model="scope.row.warehouseCode" disabled size="mini" />
              </template>
            </el-table-column>
            <el-table-column prop="warehouseType" label="仓库类型" align="center" min-width="80">
              <template slot-scope="scope">
                <el-input v-model="scope.row.warehouseType.desc" disabled size="mini" />
              </template>
            </el-table-column>
            <el-table-column prop="warehouseBelongDesc" label="仓库归属" align="center" min-width="80">
              <template slot-scope="scope">
                <el-input v-model="scope.row.warehouseBelongDesc" disabled size="mini" />
              </template>
            </el-table-column>
            <el-table-column prop="countryName" label="国家编码" align="center" min-width="80">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.countryName" disabled size="mini" />
              </template>
            </el-table-column>
            <el-table-column type="index" width="50" align="center">
              <template slot="header">
                <el-button icon="el-icon-plus" size="mini" type="primary" circle @click="addBtn()" />
              </template>
              <template slot-scope="scope">
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="removeBtn(scope)" />
              </template>
            </el-table-column>
          </el-table>

        </el-col>
        <el-col :span="24">
          <el-form-item style="text-align: right;padding-right: 20px;">
            <el-button size="mini" icon="el-icon-circle-close" @click="$parent.$emit('close')">取消</el-button>
            <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="define()">保存</el-button>
          </el-form-item>
        </el-col>

      </el-row>
    </el-card>

  </el-form>
</template>

<script>

import { update, save, getDetail, getCountry } from '@/api/base/collocation.js'

export default {
  name: 'CollocationAdd',
  props: {
    isAdd: Boolean,
    addData: Object,
    warehouseList: Array
  },
  data() {
    return {
      loading: false,
      openData: {},
      rules: {
        warehouseName: [{ required: true, message: '请输入虚拟仓库名称', trigger: 'blur' }],
        warehouseCode: [{ required: true, message: '请输入虚拟仓代码', trigger: 'blur' }],
        countryCode: [{ required: true, message: '请选择所属国家', trigger: 'change' }]
      },
      newWarehouseList: [],
      countryList: [],
      formTable: [],
      oldCode: '',
      tableData: {
        warehouseId: '',
        warehouseCode: '',
        warehouseType: { desc: '' },
        warehouseBelongDesc: '',
        countryName: '',
        virtualWarehouseId: '',
        countryCode: ''
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.rulesForm.clearValidate() // 先清空校验
    })
    this.dealWith()
  },
  methods: {
    getData() {
      getCountry().then(res => {
        this.countryList = res.data
      })
    },
    changeCountryCode(val) {
      if (val) {
        if (val !== this.oldCode) {
          this.formTable = []
          this.formTable.push(JSON.parse(JSON.stringify(this.tableData)))
          this.newWarehouseList = this.warehouseList.filter(item => { return item.countryCode === val })
          this.oldCode = val
        }
      } else {
        this.newWarehouseList = []
      }
    },
    change(val, obj) {
      if (val) {
        if (this.openData.countryCode) {
          const oldTable = JSON.parse(JSON.stringify(this.formTable))
          let isHas = true
          oldTable.splice(obj.$index, 1)
          oldTable.forEach(item => {
            if (item.warehouseId === val) {
              isHas = false
            }
          })
          if (!isHas) {
            this.$message.error('列表中已有该仓库，请勿重复添加！')
            this.formTable[obj.$index].warehouseId = ''
          } else {
            const checkObj = this.warehouseList.filter(item => { return item.id === val })
            Object.keys(this.formTable[obj.$index]).forEach(item => {
              if (item !== 'warehouseId') {
                this.formTable[obj.$index][item] = checkObj[0][item]
              }
            })
          }
        } else {
          this.$message.error('请先配置虚拟仓的所属国家！')
          this.formTable[obj.$index].warehouseId = ''
        }
      }
    },
    addBtn() {
      this.formTable.push(JSON.parse(JSON.stringify(this.tableData)))
    },
    removeBtn(obj) {
      this.formTable.splice(obj.$index, 1)
    },
    // 确认新增
    define() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.formTable = this.formTable.filter(item => item.warehouseId !== '')
          const obj = []
          this.formTable.forEach(item => {
            obj.push({ virtualWarehouseId: item.virtualWarehouseId, warehouseId: item.warehouseId, countryCode: item.countryCode })
          })
          if (this.isAdd) {
            this.openData.warehouseRelationDTOList = obj
            save(this.openData).finally(() => {
              this.loading = false
            }).then(() => {
              this.$parent.$emit('close', true)
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            })
          } else {
            const upObj = {
              virtualWarehouseId: this.openData.id,
              warehouseRelationDTOList: obj
            }
            update(upObj).finally(() => {
              this.loading = false
            }).then(() => {
              this.$parent.$emit('close', true)
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            })
          }
        }
      })
    },
    // 编辑处理
    dealWith() {
      this.loading = true
      if (this.isAdd) {
        this.openData = JSON.parse(JSON.stringify(this.addData))
        this.formTable.push(JSON.parse(JSON.stringify(this.tableData)))
        this.loading = false
      } else {
        getDetail(this.addData.id).then(res => {
          this.openData = res.data
          this.newWarehouseList = this.warehouseList.filter(item => { return item.countryCode === this.openData.countryCode })
          this.openData.warehouseRelationVOList.forEach(item => {
            this.formTable.push({
              warehouseId: item.warehouseId,
              warehouseCode: item.warehouseVO.warehouseCode,
              warehouseType: item.warehouseVO.warehouseType,
              warehouseBelongDesc: item.warehouseVO.warehouseBelongDesc,
              countryName: `${item.warehouseVO.countryCode} ( ${item.warehouseVO.countryName} )`,
              virtualWarehouseId: item.virtualWarehouseId,
              countryCode: item.warehouseVO.countryCode
            })
          })
          this.loading = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
::v-deep .el-card__body{
    padding-bottom: 0!important;
  }

.divider{
  display: inline-block;
  width: 10%;
  text-align: center;
  color: #c4c7cf;
}

.redStar{
  color: red;
  font-size: 12px;
}
</style>
