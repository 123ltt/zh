<template>
  <el-form ref="form" :model="form" size="mini" label-width="140px" :rules="rules">
    <el-form-item label="店铺" prop="account">
      <span v-if="id">{{ form.account }}</span>
      <el-select v-else v-model="form.account" placeholder="请选择" clearable class="w220" @change="changeAccount">
        <el-option v-for="(item,index) in storeCodeOption" :key="index" :label="item.displayName" :value="item.displayName" />
      </el-select>
    </el-form-item>
    <el-form-item label="模板名称" prop="templateName">
      <span v-if="id">{{ form.templateName }}</span>
      <el-input v-else v-model="form.templateName" placeholder="请输入" clearable class="w220" />
    </el-form-item>
    <p>关联产品设置</p>
    <el-form-item label="需自动关联产品的listing" prop="templateType">
      <div class="d-flex">
        <el-select v-model="form.autoRelationType" class="me-2 w220" clearable filterable @change="changeAutoRelationType">
          <el-option v-for="(item,index) in autoRelationTypeOption" :key="index" :value="item.value" :label="item.label" />
        </el-select>
        <template v-if="form.autoRelationType">
          <el-select v-if="form.autoRelationType === 1" v-model="form.autoRelationContent" clearable filterable>
            <el-option v-for="(item,index) in autoRelationContentOption" :key="index" :value="item.groupId" :label="item.groupName" />
          </el-select>
          <template v-else>
            <el-input v-model="form.autoRelationContent" type="textarea" resize="none" rows="1" :placeholder="form.autoRelationType === 3?'请输入ItemId,多个请用逗号隔开':'请输入平台类目ID,多个请用逗号隔开'" style="width:calc(100% - 220px)" clearable />
          </template>
        </template>
      </div>
    </el-form-item>
    <el-form-item label="关联产品筛选条件" prop="relationType">
      <div class="d-flex">
        <el-select v-model="form.relationType" class="me-2 w220" clearable filterable @change="changeRelationType">
          <el-option v-for="(item,index) in autoRelationTypeOption" :key="index" :value="item.value" :label="item.label" />
        </el-select>
        <template v-if="form.relationType">
          <el-select v-if="form.relationType === 1" v-model="form.relationContent" clearable filterable @change="getImageUrl">
            <el-option v-for="(item,index) in autoRelationContentOption" :key="index" :value="item.groupId" :label="item.groupName" />
          </el-select>
          <template v-else>
            <el-input v-model="form.relationContent" type="textarea" resize="none" rows="1" :placeholder="form.relationType === 3?'请输入ItemId,多个请用逗号隔开':'请输入平台类目ID,多个请用逗号隔开'" style="width:calc(100% - 220px)" clearable @change="getImageUrl" />
          </template>
        </template>
      </div>
    </el-form-item>
    <el-form-item label="关联产品总个数" prop="layoutRow">
      <template>
        <el-row>
          <el-col :span="10">
            <el-input v-model.number="form.layoutRow" class="w180 me-2" @change="changeRows" />行
          </el-col>
          <el-col :span="10">
            <el-input v-model.number="form.layoutColumn" class="w180 me-2" @change="changeRows" />列
          </el-col>
        </el-row>
        <div style="margin-left:-80px">
          <el-row v-for="(item) in imageList" :key="item.key" :gutter="6" class="mt-2">
            <el-col v-for="list in item.list" :key="list.itemId" :span="spanWidth" style="margin-bottom:0">
              <div class="imgStyle">
                <img v-if="list.imageUrls&&list.imageUrls.length" :src="list.imageUrls" alt="" style="width:100%;height:100%;min-height:60px;max-width:92px;max-height:92px">
                <el-button type="text" @click="handleItemIdCell(list.itemId)">{{ list.itemId }}</el-button>
              </div>
            </el-col>
          </el-row>
          <p v-if="!imageList.length">找不到符合条件的listingID</p>
        </div>
      </template>
    </el-form-item>
    <div class="text-end">
      <el-button size="mini" @click="$parent.$emit('close')">取消</el-button>
      <el-button type="primary" size="mini" :disabled="id ? submitBtnEnable : false" @click="submitDialog('form')">保存</el-button>
    </div>
  </el-form>
</template>

<script>
import { productCustomTempDetail, productCustomTempUpdate, productCustomTempSave, getImageUrl } from '@/api/aliExpress/temp.js'
import { getProductGroup } from '@/api/aliExpress/product.js'
export default {
  name: 'EditModal',
  props: {
    id: {
      type: String
    },
    storeCodeOption: {
      type: Array
    }
  },
  data() {
    const relationTypeValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('关联产品筛选条件不能为空'))
      } else {
        if (!this.form.relationContent) {
          callback(new Error('关联产品筛选条件不能为空'))
        } else {
          callback()
        }
      }
    }
    const freightValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('关联产品总个数不能为空'))
      } else if (value * this.form.layoutColumn > 20) {
        callback(new Error('关联产品总个数行*列不能大于20'))
      } else {
        callback()
      }
    }
    return {
      form: {
        account: '',
        accountCode: '',
        autoRelationType: null,
        layoutRow: 4, // 行
        layoutColumn: 5, // 列
        moduleContents: [],
        relationContent: '',
        autoRelationContent: ''

      },
      defaultItem: [], // 补位数组
      autoRelationContentOption: [],
      autoRelationTypeOption: [{
        label: '产品分组',
        value: 1
      }, {
        label: '平台类目',
        value: 2
      }, {
        label: '指定ID',
        value: 3
      }],
      rules: {
        account: [{ required: true, message: '店铺不能为空', trigger: 'change' }],
        templateName: [{ required: true, message: '模板名称不能为空', trigger: 'change' }],
        relationType: [{ required: true, validator: relationTypeValidate, trigger: 'change' }],
        layoutRow: [{ required: true, validator: freightValidate, trigger: 'blur' }]
      },
      cache: null
    }
  },
  computed: {
    submitBtnEnable() {
      return false
    },
    showdefault() {
      return this.form.autoRelationType && this.form.relationType
    },
    // 列的宽度大小
    spanWidth() {
      return Math.floor(24 / this.form.layoutColumn)
    },
    imageList() {
      const rows = this.form.layoutRow
      const cols = this.form.layoutColumn
      if (rows * cols > 20) return []
      const arr = new Array(rows).fill([])
      const tempList = this.cache ? arr.map((item, index) => {
        return { list: this.cache.slice(index * cols, (index + 1) * cols), key: Math.random() }
      }) : []
      return tempList
    }
  },
  mounted() {
    this.id && this.getproductCustomTempDetail()
  },
  methods: {
    changeRows() {
      this.form.layoutRow && this.form.layoutColumn && this.getImageUrl()
    },
    changeAccount(val) {
      this.form.accountCode = this.storeCodeOption.find(item => item.displayName === val).candidateDisplayName
      this.changeAutoRelationType()
      this.changeRelationType()
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const form = this.form
          form.moduleContents = this.cache
          const params = JSON.parse(JSON.stringify(this.form))
          if (form?.autoRelationType && form?.autoRelationType !== 1 && form.autoRelationContent) {
            params.autoRelationContent = JSON.stringify(form.autoRelationContent.split(/,|，|\r|\n|\r\n|\s+/))
          }

          if (!(form?.autoRelationType && form.autoRelationContent)) {
            params.autoRelationType = null
            params.autoRelationContent = null
          }
          if (form?.relationType && form?.relationType !== 1) {
            params.relationContent = JSON.stringify(form.relationContent.split(/,|，|\r|\n|\r\n|\s+/))
          }
          if (this.id) {
            productCustomTempUpdate({ ...params }).then(res => {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            })
          } else {
            productCustomTempSave({ ...params }).then(res => {
              this.$message.success(res.msg)
              this.$parent.$emit('close', true)
            })
          }
        }
      })
    },
    getproductCustomTempDetail() {
      productCustomTempDetail({ id: this.id }).then(res => {
        const data = res.data
        if (data?.autoRelationType !== 1 && data.autoRelationContent) {
          data.autoRelationContent = JSON.parse(data.autoRelationContent).join(',')
        }
        if (data?.relationType !== 1 && data.relationContent) {
          data.relationContent = JSON.parse(data.relationContent).join(',')
        }
        this.form = data
        this.getImageUrl()
        this.getProductGroup()
      })
    },
    changeAutoRelationType() {
      if (this.form.autoRelationType === 1) {
        this.getProductGroup()
      } else {
        this.form.autoRelationContent = null
      }
    },
    changeRelationType() {
      if (this.form.relationType === 1) {
        this.getProductGroup()
      } else {
        this.form.relationContent = null
      }
    },
    // 获取产品分组
    getProductGroup() {
      getProductGroup({ account: this.form.account }).then(res => {
        const data = res.data
        data.forEach(item => {
          item.groupId = item.groupId + ''
        })
        this.autoRelationContentOption = res.data
      })
    },
    getImageUrl() {
      const form = this.form
      const params = {
        account: form.account,
        relationType: form.relationType,
        relationContent: form.relationContent,
        layoutRow: form.layoutRow,
        layoutColumn: Number(form.layoutColumn)
      }
      if (params.relationType !== 1 && this.form.relationContent) {
        const relationContent = form.relationContent.split(/,|，|\r|\n|\r\n|\s+/)
        params.relationContent = JSON.stringify(relationContent)
      }
      getImageUrl({ ...params }).then(res => {
        this.cache = res.data
      })
    },
    // 点击itemID 跳转到不同的平台
    handleItemIdCell(itemId) {
      const url = 'https://www.aliexpress.com/item/' + itemId + '.html'
      window.open(url, '_blank')
    }
  }

}
</script>

<style scoped>
.w180{
  width: 180px;
}
.w220{
  width:220px;
}
.moduleContent{
  list-style:none;
  display: flex;
  flex-wrap:wrap;
  position: relative;
 /* flex-wrap: nowrap; */
  flex-direction:row;
  vertical-align: middle;
  margin:20px 0 0 -49px;

}
.imgStyle{
  border:1px solid #c0ccda;
  border-radius: 6px;
  position: relative;
  margin-bottom:6px;
}
.imgStyle img{
  width: 92px;
  height: 92px;
}
.imgStyle button{
  position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    text-align: center;
    color: #409EFF;
    font-size: 12px;
    background-color: rgba(255, 255, 255, 0.5);
    line-height: 0;
    padding: 10px 0px;
}
</style>
