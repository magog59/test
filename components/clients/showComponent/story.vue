<template>
  <section>
      <div class="form-row ">
        <div class="col-8 "></div>
        <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
      </div>
      <table class="table table-border table-hover" style="margin-top:20px">
        <tr  align="left">
            <th>Сообщение</th> 
      </tr>
        <tbody > 
          <tr >
            <td>Ничего не найдено</td> 
          </tr>
        
        </tbody>
      
      </table>
  </section>
</template>

<script>
  import Acl from '../../../utils/acl'
  import Vuex from 'vuex'  
  import pagination from "../../../utils/pagination"

export default {
    mixins: [Acl],
    name: 'story',
    data () {
      return {
        form:{
            task_date: '',
            manager_id: '',
            comment: 'Hoвая',
            status_id: 1,
            description: 'Hoвая'
        },
        search: null,
        page: null,
        edit: null,
        showForm: false
      }
    },
    components: {
      pagination
    },
    computed: {
      ...Vuex.mapGetters({
            apiUrl: 'app/apiUrl',
            datalist: 'task/datalist',
            pagination: 'task/pagination',
            users: 'app/users',
            callsStatus: 'dictionary/callsStatus'
      }),
    },
    methods: {
      ...Vuex.mapMutations({
            setMessage: 'app/setMessage',
            setError: 'app/setError',
            setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
            save: 'task/save',
            find: 'task/find',
            drop: 'task/delete'
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
      findData(){
        this.find({page:this.page, query: this.search})
      },
      getStatus(id){
          var result = {}
          this.callsStatus.map((el) => {
            if(id == el.id){
              result = el
            }
          })
          return result
        },
        toComments(id){
           this.$store.commit('comments/setValComment', {id:id}, {root: true})
        },
     },
    created() {
      this.setHeader('Задачи')
      this.page = this.pagination.page
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }

</style>
