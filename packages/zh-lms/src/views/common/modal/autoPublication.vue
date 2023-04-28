<template>
  <el-form ref="formObjRef" :rules="rules" :model="importFormObj" label-width="120px" size="mini">
    <el-row :gutter="20">
      <el-col :span="24">
        <!-- <el-form-item prop="accounts" label="刊登店铺：">
          <el-select v-model="importFormObj.accounts" collapse-tags multiple filterable clearable label="刊登账号" style="width:100%">
            <el-option v-for="item in autoList" :key="item.hiddenValue" :value="item.displayName" :label="item.displayName" />
          </el-select>
        </el-form-item> -->
        <!-- :disabled="readonly" -->
        <el-form-item label="平台店铺列表" prop="accounts">
          <v-store-list-panel v-model="importFormObj.accounts" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="skus" label="SKU/SPU：">
          <el-input v-model="importFormObj.skus" type="textarea" placeholder="1：sku/spu必须要有分隔符(,或；或空格或换行)；                  2：输入的sku/spu请统一输入牛蛙sku或新系统sku/spu,不要混合输入" rows="4" @change="resetChange" />
          <span style="color:red">提示：一次最多导入2000个sku</span>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="isDraft" label="生成listing状态：">
          <el-radio-group v-model="importFormObj.isDraft">
            <el-radio :label="true">Draft</el-radio>
            <el-radio :label="false">uploading</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="stockType" label="库存设置：">
          <div>
            <el-radio-group v-model="importFormObj.stockType">
              <el-radio :label="1">使用默认库存</el-radio>
              <el-radio :label="2">使用sku的实际库存</el-radio>
              <el-radio :label="3" style="margin-top:5px">指定库存为</el-radio>
              <el-input v-if="importFormObj.stockType===3" v-model="importFormObj.stock" v-input.positive.numeric placeholder="请输入大于0的整数" style="display:inline-block;width:40%;margin-top:5px" />
            </el-radio-group>
          </div>

        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="grossProfit" label="利润：">
          <span>指定利润率：</span><el-input v-model="importFormObj.grossProfit" v-input.positive maxlength="4" placeholder="请输入0-1之间的小数，最多两位小数" style="display:inline-block;width:79%" />
          <span style="color:red;position:relative;top:0;left:73px">提示：不输入则默认使用店铺利润率</span>
        </el-form-item>
      </el-col>
    </el-row>
    <div style="padding-bottom: 20px;text-align: right">
      <el-button size="mini" @click="$parent.$emit('close')">取 消</el-button>
      <el-button type="primary" size="mini" @click="save">确 定</el-button>
    </div>
  </el-form>

</template>

<script>
import { autoBatchUpdateByFile, optionsWithPlatformCode } from '@/api/amazon/amazon'
import VStoreListPanel from './storeListPanel.vue'
// 分割线
export default {
  name: 'NpcImport',
  components: {
    VStoreListPanel
  },
  props: {
    // autoList: Array
  },
  data() {
    return {
      importFormObj: {
        accounts: [],
        skus: '',
        isDraft: false,
        stockType: 1
      },
      rules: {
        accounts: [{ required: true, message: '刊登店铺不能为空', trigger: ['blur', 'change'] }],
        skus: [{ required: true, message: 'SKU/SPU不能为空', trigger: 'blur' }],
        isDraft: [{ required: true, message: 'listing状态不能为空', trigger: 'change' }]
        // stockType: [{ required: true, message: '库存设置不能为空', trigger: 'change' }],
        // grossProfit: [{ required: true, message: '指定利润率不能为空', trigger: ['blur', 'change'] }]
      },
      skus: [],
      autoList: []
    }
  },
  created() {
    this.platformChange()
  },
  mounted() {
  },
  methods: {
    platformChange() {
      optionsWithPlatformCode({ platformCode: 'WH' }).then(res => {
        this.autoList = res.data
      })
    },
    resetChange(val) {
      this.skus = Array.from(new Set(val.split(/,|，|；|;|\r|\n|\r\n|\s+/)))
      // 删除空字符串
      if (this.skus.includes('')) this.skus.splice(this.skus.findIndex(its => its === ''), 1)
      // 限制2000长度
      if (this.skus.length > 2000) this.skus.splice(2000, this.skus.length - 2000)
      this.importFormObj.skus = this.skus.join()
    },
    save() {
      this.$refs.formObjRef.validate((valid) => {
        if (valid) {
          // const skus = this.importFormObj.skus.split(/,|，|；|;|\r|\n|\r\n|\s+/)
          autoBatchUpdateByFile({
            // feedPlatform: 'WH',
            // feedType: '2',
            accounts: this.importFormObj.accounts,
            skus: this.skus,
            isDraft: this.importFormObj.isDraft,
            stockType: this.importFormObj.stockType,
            stock: this.importFormObj.stock,
            grossProfit: this.importFormObj.grossProfit
          }).then(res => {
            this.$message.success('保存成功')
            this.$parent.$emit('close', true)
          })
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.el-col{
  margin-bottom: 0px;
}
</style>
