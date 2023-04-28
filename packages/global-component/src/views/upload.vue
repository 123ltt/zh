<template>
  <div>
    <UploadFile :files.sync="files" :size="1024*1024" :http-request="httpRequest" />
    <UploadImage :images.sync="images" :http-request="httpRequest" :avatar="avatar" />
    <div>
      <el-button size="mini" @click="avatar=!avatar">切换模式</el-button>
      <el-button size="mini" @click="images=[]">清空</el-button>
    </div>
    <pre>{{ JSON.stringify(images,null,2) }}</pre>
  </div>
</template>

<script>
import { UploadFile, UploadImage } from '../components'

// 模拟上传
function upload(option) {
  return new Promise((resolve) => {
    const e = { total: 15 }
    let i = 0
    const f = setInterval(() => {
      if (i > e.total) {
        clearInterval(f)
        resolve({ data: 'http://zehui-images-test-hk.oss-cn-hongkong.aliyuncs.com/upload/20201224/210433264f90301dbcc407019ab4c3f9.jpg' })
        return
      }
      e.percent = i++ / e.total * 100
      option.onProgress(e)
    }, 500)
  })
}

export default {
  components: { UploadFile, UploadImage },
  data() {
    return {
      files: [],
      images: [],
      httpRequest: upload,
      avatar: false
    }
  }
}
</script>
