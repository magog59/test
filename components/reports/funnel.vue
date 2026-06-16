<template>
  <section>
        <div class="form-row" style="margin-top: 50px;">
          <div class="col" >
              От<date-picker  v-model="form.from" valueType="format" :format="'DD.MM.YYYY'" ></date-picker> 
          </div>
          <div class="col">
              До<date-picker  v-model="form.to" valueType="format" :format="'DD.MM.YYYY'" ></date-picker>   
          </div>
          <div>
              Год<input type="checkbox" id="checkbox" v-model="form.groupp" style=" transform: scale(1.5); margin-left:10px">
          </div>
          <div class="col">
              <button class="btn btn-primary" @click="findData()" >Найти</button>
          </div>
          <div class="col-2"></div>
      </div>
     
      <table class="table table-border table-hover" style="margin-top:30px;text-align: left;" >

        <tr class="headColor">
            <th>Показатель</th>
            <th  v-for="(day, idx) in repDays" :key="idx">{{day}}</th>
            <th  >ИТОГО</th>
        </tr>
            <compFunnel :name="'Эк'" :keyComp="'lead'"  :form="form" @sendReport="getReport()" />
            <compFunnel :name="'Заявки'" :keyComp="'application'"  :form="form" />
            <compFunnel :name="'Коммерческие'" :keyComp="'kp'"  :form="form" />
            <compFunnel :name="'Договоры'" :keyComp="'agreement'" :form="form" />
            <compFunnel :name="'Выручка'" :keyComp="'agrpay'"  :form="form" />
            <compFunnel :name="'Маржа'" :keyComp="'margin'" :form="form" />
            <compFunnel :name="'Средняя маржа'" :keyComp="'overall'" :form="form" />
            <compFunnel :name="'Процент маржи'" :keyComp="'procentmarge'" :form="form" />

      </table>
    
       <table class="table table-border table-hover" style="margin-top:30px;text-align: left;" >

             <funnelByUser  :form="form" :users="users"  />
          
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
  import compFunnel from '../reports/funnelComp/compFunnel'
  import funnelByUser from '../reports/funnelComp/funnelByUser'
 

  export default {
    mixins: [Acl, dateFunc],
    name: 'funnel',
    data () {
      return {
        form:{
            from:  this.firstDayMonth(new Date()),
            to: this.inDate(new Date())    
        },
        showDetalsLead: false,  
        showDetalsAppl: false,
        showDetalsKp: false,  
        showDetalsAgrem: false,
        showDetalsTax: false, 
        showDetalsMarge: false,
        showDetalsOverMarge: false,
        showDetalsProcentMarge: false,
        repForMarge: [],
        arrTest: []
      }
    },
    components: {
        DatePicker,
        compFunnel,
        funnelByUser,
  
    },
    computed: {
      ...Vuex.mapGetters({
            apiUrl: 'app/apiUrl',
            datalist: 'funnel/datalist',
            source: 'source/datalist',
            pagination: 'plan/pagination',
            users: 'app/users',
            mapSourse: 'dictionary/mapFunnelElem',
      }),
      rep(){
            var obj = Object.assign({}, this.datalist)
            return obj.rep
      },
      funnel(){
            var obj = Object.assign({}, this.datalist)
            return obj.funnel
      },
      repDays(){
            var obj = Object.assign({}, this.datalist)
            return obj.dateArr 
      },
    },
    methods: {
      ...Vuex.mapMutations({
            setMessage: 'app/setMessage',
            setError: 'app/setError',
            setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
            find: 'funnel/find',
            getUsers:'app/getUsers'
      }),
      findData(){
        // window.location.href = '/reports/funnel/'
          var obj = Object.assign({}, this.form)
          this.form = {}
          this.form = obj
      },
      getReport(val){
         this.repForMarge = val
      },
   

    },
    created() {
      this.setHeader('Воронка')
      this.getUsers()
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }
  .headColor{
    background-color:#c5e2ff;  
  }
  .detailColor{
    background-color:#eaf6ff;  
  }   
  .sumColor{
    background-color:#cfe8f5;  
  }

</style>
