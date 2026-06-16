<template>
  <section>
    <div class="row">
      <div class="col-2">
        <button class="btn btn-primary" @click="showForm = !showForm " v-if="edit == null">Добавить задачу</button>
      </div>
      <div class="col-10">
        <div class="row" v-if="showForm">
          <div class="col">
            <input type="text" class="form-control" v-model="form.description" placeholder="Описание задачи"/>
          </div>
          <div class="col">
            <select class="select" v-model="form.manager_id">
              <option value="0">Менеджер</option>
              <option v-for="(user, id) in users" :key="id" v-bind:value="user.id">{{ user.username }}</option>
            </select>
          </div>
          <div class="col" style="text-align: left;">
            <date-picker v-model="form.task_date" valueType="format" :format="'DD.MM.YYYY mm:ss'"
                         placeholder="Дата"></date-picker>
          </div>
          <div class="col">
            <button class="btn btn-success " @click="saveData()">Сохранить</button>
          </div>
          <div class="col">
            <button class="btn btn-warning" @click="form = {};showForm=false ">Отменить</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-end" v-if="edit == null">
      <div class="col-4 ">
        <pagination @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit"
                    :page="pagination.page"></pagination>
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
        <th></th>
        <th></th>
      </tr>
      <tbody v-for="model in datalist" :key="model.id">
      <tr v-if="edit == null || edit.id !== model.id" :class="[model.deleted_at != null ? 'disabled' : ''] "
          align="left">
        <td>{{ inDateTime(model.task_date) }}</td>
        <td>{{ model.description }}</td>
        <td>{{ model.comment }}<a href="#" @click="toComments(model)"><i
            :class="[model.deleted_at != null ? '' : 'fas fa-comment']"></i></a></td>
        <td>{{ getUser(model.user_id).username }}</td>
        <td>{{ getUser(model.manager_id).username }}</td>
        <td>{{ getStatus(model.status_id).name }}</td>
        <td><a href="#" v-if="model.deleted_at == null || model.deleted_at === ''" @click="toChange(model)"><img
            src="../../../static/images/iconsColors/edit.png" title="Редактировать" style="max-width:20px"></a>
        </td>
        <td width="60px;">
          <a href="#">
            <vue-confirmation-button
                v-if="model.deleted_at == null || model.deleted_at === ''"
                :css="'fui-trash'"
                v-on:confirmation-success="deleteData(model.id)" title="Удалить">
            </vue-confirmation-button>
          </a>
        </td>
      </tr>
      </tbody>
    </table>
    <!----Редактировать задачу---->
    <div class="row justify-content-center" style="margin-top: 30px" v-if="edit != null">
      <h4>Редактировать задачу</h4>
    </div>
    <div class="row justify-content-center" v-if="edit != null">
      <div class="row container">
        <!---1part---->
        <div class="col-4 offset-4">
          <div class="row" style="margin-top: 30px">
            <div style="font-size: 70%; margin-right: 70%;">Дата контакта</div>
            <date-picker v-model="edit.task_date" :format="'DD.MM.YYYY mm:ss'" valueType="format"></date-picker>
          </div>
          <div class="row" style="margin-top: 30px">
            <div style="font-size: 70%; margin-right: 70%;">Менеджер</div>
            <select class="select" v-model="edit.manager_id">
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.username }}</option>
            </select>
          </div>
          <div class="row" style="margin-top: 30px">
            <div style="font-size: 70%; margin-right: 70%;">Статус</div>
            <select class="select" v-model="edit.status_id">
              <option v-for="status in statusTask" :key="status.id" :value="status.id">{{ status.name }}</option>
            </select>
          </div>
          <div class="row" style="margin-top: 30px">
            <div style="font-size: 70%; margin-right: 70%;">Описание</div>
            <textarea class="form-control" v-model="edit.description" placeholder="Для чего документ"
                      style="height: 100px;"></textarea>
          </div>
          <div class="col-3" style="margin-top: 30px">
            <button class="btn btn-success" @click="update">Сохранить</button>
          </div>
        </div>
        <div class="col-1">
          <button type="button" class="close" @click="edit = null" aria-hidden="true">×</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Acl from '../../utils/acl'
import Vuex from 'vuex'
import vueConfirmationButton from '../../utils/confirmButton'
import pagination from "../../utils/pagination"
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/ru'
import dateFunc from '../../utils/dateFunc'


export default {
  mixins: [Acl, dateFunc],
  name: 'task',
  data() {
    return {
      form: {
        task_date: this.inDateTime(new Date()),
        manager_id: '',
        description: 'Hoвая'
      },
      search: null,
      page: null,
      edit: null,
      showForm: false
    }
  },
  watch: {
    edit() {
      if (this.edit !== null) {
        this.edit.task_date = this.inDateTime(new Date())
      }
    },
    form() {
      if (this.form != null) {
        this.form.task_date = this.inDateTime(new Date())
      }
    }
  },
  components: {
    VueConfirmationButton: vueConfirmationButton,
    pagination,
    DatePicker,
  },
  computed: {
    ...Vuex.mapGetters({
      apiUrl: 'app/apiUrl',
      datalist: 'task/datalist',
      pagination: 'task/pagination',
      storeForm: 'mybuisness/form',
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
      save: 'task/save',
      find: 'task/find',
      drop: 'task/delete',
      findUsers: 'app/getUsers',
    }),
    saveData() {
      if (this.form.manager_id === '') {
        this.setError("Выберите менеджера")
        return
      }

      this.setError(null)
      this.save(this.form)
          .then(() => {
            this.find(this.storeForm)
            this.showForm = false
            this.form = {}
          })
    },
    update() {
      this.setError(null)
      this.save(this.edit)
          .then(() => {
            this.edit = null
            this.find(this.storeForm)
          })
    },
    deleteData(id) {
      this.setError(null)
      this.drop(id)
          .then(() => {
            this.find(this.storeForm)
          })
    },
    toChange(model) {
      this.edit = Object.assign({}, model)
    },
    setPage(i) {
      this.page = i
      this.storeForm.page = this.page
      this.find(this.storeForm)
    },
    getUser(id) {
      var result = {}
      this.users.map((el) => {
        if (id == el.id) {
          result = el
        }
      })
      return result
    },
    findData() {
      this.find({page: this.page, query: this.search})
    },
    getStatus(id) {
      var result = {}
      this.statusTask.map((el) => {
        if (id == el.id) {
          result = el
        }
      })
      return result
    },
    toComments(model) {
      this.$store.commit('comments/setValComment', {
        object_id: model.id,
        type: 70,
        component: 'task',
        radom: Math.random().toFixed(2)
      }, {root: true})
    },
  },
  created() {
    this.setHeader('Задачи')
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
