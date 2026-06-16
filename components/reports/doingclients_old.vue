<template>
  <section>
      <div class="row justify-content-center">
         <p style="font-size:24px">Отчет по действующим</p>
      </div>  
      <div class="form-row">
          <div class="col-2"  style="text-align: left;">
              <div style=" font-size: 70%;">Менеджер</div> 
              <select class="select"  v-model="form.user_id" >
                  <!-- <option value="" >Все </option> -->
                  <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
              </select> 
          </div>
          <div class="col-2"  style="text-align: left;">
              <div style=" font-size: 70%;">Тип</div> 
              <select class="select"  v-model="form.type_id" >
                    <option value="" >Все </option>
                    <option  v-for="type in getType" :key="type.id" :value="type.id" >{{type.name}}</option>
              </select> 
          </div>
          <div class="col-2">
              <div style=" font-size: 70%;">Дата от</div> 
                  <date-picker v-model="form.from" :format="'DD.MM.YYYY'" valueType="format" ></date-picker>  
          </div>
           <div class="col-2">
              <div style=" font-size: 70%;">Дата до</div> 
              <date-picker  v-model="form.to" valueType="format" :format="'DD.MM.YYYY '" ></date-picker> 
          </div>
           <div class="col-1"></div>
          <div class="col-2 ">
            <button class="btn btn-primary" @click="findData() "   style="margin-top: 20px">Найти</button>
          </div>
         
          <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
      </div>
      <table class="table table-border table-hover" style="margin-top:30px">
        <tr>
            <th>Название </th>
            <th>Звонок</th>
            <th>ЭК</th>
            <th>Заявки</th>
            <th>КП</th>
            <th>Договор</th>
            <th>ОРК</th>
           
        </tr>
        <tbody v-for="model in datalist" :key="model.id">
            <tr >
                  <td>{{model.name}}</td>
                  <td  :class="getClassRow(model.call_date)" >{{inDateTime(model.call_date)}}</td>
                  <td  :class="getClassRow(model.lead_date)"  >{{inDateTime(model.lead_date)}}</td>
                  <td  :class="getClassRow(model.application_date)"  >{{inDateTime(model.application_date)}}</td>
                  <td  :class="getClassRow(model.kp_date)" >{{inDateTime(model.kp_date)}}</td>
                  <td  :class="getClassRow(model.agreement_date)" >{{inDateTime(model.agreement_date)}}</td>   
                  <td  :class="getClassRow(model.ork_date)" >{{inDateTime(model.ork_date)}}</td>
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
    name: 'doingclients',
    data () {
      return {
        form:{
            from: this.firstDayMonth(new Date()), 
            to: this.inDateTime(new Date()),
            user_id: '', 
            type_id: '',
        },
        search: null,
        page: null,
        edit: null,
      }
    },
    components: {
      pagination,
      DatePicker
    },
    computed: {
      ...Vuex.mapGetters({
        apiUrl: 'app/apiUrl',
        datalist: 'reports/doingclient',
        pagination: 'reports/pagination',
        users: 'app/users',
        getType:'dictionary/getType'
      }),
    },
    methods: {
      ...Vuex.mapMutations({
        setMessage: 'app/setMessage',
        setError: 'app/setError',
        setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
            find: 'reports/findDoingclients',
            findUsers: 'app/getUsers'
      }),
   
      toChange(model){
        this.edit = Object.assign({}, model)
      },
      setPage(i){
        this.page = i
        this.findData()
      },
      findData(){
        this.find(this.form)
      },
      getClassRow(date){
          if(date != null){
                return [this.convertDate(date) < this.convertDate(new Date()) ? 'red' : '' ]
          }
      }
    },
    created() {
      this.setHeader('Отчет по действующим')
      this.page = this.pagination.page
      this.findData()
      this.findUsers()
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }
  .red{
     color:hotpink
  }
</style>
