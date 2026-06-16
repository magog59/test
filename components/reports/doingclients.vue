<template>
  <section>
				<div class="row justify-content-center">
						<p style="font-size:24px">Отчет по действующим</p>
				</div>
<!--				<div class="form-row justify-content-end">-->
<!--					<div class="col-4"></div>-->
<!--					<pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>-->
<!--				</div>-->
				<div class="form-row">
          <div class="col-2"  style="text-align: left;">
              <div style=" font-size: 70%;">Менеджер</div> 
              <select class="select"  v-model="form.user_id">
									<option value="" >Все</option>
                  <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
              </select> 
          </div>
          <div class="col-2"  style="text-align: left;">
              <div style=" font-size: 70%;">ИНН</div>
							<input class="form-control" @keyup="findData()" @change="findData()"  v-model="form.inn" type="text">
          </div>
          <div class="col-2">
              <div style=" font-size: 70%;">Дата от</div> 
                  <date-picker v-model="form.from" :format="'DD.MM.YYYY'" valueType="format" ></date-picker>  
          </div>
           <div class="col-2">
              <div style=" font-size: 70%;">Дата до</div> 
              <date-picker  v-model="form.to" valueType="format" :format="'DD.MM.YYYY'" ></date-picker>
          </div>
          <div class="col-2" style="text-align: left;">
              <div style=" font-size: 70%;">Источник</div> 
              <select class="select" v-model="form.source_id">
									<option value="" >Все</option>
                  <option  v-for="status in sources" :key="status.id" :value="status.id" >{{status.name}}</option>
              </select> 
          </div>
          <div class="col-1">
            <button class="btn btn-primary"  @click="findData()"   style="margin-top: 20px;border-radius: 6px;">Найти</button>
          </div>
					<div class="col-1">
						<a
								target="_blank"
								class="btn btn-primary upload"
								style="border-radius: 6px;"
								:href="apiUrl + 'reports/doclientsxsls?from='+form.from
                                    +'&to='+ form.to
                                    +'&manager_id='+form.user_id
                                    +'&inn='+form.inn
                                    +'&source_id='+ form.source_id"
						>CКАЧАТЬ Excel</a>
					</div>
     </div>
      <table class="table table-border table-hover" style="margin-top:30px">
        <tr>
            <th>Название </th>
            <th>ИНН</th>
            <th>Менеджер</th>
            <th>Сфера деятельности</th>
            <th>Выбранный период</th>
            <th>Сумма маржи за период </th>
            <th>Количество оформленных документов </th>
            <th>Количество сделок за период </th>
            <th>Количество заявок за период </th>
            <th>% заявок в оплату</th>
            <th>Дата первой работы в ОРК</th>
           
        </tr>
        <tbody v-for="model in datalist" :key="model.id">
            <tr >
									<td>
												<a   target="_blank" :href="'/clients/show/'+ model.clients_id+''" >{{model.client_name}}</a>
									</td>
                  <td>{{model.inn}}</td>
									<td>{{getManager(model.client_manager).username}}</td>
									<td>{{model.spherename}}</td>
									<td>{{form.from}}--{{cutForm(form.to)}}</td>
									<td>{{model.total - model.our_cost}}</td>
									<td>{{model.doc_count}}</td>
									<td>{{model.ork_count}}</td>
									<td>{{model.app_count}}</td>
									<td>{{model.ork_app_percent}}</td>
									<td></td>
            </tr>
        </tbody>
						<tr style="text-align: left">
								<th>Итого </th>
								<th></th>
								<th></th>
								<th></th>
								<th></th>
								<th style="width: 70px">{{ getMarge('total') - getMarge('our_cost') }}</th>
								<th></th>
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
  // import pagination from "../../utils/pagination"
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
            user_id: "",
            type_id: '',
						inn: '',
            source_id: '',
        },
        search: null,
        page: null,
        edit: null,
      }
    },
    components: {
      // pagination,
      DatePicker
    },
    computed: {
      ...Vuex.mapGetters({
        apiUrl: 'app/apiUrl',
        datalist: 'reports/doingclient',
        pagination: 'reports/pagination',
        users: 'app/users',
        getType:'dictionary/getType',
				spheres: 'sphere/datalist',
        sources: 'source/datalist',
      }),
    },
    methods: {
      ...Vuex.mapMutations({
        setMessage: 'app/setMessage',
        setError: 'app/setError',
        setHeader:'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
						findDoingclients: 'reports/findDoingclients',
						findDoingclientsXlsl: 'reports/findDoingclientsXlsl',
            findUsers: 'app/getUsers',
						findSphere: 'sphere/find',
            findSource: 'source/find',
      }),
      toChange(model){
        this.edit = Object.assign({}, model)
      },
      setPage(i){
        this.page = i
				this.form.page =  this.page
        this.findData()
      },
      findData(){
        this.findDoingclients(this.form)
				.then(() =>{
						this.form.xlsx = null
				})
				.catch(() =>{
						this.form.xlsx = null
				})
      },
      getClassRow(date){
          if(date != null){
                return [this.convertDate(date) < this.convertDate(new Date()) ? 'red' : '' ]
          }
      },
			cutForm(str){
				var arr = str.split(' ')
				return arr[0]
			},
			getManager(id){
					var result = {}
							this.users.map((el) => {
								if(id === el.id){
							result = el
						}
					})
				return result
			},
			getSpheres(id){
			var result = {}
					this.spheres.map((el) => {
							if (id == el.id) {
									result = el
									}
							})
					return result
				},
				getMarge(column){
					var summ = 0
					this.datalist.map(elem => {
							console.log(elem)
							summ += +elem[column]
					})
				
					return summ
				},
      },
    created() {
      this.setHeader('Отчет по действующим')
      this.page = this.pagination.page
      this.findData()
      this.findUsers()
			this.findSphere()
      this.findSource()
    }
  }
</script>
