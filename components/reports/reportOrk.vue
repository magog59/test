<template>
  <section>
      <div class="row justify-content-center">
         <p style="font-size:24px">Отчет по </p>
      </div>  
      <div class="form-row">
          <div class="col-2"  style="text-align: left;">
              <div style=" font-size: 70%;">Менеджер</div> 
              <select class="select"  v-model="form.user_id" >
                  <option value="0" >Все </option>
                  <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
              </select> 
          </div>
          <div class="col-2">
              <div style=" font-size: 70%;">Дата от</div> 
                  <date-picker v-model="form.dateFrom" :format="'DD.MM.YYYY'" valueType="format" ></date-picker>  
          </div>
           <div class="col-2">
              <div style=" font-size: 70%;">Дата до</div> 
              <date-picker  v-model="form.dateTo" valueType="format" :format="'DD.MM.YYYY '" ></date-picker> 
          </div>
          <div class="col-2 ">
            <button class="btn btn-primary" @click="findData() "   style="margin-top: 20px">Найти</button>
          </div>

          <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
      </div>
      <table class="table table-border table-hover" style="margin-top:30px">
        <tr>
            <th>Название компании</th>
            <th>Специалист ОРК</th>
            <th>Менеджер</th>
            <th>Заявки</th>
            <th>Сумма</th>
            <th>Маржа</th>
            <th>Маржа по платежам</th>
            <th>Долг клиента</th>
            <th>Планируемая дата закрытия</th>
            <th>Этап</th>
            <th>Дата старта</th>

           
        </tr>
        <tbody v-for="model in datalist" :key="model.id">
            <tr >
                  <td><a  target="_blank"  :href="'/clients/show/'+ model.clients_id+''" >{{model.name}}</a></td>
                  <td>{{getManager(model.ork_manager_id).username }}  </td>
                  <td>{{getManager(model.manager_id).username }}  </td>
                  <td>
                    <a href="#">
                        <img  src="../../../static/images/iconsColors/eye.svg"
                              style="max-width:20px"
                              @click="showAppls(model)">
                    </a>{{ model.application_id}}
                </td>
                <td>{{model.total}}</td>
                <td>{{  Number(model.total) - Number(model.our_cost)  }}</td>   
                <td>{{model.marge_by_payment }}</td>
                <td>{{model.debt}}</td>
                <td>{{ inDate(model.close_date) }}</td>
                <td>{{ getStatusOrk(model.state).name }}</td>
                <td>{{inDateTime(model.startdate)}}</td>
              
          </tr>
        </tbody>
         <tr style="text-align: left"  >
              <th>Итого</th>
              <th></th>
              <th></th>
              <th></th>
              <th  style="width: 70px">{{getSumm('total')}}</th>
              <th   style="width: 70px">{{getSumm('total') -getSumm('our_cost') }}</th>
							<th  style="width: 70px">{{getSumm('marge_by_payment')}}</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
          </tr>
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
    name: 'reportOrk',
    data () {
      return {
        form:{
            dateFrom: this.firstDayMonth(new Date()), 
            dateTo: this.inDateTime(new Date()),
            user_id: '', 
            all: '',
            deleted_at: false,
            isactive: 1,
						page: null
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
        datalist: 'reports/reportDept',
        pagination: 'reports/pagination',
        users: 'app/users',
        getType:'dictionary/getType',
        statusOrk:'dictionary/newStatusOrk',
      }),
    },
    methods: {
      ...Vuex.mapMutations({
        setMessage: 'app/setMessage',
        setError: 'app/setError',
        setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
            find: 'reports/findReportOrk',
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
        if(this.form.user_id == null || this.form.user_id == '' ){
          this.setError('Выберите менеджера')
          return
        }

				this.form.page = this.page
        this.find(this.form)
      },
      getClassRow(date){
          if(date != null){
                return [this.convertDate(date) < this.convertDate(new Date()) ? 'red' : '' ]
          }
      },
      showAppls(model){
         this.$router.push('/application/showAppls/'+ model.clients_id + '=' + model.application_id)
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
      getStatusOrk(id){
          var result = {}
          this.statusOrk.map((el) => {
              if (id == el.id) {
                  result = el
              }
          })
          return result
      },
      getSumm(column){
        var summ = 0
          this.datalist.map(elem => {
              summ += +elem[column]
          })
          return summ
      },
    },
    created() {
      this.setHeader('Отчет по ОРК')
      this.page = this.pagination.page
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
