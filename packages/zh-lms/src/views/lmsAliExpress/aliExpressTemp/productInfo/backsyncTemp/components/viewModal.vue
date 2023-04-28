<template>
  <el-form ref="form" :model="form" size="mini" label-width="80px">
    <el-form-item label="店铺" prop="account">
      {{ form.account }}
    </el-form-item>
    <el-form-item label="模板名称" prop="templateName">
      {{ form.templateName }}
    </el-form-item>
    <el-form-item label="模板类型" prop="templateType">
      {{ form.templateType==='custom'?'自定义模块':'关联模块' }}
    </el-form-item>
    <el-form-item label="模板内容" prop="moduleContents">
      <template>
        <ul class="moduleContent">
          <li v-for="(item,index) in form.moduleContents" :key="index">
            <img :src="item.imageUrls" alt="">
            <el-button type="text" @click="handleItemIdCell(item.itemId)">{{ item.itemId }}</el-button>
          </li>
        </ul>
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
import { productTempDetail } from '@/api/aliExpress/temp.js'
export default {
  name: 'ViewModal',
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      form: {}
    }
  },
  mounted() {
    this.id && this.productTempDetail()
  },
  methods: {
    productTempDetail() {
      productTempDetail({ id: this.id }).then(res => {
        this.form = res.data
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
.moduleContent{
  list-style:none;
  display: flex;
  flex-wrap:wrap;
  flex-direction:row;
  margin:0 0 0 -49px;
}
.moduleContent li{
  width: 126px;
  height: 126px;
  border:1px solid #c0ccda;
  border-radius: 6px;
  margin:0 10px 10px;
  display: table;
  position:relative;
}
.moduleContent li img{
  width: 100%;
  max-height: 126px;
  display: table-cell;
  margin:0 auto;

}
.moduleContent li button{
  position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    text-align: center;
    color: #409EFF;
    font-size: 14px;
    background-color: rgba(255, 255, 255, 0.5);
    line-height: 0;
    padding: 10px 0px;
}
</style>
