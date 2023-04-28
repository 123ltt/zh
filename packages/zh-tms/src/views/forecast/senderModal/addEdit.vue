<template>
  <basic-container>
    <h3>发件人基本信息  ( {{ type==='add'?'新增':'编辑' }} )</h3>
    <el-form ref="table" label-width="150px" size="mini" :rules="rules" :model="formData">
      <el-row :gutter="30">
        <el-col :span="10">
          <el-form-item label="发件人名称：" prop="name">
            <el-input v-model="formData.name" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="仓库：" prop="warehouseCodeList">
            <el-cascader v-model="formData.warehouseCodeList" :options="warehouseList" :props="options" collapse-tags style="width:100%" clearable @change="getChangeData" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发件公司名称：" prop="companyName">
            <el-input v-model="formData.companyName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发件人电话：" prop="tel">
            <el-input v-model="formData.tel" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发件人手机：" prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发件人国家名称：" prop="countryName">
            <el-select v-model="formData.countryName" filterable clearable style="width:100%">
              <el-option v-for="item in countryList" :key="item.countryName" :value="item.countryName" :label="item.countryNameCn+' '+item.countryName+' '+'('+item.countryNameShort+')'" />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="10">
          <el-form-item label="发件人国家简称：" prop="countryCode">
            <el-input v-model="formData.countryCode" placeholder="请输入" />
          </el-form-item>
        </el-col> -->
        <el-col :span="10">
          <el-form-item label="发件人省/州：" prop="province">
            <el-input v-model="formData.province" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发件人城市：" prop="city">
            <el-input v-model="formData.city" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发件人区/县：" prop="county">
            <el-input v-model="formData.county" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发件人街道(门牌号)：" prop="street">
            <el-input v-model="formData.street" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发件人详细地址：" prop="address">
            <el-input v-model="formData.address" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发件人详细地址1：" prop="address1">
            <el-input v-model="formData.address1" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发件人邮箱：" prop="email">
            <el-input v-model="formData.email" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发件人城市邮编：" prop="postCode">
            <el-input v-model="formData.postCode" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发件人证件号：" prop="idCard">
            <el-input v-model="formData.idCard" placeholder="请输入" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发件人税号：" prop="taxId">
            <el-input v-model="formData.taxId" placeholder="请输入" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入" type="textarea" :rows="2" show-word-limit maxlength="200" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="20">
          <div style="text-align:right;margin-bottom:10px">
            <el-button type="primary" size="mini" @click="close(false)">取消</el-button>
            <el-button type="primary" size="mini" @click="save">保存</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </basic-container>
</template>
<script>
import { addConfiguration, updateConfiguration } from '@/api/forecast/senderInfomation'
import { getCountryList, getWarehouseTypeTree } from '@/api/common'
import { deepClone } from '@/util/util'
export default {
  props: {
    type: String,
    rows: Object
  },
  data() {
    return {
      warehouseList: [],
      countryList: [],
      options: {
        value: 'code',
        label: 'desc',
        multiple: true,
        children: 'warehouseChildVOList'
      },
      formData: {
      },
      rules: {
        cfgName: [
          { required: true, message: '方案名称不能为空', trigger: ['blur'] }
        ],
        warehouseCodeList: [
          { required: true, message: '仓库不能为空', trigger: ['blur'] }
        ],
        name: [
          { required: true, message: '发件人名称不能为空', trigger: ['blur'] }
        ],
        countryName: [
          { required: true, message: '发件人国家名称不能为空', trigger: ['blur'] }
        ],
        countryCode: [
          { required: true, message: '发件人国家简称不能为空', trigger: ['blur'] }
        ],
        province: [
          { required: true, message: '发件人省/州不能为空', trigger: ['blur'] }
        ],
        city: [
          { required: true, message: '发件人城市不能为空', trigger: ['blur'] }
        ],
        address: [
          { required: true, message: '发件人详细地址不能为空', trigger: ['blur'] }
        ]
      }
    }
  },
  mounted() {
    this.getCountry()
    if (this.type === 'edit') this.getEditData()
    else this.getWarehouse()
  },
  methods: {
    getChangeData(val) {
      if (val && val.length) {
        let res = val.map(item => {
          item = item[item.length - 1]
          return item
        })
        res = res.join('_')
        this.$set(this.formData, 'warehouseCode', res)
      }
    },
    getCountry() {
      getCountryList().then(res => {
        this.countryList = res.data
      })
    },
    getWarehouse() {
      Promise.all([getWarehouseTypeTree()]).then(([a]) => {
        this.warehouseList = this.deleteChildren(a.data)
      })
    },
    getEditData() {
      getWarehouseTypeTree().then(res => {
        this.warehouseList = this.deleteChildren(res.data)
        const ids = this.rows.warehouseCode.split('_')
        const fullPath = this.getFullPath(ids, this.warehouseList)
        this.formData = deepClone(this.rows)
        this.$set(this.formData, 'warehouseCodeList', fullPath.fullIdPath)
      })
    },
    getFullPath(ids = [], options = []) {
      const fieldValue = 'code'
      const fieldName = 'desc'
      const fieldChildren = 'warehouseChildVOList'
      const fullIdPath = []
      const fullNamePath = []

      // 递归查找所有上级的节点
      function walkParent(arr = [], id, idPath = [], namePath = []) {
        return arr.some(item => {
          const itemId = item[fieldValue]
          const itemName = item[fieldName]

          if (itemId === id) {
            walkChilren(item[fieldChildren], idPath.concat(itemId), namePath.concat(itemName))
            return true
          } else if (Array.isArray(item[fieldChildren])) {
            return walkParent(item[fieldChildren], id, idPath.concat(itemId), namePath.concat(itemName))
          }
        })
      }
      // 递归查找所有的子孙节点
      function walkChilren(arr = [], idPath = [], namePath = []) {
        if (!arr || (Array.isArray(arr) && arr.length === 0)) {
          fullIdPath.push(idPath)
          fullNamePath.push(namePath)
        } else {
          arr.forEach(item => {
            const tempIdPath = idPath.concat(item[fieldValue])
            const tempNamePath = namePath.concat(item[fieldName])
            if (Array.isArray(item[fieldChildren])) {
              walkChilren(item[fieldChildren], tempIdPath, tempNamePath)
            } else {
              fullIdPath.push(tempIdPath)
              fullNamePath.push(tempNamePath)
            }
          })
        }
      }

      ids.forEach(id => {
        walkParent(options, id, [], [])
      })

      return { fullIdPath, fullNamePath }
    },
    // 删除arr列表中索引的children为空
    deleteChildren(arr) {
      const childs = arr
      for (let i = 0; i < arr.length; i++) {
        if (childs[i].warehouseChildVOList && childs[i].warehouseChildVOList.length) {
          this.deleteChildren(childs[i].warehouseChildVOList)
        } else {
          delete childs[i].warehouseChildVOList
        }
      }
      return arr
    },
    save() {
      this.$refs.table.validate(valid => {
        if (valid) {
          const shortName = this.countryList.find(item => item.countryName === this.formData.countryName).countryNameShort
          this.$set(this.formData, 'countryCode', shortName)
          if (this.type === 'add') {
            addConfiguration(this.formData).then(res => {
              this.$message.success(res.msg)
              this.close()
            })
          } else {
            updateConfiguration(this.formData).then(res => {
              this.$message.success(res.msg)
              this.close()
            })
          }
        }
      })
    },
    close(flag = true) {
      this.$emit('close', flag)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-col{
  margin-bottom:0px ;
}
</style>
