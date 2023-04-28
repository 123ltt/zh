<template>
  <el-form ref="rangeRef"
           v-loading="loading "
           size="mini"
           :model="rangeInfo"
           :rules="rules"
           label-width="150px"
           class=" pe-4"
  >
    <el-row :gutter="10">
      <el-col :span="1" />
      <el-col :span="8">
        <el-form-item prop="startShipment" label="启运地：" label-width="150px">
          <commonCascader v-model="rangeInfo.startShipment"
                          width="100%"
                          :list="warehouseList"
                          :options="warehouseOpt"
                          name="startShipment"
                          @init="newVal =>{startShipmentMiddleList = newVal}"
          />
        </el-form-item>
      </el-col>
      <el-col :span="1" />
      <el-col :span="8">
        <el-form-item
          class="country"
          label="目的国："
          prop="countryDTOList"
        >
          <g-select v-model="rangeInfo.countryDTOList"
                    style="width:100%"
                    :items="countryList"
                    key-field="countryNameShort"
                    :label-field="getLabel"
                    value-field="countryNameShort"
                    multiple
                    is-checked-all
                    placeholder="请选择"
                    :item-title="true"
          />
          <el-popover
            v-model="visible"
            placement="bottom"
            width="400"
            title="请复制你要输入的内容"
          >
            <el-card class="box-card">
              <el-input
                v-model="value"
                type="textarea"
                :rows="2"
                placeholder="请输入你要复制的内容，用英文分号分隔开，注意会自动勾选"
              />
              <div style="text-align: right; margin: 0" class="mt-2">
                <el-button size="mini" type="text" @click="cancel">取消</el-button>
                <el-button type="primary" size="mini" @click="copySuccessCountry">确定</el-button>
              </div>
            </el-card>
            <i slot="reference" class="el-icon-edit myicon" />
          </el-popover>
        </el-form-item>
      </el-col>
      <el-col v-if="!isDetail" :span="2">
        <el-button size="mini" type="primary" @click="define()">确认</el-button>
      </el-col>

    </el-row>
    <el-row>
      <div class="float-end me-1" />
    </el-row>
  </el-form>
</template>
<script>
import commonCascader from '../../components/classSelected'
import { getCountryList, getWarehouseTypeTree } from '@/api/common'
import {
  getServiceScope,
  saveServiceScope
} from '@/api/channelInformation'
export default {
  name: 'ServiceRangeInfo',
  components: { commonCascader },
  inject: ['isDetail'],
  props: {
    params: Object,
    detailInfo: Object
  },

  data() {
    return {
      loading: false,
      visible: false,
      value: '',
      warehouseList: [],
      countryList: [],
      startShipmentMiddleList: [],
      rangeInfo: {
        startShipment: [],
        countryDTOList: []
      },
      warehouseOpt: {
        childLabel: 'warehouseChildVOList',
        prop: {
          multiple: true,
          value: 'code',
          label: 'desc',
          children: 'warehouseChildVOList'
        },
        searchParentId: 'startShipmentId'
      },
      rules: {
        startShipment: [{ required: true, message: '请选择启运地', trigger: 'change' }],
        countryDTOList: [{ required: true, message: '请选择目的国', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {

  },
  methods: {
    getLabel(item) {
      return `${item.countryNameCn} ${item.countryName}(${item.countryNameShort})`
    },
    // 获取数据
    getData() {
      Promise.all([
        getWarehouseTypeTree(),
        getCountryList()

      ]).then(res => {
        this.warehouseList = res[0].data
        this.countryList = res[1].data

        this.detailInfo.channelCode && getServiceScope(
          { channelCode: this.detailInfo.channelCode }
        ).then(res => {
          const data = res.data
          data && Object.assign(this.rangeInfo, {
            countryDTOList: data.channelLimitCountryVOList.map(item => item.countryCode),
            startShipment: data.channelLimitStartShipmentVOList
          })
        })
      }).catch(() => {})
    },

    // 国家复制粘贴功能
    copySuccessCountry() {
      const val = this.value
      const label = 'countryDTOList'
      const labelList = ['countryName', 'countryNameCn']
      const allList = this.countryList
      if (this.copyToAdd(val, label, allList, labelList)) {
        this.cancel()
      }
    },

    copyToAdd(val, label, allList, labelList) {
      const allCopyArray = []
      const errorList = []
      if (val) {
        const splitArray = val.split(';').filter(item => item)
        splitArray.forEach((item, index) => {
          const data = allList.filter(element => {
            for (let i = 0; i < labelList.length; i++) {
              if (item === element[labelList[i]]) return true
            }
          })
          if (!data.length) {
            errorList.push({
              value: item,
              index: index + 1
            })
            return false
          }
          allCopyArray.push(...data)
        })
        if (errorList.length) {
          let errorMessage = ''
          errorList.forEach(item => {
            errorMessage += `索引为${item.index}的${item.value}无法匹配;  `
          })
          this.$message.error(`${errorMessage}，自动添加失败`)
          return false
        }

        const allCopyId = allCopyArray.map(item => item.id)
        const array = [...allCopyId, ...this.rangeInfo[label]]
        this.rangeInfo[label] = array
        this.$message.success('操作成功')
        return true
      }
    },

    cancel() {
      this.visible = false
      this.value = ''
    },

    changeShipmentCb() {
      const val = Object.assign([], this.startShipmentMiddleList)
      return val && val.map(item =>
        ({
          startShipmentCode: item.slice(item.length - 1)[0]
        }))
    },

    getCountryDTOList() {
      return this.rangeInfo.countryDTOList.map(item =>
        ({
          countryCode: item
        })
      )
    },

    define() {
      this.$refs.rangeRef.validate((valid) => {
        if (valid) {
          const params = Object.assign({}, {
            channelCode: this.detailInfo.channelCode,
            channelLimitCountryDTOList: this.getCountryDTOList(),
            startShipmentDTOList: this.changeShipmentCb()
          })
          this.loading = true
          saveServiceScope(params).finally(() => {
            this.loading = false
          }).then(() => {
            this.$message.success('操作成功!')
          })
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item .el-form-item__label{
  width:76px !important;
}
::v-deep .el-form-item__content{
  margin-left:76px!important;
}

::v-deep .country .el-input--suffix .el-input__inner {
    padding-left: 30px!important;
}
.myicon{
    height: 100%;
    width: 30px;
    color: #C0C4CC;
    position: absolute;
    left:0px;
    font-size:14px;
    top:10px;
    text-align: center;
    -webkit-transition: all .3s;
    transition: all .3s;
}
::v-deep .country .el-select__tags{
  margin-left:20px!important;
}

::v-deep .el-cascader__search-input{
  margin:0;
  min-width:0px;
  width:0px;
  flex:0;
}
::v-deep .el-cascader__tags .el-tag{
  margin-left:3px;
  max-width: 70%;
}

</style>
