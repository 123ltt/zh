<template>
  <div>
    <el-form :model="form" :rules="rules" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <editor v-model="form.htmlContent"
                :text-content.sync="form.content"
                :http-request="httpRequest"
                image-protocol="https"
                :height="500"
        />
      </el-form-item>
      <el-form-item label="内容" prop="content2">
        <editor v-model="form.content2" :text-content.sync="form.content2" />
      </el-form-item>
    </el-form>

    <textarea v-model="form.htmlContent" style="width:90%" rows="6" />
  </div>
</template>

<script>
import Editor from '../components/import/editor/index.vue'
export default {
  components: { Editor },
  data() {
    return {
      form: {
        title: '',
        content: '<p>hello world</p>',
        htmlContent: '<h1>hello world</h1>',
        content2: '<p>123</p><h1>hello world</h1><h1>hello world</h1><h1>hello world</h1>'
      },
      rules: {
        title: [{ required: true }],
        content: [{ required: true }],
        content2: [{ required: true }]
      }
    }
  },
  methods: {
    httpRequest(options) {
      const data = { data: 'http://zehui-images-test-hk.oss-cn-hongkong.aliyuncs.com/upload/20210317/68c77c430163f7857a4fb8a263acba5f.jpg?x-oss-process=image/resize,h_120,w_120/quality,q_50' }
      options.onSuccess(data)
    }
  }
}
</script>
