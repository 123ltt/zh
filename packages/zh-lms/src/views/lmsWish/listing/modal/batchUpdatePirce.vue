<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="按条件更新" name="first">
        <el-col>
          <el-button type="text">价格更新</el-button>
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              <p>规则如下：</p>
              <p>1.调整后的价格不得低于sku平台限价</p>
              <p>2.调整后的价格不得低于保本价（即计算价格时的利润率不能小于0)</p>
              <p>3.多变体情况下，本地价格要显示价格最低的子sku的价格</p>
            </div>
            <el-button type="primary" size="mini">查看调价规则</el-button>
          </el-tooltip>
          <el-row :gutter="10">
            <el-col :span="3" class="lh-lg">更新方式</el-col>
            <el-col :span="8">
              <el-select v-model="form.priceParamType" class="w-100" size="mini">
                <el-option v-for="(item,index) in priceList" :key="index" :value="item.value" :label="item.label" />
              </el-select>
            </el-col>
            <el-col v-if="form.priceParamType==='0'" :span="4">
              <el-select v-model="form.psign" size="mini">
                <el-option v-for="(item,index) in oprateList" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
            <el-col :span="form.priceParamType==='0'?8:12">
              <el-input v-model="form.priceParam" v-input.positive.numeric size="mini" />
            </el-col>
          </el-row>
        </el-col>
        <el-col>
          <el-button type="text">库存更新</el-button>
          <el-row :gutter="10">
            <el-col :span="3" class="lh-lg">更新方式</el-col>
            <el-col :span="8">
              <el-select v-model="form.stockParamType" class="w-100" size="mini">
                <el-option v-for="(item,index) in stockList" :key="index" :value="item.value" :label="item.label" />
              </el-select>
            </el-col>
            <el-col v-if="form.stockParamType==='0'" :span="4">
              <el-select v-model="form.ssign" size="mini">
                <el-option v-for="(item,index) in oprateList" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
            <el-col :span="form.stockParamType==='0'?8:12">
              <el-input v-model="form.stockParam" v-input.positive.numeric size="mini" />
            </el-col>
          </el-row>
        </el-col>
      </el-tab-pane>
      <el-tab-pane v-if="listingStatus!=='Draft'" label="导入更新指定价/指定库存" name="second">
        <g-list-group :label-width="50+'px'" label-align="center">
          <g-list-group-item label="下载模板" class="lh-lg">
            <el-button type="primary" size="mini" @click="downLoad">点击下载</el-button>
          </g-list-group-item>
          <g-list-group-item label="上传" class="lh-lg">
            <upload-file ref="upload" button-size="mini" :files.sync="files" mimetype=".xls,.xlsx" :limit="1" :uploading.sync="uploading" :http-request="httpRequest" />
          </g-list-group-item></g-list-group>
      </el-tab-pane>
    </el-tabs>
    <el-row type="flex" justify="end">
      <el-button size="mini" @click="close(false)">取消</el-button>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
    </el-row>
  </div>
</template>

<script>
import { batchSave, templateDownload } from '@/api/wish/wish.js'
import { dowloadExc } from '@/util/util'
import { UploadFile } from 'global-components'
import upload from '@/api/common/upload'
export default {
  components: { UploadFile },
  props: {
    ids: Array,
    listingStatus: String
  },
  data() {
    return {
      files: [],
      uploading: false,
      activeName: 'first',
      form: {
        priceParam: '',
        stockParam: '',
        priceParamType: '',
        stockParamType: '',
        psign: '',
        ssign: ''
      },
      execlUrl: '',
      priceList: [
        { label: '总价增加/减少', value: '0' },
        { label: '指定价格为', value: '1' }
      ],
      stockList: [
        { label: '增加/减少库存', value: '0' },
        { label: '指定库存为', value: '1' }
      ],
      oprateList: [
        { label: '+', value: '+' },
        { label: '-', value: '-' }
      ],
      httpRequest: upload
    }
  },
  methods: {
    downLoad() {
      templateDownload(this.ids).then(res => {
        if (res) dowloadExc(res, '指定价&指定库存模板.xlsx')
      })
    },
    submit() {
      if (this.form.priceParamType === '0' && this.form.priceParam.length && !this.form.psign) {
        this.$message.warning('请选择是否增加或减少')
        return false
      }
      if (this.form.stockParamType === '0' && this.form.stockParam.length && !this.form.ssign) {
        this.$message.warning('请选择是否增加或减少')
        return false
      }
      this.$confirm('请确认是否要按条件更新listing价格或库存?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        if (this.activeName === 'first' && (!this.form.priceParam) && (!this.form.stockParam)) {
          this.$message.warning('价格更新或库存更新至少填一个')
          return
        }
        const params = {
          execlUrl: (this.files.length && this.files[0].url) || '',
          feedType: 1,
          feedPlatform: 'WH',
          ids: this.ids,
          priceParam: this.form.priceParam.length ? this.form.psign + this.form.priceParam : '',
          stockParam: this.form.stockParam.length ? this.form.ssign + this.form.stockParam : ''
        }
        batchSave(params).then(res => {
          if (res.success) {
            this.$message.success('批量更新成功')
            this.close()
          }
        })
      }).catch(() => {})
    },
    close(type = true) {
      this.$parent.$emit('close', type)
    },
    handleClick() {
      this.form = {
        priceParam: '',
        stockParam: '',
        priceParamType: '',
        stockParamType: '',
        psign: '',
        ssign: ''
      }
    }
  }
}
</script>

<style>

</style>
