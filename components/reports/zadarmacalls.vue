<template>
  <section>
      <div class="form-row" style="margin-top:30px">
          <div class="col">
              <div style="font-size:12px">От</div>
               <date-picker v-model="form.from" :format="'DD.MM.YYYY'" valueType="format" ></date-picker> 
          </div>
          <div class="col">
              <div style="font-size:12px">До</div>
              <date-picker v-model="form.to"  valueType="format" :format="'DD.MM.YYYY'" ></date-picker>
          </div>
          <div class="col">
              <div style="font-size:12px">Тип звонка</div>
              <select class="select"  v-model="form.typecold"  @keypress.enter.prevent="this.form.typecold">
                    <option value="">Без типа</option>
                    <option value="0">Холодный</option>
                    <option value="1">Теплый</option>
              </select>
          </div>
          <div class="col">
              <div style="font-size:12px">Тип звонка</div>
              <select class="select"  v-model="form.type" >
                    <option value="">Без типа</option>
                    <option value="1" >Входящий</option>
                    <option value="0" >Исходящий</option>
              </select>
          </div>
          <div class="col">
              <div style="font-size:12px">Менеджер</div>
              <select class="select"  v-model="form.user_id" >
                    <option value="" >Все</option>
                    <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
              </select>
          </div>
          <div  style="margin-top:20px">
              <input type="text" class="form-control" v-model="form.phone" placeholder="Номер телефона"> 
          </div>
          <div class="col">
              <button class="btn btn-primary" @click="findData() " v-if="!showForm">Обновить</button>
          </div>
      </div>
      <div class="form-row justify-content-end" style="margin-top:40px">
            <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
      </div>
      <table class="table table-border table-hover" style="margin-top:30px">
        <tr>
            <th>Наш id</th>
            <th>id zadarma</th>
            <th>Дата</th>
            <th>Откуда</th>
            <th>Куда</th>
            <th>Длительность</th>
            <th>Тип</th>
            <th>Тип</th>
            <th>Оператор</th>
            <th>Клиент</th>
            <th>Прослушать</th>
        </tr>
        <tbody v-for="model in callreport" :key="model.id">
            <tr  :class="getClassRow(model)" >
                  <td >{{model.id}}</td>
                  <td >{{model.zad_call_id}}</td>
                  <td >{{model.callstart}}</td>
                  <td >{{model.sip}}</td>
                  <td >{{model.destination}}</td>
                  <td >{{model.seconds}}</td>
                  <td >{{model.incoming == 0 ? 'Исходящий' : 'Входящий' }}</td> 
                  <td >{{model.is_warm == 1 ? 'Теплый' : 'Холодный' }}</td>
                  <td >{{getManager(model.user_id).username ? getManager(model.user_id).username : "не задано" }}</td>
                  <td ><a href="#" @click="toShow(model.clients_id)">{{model.name}}</a></td>
                  <td v-if="model.is_recorded" ><audio :src="' https://api.srcert.ru/calls/'+ model.id+'.mp3'"   preload="auto" controls></audio></td>
                  <td v-else>Звонок не был записан на АТС</td> 
            </tr>
        </tbody>
      </table>
  </section>
</template>

<script>
  import Acl from '../../utils/acl'
  import Vuex from 'vuex'

  import pagination from "../../utils/pagination"
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'
  import DateFunc from '../../utils/dateFunc'

  export default {
    mixins: [Acl, DateFunc],
    name: 'zadarmacalls',
    data () {
      return {
          form:{
              from: this.firstDayMonth(new Date()), 
              to: this.inDateTime(new Date()),
              user_id: '',
              type: '' ,
              typecold: ''
          },
        search: null,
        page: null,
        edit: null,
        showForm: false
      }
    },
    components: {
      pagination,
      DatePicker
    },
    computed: {
      ...Vuex.mapGetters({
            apiUrl: 'app/apiUrl',
            datalist: 'calls/zadarmacalls',
            users:'app/users',
            user:'auth/user',
            pagination: 'calls/pagination',
      }),
      fromCallreport:{
          get: function () {
                return this.$store.getters['reports/formFromCallreport']
                },
          set: function () {
              // set here
          }
      },
      query(){
         var obj = Object.assign({}, this.datalist)
         return obj.query
      },
      callreport(){
         var obj = Object.assign({}, this.datalist)
         return obj.callreport
      },
    },
    methods: {
      ...Vuex.mapMutations({
        setMessage: 'app/setMessage',
        setError: 'app/setError',
        setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
            findUsers: 'app/getUsers',
            getZadarmacalls: 'calls/getZadarmacalls',  
      }),
      setPage(i){
        this.page = i
        this.findData()
      },
      findData(){
          this.getZadarmacalls({form: this.form,  page:this.page})
      },
      toShow(id){
         this.$router.push('../../clients/show/' + id)
      },
      changeUser(){
        var obj = Object.assign({}, this.user) 
        this.form.user_id = obj.id  
      },
      getManager(id){
        var result = {}
        this.users.map((el) => {
                if(id == el.id){
                    result = el
                }
        })
            return result
      },
      getParams(){
         
          var obj =  this.$route.params.id
          var arr = obj.split('=')
          if(arr[0] == 1){
            return
          }
          this.form.from = arr[0]
          this.form.to = arr[1]

          if(arr[2] != 0){
               this.form.user_id = arr[2]
          }else if(arr[2] == 0 ){
              this.form.user_id == ''
          }
          
          if(arr[3] == 1 ){
              this.form.type = 1
          }else if(arr[3] == 2){
              this.form.type = 0
          }

          if(arr[3] == 'total' ){
              console.log(arr[3])
          }
        
      },
  
      getClassRow(model){
          return [model.deleted_at != null ? 'disabled' : '' , model.seconds == 0 ? 'danger' : '', model.incoming == 1 ? 'warning' : '', model.incoming != 1 && model.seconds != 0 ? 'success' : '']
      },
    },
    created() {
        this.setHeader('Звонки задарма')
        this.page = this.pagination.page
        this.getParams()
        this.findData()  
        this.findUsers()
       
    
    }
  }
</script>
<style>
  .disabled {
      color:lightgrey;
  }
  .warning{
    background-color: #fcf8e3
  }
</style>
