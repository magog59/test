<template>
  <section> 
      <div class="form-row" style="margin-top: 50px;">
          <div class="col" >
              От<date-picker  v-model="form.from" valueType="format" :format="'DD.MM.YYYY'" ></date-picker> 
          </div>
          <div class="col">
              До<date-picker  v-model="form.to" valueType="format" :format="'DD.MM.YYYY'" ></date-picker>   
          </div>
          <!-- <div>
              Год<input type="checkbox" id="checkbox" v-model="form.group" style=" transform: scale(1.5); margin-left:10px">
          </div> -->
          <div class="col">
              <button class="btn btn-primary" @click="findData()" >Найти</button>
          </div>
          <div class="col-2"></div>
      </div>
   
      <table class="table table-border table-hover" style="margin-top:30px">
        <tr>
            <th>Менеджер</th>
            <th>Входящие</th>
            <th>Время входящих(мин\час)</th>
            <th>Среднее время входящих(сек)</th>
            <th>Исходящие</th>
            <th>Время исходящих(мин\час)	</th>
            <th>Среднее время исходящих(сек) </th>  
            <th>Недозвонов</th>
                                   
        </tr>
          <tbody >  
                <tr  v-for="model in report" :key="model.id"> 

                    <td><a  target="_blank" :href="'/reports/zadarmacalls/'+form.from+'='+form.to+'='+ model.user_id+''"  >{{model.name}}</a></td>
       
                    <td><a  target="_blank" :href="'/reports/zadarmacalls/'+form.from+'='+form.to+'='+ model.user_id+'='+ 1 +''"  >{{model.in}}</a></td>
                    <td>{{Math.round(model.intime / 60) +'/'+ Math.round(model.intime / 3600) }}  </td>
                    <td>{{  model.in !=null && model.in != '' ? Math.round(model.intime / model.in , 2) :0 }}</td>
                    <td><a  target="_blank" :href="'/reports/zadarmacalls/'+form.from+'='+form.to+'='+ model.user_id+'='+2+''"  >{{model.out}}</a></td>
                    <td>{{Math.round(model.outtime / 60) +'/'+ Math.round(model.outtime / 3600 )}}  </td>
                    <td>{{  model.out !=null && model.out != '' ? Math.round(model.outtime / model.out , 2) :0 }}</td>  
                    <td>{{model.fail}}</td>
                </tr>
          </tbody> 
          <tbody> 
                <tr>
                    <td>ИТОГО</td>
                    <td><a  target="_blank" :href="'/reports/zadarmacalls/'+form.from+'='+form.to+'='+0+'='+1+''"  >{{getSumm('in') }}</a></td>
                    <td>{{ getSummTimeIn('intime') }}  </td>
                    <td>{{ this.intime == 0 &&  this.varIn == 0  ? 0 : Number(this.intime / this.varIn).toFixed(2) }}</td>
                    <td><a  target="_blank" :href="'/reports/zadarmacalls/'+form.from+'='+form.to+'='+0+'='+ 2 "  >{{getSumm('out') }}</a></td>
                    <td>{{ getSummTimeIn('outtime')  }}  </td>
                    <td>{{ this.outtime == 0 && this.out == 0 ? 0 : Number(this.outtime / this.out).toFixed(2) }}</td>  
                    <td>{{ getSumm('fail') }}</td>
                </tr>
         </tbody>
      </table>
  </section>
</template>

<script>
  import Acl from '../../utils/acl'
  import Vuex from 'vuex'
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'
  import dateFunc from '../../utils/dateFunc'

  export default {
    mixins: [Acl, dateFunc ],
    name: 'callreport',
    data () {
      return {
        form:{
            from:  this.firstDayMonth(new Date()),
            to:  this.inDate(new Date()),
            user_id:'',
            type:'',
            group:'',
        },
        search: null,
        page: null,
        edit: null,
        showForm: false,
        varIn: 0,
        intime: 0,
        out: 0,
        outtime: 0,
        fail: 0,
      }
    },
    components: {
      DatePicker
    },
    computed: {
      ...Vuex.mapGetters({
            apiUrl: 'app/apiUrl',
            datalist: 'calls/report',
            user:'auth/user',
            users:'app/users',
            pagination: 'calls/pagination',
      }),
      report(){
          var obj = Object.assign({}, this.datalist)
          return obj.report
      },
    },
    methods: {
      ...Vuex.mapMutations({
            setMessage: 'app/setMessage',
            setError: 'app/setError',
            setHeader:'app/setCurrentPageHeader',
            formFromCallreport: 'reports/formFromCallreport'
      }),
      ...Vuex.mapActions({
            save: 'calls/save',
            find: 'calls/find',
            getCallreport: 'calls/getCallreport',
            getUsers: 'app/getUsers',
            drop: 'calls/delete'
      }),
      findData(){
          this.getCallreport(this.form)    
      },
      getSumm(val){
          if(this.report == null){
            return 
          }
          var sum = 0
          this.users.map((e) => {
              if(this.report[e.id] != null && this.report[e.id] != 0){
                  sum +=  this.report[e.id][val] 
              }
          })
          val == 'in'? val ='varIn': ''  
          this[val] = sum
          return sum   
      },
      getSummTimeIn(val){
           if(this.report == null){
              return 
          }
          var sum = 0
          var sumMinIn =0
          var sumSecIn =0
          this.users.map(e => {
              if(this.report[e.id] !=null && this.report[e.id] !=0){
                  sum += this.report[e.id][val] 
                  sumMinIn += this.report[e.id][val] / 60
                  sumSecIn += this.report[e.id][val] / 3600
              }
          })
          this[val] = sum
          return  Number(sumMinIn).toFixed(0) +'/'+ Number(sumSecIn).toFixed(0)  
      },
      changeUser(){
        var obj = Object.assign({}, this.user) 
        this.form.user_id = obj.id  
      },
      forUsers(){
        
      },
     
    },
    created() {
      this.setHeader('Звонки общий')
      this.page = this.pagination.page
      this.findData()
      this.getUsers()
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }
</style>
