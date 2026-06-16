<template>
  <section>
    <h6 v-if="form.model == 'lead'">Детализация эффективных компаний</h6>
    <h6 v-if="form.model == 'application'">Детализация заявок</h6>
    <h6 v-if="form.model == 'kp'">Детализация коммерческих</h6>
    <h6 v-if="form.model == 'agreement'">Детализация договоров</h6>
    <h6 v-if="form.model == 'agrpay'">Детализация платежей</h6>

    <h6 v-if="form.model != 'lead'" style="font-size: 13px">Выручка: {{ total }} Себестоимость: {{ our_cost }} Маржа :
      {{ Number(total - our_cost) }} Количество :{{ keys != null ? keys.length : 0 }}. Средняя маржа:
      {{ (Number(total - our_cost) / (keys != null ? keys.length : 0)).toFixed(2) }}</h6>
    <h6 v-if="form.model == 'lead' && form.model == 'agrpay'  " style="font-size: 14px">Период с {{ form.dateFromDtl }}
      по {{ form.dateToDtl }} </h6>

    <div class="form-row justify-content-end">
      <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit"
                  :page="pagination.page"></pagination>
    </div>

    <div class="form-row" v-if="form.model == 'agreement'">
      <div class="col-2" style="text-align: start;">
        <p style="margin-bottom: 5px; font-size: 15px;">Дата</p>
        <date-picker v-model="form.dateFromDtl" valueType="format" :format="'DD.MM.YYYY'"
                     @change="findData"></date-picker>
      </div>
      <div class="col-2" style="text-align: start;">
        <p style="margin-bottom: 5px; font-size: 15px;">Дата контакта</p>
        <date-picker v-model="form.dateToDtl" valueType="format" :format="'DD.MM.YYYY'"
                     @change="findData"></date-picker>
      </div>
      <div class="col-2" style="text-align: start;">
        <p style="margin-bottom: 5px; font-size: 15px;">Источинк</p>
        <select class="select" v-model="form.source_id" @change="findData">
          <option value="">Выберите источник</option>
          <option v-for="src in sources" :key="src.id" :value="src.id">{{ src.name }}</option>
        </select>
      </div>
      <div class="col-5"></div>
      <div class="col-1" style="display: flex; flex-direction: column; justify-content: flex-end;">
        <a
            target="_blank"
            class="btn btn-primary upload"
            style="border-radius: 6px;"
            :href="apiUrl + 'agreement/xls?dateFromDtl='+form.dateFromDtl
                        +'&dateToDtl='+ form.dateToDtl
                        +'&userId='+form.user_id
                        +'&source_id='+ form.source_id"
        >CКАЧАТЬ Excel</a>
      </div>
    </div>


    <table class="table table-border table-hover" style="margin-top: 50px">
      <!-- lead -->
      <tr v-if="form.model == 'lead'">
        <th>Дата</th>
        <th>Интерес</th>
        <th>Менеджер</th>
        <th>Организация</th>
        <th>Состояние</th>
        <th>Источник</th>
        <th>Дата контакта</th>
      </tr>
      <!-- application -->
      <tr v-if="form.model == 'application'">
        <th></th>
        <th>№</th>
        <th>Дата контакта</th>
        <th>Менеджер</th>
        <th>Организация</th>
        <th>Рассчитывает</th>
        <th>Документы на руки</th>
        <th>ЛПР</th>
        <th>Др. предложение</th>
        <th>Для чего документ</th>
        <th>Итого</th>
        <th>Маржа</th>
        <th>Источник</th>
      </tr>
      <!-- kp -->
      <tr v-if="form.model == 'kp'">
        <th>#</th>
        <th>Заявка</th>
        <th>Cтатус</th>
        <th>Дата контакта</th>
        <th>Менеджер</th>
        <th>Документы на руки</th>
        <th>ЛПР</th>
        <th>Др. предложение</th>
        <th>Для чего документ</th>
        <th>Организация</th>
        <th>Итого</th>
        <th>Себестоимость</th>
        <th>Маржа</th>
        <th>Источник</th>
      </tr>
      <!-- agreement -->
      <tr v-if="form.model == 'agreement'">
        <th>#</th>
        <th>Cтатус</th>
        <th>Дата</th>
        <th>Дата контакта</th>
        <th>Менеджер</th>
        <th>Документы на руки</th>
        <th>ЛПР</th>
        <th>Др. предложение</th>
        <th>Для чего документ</th>
        <th>Организация</th>
        <th>Итого</th>
        <th>Себестоимость</th>
        <th>Маржа</th>
        <th>Задолженность</th>
        <th>Источник</th>
      </tr>
      <!-- agrpay -->
      <tr v-if="form.model == 'payment'">
        <th>Дата платежа</th>
        <th>Менеджер</th>
        <th>Организация</th>
        <th>Итого</th>
        <th>Маржа</th>
        <th>Источник</th>
      </tr>


      <tbody v-for="model in datalist" :key="model.id">
      <!-- lead -->
      <tr v-if="form.model == 'lead'" :class="getClassRowLead(model)">
        <td>{{ model.startdate }}</td>
        <td>{{ model.interesttype }}</td>
        <td>{{ getManager(model.manager).username }}</td>
        <td><a target="_blank" :href="'/clients/show/'+ model.clients_id+''">{{ model.name }}</a></td>
        <td>{{ getStatusLead(model.state).name }}</td>
        <td>{{ getSources(model.source_id).name }}</td>
        <td>{{ model.contactdate }}</td>
      </tr>
      <!-- application -->
      <tr v-if="form.model == 'application'" :class="getClassRowAppl(model)">
        <td>
          <a href="#">
            <img src="../../../../static/images/iconsColors/eye.svg"
                 style="max-width:20px"
                 @click="showAppls(model)">
          </a>
        </td>
        <td>{{ model.id }}</td>
        <td>{{ inDateTime(model.contactdate) }}</td>
        <td>{{ getManager(model.manager_id).username }}</td>
        <td><a target="_blank" :href="'/clients/show/'+ model.clients_id+''">{{ model.name }}</a></td>
        <td>{{ getManager(model.countmanager_id).username }}</td>
        <td>{{ (model.doc_on_hand) }}</td>
        <td>{{ getLpr(model.is_lpr).name }}</td>
        <td>{{ model.another_offer }}</td>
        <td>{{ (model.doc_for_what) }}</td>
        <td>{{ model.total }}</td>
        <td>{{ Number(model.total) - Number(model.our_cost) }}</td>
        <td>{{ getSources(model.source_id).name }}</td>
        <td>{{ getSummTotal('total') }}</td>
        <td>{{ getSummOurCost('our_cost') }}</td>
        <td>{{ getSummMarge() }}</td>
      </tr>
      <!-- kp -->
      <tr v-if="form.model == 'kp'" :class="getClassRowKp(model)">
        <td>{{ model.id }}</td>
        <td>{{ model.application_id }}</td>
        <td>{{ getStatusKp(model.state).name }}</td>
        <td>{{ inDate(model.contactdate) }}</td>
        <td>{{ getManager(model.manager_id).username }}</td>
        <td>{{ (model.doc_on_hand) }}</td>
        <td>{{ getLpr(model.is_lpr).name }}</td>
        <td>{{ model.another_offer }}</td>
        <td>{{ model.doc_for_what }}</td>

        <td>
          <a target="_blank" :href="'/clients/show/'+ model.clients_id+''"
          >{{ model.name }}

          </a>
        </td>
        <td>{{ model.total }}</td>
        <td>{{ model.our_cost }}</td>
        <td>{{ Number(model.total) - Number(model.our_cost) }}</td>
        <td>{{ getSources(model.source_id).name }}</td>
        <td>{{ getSummTotal('total') }}</td>
        <td>{{ getSummOurCost('our_cost') }}</td>
        <td>{{ getSummMarge() }}</td>
      </tr>
      <!-- agreement -->
      <tr :class="getClassRowAgreem(model)" v-if="form.model == 'agreement'">
        <td>{{ model.numberagree }}</td>
        <td>{{ getStatusAgr(model.state).name }}</td>
        <td>{{ inDate(model.agreedate) }}</td>
        <td>{{ inDate(model.contactdate) }}</td>
        <td>{{ getManager(model.manager_id).username }}</td>
        <td>{{ (model.doc_on_hand) }}</td>
        <td>{{ getLpr(model.is_lpr).name }}</td>
        <td>{{ model.another_offer }}</td>
        <td>{{ model.doc_for_what }}</td>
        <td>
          <a target="_blank" :href="'/clients/show/'+ model.clients_id+''"
             v-if="model.deleted_at == null || model.deleted_at == ''">
            {{ model.name }}
          </a>
        </td>
        <td>{{ model.total }}</td>
        <td>{{ model.our_cost }}</td>
        <td>{{ Number(model.total) - Number(model.our_cost) }}</td>
        <td>{{ model.debt }}</td>
        <td>{{ getSources(model.source_id).name }}</td>
        <td>{{ getSummTotal('total') }}</td>
        <td>{{ getSummOurCost('our_cost') }}</td>
        <td>{{ getSummMarge() }}</td>
      </tr>
      <!-- agrpay -->
      <tr v-if="form.model == 'payment' && form.model == 'agrpay'" :class="getClassRowLead(model)">
        <td>{{ model.payment_date }}</td>
        <td>{{ getManager(model.user_id).username }}</td>
        <td><a target="_blank" :href="'/clients/show/'+ model.clients_id+''">{{ model.name }}</a></td>
        <td>{{ model }}</td>
        <td>{{ Number(model.total) - Number(model.our_cost) }}</td>
        <td>{{ getSources(model.source_id).name }}</td>
      </tr>
      </tbody>
    </table>
  </section>
</template>


<script>
import Acl from '../../../utils/acl'
import Vuex from 'vuex'
import dateFunc from '../../../utils/dateFunc'
import pagination from "../../../utils/pagination.vue"
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/ru'

export default {
  mixins: [Acl, dateFunc],
  name: 'detailFunnel',
  data() {
    return {
      form: {},
      datalist: null,
      search: null,
      page: null,
      edit: null,
      keys: null,
      total: null,
      our_cost: null,
      pagination: {}
    }
  },
  components: {
    pagination,
    DatePicker,
  },
  watch: {
    datalist() {
      if (this.datalist != null) {
        var key = Object.keys(this.datalist)
        this.keys = key
      }
    }
  },
  computed: {
    ...Vuex.mapGetters({
      apiUrl: 'app/apiUrl',
      sources: 'source/datalist',
      users: 'app/users',
      statusLead: 'dictionary/statusLead',
      statusAgreement: 'dictionary/statusAgreement',
      kpStatuses: 'dictionary/kpStatuses',
      is_lpr: 'dictionary/is_LprList',
      arrDocAll: 'document/arrDocAll',
      citys: 'city/datalist',
    }),
  },
  methods: {
    ...Vuex.mapMutations({
      setMessage: 'app/setMessage',
      setError: 'app/setError',
      setHeader: 'app/setCurrentPageHeader'
    }),
    ...Vuex.mapActions({
      save: 'sphere/save',
      drop: 'sphere/delete',
      findSource: 'source/find',
      findUsers: 'app/getUsers',
      findDoc: 'document/findAll',
      findCity: 'city/findAll',
    }),
    setPage(i) {
      this.page = i
      this.findData()
    },
    findData() {
      if (this.form.model == 'agrpay') {
        this.form.model = 'payment'
      }
      this.form.page = this.page
      this.$store.dispatch('' + this.form.model + '/find', this.form)
          .then((resp) => {
            this.datalist = resp.data
            this.pagination.page = resp.pagination.page
            this.pagination.total = resp.pagination.total
            this.pagination.limit = resp.pagination.limit
          })
    },
    getSummTotal(val) {
      var summ = 0
      for (var i = 0; i < this.keys.length; i++) {
        var elem = this.datalist[i] ? this.datalist[i][val] : 0
        if (Number(elem) != null) {
          summ += Number(elem)
        }
      }

      this.total = summ
    },
    getSummMarge() {

    },
    getSummOurCost(val) {
      var summ = 0
      for (var i = 0; i < this.keys.length; i++) {
        var elem = this.datalist[i] ? this.datalist[i][val] : 0
        if (Number(elem) != null) {
          summ += Number(elem)
        }
      }
      this.our_cost = summ
    },
    getSources(id) {
      var result = {}
      this.sources.map((el) => {
        if (id == el.id) {
          result = el
        }
      })
      return result
    },
    getCity(id) {
      var result = {}
      this.citys.map((el) => {
        if (id == el.id) {
          result = el
        }
      })
      return result
    },
    getManager(id) {
      var result = {}
      this.users.map((el) => {
        if (id == el.id) {
          result = el
        }
      })
      return result
    },
    getStatusAgr(id) {
      var result = {}
      this.statusAgreement.map((el) => {
        if (id == el.id) {
          result = el
        }
      })
      return result
    },
    getStatusLead(id) {
      var result = {}
      this.statusLead.map((el) => {
        if (id == el.id) {
          result = el
        }
      })
      return result
    },
    getStatusKp(id) {
      var result = {}
      this.kpStatuses.map((el) => {
        if (id == el.id) {
          result = el
        }
      })
      return result
    },
    getClassRowLead(model) {
      return [model.deleted_at != null ? 'disabled' : '', model.state == 50 ? 'danger' : '', model.state == 60 ? 'success' : '']

    },
    getClassRowAppl(model) {
      return [model.deleted_at != null ? 'disabled' : '', model.state == 20 ? 'danger' : '', model.state == 10 ? 'success' : '']
    },
    getClassRowKp(model) {
      return [model.deleted_at != null ? 'disabled' : '', model.state == 50 ? 'danger' : '', model.state == 40 ? 'success' : '']

    },
    getClassRowAgreem(model) {
      return [model.deleted_at != null ? 'disabled' : '', model.state == 20 ? 'danger' : '', model.state == 10 ? 'success' : '']
    },
    getDocumentName(id) {
      var result = {}
      this.arrDocAll.map((el) => {
        if (id == el.id) {
          result = el
        }
      })
      return result
    },
    getLpr(id) {
      var result = {}
      this.is_lpr.map((el) => {
        if (id == el.id) {
          result = el
        }
      })
      return result
    },
    getParams() {
      var obj = this.$route.params.id
      var arr = obj.split('=')

      this.form.dateFromDtl = arr[0]

      if (arr[5] == 'total') {
        this.form.dateToDtl = arr[4]
      } else {
        this.form.dateToDtl = arr[0]
      }

      this.form.model = arr[1]

      if (arr[2] == 0) {
        this.form.source_id = ''
      } else {
        this.form.source_id = arr[2]
      }
      if (arr[3] != 'undefined') {
        this.form.userId = arr[3]
      }
      this.form.deleted_at = false
    },


  },
  created() {
    this.setHeader('Детализация эффективных компаний')
    this.page = this.pagination.page
    this.findSource()
    this.findDoc()
    this.findCity()
    this.findUsers()
    this.getParams()
    this.findData()
    this.setPage()
  }
}
</script>
<style>
.disabled {
  color: lightgrey;
}
</style>
