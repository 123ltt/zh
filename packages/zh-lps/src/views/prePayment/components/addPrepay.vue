<template>
  <div>
    <el-row>
      <el-col :span="12">
        <span>申请人: </span>
        <span>{{ userInfo.user_name }}</span>
      </el-col>
      <el-col :span="12">
        <span>申请时间: </span>
        <span>{{ date() }}</span>
      </el-col>
    </el-row>
    <div>
      <div class="title fw-bold">收款信息</div>
      <colsForm ref="formRef1" :message-style="false" :label-width="'110px'" :form-info="formInfo" :form-item="formItem1" />
    </div>
    <div>
      <div class="title fw-bold">付款信息</div>
      <colsForm ref="formRef2" :message-style="false" :label-width="'110px'" :form-info="formInfo" :form-item="formItem2" />
    </div>
    <div class="btn">
      <el-button size="mini" type="primary" @click="submit">确定</el-button>
      <el-button size="mini" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import colsForm from '@/views/components/colsForm.vue'
import { dateFormat } from '@/util/date.js'
import { mapGetters } from 'vuex'
import { addorEditPrePayPage } from '@/api/prePay'
export default {
  components: { colsForm },
  data() {
    return {
      p: '',
      formInfo: {

      },
      formItem1: [
        {
          label: '物流商名称',
          type: 'gselect',
          prop: 'wls',
          options: [],
          required: true
        },
        {
          label: '金蝶物流商编码',
          type: 'input',
          prop: '11'
        },
        {
          label: '收款单位',
          type: 'gselect',
          prop: '102',
          options: [],
          required: true
        },
        {
          label: '收款单位',
          type: 'input',
          prop: '22',
          options: []
        }
      ],
      formItem2: [
        {
          label: '付款主体',
          type: 'select',
          prop: '33',
          options: [],
          required: true
        },
        {
          label: '付款方式',
          type: 'select',
          prop: '44',
          options: [],
          required: true
        },
        {
          label: '付款渠道',
          type: 'select',
          prop: '55',
          options: [],
          required: true
        },
        {
          label: '付款账号',
          type: 'input',
          prop: '8'
        },
        {
          label: '付款币种',
          type: 'select',
          prop: '66',
          options: [],
          required: true
        },
        {
          label: '预付金额',
          type: 'input',
          prop: '47',
          required: true
        },
        {
          label: '汇率',
          type: 'input',
          prop: '57',
          required: true
        },
        {
          label: '预付金额(RMB)',
          type: 'input',
          prop: '67',
          options: [],
          required: true
        },
        {
          label: '付款依据',
          type: 'uploadFile',
          prop: '87',
          required: true
        },
        {
          label: '备注',
          type: 'textarea',
          prop: '97',
          contentWidth: '400px',
          required: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    console.log(this.userInfo)
  },
  methods: {
    submit() {
      this.$refs.formRef1.validate() && this.$refs.formRef2.validate(addorEditPrePayPage)
    },
    date() {
      return dateFormat(new Date(), 'yyyy-MM-dd hh:mm')
    },
    cancel() {
      this.$parent.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  .title{
    padding: 4px 0;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
  .btn{
    text-align: center;
    padding: 3px 0;
  }
  .el-row {
    padding: 0 10px 0 35px;
  }
</style>
