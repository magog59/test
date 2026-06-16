<template>
    <section>
        <h4>Отчет по закрытым работам</h4>
        <div class="form-row" >
            <div class="col-2">
                <div style=" font-size: 70%;">Дата закрытия от</div>
                <date-picker v-model="form.from" :format="'DD.MM.YYYY'" valueType="format" ></date-picker>    
            </div>
            <div class="col-2">
                <div style=" font-size: 70%;">Дата закрытия до</div>
                <date-picker  v-model="form.to" valueType="format" :format="'DD.MM.YYYY '" ></date-picker>  
            </div>
            <div class="col-2">
                <div style=" font-size: 70%;">Менеджер</div> 
                <select class="select"  v-model="form.manager_id" >
                    <option value="" >Все </option>
                    <option  v-for="user in users" :key="user.id" :value="user.id" >{{ user.username }}</option>
                </select>
            </div>
            <div class="col-2">
                <div style=" font-size: 70%;">Источник</div> 
                <select class="select" v-model="form.source_id">
                    <option value="">Все</option>
                    <option  v-for="sourceL in sources" :key="sourceL.id" :value="sourceL.id" >{{ sourceL.name }}</option>
                </select>
            </div>
            <div class="col-2">
                <div style=" font-size: 70%;">Компания</div>
                <input type="text" class="form-control" v-model="form.name" >
            </div>
						<div class="col-2">
								<div style=" font-size: 70%;">Орган</div>
								<input type="text" class="form-control" v-model="form.organ" >
						</div>
            
       </div>
       <div class="form-row" style="margin-top: 20px">
						<div class="col" style="margin: auto" >
									<button class="btn btn-success"  @click="findData()">Получить</button>
						</div>
            
            <div class="col-2">
                 <a   
                      target="_blank" 
                      class="btn btn-success upload" 
                      style="border-radius: 6px;"  
                      :href="apiUrl + 'funnel/closeworkxlxs?from='+form.from
                                    +'&to='+ form.to
                                    +'&manager_id='+form.manager_id
                                    +'&name='+form.name
                                    +'&organ='+form.organ
                                    +'&source_id='+form.source_id"
                                    

                    >CКАЧАТЬ Excel</a>
            </div>
      </div>
      <div class="form-row justify-content-end" style="margin-top:60px"> 
            <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
      </div>
      
      <table class="table table-border table-hover" >
        <tr>
            <th class="secondColor">ID</th>
            <th class="secondColor">Дата запуска</th>
            <th class="firstColor">Компания</th>
            <th class="secondColor" >Выданный документ</th>
            <th  class="firstColor">Название продукции</th>
            <th class="secondColor">Менеджер ОРК</th>
            <th  class="firstColor">Орган</th>
            <th  class="secondColor">Сумма</th>
            <th  class="firstColor">Маржа</th>
            <th  class="secondColor">Менеджер договора</th>
            <th  class="firstColor">Дата закрытия</th>
            <th  class="secondColor">Источник</th>
            <th  class="secondColor">Комментарий</th>
            <th  class="firstColor"></th>
        </tr>
        <tbody v-for="model in closeWork" :key="model.idx">
            <tr  :class="[model.deleted_at != null ? 'disabled' : '']">
                  <td class="thirdColor" >{{ model.id }}</td>
                  <td class="thirdColor" >{{inDate(model.startdate)}}</td>
                  <td>
                        <a   target="_blank" :href="'/clients/show/'+ model.clients_id+''" >{{model.name}}</a>
                  </td>
                  <td class="firstColor">{{getDocumentName( model.document_id).name}}</td>
                  <td class="thirdColor">{{model.prod_name}}</td>
                  <td class="firstColor">{{getManager(model.manager_id).username}}</td>
                  <td class="thirdColor">{{model.act_organ}}</td>
                  <td class="firstColor">{{model.total}}</td>
                  <td class="thirdColor">{{model.total - getOurCost(model) }}</td>
                  <td class="firstColor">{{getManager(model.a_man).username}}</td>
									<td class="thirdColor" v-show="!showCalendar && edit !== null || edit.item_id !== model.item_id">{{inDate(model.close_date)}} </td>

                  <td class="thirdColor" v-if="showCalendar" v-show="edit !== null && edit.item_id === model.item_id">
										<div class="col" style="text-align: left;" >
											<date-picker v-model="edit.close_date" valueType="format" :format="'YYYY-MM-DD'"  placeholder="Дата"></date-picker>
										</div>
									</td>
                  <td class="firstColor" style="text-align: center;">{{ getSourceNameById(model.source_id) }}</td>
                  <td class="thirdColor">{{model.comment}}</td>
							<td>
								<a
										href="#"
										@click="showCalendar = !showCalendar; toChange(model)">
									<img    src="../../../static/images/iconsColors/edit.png" title="Редактировать" style="max-width:20px; margin-left:7px">
								</a>
								<p></p>
								<a
										v-if="showCalendar"
										href="#"
										@click="updateDate()">
									<img    src="../../../static/images/iconsColors/save.svg" title="Сохранить" style="max-width:20px; margin-left:7px;">
								</a>
							</td>
                </tr>
        </tbody>

				<tr style="text-align: left">
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th style="font-size: 15px">ИТОГО</th>
					<th></th>
					<th style="font-size: 15px">{{getSumm('total')}}</th>
					<th style="font-size: 15px">{{getMarge('total') - getMargeOurCost() }}</th>
<!--					<th style="font-size: 15px">{{ getMarge() }}</th>-->
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
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css'
  import 'vue2-datepicker/locale/ru'
  import pagination from "../../utils/pagination"
   import DateFunc from '../../utils/dateFunc'

	export default {
    mixins: [Acl, DateFunc],
    name: 'closeWork',
    data () {
      return {
        form:{
            from: this.firstDayMonth(new Date()), 
            to: this.inDateTime(new Date()),
            manager_id: '',
            name :  '',
            product :  '',
            agreenum :  '',
            actnum :  '',
            sertnum:  '',
            organ:'',
            source_id: '',
        },
        search: null,
        page: null,
        edit: { item_id : 0},
        showForm: false,
				showCalendar: false
      }
    },
    components: {
      DatePicker,
      pagination 
    },
		watch:{
		},
    computed: {
      ...Vuex.mapGetters({
            apiUrl: 'app/apiUrl',
            pagination: 'reports/pagination',
            users: 'app/users',
            documents: 'document/arrDocAll',
						closeWork: 'reports/closeWork',
            yesNoList: 'dictionary/yesNoList',
						constStatusOrk:'dictionary/constStatusOrk',
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
            find: 'reports/findCloseWorkOrk',
            findUsers:'app/getUsers',
            findAllDocument: 'document/findAll',
						saveOrk: 'ork/save',
            getSource: 'source/find',
      }),
      setPage(i){
        this.page = i
        this.form.page = i
        this.findData()
      },
      findData(){
        this.find(this.form)
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
      NoList(id){
        var result = {}
        this.yesNoList.map((el) => {
           if(id === el.id){
             result = el
           }
        })
        return result     
      },
      getDocumentName(id){
            var result = {}
            this.documents.map((el) => {
                  if(id === el.id){
                        result = el
                  }
            })
            return result
      },
			getSumm(column){
				var summ = 0

				if (this.closeWork.length === undefined){
					return
				}

				this.closeWork.map(elem => {
					summ += +elem[column]
				})

				return summ
			},
			getMarge(column){
				var summ = 0

				if (this.closeWork.length === undefined){
					return
				}

				this.closeWork.map(elem => {
						summ += +elem[column]
				})

				return summ
			},
			getMargeOurCost(){
				var summ = 0
				var val = 0

				if (this.closeWork.length === undefined){
					return
				}

				this.closeWork.map(elem => {
					val = elem['our_cost_fact']
					if (val == null) {
						val = elem['our_cost']
					}

					summ += +val
				})

				return summ
			},
			getOurCost(model){
				if (model.our_cost_fact == null){
					return model.our_cost
				}

				return model.our_cost_fact
			},
			getStatusOrk(id){
				var result = {}
				this.statusOrk.map((el) => {
					if (id === el.id) {
						result = el
					}
				})
				return result
			},
			updateDate(){
							this.saveOrk(this.edit)
									.then(() =>{
											this.find(this.form)
									})
							this.showCalendar = false
			},
			toChange(model){
					this.edit = Object.assign({}, model)
			},
      getSourceNameById(id) {
        let name = ''
        this.sources.map((element) => {
          if (element.id == id) {
            name = element.name
          }
        })
        return name
      },
    },
    mounted() {
      this.getSource()
    },
    created() {
      this.setHeader('Отчет по закрытым работам')
      this.page = this.pagination.page
      this.findAllDocument()
      this.findData()
      this.findUsers()
    }
  }
</script>
<style scope>
  .firstColor{
      background-color:#d9d9fd    
  }
  .secondColor{
      background-color:#bfbebe
  }
  .thirdColor{
      background-color:#e8e8f7
  }
</style>

