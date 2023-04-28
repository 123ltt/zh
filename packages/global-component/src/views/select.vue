<template>
  <div style="width:300px">
    <el-form :rules="rules" :model="form">
      <el-form-item prop="selected" label="测试1">
        <g-select v-model="form.selected"
                  :items="list"
                  key-field="id"
                  :label-field="getLabel"
                  class="w-100"
                  :disabled="false"
                  is-checked-all
                  multiple
                  dropdown-width="auto"
        />
      </el-form-item>
      <el-form-item prop="selected2" label="测试2">
        <g-select v-model="form.selected2"
                  :items="list2"
                  key-field="id"
                  :label-field="getLabel"
                  class="w-100"
                  :disabled="false"
                  is-checked-all
                  multiple
        />
      </el-form-item>
      <el-form-item prop="selected3" label="测试3">
        <g-select v-model="form.selected3"
                  :items="list3"
                  key-field="id"
                  :label-field="getLabel"
                  class="w-100"
                  :disabled="false"
                  is-checked-all
                  multiple
                  @keyword="onKeyword"
        />
      </el-form-item>
    </el-form>
    <el-button size="mini" @click="setList">更新测试1列表数据</el-button>
    <el-button size="mini" @click="list=[]">清空测试1列表数据</el-button>
    <el-button size="mini" @click="update">更新测试1值</el-button>
    <el-button size="mini" @click="updateAll">同时设置测试1 items和value</el-button>
    <el-button size="mini" @click="updateTwo">同时两个列表的值和列表(延迟1s，异步)</el-button>
    <el-button size="mini" @click="selectAll">测试1默认全选</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      list2: [],
      list3: [],
      form: {
        selected: [], // 默认选中id为1的选项
        selected2: [], // 默认选中id为1的选项
        selected3: []
      },
      rules: {
        selected: [
          { required: true, trigger: 'change' }
        ],
        selected2: [
          { required: true, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 生成1万条数据
    getData() {
      const list = [...new Array(100)].map((item, index) => {
        const name = Number(String(Math.random()).slice(2)).toString(32)
        return { id: index, name: name.repeat(3) }
      })
      list.unshift({ id: 1, name: 'abc' })
      return list
    },
    setList() {
      this.list = this.getData()
    },
    // 自定义label
    getLabel(data) {
      return [data.id, data.name].join(' - ')
    },
    update() {
      this.form.selected = [5, 6]
    },
    updateAll() {
      this.form.selected = [1, 2]
      this.list = this.getData()
    },
    updateTwo() {
      this.form.selected = [1]
      this.form.selected2 = [2]
      setTimeout(() => {
        this.list = this.getData()
        this.list2 = this.getData()
      }, 1000)
    },
    selectAll() {
      const list = this.getData()
      this.form.selected = list.map(item => item.id)
      this.list = list
    },
    onKeyword() {
      this.list3 = this.getData()
    }
  }
}
</script>
