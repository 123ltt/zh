<template>
  <div>
    <div class="d-flex flex-wrap">
      <div v-for="(item,index) in imgList" :key="index" class="d-flex flex-column image-box mx-1 mb-1 ">
        <g-thumb :width="100" :height="100" :url="item.imageUrl.link" />
        <el-checkbox v-model="item.checked" class="align-items-center d-flex justify-content-center mx-0" @change="(val)=>checkChange(val,index)">选择</el-checkbox>
      </div>
    </div>
    <AddImage ref="addimage" v-bind="{isoss:true,submit,getFiles,a:1}" />
  </div>
</template>

<script>
import AddImage from '../../../components/picture/addImage.vue'
export default {
  components: { AddImage },
  props: {
    imgs: Array
  },
  data() {
    return {
      imgList: [],
      checked: false
    }
  },
  mounted() {
    if (this.imgs) {
      this.init()
    }
  },
  methods: {
    init() {
      this.imgs.forEach(item => {
        this.imgList.push(item)
      })
      this.initData()
    },
    initData() {
      this.imgList.forEach(item => {
        item.imageUrl = item.response?.data || item.url || item.imageUrl
        this.$set(item, 'checked', false)
      })
    },
    submit() {
      const imageUrl = this.imgList.filter(item => {
        if (item.checked) {
          return item
        }
      })
      if (imageUrl.length === 0) {
        this.$message.warning('请选择一张图片')
        return
      }
      this.$parent.$emit('close', imageUrl[0].imageUrl.link)
    },
    getFiles(val) {
      if (this.imgs.length) {
        this.imgList.push(...val)
      } else {
        this.imgList = [...val]
      }
      this.initData()
    },
    checkChange(val, index) {
      this.imgList.forEach((item, i) => {
        if (index === i) {
          this.$set(item, 'checked', true)
        } else {
          this.$set(item, 'checked', false)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.image-box{
   border: 1px dashed #d9d9d9;
}
</style>
