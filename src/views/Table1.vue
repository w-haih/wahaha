<template>
  <div class="home">
    <div class="div_top">
      <p><a href="#">列表页</a>/<a href="#" class="a_active">查询表格</a></p>
      <h3>查询表格</h3>
    </div>
    <div class="table_box">
      <div class="table_search">
        <div class="">
          <form action="">
            <div class="top_div">
              <div class="rule_name_div">

                <span>规则名称：</span>
                <el-input
                    placeholder="请输入内容"
                    v-model="t_id"
                    clearable>
                </el-input>
              </div>
              <div class="describe_div">
                <span>描述：</span>
                <el-input
                    placeholder="请输入内容"
                    v-model="t_des"
                    clearable>
                </el-input>

              </div>
              <div class="buttons_div">
                <el-button @click="reset" round>重置</el-button>
                <el-button type="primary" @click="query" round>查询</el-button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <el-table
          ref="multipleTable"
          :data="tableData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)"
          tooltip-effect="dark"
          highlight-current-row
          style="width: 100%"
          :default-sort="{prop: 'id', order: ''}"
          sort-by="[prop: 'id',prop:'lastTime']"
          @selection-change="handleSelectionChange">
        <!--        highlight-current-row   高亮显示当前行   default-sort排序-->
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="规则名称"
            sortable
            width="80">
        </el-table-column>
        <el-table-column
            prop="des"
            label="描述"
            width="180"
            show-overflow-tooltip>
          <!--          show-overflow-tooltip 当内容过长被隐藏时显示 tooltip-->
        </el-table-column>
        <el-table-column
            prop="servers"
            label="服务调用次数">
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态">
          <template v-slot="scope">
            <i v-if="scope.row.status=='0'" class="status_dot status_dot_info"></i>
            <i v-else-if="scope.row.status=='1'" class="status_dot status_dot_danger"></i>
            <i v-else-if="scope.row.status=='2'" class="status_dot status_dot2"></i>
            <i v-else="scope.row.status=='3'" class="status_dot status_dot_success"></i>
            <span style="margin-left: 10px">{{ stateValue(scope.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="lastTime"
            label="上次调度时间"
            sortable
            :formatter="dateFormat">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="openDetailPage(scope.row)">详情</el-button>
            <el-button v-if="scope.row.isSubscribe==true" type="text" disabled @click="subToAlert(scope.row)">订阅警报</el-button>
             <el-button v-if="scope.row.isSubscribe==false" slot="reference" type="text" @click="subToAlert(scope.row)">订阅警报</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      翻页-->
      <table-ul :total="tableData.length" :page-size="pageSize" :current-page="currentPage"  @pageNumchange="parentPageNumChange"></table-ul>
    </div>
<!--详情弹出页面-->
    <el-dialog
        title="详情页面"
        :visible.sync="dialogVisible"
        width="60%"
        append-to-body
        :before-close="handleClose">
      <el-form label-width="180px">
        <el-form-item label="id:">
          <span prop="id">{{ rowData.id }}</span>
        </el-form-item>
        <el-form-item label="描述:">
          <span>{{ rowData.des }}</span>
        </el-form-item>
        <el-form-item label="调用次数:">
          <span>{{ rowData.servers }}</span>
        </el-form-item>
        <el-form-item label="状态:">
          <span>{{ stateValue(rowData.status) }}</span>
        </el-form-item>
        <el-form-item label="上次调用时间:">
          <span>{{ dateFormat(rowData) }}</span>
        </el-form-item>
        <el-form-item label="是否订阅警报信息:">
          <span>{{ rowData.isSubscribe == true ? "已订阅" : "未订阅" }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
    </el-dialog>
<!--订阅警报弹出页面-->
    <el-dialog
        title="提示"
        :visible.sync="dialog2Visible"
        width="30%"
        :before-close="handleClose">
      <span>当前 确定要订阅警报吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialog2Visible = false">取 消</el-button>
    <el-button type="primary" @click="subToYes">确 定</el-button>
  </span>
    </el-dialog>
    {{tableData}}
  </div>
</template>
<style>
* {
  margin: 0;
  padding: 0;
}

.div_top {
  width: 80%;
  height: 10%;
  margin: 0 auto;
  padding: 10px;
  background: #fff;
  text-align: left;
}

.div_top p {
  display: inline-block;
  width: 20%;
  padding: 10px;
}

.div_top a {
  color: rgba(0, 0, 0, .45);
  text-decoration: none;
}

.div_top .a_active {
  color: rgba(0, 0, 0, .8)
}

.div_top h3 {
  padding: 10px;
}

.table_box {
  width: 80%;
  height: auto;
  margin: 0 auto;
  padding: 10px;
  background-color: #eee;
}

.table_search {
  padding: 0 20px 5px 20px;
  margin-bottom: 20px;
  background-color: #fff;
}

.top_div {
  display: flex;
  flex-direction: row;
}

.top_div div {
  width: 60%;
  box-sizing: border-box;
  padding-top: 5px;
}

.span_input {
  padding: 4px 11px;
  border: 1px solid #ccc;
}

input {
  height: 22px;
  border: none;
  outline: none;
}

.span_input:hover {
  border: 1px solid skyblue;
}

.btn {
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
  cursor: pointer;
  transition: all .3s cubic-bezier(.645, .045, .355, 1);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: manipulation;
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  border-radius: 2px;
  color: rgba(0, 0, 0, .85);
  border: 1px solid #d9d9d9;
  background: #fff;
}

.buttons_div button:first-child:focus, .buttons_div button:first-child:hover {
  color: #40a9ff;
  border-color: #40a9ff;
  background: #fff;
}

.btn-primary {
  color: #fff;
  border-color: #1890ff;
  background: #1890ff;
  text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
  box-shadow: 0 2px 0 rgb(0 0 0 / 5%);
  margin-left: 10px;
}

.table-container {
  background: #fff;
}

.table_top {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.ul_top div {
  width: 35%;
}

.search_txt {
  padding-left: 20px;
  font-size: large;
  text-align: left;
}

/*表格样式*/
table {
  padding: 10px;
  width: 100%;
  text-align: left;
}

th {
  position: relative;
  color: rgba(0, 0, 0, .85);
  font-weight: 500;
  text-align: left;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  transition: background .3s ease;

}

th, td {
  padding: 12px 8px;
}

th:not(:last-child):before {
  position: absolute;
  top: 50%;
  right: 0;
  width: 1px;
  height: 1.6em;
  background-color: rgba(0, 0, 0, .1);
  transform: translateY(-50%);
  transition: background-color .3s;
  content: "";
}

a {
  color: rgb(24, 144, 255);
  text-decoration: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  transition: color 0.3s ease 0s;
}

.status_dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 4px;
  border-radius: 50%;
}

.status_dot_info {
  background: #909399;
}

.status_dot_danger {
  background: #F56C6C;
}

.status_dot2 {
  background: #1890ff;
  position: relative;
}

.status_dot2:after {
  position: absolute;
  top: -1px;
  left: -1px;
  width: 100%;
  height: 100%;
  border: 1px solid #1890ff;
  border-radius: 50%;
  -webkit-animation: antStatusProcessing 1.2s ease-in-out infinite;
  animation: antStatusProcessing 1.2s ease-in-out infinite;
  content: "";
}

.status_dot_success {
  background: #67C23A;
}
/*修改公共样式*/
.has-gutter tr th:first-child div{
  padding-right: 0 !important;
  padding-left: 14px !important;
}
.cell>button:first-child {
  margin-right: 5px;
}

</style>
<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
/*let vue=new Vue({
  el:".home",

})*/
import TableUl from "../components/tableUl";

export default {
  name: 'Table1',
  components: {
    TableUl,
  },
  //prop:["currentPage","pageSize"],
  data: function () {
    return {
      t_id: "",
      t_des: '',
      dialogVisible: false,
      dialog2Visible: false,
      visible:false,
      tableDataSearch: [],
      isText: false,
      multipleSelection: [],
      pageSize:5,
      currentPage:1,
      form: {
        id: '1'
      },
      formLabelWidth: '120px',
      /*state:0关闭，1异常，2运行中，3已上线*/
      tableData: [
        {
          id: "1",
          des: "0是一大段描述1,这是一大段描述1",
          servers: "10万",
          status: "0",
          lastTime: 1620243899400,
          isSubscribe: true
        },
        {
          id: "2",
          des: "这是一大段描述23",
          servers: "10万",
          status: "1",
          lastTime: Date.now(),
          isSubscribe: false
        },
        {
          id: "3",
          des: "这是一大段描述23",
          servers: "10万",
          status: "2",
          lastTime: 1638143099400,
          isSubscribe: false
        },
        {
          id: "4",
          des: "这是一大段描述4",
          servers: "10万",
          status: "1",
          lastTime: Date.now(),
          isSubscribe: false
        },
        {
          id: "5",
          des: "这是一大段描述5",
          servers: "10万",
          status: "3",
          lastTime: 1938240899400,
          isSubscribe: false
        },
        {
          id: "6",
          des: "这是一大段描述6",
          servers: "10万",
          status: "3",
          lastTime: 1638213899400,
          isSubscribe: false
        },
        {
          id: "7",
          des: "这是一大段描述2",
          servers: "10万",
          status: "1",
          lastTime: Date.now(),
          isSubscribe: false
        },
        {
          id: "8",
          des: "这是一大段描述2",
          servers: "10万",
          status: "2",
          lastTime: 1638143099400,
          isSubscribe: false
        },
        {
          id: "9",
          des: "这是一大段描述2",
          servers: "10万",
          status: "1",
          lastTime: Date.now(),
          isSubscribe: false
        },
        {
          id: "10",
          des: "这是一大段描述23",
          servers: "10万",
          status: "3",
          lastTime: 1938240899400,
          isSubscribe: false
        },
        {
          id: "11",
          des: "这是一大段描述2",
          servers: "10万",
          status: "3",
          lastTime: 1638213899400,
          isSubscribe: false
        },
        {
          id: "12",
          des: "这是一大段描述2",
          servers: "10万",
          status: "1",
          lastTime: Date.now(),
          isSubscribe: false
        },
        {
          id: "13",
          des: "这是一大段描述2",
          servers: "10万",
          status: "2",
          lastTime: 1638143099400,
          isSubscribe: false
        },
        {
          id: "14",
          des: "这是一大段描述2",
          servers: "10万",
          status: "1",
          lastTime: Date.now(),
          isSubscribe: false
        },
        {
          id: "15",
          des: "这是一大段描述2",
          servers: "10万",
          status: "3",
          lastTime: 1938240899400,
          isSubscribe: false
        },
        {
          id: "16",
          des: "这是一大段描述2",
          servers: "10万",
          status: "3",
          lastTime: 1638213899400,
          isSubscribe: false
        },
        {
          id: "17",
          des: "这是一大段描述2",
          servers: "10万",
          status: "1",
          lastTime: Date.now(),
          isSubscribe: false
        },
        {
          id: "18",
          des: "这是一大段描述2",
          servers: "10万",
          status: "2",
          lastTime: 1638143099400,
          isSubscribe: false
        },
        {
          id: "19",
          des: "这是一大段描述2",
          servers: "10万",
          status: "1",
          lastTime: Date.now(),
          isSubscribe: false
        },
        {
          id: "20",
          des: "这是一大段描述2",
          servers: "10万",
          status: "3",
          lastTime: 1938240899400,
          isSubscribe: false
        },
        {
          id: "21",
          des: "这是一大段描述2",
          servers: "10万",
          status: "3",
          lastTime: 1638213899400,
          isSubscribe: false
        },
        {
          id: "22",
          des: "这是一大段描述2",
          servers: "10万",
          status: "1",
          lastTime: Date.now(),
          isSubscribe: false
        },
        {
          id: "23",
          des: "这是一大段描述2",
          servers: "10万",
          status: "2",
          lastTime: 1638143099400,
          isSubscribe: false
        },
        {
          id: "24",
          des: "这是一大段描述2",
          servers: "10万",
          status: "1",
          lastTime: Date.now(),
          isSubscribe: false
        },
        {
          id: "25",
          des: "这是一大段描述2",
          servers: "10万",
          status: "3",
          lastTime: 1938240899400,
          isSubscribe: false
        },
        {
          id: "26",
          des: "这是一大段描述2",
          servers: "10万",
          status: "3",
          lastTime: 1638213899400,
          isSubscribe: false
        },
        {
          id: "27",
          des: "这是一大段描述2",
          servers: "10万",
          status: "1",
          lastTime: Date.now(),
          isSubscribe: false
        },
        {
          id: "28",
          des: "这是一大段描述2",
          servers: "10万",
          status: "2",
          lastTime: 1638143099400,
          isSubscribe: false
        },
        {
          id: "29",
          des: "这是一大段描述2",
          servers: "10万",
          status: "1",
          lastTime: Date.now(),
          isSubscribe: false
        },
        {
          id: "30",
          des: "这是一大段描述2",
          servers: "10万",
          status: "3",
          lastTime: 1938240899400,
          isSubscribe: false
        },
        {
          id: "31",
          des: "这是一大段描述2",
          servers: "10万",
          status: "3",
          lastTime: 1638213899400,
          isSubscribe: false
        },

      ],
      //存放此行的数据
      rowData: {},
      rowData2:{},
      str: ''
    }

  },
  methods: {
    //页数改变
    parentPageNumChange(currentPage,pageSize) {
      const currentTotal = Math.ceil(this.total / pageSize); // 当前总的页码
      // 如果当前总的页码大于输入的页码，显示输入的页码； 否则显示当前总的页码
      if(currentPage > currentTotal) {
        this.currentPage = Number(currentTotal);
      } else {
        this.currentPage=currentPage;
      }
      this.pageSize=pageSize;
    },
    reset: function () {
      this.t_id = '';
      this.t_des = '';
      this.tableData = JSON.parse(JSON.stringify(this.tableDataSearch));
    },
    query: function () {
      //filter 过滤
      let newJson = this.tableDataSearch.filter((tableData) => {
        if (tableData.id == this.t_id || (this.t_des && tableData.des.indexOf(this.t_des) !== -1)) {
          return true;
        }
      });
      this.tableData = newJson;
    },
    //时间函数
    dateFormat: function (row) {
      let date = new Date(row.lastTime);
      let year = date.getFullYear();
      let month = date.getMonth() + 1 + "";
      let day = date.getDate() + "";
      let hour = date.getHours() + "";
      let minutes = date.getMinutes() + "";
      let second = date.getSeconds() + "";
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${hour.padStart(2, "0")}:${minutes.padStart(2, "0")}:${second.padStart(2, "0")}`;

    },
    stateValue: function (v) {
      switch (v) {
        case "0":
          return "关闭";
          break;
        case "1":
          return "异常";
          break;
        case "2":
          return "运行中";
          break;
        case "3":
          return "已上线";
          break;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //dialog弹出框
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    openDetailPage(val) {
      this.rowData = val;
      this.dialogVisible = true
    },
    subToAlert(val){
      this.rowData2 = val;
      this.dialog2Visible = true
    },
    subToYes(){
      this.rowData2.isSubscribe=true;
      this.dialog2Visible = false;
    }

  },

  computed: {

  },
  watch:{
 /*   t_des: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.tableData = JSON.parse(JSON.stringify(this.tableDataSearch));
        }
      }
    },
    t_id:{
      handler(newVal,oldVal){
        if(newVal!=oldVal){
          this.tableData = JSON.parse(JSON.stringify(this.tableDataSearch));
        }
      }
    }*/

  },

  beforeCreate() {
  },
  created() {

  },
  beforeMount() {
  },
  //生命周期 已挂载
  mounted() {
    // console.log( "mounted", document.querySelector('.div_top') )
    this.tableDataSearch = JSON.parse(JSON.stringify(this.tableData))
  },
  beforeUpdate() {
  },
  updated() {
  },
  beforeDestroy() {
  },
  destroyed() {
  }

}
</script>
