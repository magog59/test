<template>
  <section>
    <div class="form-row justify-content-end">
      <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit"
                  :page="pagination.page"></pagination>
    </div>
    <table class="table table-border table-hover" style="margin-top:20px" v-if="edit == null">
      <tr v-show="showDecl==false">
        <th>#</th>
        <th class="custom_padding">Заявка</th>
        <!--            <th>Cтатус</th>-->
        <th>Дата контакта</th>
        <th>Менеджер</th>
        <th class="custom_padding">ЛПР</th>
        <th class="custom_padding">Комментарий</th>
        <th>Организация</th>
        <th>Продукция</th>
        <th>Документ</th>
        <th>Итого</th>
        <th>Итого с НДС клиенту</th>
        <th v-if="panel" class="custom_padding">Себе - стоимость</th>
        <th v-if="mybuisness">Маржа</th>
        <th class="custom_padding">Задол - женность</th>
        <th>Состав</th>
        <th>Оплата</th>
        <th>Счёт</th>
        <th>Договор</th>
        <th v-for="i in 4" :key="i"></th>
      </tr>
      <tbody>
      <!--              v-if="edit == null || edit.id != model.id"-->
      <tr
          v-for="model in datalist" :key="model.id"

          :class="getClassRow(model)"
          v-show="showDecl==false"

      >
        <td>{{ model.numberagree }}</td> <!-- id -->
        <td>{{ model.application_id }}</td> <!-- заявка -->
        <!--              <td >{{getStatusAgr(model.state).name}}</td>-->
        <td>{{ inDate(model.contactdate) }}</td> <!-- Дата контракта -->
        <td>{{ getManager(model.manager_id).username }}</td> <!-- Менеджер -->
        <td>{{ getLpr(model.is_lpr).name }}</td> <!-- ЛПР -->
        <td>{{ model.comment }}
          <a
              href="#"
              @click="toComments(model.id)">
            <i :class="[model.deleted_at != null ? '' : 'fas fa-comment']"></i>
          </a>
        </td>
        <td> <!-- Организация -->
          <a target="_blank" :href="'/clients/show/'+ model.clients_id+''"
             v-if="model.deleted_at == null || model.deleted_at == ''">
            {{ model.name }}
          </a>
        </td>
        <td>{{ model.nameproduct }}</td> <!-- Продукиця -->
        <td>{{ getDocumentName(model.document_id).name }}</td> <!-- Документ -->
        <td>{{ model.total }}</td> <!-- Итого -->
        <td>{{ model.total * 1.05 }}</td> <!-- Итого с НДС -->
        <td v-if="panel">{{ model.our_cost }}</td> <!-- Вне НДС -->
        <td v-if=" mybuisness">{{ model.marge }}</td> <!-- Себестоимость -->
        <td>{{ (model.total * 1.05) }}</td>  <!-- Задолженность -->
        <td>
          <a href="#"
             v-if="model.deleted_at == null || model.deleted_at == ''"
             @click="showItem(model)">
            <img
                src="../../../static/images/iconsColors/user-interface.svg"
                title="Состав"
                style="max-width:20px;"
                v-if="model.state != 10 && model.state != 20">
          </a>
        </td>
        <td>
          <a href="#"
             @click="toPayment(model)"
             v-if="model.deleted_at == null || model.deleted_at == ''">
            <img
                src="../../../static/images/iconsColors/card.svg"
                title="Оплата"
                style="max-width:20px;margin-left:7px"
                v-if="model.state != 10 && model.state != 20">
          </a>
        </td>

        <td> <!-- Счёт -->
          <a target="_blank"
             :href="'https://api.srcert.ru/index.php/agreement/bill?id='+ model.id +'&stamp=1'  "
             v-if="model.deleted_at == null || model.deleted_at === ''">
            <img
                src="../../../static/images/iconsColors/pdf-dwn.png"
                title="Напечатать счет с печатью"
                style="max-width:20px; margin-left:7px">
          </a>
        </td>

        <td><!-- Договор -->
          <a :href="'https://api.srcert.ru/index.php/agreement/print?id='+ model.id+ '&stamp=1&report=1'"
             target="_blank"
             v-if="model.deleted_at == null || model.deleted_at === ''">
            <img
                src="../../../static/images/iconsColors/pdf-dwn.png"
                title="Напечатать договор с печатью"
                style="max-width:20px; margin-left:7px"
            >
          </a>
        </td>

<!--        <td>-->
<!--          <a href="#" @click="toPrintContract(model.id)"-->
<!--             v-if="model.deleted_at == null || model.deleted_at == ''">-->
<!--            <img src="../../../static/images/iconsColors/mail.svg"-->
<!--                 title="Отправить договор подписанный"-->
<!--                 style="max-width:20px; margin-left:7px"-->
<!--            >-->
<!--          </a>-->
<!--        </td>-->
        <td>
          <a href="#"
             v-if="model.deleted_at == null || model.deleted_at == ''">
            <i class="fa fa-angle-double-right"
               title="Создать ОРК"
               @click="toCreateOrk(model)"
               style="max-width:20px; margin-left:7px"
               v-if="model.state != 10 && model.state != 20">
            </i>
          </a>
        </td>
        <td>
          <a
              href="#"
              v-if="model.deleted_at == null || model.deleted_at == ''"
              @click="toChange(model)">
            <img src="../../../static/images/iconsColors/edit.png"
                 title="Редактировать"
                 style="max-width:20px; margin-left:7px"
                 v-if="model.state != 10 && model.state != 20">
          </a>
        </td>
        <td v-show="model.state == 10 || model.state == 20">
          <a
              href="#"
              v-if="model.deleted_at == null || model.deleted_at == ''"
              @click="toRestore(model)">
            <img
                src="../../../static/images/iconsColors/pencils.svg"
                title="Восстановить"
                style="max-width:20px">
          </a>
        </td>
        <td v-show="model.state != 10 && model.state != 20">
          <a
              href="#"
              v-if="model.deleted_at == null || model.deleted_at == ''"
              @click="showDecl=true;setModelClose(model)">
            <img
                src="../../../static/images/iconBest/canc.png"
                title="Отказ"
                style="max-width:20px">
          </a>
        </td>
        <td>
          <a
              href="#" style="max-width:20px; margin-left:7px"
              v-if="model.deleted_at == null || model.deleted_at == ''">
            <vue-confirmation-button
                title="Удалить"
                v-if="model.deleted_at == null || model.deleted_at == ''"
                :css="'fui-trash'"
                v-on:confirmation-success="deleteData(model.id)">
            </vue-confirmation-button>
          </a>
        </td>
      </tr>
      </tbody>
      <tr v-if="showDecl==true">
        <button type="button" class="close" @click="showDecl=false" aria-hidden="true">×</button>
        <div style="font-size: 70%; text-align:right">Выбирите причины отказа</div>
        <select class="select" v-model="declinematter_id">
          <option v-for="item in declinematters" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
        <button class="btn btn-success" @click="toClose()">Сохранить</button>
      </tr>
      <tr style="text-align: left" v-if="this.mybuisness==true" v-show="showDecl==false">
        <th>Итого</th>
        <th v-for="i in 8" :key="i"></th>
        <th v-if=" mybuisness" style="width: 70px">{{ getSumm('total') }}</th>
        <th v-if=" mybuisness" style="width: 70px">{{ getSumm('total') - getSumm('our_cost') }}</th>
        <th v-if=" mybuisness" style="width: 70px">{{ getSumm('debt') }}</th>
        <th v-for="i in 9" :key="i"></th>

      </tr>
    </table>
    <!----Редактировать договор---->
    <h4 style="margin: auto" v-if="edit != null">Редактировать договор</h4>
    <div class="row justify-content-center" v-if="edit != null">

      <div class="col-1"></div>
      <div class="col-9 ">
        <div class="row ">
          <!---1part---->
          <div class="col-4 offset-1">
            <div class="row" style="margin-top: 30px">
              <div style="font-size: 70%; margin-right: 70%;">Дата контакта</div>
              <date-picker v-model="edit.contactdate" valueType="format"></date-picker>
            </div>
            <div class="row" style="margin-top: 30px">
              <div style="font-size: 70%; margin-right: 70%;">Дата договора</div>
              <date-picker v-model="edit.agreedate" valueType="format"></date-picker>
            </div>
            <div class="row" style="margin-top: 30px">
              <div style="font-size: 70%; margin-right: 70%;">Менеджер</div>
              <select class="select" v-model="edit.manager_id">
                <option v-for="user in users" :key="user.id" :value="user.id">{{ user.username }}</option>
              </select>
            </div>
            <div class="row" style="margin-top: 30px">
              <div style="font-size: 70%; margin-right: 70%;">Состояние</div>
              <select class="select" v-model="edit.state">
                <option v-for="status in statusAgr" :key="status.id" :value="status.id">{{ status.name }}</option>
              </select>
            </div>

            <div class="row" style="margin-top: 30px">
              <div style="font-size: 70%; margin-right: 70%;">НДС</div>
              <select class="select" v-model="edit.tax">
                <option value="10">ООО Современные решения</option>
                <option value="20">ИП Филимонов</option>
                <option value="30">ООО Современные решения(Киров)</option>
              </select>
            </div>

            <div class="col-3" style="margin-top: 30px">
              <button class="btn btn-success" @click="update">Сохранить</button>
            </div>
          </div>
          <!---2part-- -->
          <div class="col-4 offset-1">
            <div class="row" style="margin-top: 30px">
              <div style="font-size: 70%; margin-right: 70%;">В лице</div>
              <input type="text" class="form-control" v-model="edit.person">
            </div>
            <!-- <div class="row"  style="margin-top: 30px">
                 <div style="font-size: 70%; margin-right: 70%;">Задолженость клиента</div>
                 <input type="text" class="form-control" v-model="edit.debt" >
           </div> -->
            <div class="row" style="margin-top: 30px">
              <div style="font-size: 70%; margin-right: 70%;">подпись</div>
              <input type="text" class="form-control" v-model="edit.short_person">
            </div>
            <div class="row" style="margin-top: 30px">
              <div style="font-size: 70%; margin-right: 70%;">Номер спецификации</div>
              <input type="text" class="form-control" v-model="edit.spec_num">
            </div>
            <div class="row" style="margin-top: 30px">
              <div style=" font-size: 70%;text-align:left;">На основании</div>
              <input type="text" class="form-control" v-model="edit.basement">
            </div>
            <div class="row" style="margin-top: 50px">
              <textarea class="form-control" v-model="edit.options" placeholder="Для чего документ"
                        style="height: 100px;"></textarea>
            </div>

          </div>
          <!-----end2part----->
          <div class="col-1">
            <button type="button" class="close" @click="edit = null" aria-hidden="true">×</button>
          </div>
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
import '../../utils/dateFunc'
import dateFunc from '../../utils/dateFunc'

export default {
  mixins: [Acl, dateFunc],
  name: 'agreement',
  props: ['panel', 'mybuisness', 'clients_id'],
  data() {
    return {
      form: {},
      search: null,
      page: null,
      edit: null,
      keys: [],
      content: null,
      declinematter_id: null,
      showDecl: false,
      modelClose: null
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
      datalist: 'agreement/datalist',
      pagination: 'agreement/pagination',
      storeForm: 'mybuisness/form',
      citys: 'city/datalist',
      users: 'app/users',
      is_lpr: 'dictionary/is_LprList',
      statusAgr: 'dictionary/statusAgreement',
      getTax: 'dictionary/getTax',
      arrDocAll: 'document/arrDocAll',
      declinematters: 'declinematter/datalist'
    }),
  },
  methods: {
    ...Vuex.mapMutations({
      setMessage: 'app/setMessage',
      setError: 'app/setError',
      setHeader: 'app/setCurrentPageHeader'
    }),
    ...Vuex.mapActions({
      save: 'agreement/save',
      find: 'agreement/find',
      drop: 'agreement/delete',
      findDoc: 'document/findAll',
      restore: 'agreement/restore',
      close: 'agreement/close',
      declinemFind: 'declinematter/find'
    }),
    update() {
      this.setError(null)
      this.save(this.edit)
          .then(() => {
            this.edit = null
            if (this.mybuisness === true) {
              this.find(this.storeForm)
            }
            if (this.panel === true) {
              this.find({clients_id: this.clients_id})
            }
          })
    },
    deleteData(id) {
      this.setError(null)
      this.drop(id)
          .then(() => {
            if (this.mybuisness === true) {
              this.find(this.storeForm)
            }
            if (this.panel === true) {
              this.find({clients_id: this.clients_id})
            }
          })
    },
    toRestore(model) {
      this.restore({id: model.id})
      if (this.mybuisness === true) {
        this.find(this.storeForm)
      }
      if (this.panel === true) {
        this.find({clients_id: this.clients_id})
      }

    },
    toClose() {
      this.close({id: this.modelClose.id, declinematter_id: this.declinematter_id})
      if (this.mybuisness === true) {
        this.find(this.storeForm)
      }
      if (this.panel === true) {
        this.find({clients_id: this.clients_id})
      }
      this.showDecl = false

    },
    setModelClose(model) {
      this.modelClose = Object.assign({}, model)
    },
    toChange(model) {
      this.edit = Object.assign({}, model)
    },
    setPage(i) {
      this.page = i
      if (this.clients_id) {
        this.find({page: this.page, clients_id: this.clients_id})
      } else {
        this.storeForm.page = this.page
        this.find(this.storeForm)
      }
    },
    getCity(id) {
      let result = {};
      this.citys.map((el) => {
        if (id === el.id) {
          result = el
        }
      })
      return result
    },
    getManager(id) {
      let result = {};
      this.users.map((el) => {
        if (id === el.id) {
          result = el
        }
      })
      return result
    },
    getLpr(id) {
      var result = {}
      this.is_lpr.map((el) => {
        if (id === el.id) {
          result = el
        }
      })
      return result
    },
    // getStatusAgr(id) {
    //   var result = {}
    //   this.statusAgr.map((el) => {
    //     if (id === el.id) {
    //       result = el
    //     }
    //   })
    //   return result
    // },
    toCreateOrk(model) {
      this.$router.push('/create/createOrk/' + model.id + '=' + model.clients_id + '=' + this.$route.name)
    },
    toComments(id) {
      this.$store.commit('comments/setValComment', {
        object_id: id,
        type: 50,
        component: 'agreement',
        radom: Math.random().toFixed(2)
      }, {root: true})
    },
    toShow(id) {
      this.$router.push('../../clients/show/' + id)
    },
    toPayment(model) {
      this.$router.push('../../../ork/' + model.clients_id + '=' + model.id + '=' + this.$route.name)
    },
    getSumm(column) {
      var summ = 0
      this.datalist.map(elem => {
        summ += +elem[column]
      })
      return summ
    },
    showItem(model) {
      this.$store.commit('item/setShowItem', {state: true, agreement_id: model.id})
    },
    getDocumentName(id) {
      if (this.arrDocAll == null) {
        return
      }
      let result = {};
      if (this.arrDocAll == null) {
        return
      }
      this.arrDocAll.map((el) => {
        if (id === el.id) {
          result = el
        }
      })
      return result
    },
    getClassRow(model) {
      return [model.deleted_at != null ? 'disabled' : '', model.state == 20 ? 'danger' : '', model.state == 10 ? 'success' : '']
    },
  },
  created() {
    this.setHeader('Договор')
    this.page = this.pagination.page
    this.findDoc()
    this.declinemFind()
  }
}
</script>