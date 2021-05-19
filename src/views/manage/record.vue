<template>
  <div style="text-align:left;margin:10px 0">
    <a-tabs v-model="activeKey" type="editable-card" @edit="onEdit" hide-add>
      <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
        <div v-if="pane.key === '0'">
          <a-select default-value="id" style="width: 100px; margin:0px 10px 15px 0px" @change="handleChange">
            <a-select-option value="id">
              游记编号
            </a-select-option>
            <a-select-option value="content">
              游记内容
            </a-select-option>
            <a-select-option value="position">
              游记地点
            </a-select-option>
            <a-select-option value="owner">
              用户编号
            </a-select-option>
          </a-select>
          <a-input-search placeholder="请输入搜索文本" style="width: 300px; margin:0 5px 0 2px"  @search="onSearch" />
          <a-button style="margin:0 5px 0 50px; width: 64px; height: 32px" type="primary" @click="add">查看</a-button>
          <!-- <a-button style="margin:0 5px; width: 130px; height: 32px"  type="primary" @click="setRecordsUnderInspect">标记为“待审核”</a-button> -->
          <a-button style="margin:0 5px; width: 64px; height: 32px" @click="deleteRecords">删除</a-button>
          <a-spin :spinning="spinning">
            <a-table :row-selection="rowSelection" :columns="columns" :data-source="pane.data" :pagination="false">
              <a slot="id" slot-scope="text, record" @click="addSingle(record)">{{text}}</a>
            </a-table>
            <br>
            <a-pagination show-quick-jumper :page-size="1" :total="pageNum" @change="onPageChange" />
          </a-spin>
        </div>
        <div v-else style="margin:10px 0 10px 15px;">
          <a-descriptions title="游记信息" bordered style="word-break: break-all;word-wrap: break-word;">
            <a-descriptions-item label="游记标题" :span="3">
              {{data[pane.key-1].title}}
            </a-descriptions-item>
            <a-descriptions-item label="游记编号">
              {{data[pane.key-1].id}}
            </a-descriptions-item>
            <a-descriptions-item label="游记地点">
              {{data[pane.key-1].positionName}}
            </a-descriptions-item>
            <a-descriptions-item label="发布时间">
              {{data[pane.key-1].createTime}}
            </a-descriptions-item>
            <a-descriptions-item label="用户编号">
              {{data[pane.key-1].owner.id}}
            </a-descriptions-item>
            <a-descriptions-item label="用户名称">
              {{data[pane.key-1].owner.name}}
            </a-descriptions-item>
            <a-descriptions-item label="用户昵称">
              {{data[pane.key-1].owner.nickname}}
            </a-descriptions-item>
            <a-descriptions-item label="阅读数">
              {{data[pane.key-1].read_total}}
            </a-descriptions-item>
            <a-descriptions-item label="评论数">
              {{data[pane.key-1].comments.length}}
            </a-descriptions-item>
            <a-descriptions-item label="点赞数">
              {{data[pane.key-1].likes}}
            </a-descriptions-item>
            <a-descriptions-item label="游记内容" :span="3">
              {{data[pane.key-1].content}}
            </a-descriptions-item>
            <a-descriptions-item label="游记封面" :span="3">
              <img :src="data[pane.key-1].coverImage" width="500" alt="">
            </a-descriptions-item>
            <a-descriptions-item label="游记图片" :span="3">
              <div v-for="item in data[pane.key-1].recordImages" :key="item">
                <img :src="item" width="500" alt="">
              </div>
            </a-descriptions-item>
          </a-descriptions>
          <a-descriptions title="游记评论" style="margin-top: 20px"></a-descriptions>
          <div style="margin-bottom: 16px">
            <a-button type="primary" :disabled="!commentHasSelected" @click="deleteComments">
              删除
            </a-button>
            <span style="margin-left: 8px">
              <template v-if="commentHasSelected">
                {{ `已选中 ${commentSelectedRowKeys.length} 条评论` }}
              </template>
            </span>
          </div>
          <a-table
            :row-selection="commentRowSelection"
            :columns="commentColumns"
            :data-source="data[pane.key-1].commentData"
            :pagination="false"
            rowKey="id"
          >
          </a-table>
          <br>
          <a-pagination show-quick-jumper :page-size="1" :total="commentPageNum[activeKey - 1]" @change="onCommentPageChange" />
        </div>
      </a-tab-pane>
    </a-tabs>
    <a-modal
        title="提示"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
      <p>{{ ModalText }}</p>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: '游记编号',
    dataIndex: 'id',
    scopedSlots: { customRender: 'id' },
  },
  {
    title: '游记标题',
    dataIndex: 'title',
  },
  {
    title: '用户编号',
    dataIndex: 'ownerId',
  },
  {
    title: '用户名称',
    dataIndex: 'ownerName',
  },
  {
    title: '游记地点',
    dataIndex: 'positionName',
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
  },
  {
    title: '审核状态',
    dataIndex: 'status',
  },
];

const commentColumns = [
  {
    title: '编号',
    dataIndex: 'commentId',
    width: '150px'
  },
  {
    title: '内容',
    dataIndex: 'content',
    width: '800px'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '80px'
  },
];

export default {
<<<<<<< HEAD
  name:"user",
=======
  name:"record",
>>>>>>> master
  data() {
    const panes = [
      { title: '游记管理', data:[],  key: '0' ,closable: false },
    ];
    return {
      spinning:true,
      data:[],
      searchType: "id",
      columns,
      commentColumns,
      commentSelectedRowKeys: [],
      activeKey: panes[0].key,
      panes,
      selectedRows:[],
      selectedRowKeys:[],
      newTabIndex: 0,
      page: 1,
      pageNum: 1,
      commentPageNum: {},
      visible: false,
      confirmLoading: false,
      ModalText: '您的登录信息已过期，请重新登录',
      commentReplyDict: {},
    };
  },
  computed:{
    commentHasSelected() {
      return this.commentSelectedRowKeys.length > 0;
    },
    commentRowSelection() {
      return {
        onChange: (commentSelectedRowKeys, commentSelectedRows) => {
          console.log(`selectedRowKeys: ${commentSelectedRowKeys}`, 'selectedRows: ', commentSelectedRows);
          this.commentSelectedRows = commentSelectedRows;
          this.commentSelectedRowKeys = commentSelectedRowKeys;
        },
      }
    },
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.selectedRows = selectedRows;
          this.selectedRowKeys = selectedRowKeys;
        },
        getCheckboxProps: record => ({
          props: {
            title: record.id,
          },
        }),
      };
    },
  },
  mounted(){
    this.spinning = true;
    this.getRecords({"page":"1"});
  },
  methods: {
    deleteComments() {

    },
    getRecords(p) {
      console.log(localStorage.getItem('Authorization'))
      this.$axios({
        method: "get",
        url: "api/admin/travels/",
        params: p,
        headers: {
          Authorization: localStorage.getItem('Authorization')
        },
        data: {},
      }).then((res) => {
        this.data = res.data.results;
        this.pageNum = res.data.pages;
        let key = 1;
        this.data.forEach((item) => {
          item.key = key + '';
          key = key + 1;  
          item.ownerId = item.owner.id;
          item.ownerName = item.owner.name;
          item.positionName = item.position.name;
          let time_array = item.time.split("T");
          item.createTime = time_array[0] + " " + time_array[1].split("+")[0].split(".")[0];
          item.positionName = item.position == null ? null : item.position.name;
          if (item.cover != null) {
            item.coverImage = "https://tra-fr-2.zhouyc.cc/api/core/images/" + item.cover + "/data/";
          }
          item.recordImages = []
          item.images.forEach((image) => {
            item.recordImages.push("https://tra-fr-2.zhouyc.cc/api/core/images/" + image + "/data/");
          })
          item.status = "审核通过";
          if (item.forbidden == "1") {
            item.status = "人工审核不通过"
          } else if (item.forbidden == "2") {
            item.status = "机器审核不通过"
          }
          item.commentData = [];
          this.$axios({
            method: "get",
            url: "api/admin/comments/",
            params: {
              "travel": item.id
            },
            headers: {
              Authorization: localStorage.getItem('Authorization')
            },
            data: {},
          }).then((res) => {
            this.commentPageNum[item.key] = res.data.pages;
            let commentList = res.data.results;
            let commentDict = {};
            commentList.forEach((comment) => {
              comment.status = comment.deleted == false ? "保留" : "已删除";
              if (comment.reply == null) {
                comment.commentId = comment.id;
                commentDict[comment.id] = [comment];
              } else {
                if (!(comment.reply in commentDict)) {
                  commentDict[comment.reply] = []
                }
                comment.commentId = comment.id + " 回复 " + comment.reply;
                commentDict[comment.reply].push(comment);
              }
            })
            for (var key in commentDict) {
              console.log(commentDict[key]);
              item.commentData = item.commentData.concat(commentDict[key]);
            }
          }).catch((error) => {
            console.log(error);
          })
        })
        this.panes = [this.panes[0]]
        this.panes[0].data = this.data;
        this.spinning = false;
      }).catch((error) => {
        console.log(error.response.status);
        if (error.response.status == 403) {
          this.visible = true;
        }
      });
    },
    deleteRecord(recordId) {
      this.$axios({
        method: "delete",
        url: "api/admin/travels/" + recordId + "/",
        params: {},
        headers: {
          Authorization: localStorage.getItem('Authorization')
        },
        data: {},
      }).then((res) => {
        console.log(res);
      }).catch((error) => {
        if (error.response.status == 403) {
          this.visible = true;
        }
      });
    },
    // setRecordUnderInspect(recordId) {
    //   this.$axios({
    //     method: "",

    //   })
    // },
    handleOk() {
      this.ModalText = '该对话框将在2秒后关闭';
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
        this.$router.push('/login');
      }, 2000);
    },
    handleCancel() {
      this.visible = false;
    },
    handleChange(value) {
      this.searchType = value;
    },
    onSearch(value){
      let params = {"page":"1"};
      params[this.searchType] = value;
      this.getRecords(params);
    },
    onPageChange(page) {
      this.getRecords({"page": page});
      // 为什么这里没有用
      this.selectedRows = [];
      this.selectedRowKeys = [];
    },
    getComments(p) {
      let commentData = [];
      this.$axios({
        method: "get",
        url: "api/core/travels/" + p["recordId"] + "/comments/",
        params: {"page": p["page"]},
        headers: {
          Authorization: localStorage.getItem('Authorization')
        },
        data: {},
      }).then((res) => {
        this.commentPageNum[this.activeKey - 1] = res.data.pages;
        let commentList = res.data.results;
        let commentDict = {};
        commentList.forEach((comment) => {
          comment.status = comment.deleted == false ? "保留" : "已删除";
          if (comment.reply == null) {
            comment.commentId = comment.id;
            commentDict[comment.id] = [comment];
          } else {
            if (!(comment.reply in commentDict)) {
              commentDict[comment.reply] = []
            }
            comment.commentId = comment.id + " 回复 " + comment.reply;
            commentDict[comment.reply].push(comment);
          }
        })
        for (var key in commentDict) {
          commentData = commentData.concat(commentDict[key]);
        }
        this.panes[this.activeKey - 1].data.commentData = commentData;
      }).catch((error) => {
        console.log(error);
      })
    },
    onCommentPageChange(commentPage) {
      this.getComments({"recordId": this.panes[this.activeKey - 1].data.id, "page": commentPage},)
    },
    deleteRecords() {
      this.selectedRows.forEach((item)=>{
        this.deleteRecord(item.id);
        this.remove(item.key);
      });
      this.getRecords({"page":"1"});
      this.selectedRows = [];
      this.selectedRowKeys = [];
    },
    // setRecordsUnderInspect() {
    //   this.selectedRows.forEach((item)=>{
    //     this.setRecordUnderInspect(item.id);
    //     this.remove(item.key);
    //   });
    //   this.getRecords({"page": "1"});
    //   this.selectedRows = [];
    //   this.selectedRowKeys = [];
    // },
    callback(key) {
      console.log(key);
    },
    onEdit(targetKey, action) {
      this[action](targetKey);
      console.log("targetKey:"+targetKey);
      console.log("action:"+action);
      console.log(this.panes);
    },
    addSingle(record){
      console.log(record);
      const panes = this.panes;
      let flag = 0;
      let item = record;
      console.log(item);
      for(let j = 0; j<panes.length;j++){
        if(panes[j].key == item.key){
          console.log("item.key:"+item.key);
          flag = 1;
          break;
        }
      }
      if(flag == 0){
        panes.push({ title: item.id, data:item.data, key: item.key });
      }
      this.activeKey = item.key;
      this.panes = panes;
    },
    add() {
      const panes = this.panes;
      // const activeKey = `newTab${this.newTabIndex++}`;
      let i = 0;
      this.selectedRows.forEach((item)=>{
        let flag = 0;
        for(let j = 0; j<panes.length;j++){
          if(panes[j].key == item.key){
            console.log("item.key:"+item.key);
            flag = 1;
            break;
          }
        }
        console.log("flag:"+flag);
        if(flag == 0){
          panes.push({ title: item.id, data:item.data, key: item.key });
          i=item.key;
          console.log(i);
          this.activeKey = i;
        }
      })
      this.panes = panes;
    },
    remove(targetKey) {
      let activeKey = this.activeKey;
      let lastIndex;
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const panes = this.panes.filter(pane => pane.key !== targetKey);
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key;
        } else {
          activeKey = panes[0].key;
        }
      }
      this.panes = panes;
      this.activeKey = activeKey;
    },
  },
};
</script>