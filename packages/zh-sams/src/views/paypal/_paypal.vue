<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <template slot="header">
        <el-form ref="formRef" :model="formObj" size="mini" class="no-message" @submit.native.prevent="search">
          <el-row>
            <el-col :span="5">
              <el-form-item label="paypal账号" prop="paypalAddress" label-width="70">
                <el-input v-model="formObj.paypalAddress" placeholder="paypal账号" style="width:160px" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="账户类型" prop="type" label-width="60">
                <el-select v-model="formObj.type" clearable filterable placeholder="请选择" style="width:120px" @change="search">
                  <el-option
                    v-for="(item,index) in typeOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="状态" prop="paypalStatus" label-width="40">
                <el-select v-model="formObj.paypalStatus" clearable filterable placeholder="请选择" style="width:110px" @change="search">
                  <el-option
                    v-for="(item,index) in paypalStatusOption"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9" label-width="60">
              <el-form-item label="添加时间" prop="startAddTime">
                <el-row>
                  <el-date-picker v-model="formObj.startAddTime"
                                  type="datetime"
                                  size="mini"
                                  placeholder="开始时间"
                                  default-time="00:00:00"
                                  style="width:172px;margin-right:10px"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  :picker-options="pickerOptionsStart"
                  />-
                  <el-date-picker v-model="formObj.endAddTime"
                                  type="datetime"
                                  size="mini"
                                  placeholder="结束时间"
                                  default-time="23:59:59"
                                  style="width:172px;margin-left:10px"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  :picker-options="pickerOptionsEnd"
                  />
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" size="mini" native-type="submit">搜 索</el-button>
              <el-button size="mini" @click="handlerReact('formRef')">清 空</el-button>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="proportion" label="paypal费率">
        <template slot-scope="{row}">
          <span v-for="(item,index) in row.rate" :key="index" class="d-inline-block me-2">
            {{ item.currency }}:{{ item.proportion }}
          </span>
        </template>
      </el-table-column>
      <el-table-column slot="fixedAmount" label="paypal固定费">
        <template slot-scope="{row}">
          <span v-for="(item,index) in row.rate" :key="index" class="d-inline-block me-3">
            {{ item.currency }}:{{ item.fixedAmount }}
          </span>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { paypalList } from '@/api/paypal'
export default {
  name: 'Paypal',
  data() {
    return {
      pickerOptionsStart: {
        disabledDate: time => {
          if (this.formObj.endAddTime) {
            return (
              time.getTime() > new Date(this.formObj.endAddTime).getTime()
            )
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          if (this.formObj.startAddTime) {
            return (
              time.getTime() > Date.now() ||
                time.getTime() < new Date(this.formObj.startAddTime).getTime()
            )
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      formObj: {
        paypalAddress: '',
        startAddTime: '',
        endAddTime: '',
        paypalStatus: ''
      },
      typeOption: [{
        label: '公司账户',
        value: 1
      }, {
        label: '私人账户',
        value: 2
      }],
      paypalStatusOption: [{
        label: '正常',
        value: 1
      }, {
        label: '停用',
        value: 2
      }, {
        label: '冻结',
        value: 3
      }, {
        label: '已注销',
        value: 4
      }],
      headers: [{
        label: 'paypal账号',
        prop: 'paypalAddress'
      }, {
        label: '账户类型',
        prop: 'type',
        formatter(row, column, cellValue) {
          return cellValue === 2 ? '私人账户' : '公司账户'
        }
      }, {
        label: '注册人',
        prop: 'register'
      }, {
        label: '添加时间',
        prop: 'addTime'
      }, {
        slot: true,
        slotName: 'proportion'
      }, {
        slot: true,
        slotName: 'fixedAmount'
      }, {
        label: '添加人',
        prop: 'userJobNumber'
      }, {
        label: '状态',
        prop: 'paypalStatus',
        formatter(row, column, cellValue, index) {
          let text = ''
          switch (cellValue) {
            case 1:
              text = '正常'
              break
            case 2:
              text = '停用'
              break
            case 3:
              text = '冻结'
              break
            case 4:
              text = '已注销'
              break
          }
          return text
        }
      }]
    }
  },
  mounted() {
    this.$refs.table.load(1, this.formObj)
  },
  methods: {
    fetch({ current, size }, params) {
      return paypalList({ current, size, ...params }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    search() {
      this.$refs.table.load(1, this.formObj)
    },
    handlerReact(formName) {
      this.$refs[formName].resetFields()
      this.formObj.endAddTime = ''
      this.search()
    }
  }

}
</script>

<style>

</style>
