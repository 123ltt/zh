<template>
  <div class="openBox">
    <div class="addBox">
      <header class="header">
        <p class="title">{{ isEdit ? "编辑访厂考核" : "新增访厂考核" }}</p>
        <div class="closeBtn" @click="close()">
          <i class="el-icon-close" />
        </div>
      </header>
      <div ref="main" class="main">
        <el-form ref="rulesForm" :model="openData" label-width="120px" size="mini">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="evalNo" label="考核项序号" :rules="{ required: true, message: '考核项序号不能为空', trigger: 'blur' }">
                <el-input
                  v-model="openData.evalNo"
                  v-input.positive.numeric
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="evalType" label="考核项归类" :rules="{ required: true, message: '考核项归类不能为空', trigger: 'change' }">
                <el-select
                  v-model="openData.evalType"
                  clearable
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="item in classified"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="contentNo" label="审核内容序号" :rules="{ required: true, message: '审核内容序号不能为空', trigger: 'blur' }">
                <el-input
                  v-model="openData.contentNo"
                  v-input.positive.numeric
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="evalContent" label="审核内容" :rules="{ required: true, message: '审核内容不能为空', trigger: 'blur' }">
                <el-input
                  v-model="openData.evalContent"
                  :autosize="{ minRows: 4, maxRows: 6 }"
                  clearable
                  type="textarea"
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="footer">
        <el-button size="mini"
                   icon="el-icon-circle-close"
                   @click="close()"
        >取消</el-button>
        <el-button size="mini"
                   type="primary"
                   @click="todefine()"
        >下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/util/util'
export default {
  name: 'AddBox',
  props: {
    isEdit: Boolean,
    classified: Array,
    openData: Object, // 父传子的表格参数
    close: {
      // 父传子的关闭函数
      type: Function,
      default: null
    },
    define: {
      // 父传子的关闭函数
      type: Function,
      default: null
    }
  },
  data() {
    return {}
  },
  methods: {
    todefine: debounce(function() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          this.classified.forEach((item) => {
            if (item.dictKey === this.openData.evalType) {
              this.openData.evalTypeDictValue = item.dictValue
            }
          })
          this.define()
        }
      })
    })
  }
}
</script>

<style lang='scss' scoped>
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"] {
  -moz-appearance: textfield;
}
* {
  box-sizing: border-box;
}
.openBox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  translate: all 1s;
  background: rgba($color: #000000, $alpha: 0.3);
  .addBox {
    box-sizing: border-box;
    width: 600px;
    height: auto;
    position: absolute;
    top: 50%;
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
      width: 100%;
      padding-top: 20px;
      padding-right: 20px;
      ::v-deep .el-select {
        width: 100%;
      }
      ::v-deep .el-form-item__content {
        width: 60%;
        ::v-deep .el-input-group__prepend {
          width: 25%;
          padding: 0;
          text-align: center;
        }
      }
      .biaozhi {
        color: red;
        font-size: 12px;
      }
    }
    .footer {
      text-align: right;
      padding-right: 20px;
      padding-bottom: 20px;
    }
  }
}
</style>
