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
          <a-button style="margin:0 5px 0 50px" type="primary" @click="add">查看</a-button>
          <a-button style="margin:0 5px" type="primary" @click="passRecords">通过</a-button>
          <a-button  style="margin:0 5px" @click="showModal">不通过</a-button>
          <a-modal v-model="refuseVisible" title="不通过原因" @ok="refuseHandleOk" @cancel="refuseHandleCancel">
            <a-textarea v-model="reason" auto-size />
          </a-modal>
          <a-table :row-selection="rowSelection" :columns="columns" :data-source="pane.data" :pagination="false">
            <a slot="id" slot-scope="text, record" @click="addSingle(record)">{{ text }} </a>
            <template v-slot:action>
              <a-button style="margin-right:10px" size="small" type="primary">通过</a-button>
              <a-button size="small" >不通过</a-button>
            </template>
          </a-table>
          <br>
          <a-pagination show-quick-jumper :page-size="1" :total="pageNum" @change="onPageChange" />
        </div>
        <div v-else style="margin:10px 0 10px 15px;">
          <a-descriptions title="Record Info">
          <a-descriptions-item label="Title">
            {{data[pane.key-1].titleName}}
          </a-descriptions-item>
          <a-descriptions-item label="Username">
            {{data[pane.key-1].username}}
          </a-descriptions-item>
          <a-descriptions-item label="Remark">
            empty
          </a-descriptions-item>
          <a-descriptions-item label="Reason">
          {{data[pane.key-1].reason}}
          </a-descriptions-item>
        </a-descriptions>
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
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

// const data = [
//   {
//     key: '1',
//     titleName: 'paper 1',
//     username: "lucy",
//     reason: 'do not understand what you are doing',
//   },
//   {
//     key: '2',
//     titleName: 'paper 2',
//     username: "lucy",
//     reason: 'do not understand what you are doing',
//   },{
//     key: '3',
//     titleName: 'paper 3',
//     username: "lucy",
//     reason: 'do not understand what you are doing',
//   },{
//     key: '4',
//     titleName: 'paper 4',
//     username: "lucy",
//     reason: 'do not understand what you are doing',
//   },
// ];

export default {
  name:"underInspect",
  data() {
    const panes = [
      { title: '待审核', data:[],  key: '0' ,closable: false },
    ];
    return {
      data:[],
      searchType: "id",
      columns,
      activeKey: panes[0].key,
      panes,
      selectedRows:[],
      selectedRowKeys:[],
      page: 1,
      pageNum: 1,
      refuseVisible: false,
      reason: "",
      visible: false,
      confirmLoading: false,
      ModalText: '您的登录信息已过期，请重新登录'
    };
  },
  computed:{
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
    this.getRecords({"page": "1", "forbidden": "2"});
  },
  methods: {
    showModal() {
      this.refuseVisible = true;
    },
    getRecords(p) {
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
        // this.pageNum = res.data.pages;
        let key = 1;
        this.data.forEach((item)=>{
          item.key = key + '';
          key = key + 1;  
          item.ownerId = item.owner.id;
          item.ownerName = item.owner.name;
          item.positionName = item.position.name;
          let time_array = item.time.split("T");
          item.createTime = time_array[0] + " " + time_array[1].split(".")[0];
        })
        this.panes[0].data = this.data;
      }).catch((error) => {
        if (error.response.status == 403) {
          this.visible = true;
        }
      });
    },
    dealRecord(d) {
      this.$axios({
        method: "post",
        url: "api/admin/travels/forbid/",
        params: {},
        headers: {
          Authorization: localStorage.getItem('Authorization')
        },
        data: d,
      }).then((res) => {
        console.log(res);
      }).catch((error) => {
        if (error.response.status == 403) {
          this.visible = true;
        }
      });
    },
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
      let params = {"page": "1", "forbidden": "2"};
      params[this.searchType] = value;
      this.getRecords(params);
    },
    onPageChange(page) {
      this.getRecords({"page": page, "forbidden": "2"});
    },
    passRecords() {
      this.selectedRows.forEach((item)=>{
        this.dealRecord({"id": item.id});
        this.remove(item.key);
      });
      this.getRecords({"page":"1", "forbidden": "2"});
      this.selectedRows = [];
      this.selectedRowKeys = [];
    },
    refuseHandleOk() {
      // console.log(this.reason);
      this.selectedRows.forEach((item)=>{
        this.dealRecord({"id": item.id, "status": "1", "reason": this.reason});
        this.remove(item.key);
      });
      this.getRecords({"page":"1", "forbidden": "2"});
      this.selectedRows = [];
      this.selectedRowKeys = [];
      this.refuseVisible = false;
    },
    refuseHandleCancel() {
      this.refuseVisible = false;
    },
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
      const panes = this.panes;
        let flag = 0;
        let item = record;
        for(let j = 0; j<panes.length;j++){
          if(panes[j].key == item.key){
            console.log("item.key:"+item.key);
            flag = 1;
            break;
          }
        }
        if(flag == 0){
          panes.push({ title: item.titleName, data:item.data, key: item.key });
         
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
          panes.push({ title: item.titleName, data:item.data, key: item.key });
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