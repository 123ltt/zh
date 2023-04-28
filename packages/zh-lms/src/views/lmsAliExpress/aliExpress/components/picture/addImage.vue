<template>
  <div v-loading="loading">
    <div class="tips">
      <span class="red">*</span>图片支持{{ imgType.join(',') }},
      <span class="red">*</span>大小不能超过1M,
      <span v-if="type=='productImg'"><span class="red">*</span>尺寸800以上*800以上</span>
      <span v-if="type == 'marketImages2'"><span class="red">*</span>白底图大小为800*800</span>
      <span v-if="type == 'marketImages1'"><span class="red">*</span>场景图大小为750*1000</span>
    </div>
    <el-row class="m-t-30">
      <el-col :span="3">
        <span class="label">图片url</span>
      </el-col>
      <el-col :span="21">
        <el-row v-for="(item, index) in imgInfo" :key="index">
          <div class="img-box">
            <el-col :span="18">
              <el-input v-model="item.imageUrl" v-loading="item.loading" size="small" placeholder="请输入图片url地址，失去焦点上传图片" @change="(value) => change(value, index)" />
            </el-col>
            <el-col :span="6">
              <div class="img-btn">
                <el-button circle icon="el-icon-plus" size="small" class="m-l-10" title="点击添加" @click="addImageUrl(index)" />
                <el-button v-if="imgInfo.length >1" circle icon="el-icon-minus" size="small" class="m-l-10" title="点击删除" @click="imgInfo.splice(index, 1)" />
              </div>
            </el-col>
          </div>
        </el-row>
      </el-col>
    </el-row>
    <div class="upload-img-box">
      <UploadImgModal
        :files="files"
        :img-width="imgWidth"
        :img-height="imgHeight"
        :max-size="maxSize"
        :show-check-icon="false"
        :has-title="false"
        :is-plus="true"
        :is-auto-check="false"
        :if-can-delete="true"
        :is-required-img="false"
        :uploading.sync="loading"
        @updateFiles="updateFiles"
      />
    </div>
    <div style="padding-bottom: 20px;text-align: right;margin-top: 20px;margin-right: 30px">
      <span class="el-button el-button--default el-button--medium" @click="$parent.$emit('close')">
        <span>取消</span>
      </span>
      <el-button :disabled="closeEnabled" size="small" type="primary" @click="closeHandle">确 定</el-button>
    </div>
  </div>
</template>

<script>
// import { isImage } from '@/util/img'
import UploadImgModal from '@/components/uploadImg'
import { LIMIT } from '@/config/form'
import { uploadUrlImg } from '@/api/amazon/amazon.js'
export default {
  name: 'AddImage',
  components: { UploadImgModal },
  props: {
    type: String
  },
  data() {
    return {
      loading: false,
      LIMIT,
      files: [],
      imgType: ['jpg', 'jpeg', 'png', 'bmp', 'webp', 'gif'],
      imgInfo: [
        {
          dataUrl: '',
          imageUrl: '',
          isCheck: false,
          loading: false
        }
      ],
      // 图片导入相关
      importImgList: [],
      closeEnabled: false,
      imgWidth: [800, 99999],
      imgHeight: [800, 99999],
      maxSize: 1024 * 1024
    }
  },
  watch: {
    imgInfo: {
      handler(newName, oldName) {
        this.closeEnabled = (this.imgInfo.findIndex(item => item.imageUrl && !item.dataUrl) > -1)
      },
      deep: true
    }
  },
  created() {
    // 变体上传图片尺寸
    if (this.type === 'attrPic') {
      this.imgWidth = [40, 99999]
      this.imgHeight = [40, 99999]
    } else if (this.type === 'marketImages1') {
      this.imgWidth = [750, 99999]
      this.imgHeight = [1000, 99999]
    }
  },
  methods: {
    // 本地图片上传
    updateFiles(val) {
      if (Array.isArray(val)) {
        this.files = val
      } else this.files.splice(val, 1)
      this.files.filter((file, index) => {
        if (file.response && file.response.code === 200) {
          const url = file.response.data.link
          this.loadImg(url).then(res => {
            const i = this.importImgList.findIndex(item => item.imageUrl === url)
            if (i > -1) return
            // 白底图(方图) type: 2，场景图比例需为3:4(长图) type: 1
            const w = res.width
            const h = res.height
            let erMsg = ''
            if (this.type === 'marketImages1' && !(w >= 750 && (w / h === 0.75))) { erMsg = '场景图比例需为3:4, 750*1000' }
            if (this.type === 'marketImages2' && !(w >= 800 && w === h)) { erMsg = '场景图比例需为1:1, 800*800' }
            if (erMsg) {
              this.$message.error(erMsg)
              this.files.splice(index, 1)
              return false
            }
            this.importImgList.push({
              imageUrl: url,
              isCheck: false
            })
          })
        }
      })
    },
    loadImg(url) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = url
        // 图片403报错处理
        img.setAttribute('referrerPolicy', 'no-referrer')
        img.onload = function() {
          console.log('width:' + img.width + ',height:' + img.height)
          resolve({ width: img.width, height: img.height })
        }
      })
    },
    change(value, index) {
      // const url = value.target.value
      const url = value
      if (!url) {
        this.imgInfo[index].dataUrl = ''
      } else {
        const suffix = url.substr(url.lastIndexOf('.') + 1)
        if (!this.imgType.includes(suffix)) {
          this.$message.error('格式不支持，请换一个图片url')
          this.imgInfo[index].dataUrl = ''
          this.imgInfo[index].imageUrl = ''
          return false
        }
        this.loadImg(url).then(res => {
          // 白底图(方图) type: 2，场景图比例需为3:4(长图) type: 1
          const w = res.width
          const h = res.height
          let erMsg = ''
          if (this.type === 'marketImages1' && !(w >= 750 && (w / h === 0.75))) { erMsg = '场景图比例需为3:4, 750*1000' }
          if (this.type === 'marketImages2' && !(w >= 800 && w === h)) { erMsg = '场景图比例需为1:1, 800*800' }
          if (this.type === 'productImg' && !(w >= 800 && w === h)) { erMsg = '产品图片需为800*800以上' }
          if (erMsg) {
            this.$message.error(erMsg)
            this.imgInfo[index].imageUrl = ''
            return false
          }
          this.imgInfo[index].loading = true
          uploadUrlImg({ url }).then(res => {
            if (res.success) {
              this.imgInfo[index].dataUrl = res.data
            } else {
              this.$message.error('图片上传失败,请换一个url重试')
              this.imgInfo[index].imageUrl = ''
            }
          }).catch(() => {
            this.$message.error('图片上传失败,请换一个url重试')
            this.imgInfo[index].imageUrl = ''
          }).finally(() => {
            this.imgInfo[index].loading = false
          })
        })
      }
    },
    addImageUrl(index) {
      this.imgInfo.splice(index + 1, 0, {
        imageUrl: '',
        isCheck: false,
        loading: false
      })
    },
    closeHandle() {
      if (this.closeEnabled) {
        return
      }
      const urlImgList = []
      this.imgInfo.filter(item => {
        if (item.dataUrl) {
          urlImgList.push({
            imageUrl: item.dataUrl,
            isCheck: item.isCheck,
            type: item.type
          })
        }
      })
      this.$parent.$emit('close', [...this.importImgList, ...urlImgList])
    }
  }
}
</script>

<style lang="scss" scoped>
.tips{
  margin-top: 15px;
  margin-left: 35px;
  color: #999;
  .red{
    color: #F56C6C;
    margin-right: 5px;
  }
}
.upload-img-box{
  padding: 0 20px;
}
.label{
  text-align: right;
  padding-right: 12px;
  display: block;
  line-height: 32px;
}
.pic{
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    margin: 0 8px 8px 0;
    display: inline-block;
}
.m-l-10{
  margin-left: 10px;
}
.m-t-30{
  margin-top: 15px;
}
.p-b-30{
  padding-bottom: 30px;
}
</style>
