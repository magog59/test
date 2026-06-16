<template>
  <section>{{datalist}}
      <div class="row justify-content-center">
         <p style="font-size:24px">План Факт</p>
      </div>  
      <div class="form-row">
          <div class="col-3">
            От<date-picker  v-model="form.from" valueType="format" ></date-picker>  
          </div>
           <div class="col-3">
            До<date-picker  v-model="form.to" valueType="format" ></date-picker>  
          </div>
          <div class="col-1">
            <button class="btn btn-primary" @click="findData() ">Найти</button>
          </div>
          <div class="col-2"></div>
          <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
    </div>

      <table class="table table-border table-hover" style="margin-top:30px">  
        <tr>
            <th>Показатель</th>
            <th>Неделя</th>
            <th for=""></th>
        </tr>
          <tbody >
            <tr  >
                <td rowspan="4">Исходящие</td>
            </tr>
            <tr  >
                 <td>Эффективные</td>
            </tr>
            <tr>
                <td>Эффективные </td>
            </tr>
        </tbody>
        <tbody v-for="model in datalist" :key="model.id">
            <tr  >
                  <td>{{model.planned_date}}</td>
                  <td>{{model.calls}}</td>
                  <td>{{model.leads}}</td>
                  <td>{{model.applications}}</td>
                  <td>{{model.kps}}</td>
                  <td>{{model.agreements}}</td> 
                  <td>{{model.pays}}</td>
                  <td>{{model.marges}}</td>
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

  export default {
    mixins: [Acl],
    name: 'planfact',
    data () {
      return {
        form:{
          from: '',
          to:''
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
        datalist: 'reports/planfact',
        pagination: 'reports/pagination',
      }),
    },
    methods: {
      ...Vuex.mapMutations({
        setMessage: 'app/setMessage',
        setError: 'app/setError',
        setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
        find: 'reports/findPlanFact',
      }),
      setPage(i){
        this.page = i
        this.findData()
      },
      findData(){
        this.find(this.form)
      }
    },
    created() {
      this.setHeader('План факт')
      this.page = this.pagination.page
      this.findData()
    }
  }
</script>
<style>
  .disabled {
    color:lightgrey;
  }
</style>
