<template>
  <div class="openBox">
    <div v-if="!editor" class="addBox">
      <header class="header">
        <p class="title">{{ isEdit?'编辑':'新增' }}评审标准项</p>
        <div class="closeBtn" @click="close()">
          <i class="el-icon-close" />
        </div>
      </header>
      <main class="main">
        <el-card>
          <section class="basic">
            <el-form ref="rulesForm" :model="saveData" label-width="120px" size="mini" style="width:70%">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item prop="standardNo" label="标准项序号" :rules="{ required: true, message: '标准项序号不能为空', trigger: 'blur' }">
                    <el-input
                      v-model="saveData.standardNo"
                      v-input.positive.numeric
                      clearable
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="score" label="标准项分值" :rules="{ required: true, message: '标准项分值不能为空', trigger: 'blur' }">
                    <el-input
                      v-model="saveData.score"
                      v-input.positive.numeric
                      clearable
                      maxlength="3"
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="standardItem" label="评审标准项" :rules="{ required: true, message: '评审标准项不能为空', trigger: 'blur' }">
                    <el-input
                      v-model="saveData.standardItem"
                      :autosize="{ minRows: 4, maxRows: 6}"
                      clearable
                      type="textarea"
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="footer">
                  <el-form-item>
                    <el-button
                      size="mini"
                      icon="el-icon-circle-close"
                      @click="close()"
                    >取消</el-button>
                    <el-button
                      size="mini"
                      type="primary"
                      icon="el-icon-circle-plus-outline"
                      @click="tosave()"
                    >保存</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </section>
        </el-card>
        <el-card>
          <div slot="header">
            <span>评审标准列表</span>
          </div>
          <section class="record">
            <el-table
              :data="reviewTable"
              max-height="250px"
              stripe
              style="width: 100%"
              border
            >
              <el-table-column
                prop="standardItem"
                label="评审标准项"
                align="center"
                min-width="300"
              />
              <el-table-column
                prop="score"
                label="标准项分值"
                align="center"
                min-width="100"
              />
              <el-table-column
                prop="standardNo"
                label="标准项序号"
                align="center"
                min-width="100"
              />
              <el-table-column
                prop="contentNo"
                label="评审内容序号"
                align="center"
                min-width="100"
              />
              <el-table-column
                prop="evalNo"
                label="考核项序号"
                align="center"
                min-width="100"
              />
              <el-table-column
                label="操作"
                align="center"
                min-width="100"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="editBtn(scope)"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="removeBtn(scope)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <footer class="footer">
              <el-button
                size="mini"
                icon="el-icon-circle-close"
                @click="close()"
              >取消</el-button>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="tijiao()"
              >提交</el-button>
            </footer>
          </section>
        </el-card>
      </main>
    </div>
    <div v-else class="editorBox">
      <div class="header">
        <p class="title">编辑评审项</p>
        <div
          class="closeBtn"
          @click="editclose()"
        >
          <i class="el-icon-close" />
        </div>
      </div>
      <div ref="main" class="main">
        <el-form ref="rulesForm" :model="editData" label-width="120px" size="mini">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item prop="standardNo" label="标准项序号" :rules="{ required: true, message: '标准项序号不能为空', trigger: 'blur' }">
                <el-input
                  v-model="editData.standardNo"
                  v-input.positive.numeric
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="score" label="标准项分值" :rules="{ required: true, message: '标准项分值不能为空', trigger: 'blur' }">
                <el-input
                  v-model="editData.score"
                  v-input.positive.numeric
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="standardItem" label="评审标准项" :rules="{ required: true, message: '评审标准项不能为空', trigger: 'blur' }">
                <el-input
                  v-model="editData.standardItem"
                  :autosize="{ minRows: 4, maxRows: 6}"
                  clearable
                  type="textarea"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" class="footer">
              <el-form-item>
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-circle-plus-outline"
                  @click="editsave()"
                >保存</el-button>
                <el-button
                  size="mini"
                  icon="el-icon-circle-close"
                  @click="editclose()"
                >取消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/util/util'
import { getreviewList } from '@/api/basicManagement/factoryVisitAssessment.js'
export default {
  name: 'AddNext',
  props: {
    isEdit: Boolean,
    openData: Object,
    close: { // 父传子的关闭函数
      type: Function,
      default: null
    },
    nextdefine: { // 父传子的关闭函数
      type: Function,
      default: null
    }
  },
  data() {
    return {
      reviewTable: [],
      saveData: {
        standardNo: '',
        standardItem: '',
        score: ''
      },
      editor: false,
      editData: {},
      num: ''
    }
  },
  mounted() {
    this.toget()
    this.reviewTable = []
  },
  methods: {
    toget() {
      const contentId = this.openData.id
      getreviewList(contentId).then((res) => {
        if (res.code === 200) {
          const data = res.data
          this.reviewTable = data.records
          this.reviewTable.forEach(item => {
            item.contentNo = this.openData.contentNo
            item.evalNo = this.openData.evalNo
          })
        } else {
          this.$message.error('请求数据失败!')
        }
      })
    },
    tosave: debounce(function() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          const obj = {
            contentNo: this.openData.contentNo,
            evalNo: this.openData.evalNo,
            ...this.saveData
          }
          this.reviewTable.unshift(obj)
          this.saveData.standardNo = ''
          this.saveData.score = ''
          this.saveData.standardItem = ''
        }
      })
    }),
    editBtn(val) {
      this.editor = true
      this.editData = JSON.parse(JSON.stringify(val.row))
      this.num = val.$index
    },
    editclose() {
      this.editor = false
      this.editData = {}
      this.num = ''
    },
    editsave() {
      if (this.editData.name === '' || this.editData.score === '' || this.editData.audit === '') {
        this.$message.error('请填写必填项!')
      } else {
        this.reviewTable.splice(this.num, 1, this.editData)
        this.editor = false
      }
    },
    tijiao: debounce(function() {
      if (this.reviewTable.length === 0) {
        this.$message.error('请填写新增项!')
      } else {
        this.reviewTable.forEach(item => {
          item.contentId = this.openData.id
        })
        this.$emit('toVal', this.reviewTable)
        this.nextdefine()
      }
    }),
    removeBtn(val) {
      this.reviewTable.splice(val.$index, 1)
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"]{
  -moz-appearance: textfield;
}
::v-deep .el-form-item__content{
    margin-left:0 ;
}
*{
    box-sizing: border-box;
}
.openBox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  translate: all 1s;
  background: rgba($color: #000000, $alpha: 0.3);
  .editorBox,.addBox {
    box-sizing: border-box;
    width: 1000px;
    height: auto;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 5px;
    .header {
      box-sizing: border-box;
      padding: 0 20px;
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #cccccc;
      .title {
        font-size: 14px;
      }
      .closeBtn {
        cursor: pointer;
        &:hover{
            color: #409eff;
        }
        i {
          size: 16px;
        }
      }
    }
    .main {
      box-sizing: border-box;
      width: 100%;
      padding-top: 10px;
      .mainHeader{
          width: 100%;
          height: 30px;
          line-height: 30px;
          padding-left: 10px;
          background-color: #409eff;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .submitBtn{
              border: none;
              height: 70%;
              padding: 0 5px;
              text-decoration: none;
              color: #ffffff;
              background-color: #409eff;
              font-size: 14px;
              margin-right: 10px;
          }
      }
      .basic{
          // padding-right: 20px;
          display: flex;
          justify-content: center;
          ::v-deep .el-form-item{
              margin-bottom: 10!important;
          }

        .biaozhi {
            color: red;
            font-size: 12px;
          }
        .footer {
        text-align: center;
        }
      }
      .record{
          // padding: 20px;
          ::v-deep .el-table td, .el-table th{
              padding: 5px 0;
          }
      }
    }
  }
  .editorBox{
      width: 450px;
      .main{
          padding-right: 20px;
      }
      .biaozhi {
            color: red;
            font-size: 12px;
          }
  }
  .footer{
      text-align: right;
      padding-right: 20px;
      margin-top: 20px;
  }
}
</style>
