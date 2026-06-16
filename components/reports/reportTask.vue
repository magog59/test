<template>
    <section>
				<h4>Отчет по задачам</h4>
				<div class="row " >
					<div class="col">
							<div style=" font-size: 70%;">Дата от</div>
							<date-picker v-model="form.dateFrom" :format="'DD.MM.YYYY'" valueType="format" ></date-picker>
					</div>
					<div class="col">
							<div style=" font-size: 70%;">Дата до</div>
							<date-picker v-model="form.dateTo"  valueType="format" :format="'DD.MM.YYYY'" ></date-picker>
					</div>
					<div class="col" >
							<div style=" font-size: 70%;">Выберите менеджера</div>
							<select  class="select"  v-model="form.userId" style="width: 80px!important;">
								<option  v-for="manager in users" :key="manager.id" :value="manager.id" >{{manager.username}}</option>
							</select>
					</div>
					<div class="col" style="margin-top: 20px;"  >
						<button class="btn btn-primary" @click="findData()"  style="width:120px; margin-right: 10px;border-radius: 20px"  > Получить</button>
					</div>
			</div>

			<!--pagination --->
				<div class="row justify-content-end">
						<div class="col-4 ">
								<pagination @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
						</div>
				</div>
        <table class="table table-border table-hover" style="margin-top:20px" v-if="edit == null">
            <tr align="left">
                <th>Поставлена</th>
                <th>Задача</th>
                <th>Комментарий</th>
                <th>Поставил</th>
                <th>Менеджер</th>
                <th>Состояние</th>
            </tr>
            <tbody v-for="model in datalist" :key="model.id">
            <tr v-if="edit == null || edit.id != model.id" :class="[model.deleted_at != null ? 'disabled' : ''] "
                align="left">
                <td width="140">{{inDateTime(model.task_date)}}</td>
                <td>{{model.description}}</td>
                <td >{{model.comment}}<a href="#" @click="toComments(model)"><i :class="['fas fa-comment']"></i></a></td>
                <td >{{getUser(model.user_id).username}}</td>
                <td>{{getUser(model.manager_id).username}}</td>
                <td>{{getStatus(model.status_id).name}}</td>
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
  import dateFunc from '../../utils/dateFunc'
 

  export default {
    mixins: [Acl, dateFunc],
    name: 'reportTask',
    data() {
      return {
				form: {
					dateFrom: this.firstDayMonth(new Date()),
					dateTo: this.inDateTime(new Date()),
        },
        search: null,
        page: null,
        edit: null,
        showForm: false
      }
    },
    components: {
      pagination,
      DatePicker,
    },
    computed: {
      ...Vuex.mapGetters({
            apiUrl: 'app/apiUrl',
            datalist: 'reports/reportTask',
            pagination: 'reports/pagination',
            users: 'app/users',
            statusTask: 'dictionary/statusTask',
      }),
    },
    methods: {
      ...Vuex.mapMutations({
            setMessage: 'app/setMessage',
            setError: 'app/setError',
            setHeader: 'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
						getReportTask: 'reports/getReportTask',
						findUsers: 'app/getUsers',
      }),
      setPage(i) {
          this.page = i
          this.form.page = this.page
          this.findData(this.form)
      },
      getUser(id) {
          var result = {}
          this.users.map((el) => {
            if (id === el.id) {
              result = el
            }
          })
          return result
      },
      findData() {
          this.getReportTask({
						page: this.page,
						query: this.search,
						dateFrom: this.form.dateFrom,
						dateTo: this.form.dateTo,
						userId: this.form.userId,
					})
      },
      getStatus(id) {
          var result = {}
          this.statusTask.map((el) => {
              if (id === el.id) {
                result = el
              }
          })
          return result
      },
      toComments(model) {
          this.$store.commit('comments/setValComment', { object_id: model.id, type: 70, component: 'task', radom: Math.random().toFixed(2)}, {root: true})
      },
    },
    created() {
      this.setHeader('Отчет по задачам')
      this.findUsers()
      this.page = this.pagination.page
    }
  }
</script>
<style>
    .disabled {
        color: lightgrey;
    }

</style>
