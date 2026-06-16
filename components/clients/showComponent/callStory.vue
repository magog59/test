<template>
  <section>
      <div class="form-row justify-content-end">
            <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
      </div>
      <table class="table table-border table-hover" style="margin-top:20px">
        <tr  align="left">
            <th>Наш id</th> 
            <th>id zadarma</th>
            <th>Дата</th>
            <th>Откуда</th>
            <th>Куда</th>
            <th>Длительность</th>
            <th>Тип</th>
            <th>Оператор</th>
            <th>Прослушать</th>
        </tr>
        <tbody v-for="model in datalist" :key="model.id"> 
          <tr    :class="getClassRow(model)" >
            <td>{{model.id}}</td>
            <td>{{model.zad_call_id}}</td>
            <td>{{model.callstart}}</td>
            <td>{{model.sip}}</td>
            <td>{{model.destination}}</td>
            <td>{{model.seconds}}</td>
            <td>{{model.incoming==1  ? 'Входящий' : 'Исходящий'}}</td>
            <td>{{getManager(model.user_id).username ?getManager(model.user_id).username : 'Не задано' }}</td>
            <!-- <td><audio :src="' https://api.srcert.ru/calls/' +model.id+'.mp3'"   preload="auto" controls></audio></td> -->
             <td v-if="model.is_recorded" ><audio :src="' https://api.srcert.ru/calls/'+ model.id+'.mp3'"   preload="auto" controls></audio></td>
             <td v-else>Звонок не был записан на АТС</td> 
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
    name: 'callStory',
    props: ['clients_id'],
    data () {
      return {
        page: null,
      }
    },
    components: {
      pagination,
    },
    computed: {
      ...Vuex.mapGetters({
            apiUrl: 'app/apiUrl',
            datalist: 'calls/datalist',
            pagination: 'calls/pagination',
            users: 'app/users',
            storeForm: 'mybuisness/form',
      }),
    },
    methods: {
      ...Vuex.mapMutations({
            setMessage: 'app/setMessage',
            setError: 'app/setError',
            setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
            findCalls: 'calls/find'
      }),
      setPage(i){
        this.page = i
        this.findCalls({clients_id: this.clients_id, page :this.page})
      },
      findData(){
          this.findCalls({clients_id: this.clients_id})
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
      getManager(id){
          var result = {}
          this.users.map((el) => {
          if (id == el.id) {
                result = el
              }
          })
          return result
      },
      getClassRow(model){
          return [model.deleted_at != null ? 'disabled' : '' , model.seconds == 0 ? 'danger' : '', model.incoming == 1 ? 'warning' : '', model.incoming != 1 && model.seconds != 0 ? 'success' : '']
      }
     },
    created() {
      this.setHeader('История звонков')
      this.page = this.pagination.page
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }
  /* .danger {
    color:lightgrey;
  }
  .warning {
    color:lightgrey;
  }
  .success {
    color:lightgrey;
  } */

</style>
