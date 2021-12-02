<template>
  <div class="table_ul">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        <!--page-sizes-可选每页的条数  page-size是当前选择的每页条数  ---total总条数-->
      </el-pagination>

<!--    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
    </el-pagination>-->

  </div>
</template>

<script>
export default {
  name: "tableUl",
  props: ["total","currentPage","pageSize"],
  data(){
    return {

    }
  },
  mounted() {

  },
  watch:{
  },
  methods:{
    handleSizeChange(val){
      this.$emit("pageNumchange", this.currentPage,val);
    },
    handleCurrentChange(val) {
      this.$emit("pageNumchange",val,this.pageSize);
    }
  },
  updated() {

   // console.log("更新了")

  }

}
</script>

<style scoped>
.table_ul{
  padding: 5px 20px 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: #fff;
  margin-top: 2px;
}
.none{
  display: none;
}
.table_ul ul li{
  list-style: none;
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  margin: 2px;
}
.table_ul ul li a{
  color: rgba(0,0,0,.85);
}
.table_ul ul li:first-child,.table_ul ul li:last-child{
  width: auto;
}
.table_ul ul li a:hover{
  color:#1890ff;
}
.active{
  box-sizing: border-box;
  border: 1px solid dodgerblue;
  border-radius: 20%;
}
.selector{
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  padding: 2px 2px;
}
.selector span{
  margin-right: 5px;
}
</style>