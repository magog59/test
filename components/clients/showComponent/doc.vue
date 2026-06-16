<template>
  <section>
      <div class="form-row ">
        <div class="col-8 "></div>
        <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
      </div>
      <table class="table table-border table-hover" style="margin-top:20px">
        <tr  align="left">
            <th>Номер договора</th> 
            <th>Выданный документ</th>
            <th>Название продукции</th>
            <th>Менеджер орк</th>
            <th>Выдан</th>
            <th>Действует до</th>
            <th>	Месяц/год оконания</th>
            <th>	Орган</th>
            <th>	№ сертификата</th>
            <th>Менеджер договора</th>
        </tr>
        <tbody v-for="model in datalist" :key="model.idx"> 
          <tr  v-if="edit == null || edit.id != model.id"  :class="getClassRow(model)" >
              <td>{{(model.numberagree)}}</td>
              <td>{{getDocumentName(model.document_id).name}}</td>  
              <td>{{model.prod_name}}</td>
              <td>{{getUser(model.manager_id).username}}</td>
              <td>{{inDate(model.get_date)}}</td>
              <td>{{inDate(model.license_to)}}</td>
              <td>{{inDateMounthYear(model.license_to)}}</td>
              <td>{{model.act_organ}}</td>
              <td>{{model.sert_num}}</td>
              <td>{{getUser(model.a_man).username}}</td>
          </tr>
        </tbody>
      </table>
  </section>
</template>

<script>
  import Acl from '../../../utils/acl'
  import Vuex from 'vuex'    
  import pagination from "../../../utils/pagination"
  import dateFunc from '../../../utils/dateFunc'
  
  export default {
    mixins: [Acl,dateFunc],
    name: 'dok',
    props:['clients_id'],
    data () {
      return {
        form:{
        },
        search: null,
        page: null,
        edit: null,
        showForm: false,
        datalists: '',
        count: null,
      } 
    },
    components: {
      pagination,
    },
    computed: {
      ...Vuex.mapGetters({
            apiUrl: 'app/apiUrl',  
            datalist: 'document/datalist',
            arrDocAll: 'document/arrDocAll',
            pagination: 'document/pagination',
            users: 'app/users',
      }),
    },
    methods: {
      ...Vuex.mapMutations({
            setMessage: 'app/setMessage',
            setError: 'app/setError',
            setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
          save: 'document/save',
          find: 'document/findDocItem',
          findAll: 'document/findAll',
          drop: 'document/delete',
          findUser: 'app/getUsers'
      }),
      saveData(){
        this.setError(null)
        this.save(this.form)
                .then(() =>{
                  this.findData()
                })
      },
      update() {
        this.setError(null)
        this.save(this.edit)
                .then(() =>{
                  this.edit = null
                  this.findData()
                })
      },
      deleteData(id){
        this.setError(null)
        this.drop(id)
                .then(() =>{
                  this.findData()
                })
      },
      toChange(model){
        this.edit = Object.assign({}, model)
      },
      setPage(i){
        this.page = i
        this.findData()
      },
      getUser(id){
          var result = {}
            this.users.map((el) => {
            if (id == el.id) {
                  result = el
                }
            })
            return result
      },
      getDocumentName(id){
          var res = {}
          this.arrDocAll.map((el) => {
            if(id == el.id){
                res = el
            }
          })
          return res
      },
      findData(){
        this.find({ clients_id: this.clients_id, page: this.page  })
      },
      toComments(id){
           this.$store.commit('comments/setValComment', {id:id}, {root: true})
      },
      getClassRow(model){
          return [model.deleted_at != null ? 'disabled' : '' , new Date(model.license_to) < new Date() ? 'danger' : 'success']
      }
     },
    created() {
        this.setHeader('Документ')
        this.page = this.pagination.page
        this.findData()
        this.findAll()
        this.findUser()
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }

</style>
