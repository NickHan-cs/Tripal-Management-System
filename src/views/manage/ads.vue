<template>
  <div style="text-align:left;margin:10px 0">
    <a-tabs v-model="activeKey" type="editable-card" @edit="onEdit" hide-add>
      <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
        <div v-if="pane.key === '0'">
          <!-- <a-input-search placeholder="请输入搜索文本" style="width: 300px; margin:0 5px 0 2px"  @search="onSearch" />
          <a-button style="margin:0 5px 0 50px" type="primary" @click="add">查看</a-button> -->
          <a-button style="margin:0 10px 15px 0px" type="primary" @click="add">查看</a-button>
          <a-button  style="margin:0 5px" @click="deleteAds">删除</a-button>
          <a-spin :spinning="spinning">
            <a-table :row-selection="rowSelection" :columns="columns" :data-source="pane.data" :pagination="false">
              <a slot="id" slot-scope="text, record" @click="addSingle(record)">{{ text}}</a>
              <template slot="action" slot-scope="record" >
                <a-button style="margin-right:10px" size="small" type="primary" @click="passSingleAd(record)">上架</a-button>
                <a-button size="small" @click="failSingleAd(record)">下架</a-button>
              </template>
            </a-table>
            <br>
            <a-pagination show-quick-jumper :page-size="1" :total="pageNum" @change="onPageChange" />
          </a-spin>
        </div>
        <div v-else style="margin:10px 0 10px 15px;">
          <a-descriptions title="广告信息">
          <a-descriptions-item label="广告编号" :span="3">
            {{data[pane.key-1].id}}
          </a-descriptions-item>
          <a-descriptions-item label="广告标题" :span="3">
            <div v-if="titleEditable">
              <a-textarea v-model="data[pane.key-1].title" style="width: 700px" auto-size/>
              <a-button style="margin-left: 40px; width: 64px; height: 32px" type="primary" @click="titleSave">保存</a-button>
              <a-button style="margin-left: 20px; width: 64px; height: 32px" @click="titleCancel">取消</a-button>
            </div>
            <div v-else >
              {{ data[pane.key-1].title }}
              <a-icon
                type="edit"
                theme="twoTone"
                style="fontSize: 18px;"
                @click="titleEdit"
              />
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="广告内容" :span="3">
            <div v-if="contentEditable">
              <a-textarea v-model="data[pane.key-1].content" style="width: 700px" auto-size/>
              <a-button style="margin-left: 40px; width: 64px; height: 32px" type="primary" @click="contentSave">保存</a-button>
              <a-button style="margin-left: 20px; width: 64px; height: 32px" @click="contentCancel">取消</a-button>
            </div>
            <div v-else >
              {{ data[pane.key-1].content }}
              <a-icon
                type="edit"
                theme="twoTone"
                style="fontSize: 18px;"
                @click="contentEdit"
              />
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="广告链接" :span="3">
            <div v-if="urlEditable">
              <a-textarea v-model="data[pane.key-1].url" style="width: 700px" auto-size/>
              <a-button style="margin-left: 40px; width: 64px; height: 32px" type="primary" @click="urlSave">保存</a-button>
              <a-button style="margin-left: 20px; width: 64px; height: 32px" @click="urlCancel">取消</a-button>
            </div>
            <div v-else >
              {{ data[pane.key-1].url }}
              <a-icon
                type="edit"
                theme="twoTone"
                style="fontSize: 18px;"
                @click="urlEdit"
              />
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="广告封面" :span="3">
              <img :src="data[pane.key-1].coverImage" width="200" alt="">
              <a-upload
                name="cover"
                :multiple="false"
                @change="coverChange"
                style="margin-left: 30px"
              >
                <a-button> <a-icon type="upload" /> 更换封面 </a-button>
              </a-upload>
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
    title: '广告编号',
    dataIndex: 'id',
    scopedSlots: { customRender: 'id' },
  },
  {
    title: '广告标题',
    dataIndex: 'title',
  },
  {
    title: '广告状态',
    dataIndex: 'status',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];

export default {
  name:"ads",
  data() {
    const panes = [
      { title: '广告管理', data:[],  key: '0' ,closable: false },
    ];
    return {
      spinning:true,
      data:[],
      searchType: "id",
      searchText: "",
      columns,
      activeKey: panes[0].key,
      panes,
      selectedRows:[],
      selectedRowKeys:[],
      newTabIndex: 0,
      page: 1,
      pageNum: 1,
      visible: false,
      confirmLoading: false,
      ModalText: '您的登录信息已过期，请重新登录',
      titleEditable: false,
      contentEditable: false,
      urlEditable: false,
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
    this.spinning = true;
    this.getAds({"page":"1"});
  },
  methods: {
    titleCancel() {
      this.data[this.activeKey-1].title = this.data[this.activeKey-1].preTitle;
      this.titleEditable = false;
    },
    titleSave() {
      this.$axios({
        method: "put",
        url: "/api/admin/ads/" + this.data[this.activeKey-1].id + "/",
        params: {},
        headers: {
          Authorization: localStorage.getItem('Authorization')
        },
        data: {
          "title": this.data[this.activeKey-1].title
        }
      }).then((res) => {
        console.log(res);
      }).catch((error) => {
        if (error.response.status == 403) {
          this.visible = true;
        }
      });
      this.titleEditable = false;
    },
    titleEdit() {
      this.data[this.activeKey-1].preTitle = this.data[this.activeKey-1].title;
      this.titleEditable = true;
    },
    contentCancel() {
      this.data[this.activeKey-1].content = this.data[this.activeKey-1].preContent;
      this.contentEditable = false;
    },
    contentSave() {
      this.$axios({
        method: "put",
        url: "/api/admin/ads/" + this.data[this.activeKey-1].id + "/",
        params: {},
        headers: {
          Authorization: localStorage.getItem('Authorization')
        },
        data: {
          "content": this.data[this.activeKey-1].content
        }
      }).then((res) => {
        console.log(res);
      }).catch((error) => {
        if (error.response.status == 403) {
          this.visible = true;
        }
      });
      this.contentEditable = false;
    },
    contentEdit() {
      this.data[this.activeKey-1].preContent = this.data[this.activeKey-1].content;
      this.contentEditable = true;
    },
    urlCancel() {
      this.data[this.activeKey-1].url = this.data[this.activeKey-1].preUrl;
      this.urlEditable = false;
    },
    urlSave() {
      this.$axios({
        method: "put",
        url: "/api/admin/ads/" + this.data[this.activeKey-1].id + "/",
        params: {},
        headers: {
          Authorization: localStorage.getItem('Authorization')
        },
        data: {
          "url": this.data[this.activeKey-1].url
        }
      }).then((res) => {
        console.log(res);
      }).catch((error) => {
        if (error.response.status == 403) {
          this.visible = true;
        }
      });
      this.urlEditable = false;
    },
    urlEdit() {
      this.data[this.activeKey-1].preUrl = this.data[this.activeKey-1].url;
      this.urlEditable = true;
    },
    getAds(p) {
      // 如果page超过pages了，捕捉404错误码？
      this.$axios({
        method: "get",
        url: "api/admin/ads/",
        params: p,
        headers: {
          Authorization: localStorage.getItem('Authorization')
        },
        data: {},
      }).then((res) => {
        this.data = res.data.results;
        this.pageNum = res.data.pages;
        let key = 1;
        this.data.forEach((item)=>{
          item.key = key + '';
          key = key + 1;
          item.status = item.visible == false ? '未上架' : '已上架';
          item.preTitle = item.title;
          item.preContent = item.content;
          item.preUrl = item.url;
          if (item.cover != null) {
            item.coverImage = "https://tra-fr-2.zhouyc.cc/api/core/images/" + item.cover.id + "/data/";
          }
        })
        this.panes[0].data = this.data;
        this.spinning = false;
      }).catch((error) => {
        if (error.response.status == 403) {
          this.visible = true;
        }
      });
    },
    deleteAd(adId) {
      this.$axios({
        method: "delete",
        url: "api/admin/ads/" + adId + "/",
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
    dealAd(id, d) {
      this.$axios({
        method: "put",
        url: "api/admin/ads/" + id + "/",
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
    passSingleAd(record) {
      this.dealAd(record.id, {"visible": true});
      this.remove(record.key);
      this.getAds({"page": "1"});
      this.selectedRows = [];
      this.selectedRowKeys = [];
    },
    failSingleAd(record) {
      this.dealAd(record.id, {"visible": false});
      this.remove(record.key);
      this.getAds({"page": "1"});
      this.selectedRows = [];
      this.selectedRowKeys = [];
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
      let params = {"page":"1"};
      this.searchText = value;
      params[this.searchType] = this.searchText;
      this.getAds(params);
    },
    onPageChange(page) {
      let params = {"page": page};
      params[this.searchType] = this.searchText;
      this.getAds(params);
    },
    deleteAds() {
      this.selectedRows.forEach((item)=>{
        this.deleteAd(item.id);
        this.remove(item.key);
      });
      this.getAds({"page":"1"});
      this.selectedRows = [];
      this.selectedRowKeys = [];
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