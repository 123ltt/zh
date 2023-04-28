<template>
  <basic-container>
    <div class="openBox">
      <div v-loading="loading" class="fubox">
        <header class="header">
          <p class="title">访厂记录详情</p>
          <div
            class="closeBtn"
            @click="toclose()"
          >
            <el-button
              size="mini"
              type="primary"
            >返回</el-button>
          </div>
        </header>
        <main class="main">
          <el-card>
            <section class="basic">
              <el-form size="mini" label-width="100px" class="no-message">
                <el-row :gutter="10">
                  <el-col :span="16">
                    <el-form-item label="供应商名称">
                      <el-input :value="detail.supplierName" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="稽核人员">
                      <el-input :value="auditors" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="访厂日期">
                      <el-input :value="detail.visitTime" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="陪同人员">
                      <el-input :value="accompanying" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="供应商评分表">
                      <a :href="fileLink" style="color:blue;">供应商评分表</a>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="最终得分">
                      <el-input :value="detail.score" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="供应商等级">
                      <el-input :value="detail.grade" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="24">
                    <div class="tuOne">
                      <el-form-item label="访厂图片">
                        <div class="idcard">
                          <ul class="imgBox">
                            <li v-for="(item,index) in imgList" :key="index">
                              <el-image
                                :src="item.link"
                                :preview-src-list="[item.link]"
                                style="width: 140px; height: 100px;border: 1px solid #ccc;"
                              />
                            </li>
                          </ul>
                        </div>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item label="创建人">
                      <el-input :value="detail.createUserName" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="创建时间">
                      <el-input :value="detail.createTime" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="修改人">
                      <el-input :value="detail.updateUserName" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="最后修改时间">
                      <el-input :value="detail.updateTime" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </section>
          </el-card>
        </main>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { getDetail } from '@/api/factoryVisitManagement/factoryVisitRecord.js'
export default {
  name: 'PssFactoryVisitRecordDetail',
  props: {
    detailData: Object, // 父传子的表格参数
    close: { // 父传子的关闭函数
      type: Function,
      default: null
    }
  },
  data() {
    return {
      detail: {},
      imgList: [],
      fileLink: '',
      accompanying: '',
      auditors: '',
      loading: false
    }
  },
  mounted() {
    this.getData(this.detailData.id)
  },
  methods: {
    getData(val) {
      this.loading = true
      getDetail(val).then(res => {
        if (res.code === 200) {
          const data = res.data
          this.detail = data
          data.files.forEach(item => {
            if (item.fileType === 'excel') {
              this.fileLink = item.link
            } else if (item.fileType === 'image') {
              this.imgList.push({ link: item.link })
            }
          })
          const arr = []
          data.users.forEach(item => {
            if (item.type === 'auditor') {
              this.auditors = item.userRealName
            } else if (item.type === 'entourage') {
              arr.push(item.userRealName)
            }
          })
          this.accompanying = arr.join(',')
          this.loading = false
        }
      })
    },
    toclose() {
      this.$emit('close')
      this.close()
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
*{
    box-sizing: border-box;
}
.openBox{
    width: 100%;
    // height: 600px;
    overflow: auto;
    .fubox{
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
        }
        .main {
        width: 100%;
        padding-top: 20px;
        padding-right: 20px;
        .mainHeader{
            width: 100%;
            height: 30px;
            line-height: 30px;
            padding-left: 10px;
            background-color: #cccccc;
        }
        .basic{
            width: 100%;
            // padding:20px ;
            overflow: hidden;
            span{
                display: inline-block;
            }
            .introduce{
                width: 120px;
            }
            .content{
                img{
                    width: 300px;
                    height: 200px;
                }
            }
        }

            .tuOne{
                width: 100%;
                display: flex;
                .introduce{
                    width: 120px;
                }
                .idcard{
                    width: 630px;
                    .imgBox{
                        width: 100%;
                        padding-left: 0;
                        display: flex;
                        flex-wrap: wrap;
                        li{
                            list-style: none;
                            width: 140px;
                            height: 100px;
                            margin-right: 10px;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
