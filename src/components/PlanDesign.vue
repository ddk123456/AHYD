<template>
  <div>
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="规划设计名称">
        <el-input v-model="searchForm.planDesignName" placeholder="规划设计名称"></el-input>
      </el-form-item>
      <el-form-item label="规划类型">
        <el-select v-model="searchForm.specId" placeholder="规划类型">
          <el-option v-once v-for="(item,index) in this.planDesignType.entries" :key="item.key" :value="item.value"
                     :label="item.text"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设计人">
        <el-input v-model="searchForm.designer" placeholder="设计人"></el-input>
      </el-form-item>
      <el-form-item label="设计时间">
        <el-date-picker
            v-model="searchForm.designTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
    <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">新增</el-button>
    <el-table
        :data="planDesignInfoList"
        border
        style="width: 100%">
      <el-table-column
          prop="plan_bill_no"
          label="规划工单号"
          width="220">
      </el-table-column>
      <el-table-column
          prop="plan_design_name"
          label="规划设计名称"
          width="220">
      </el-table-column>
      <el-table-column
          prop="design_company"
          label="设计单位"
          width="230">
      </el-table-column>
      <el-table-column
          prop="spec_id"
          label="业务类型"
          :formatter="formatterDesignType"
          width="120">
      </el-table-column>
      <el-table-column
          prop="project_director"
          label="项目总负责人"
          width="120">
      </el-table-column>
      <el-table-column
          prop="spec_leader"
          label="专业负责人"
          width="120">
      </el-table-column>
      <el-table-column
          prop="designer"
          label="设计人"
          width="120">
      </el-table-column>
      <el-table-column
          prop="reviewer"
          label="校审人"
          width="120">
      </el-table-column>
      <el-table-column
          prop="create_time"
          label="设计新建时间"
          width="170">
      </el-table-column>
      <el-table-column
          label="操作"
          width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @next-click="next"
        @prev-click="previous"
        @current-change="handleCurrentChange"
        :current-page="this.searchForm.current"
        :page-sizes="[1,2,3]"
        :page-size="1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total">
    </el-pagination>
    <el-dialog title="新增规划设计评估记录" :visible.sync="dialogFormVisible" width="1410px">
      <el-form :model="form">
        <el-form-item label="规划工单编号" :label-width="formLabelWidth">
          <el-input v-model="form.planBillNo" autocomplete="off" :style="{width: '450px'}"></el-input>
        </el-form-item>
        <el-form-item label="规划设计名称" :label-width="formLabelWidth">
          <el-input v-model="form.planDesignName" autocomplete="off" :style="{width: '450px'}"></el-input>
        </el-form-item>
      </el-form>
      <!--      插入文件上传的代码-->
      <el-upload
          class="upload-demo"
          action="http://localhost:8080/upload.do"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1"
          :on-exceed="exceedTips"
          :on-success="handleDwgSuccess">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传dwg格式文件、不超过10MB，上传数量限制1个。</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import axios from 'axios'
import {planDesignType} from '@/enum.js'

export default {
  name: 'HelloWorld',
  data() {
    return {
      planDesignType,
      planDesignInfoList: [],
      dialogFormVisible: false,
      form: {
        planBillNo: 'AHYD-PMS-20230527-002',
        planDesignName: '安徽二干华为规划设计',
      },
      searchForm: {
        planDesignName: "",
        specId: 1,
        designer: "",
        designTime: [],
        current: 1,
        size: 1
      },
      total: 0,
      formLabelWidth: '120px',
      dwgFileUrl: "",
      dwgFileName: ""
    }
  },
  methods: {
    // 新增一个《格式化业务类型》方法
    formatterDesignType(row) {
      if(row.spec_id==1){
        return "OTN业务"
      }else if(row.spec_id==2){
        return "网元业务"
      }
    },
    previous(val) {
      this.searchForm.current = Number.parseInt(`${val}`);
      let _this = this;
      axios.post('http://localhost:8080/searchBill.do', this.searchForm)
          .then(res => {
            _this.planDesignInfoList = res.data.data.records;
            this.total = res.data.data.total;
          }, err => {
            console.log("服务器出错，err代表服务器返回的错误信息")
          });
    },
    next(val) {
      this.searchForm.current = Number.parseInt(`${val}`);
      let _this = this;
      axios.post('http://localhost:8080/searchBill.do', this.searchForm)
          .then(res => {
            _this.planDesignInfoList = res.data.data.records;
            this.total = res.data.data.total;
          }, err => {
            console.log("服务器出错，err代表服务器返回的错误信息")
          });
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    },
    search() {
      let _this = this;
      axios.post('http://localhost:8080/searchBill.do', this.searchForm)
          .then(res => {
            _this.planDesignInfoList = res.data.data.records;
            this.total = res.data.data.total;
          }, err => {
            console.log("服务器出错，err代表服务器返回的错误信息")
          });
    },
    save() {
      /*
      因为axios中的this并不是vue实例，所以如果想在axios中使用this，要先把this赋值给一个变量
       */
      let _this = this;
      axios.post('http://localhost:8080/createBill.do', {
        "plan_bill_no": this.form.planBillNo,
        "plan_design_name": this.form.planDesignName
      })
          .then(function (response) {
            // 处理成功情况
            if (response.data.code == 200) {
              _this.dialogFormVisible = false;
              _this.$message({
                message: response.data.message,
                type: 'success'
              });
            } else {
              _this.$message.error(response.data.message);
            }
            /*
            如果成功就让Dialog关闭，并且提示：保存成功
            如果失败Dialog保持，并且提示：保存失败
             */
          })
          .catch(function (error) {
            // 处理错误情况
            console.log(error);
          })
          .then(function () {
            // 总是会执行
          });
    },
    selectRouteCable() {
      // 用axios对后端发请求获取数据
      let _this = this;
      axios.get('http://localhost:8080/selectRouteCableList.do')
          .then(function (response) {
            // 处理成功情况
            console.log(response);
            _this.routeCableList = response.data.data;
          })
          .catch(function (error) {
            // 处理错误情况
            console.log(error);
          })
          .then(function () {
            // 总是会执行
          });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    beforeRemove(file, fileList) {
      // 删除之前要问一下用户？
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleDwgSuccess(res) {
      this.dwgFileUrl = res.data[0];
      console.log("文件名：", this.dwgFileUrl.substr(this.dwgFileUrl.lastIndexOf("/") + 1));
      console.log("上传成功后，服务器返回的文件的url（地址）：", this.dwgFileUrl)

    },
    exceedTips() {
      this.$message.error("只能上传1个文件");
    }
  }
}
</script>

<style scoped>
</style>
