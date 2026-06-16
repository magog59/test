<template>
  <section>
    <div class="nav-item d-xl-none" style="margin-top: 280px"></div>
    <div class="pane row" v-if="checkRoleShowFilter">

      <div class="col" v-if="can('manager') || can('rbacManage')">
        <a href="#" @click="showComponent('outcall')" :class="[outcall ? 'color ' : '']">Звонки <span
            class="badge">{{ outcallPagination.total ? outcallPagination.total : 0 }}</span></a>
      </div>
      <div class="col" v-if="can('manager') || can('rbacManage')">
        <a href="#" @click="showComponent('lead')" :class="[lead ? 'color ' : '']">ЭК<span
            class="badge">{{ leadPagination.total ? leadPagination.total : 0 }}</span></a>
      </div>
      <div class="col" v-if="can('manager') || can('rbacManage')">
        <a href="#" @click="showComponent('application')" :class="[application ? 'color ' : '']">Заявки<span
            class="badge">{{ applPagination.total ? applPagination.total : 0 }}</span></a>
      </div>
      <div class="col" v-if="can('manager') || can('rbacManage')">
        <a href="#" @click="showComponent('kp')" :class="[kp ? 'color ' : '']">Коммерческие<span
            class="badge">{{ kpPagination.total ? kpPagination.total : 0 }}</span></a>
      </div>
      <div class="col" v-if="can('manager') || can('rbacManage')">
        <a href="#" @click="showComponent('agreement') " :class="[agreement ? 'color ' : '']">Договоры<span
            class="badge">{{ agreementPagination.total ? agreementPagination.total : 0 }}</span></a>
      </div>
      <div class="col" v-if="can('manager') || can('rbacManage') || can('ork')">
        <a href="#" @click="showComponent('ork') " :class="[ork ? 'color ' : '']">ОРК<span
            class="badge">{{ orkPagination.total ? orkPagination.total : 0 }}</span></a>
      </div>

      <!--      Что тут было до этого?
      <div class="nav-item d-xl-none" style="margin-top: 340px" v-if="can('manager') || can('rbacManage')"></div>-->
      <div class="col" v-if="can('manager') || can('rbacManage')">
        <button class="btn btn-primary" @click="showForm = !showForm;changeHeight()">ФИЛЬТР</button>
      </div>

    </div>
    <div class="pane row" style="margin-top: 20px" v-if="checkRoleShowFilter && can('ork') || can('rbacManage')">
      <div class="col" v-if="can('manager') || can('rbacManage') || can('ork')">
        <a href="#" @click="showComponent('hungJobs')" :class="[hungJobs ? 'color' : '']">Зависшие работы <span
            class="badge">{{ hungTaskPagination.total ? hungTaskPagination.total : 0 }}</span></a>
      </div>

      <div class="col" v-if="startNot">
        <a href="#" @click="showComponent('start')"
           :class="[start ? 'color ' : ''] ">Запуск
          <span class="badge">{{ startNot.count ? startNot.count : 0 }}</span>
          <span class="badge"
                v-if="startNot.not > 0"
                :style="collectDocClass ">{{ startNot.not ? startNot.not : 0 }}
                            </span>

        </a>
      </div>
      <div class="col" v-if="collectDocNot">
        <a href="#" @click="showComponent('collectDoc')"
           :class="[collectDoc ? 'color ' : '']">Сбор документов
          <span class="badge">{{ collectDocNot.count ? collectDocNot.count : 0 }}</span>
          <span class="badge"
                v-if="collectDocNot.not > 0"
                :style="collectDocClass ">{{ collectDocNot.not ? collectDocNot.not : 0 }}
                                </span>
        </a>
      </div>
      <div class="col" v-if="analysisNot">
        <a href="#" @click="showComponent('analysis')"
           :class="[analysis ? 'color ' : '']">Анализ
          <span class="badge">{{ analysisNot.count ? analysisNot.count : 0 }}</span>
          <span class="badge"
                v-if="analysisNot.not > 0"
                :style="collectDocClass ">{{ analysisNot.not ? analysisNot.not : 0 }}</span>
        </a>
      </div>
      <div class="col" v-if="decorateDocNot">
        <a href="#" @click="showComponent('decorateDoc')"
           :class="[decorateDoc ? 'color ' : '']">Оформление док-та
          <span class="badge">{{ decorateDocNot.count ? decorateDocNot.count : 0 }}</span>
          <span class="badge"
                v-if="decorateDocNot.not > 0"
                :style="collectDocClass ">{{ decorateDocNot.not ? decorateDocNot.not : 0 }}</span>
        </a>
      </div>
      <div class="col" v-if="workCloseNot">
        <a href="#" @click="showComponent('workClose')"
           :class="[workClose ? 'color ' : '']">Работа закрыта
          <span class="badge">{{ workCloseNot.count ? workCloseNot.count : 0 }}</span>
          <span class="badge"
                v-if="workCloseNot.not > 0"
                :style="collectDocClass ">{{ workCloseNot.not ? workCloseNot.not : 0 }}</span>
        </a>
      </div>
      <div class="col" v-if="transferNot">
        <a href="#" @click="showComponent('transfer')"
           :class="[transfer ? 'color ' : '']">Доставка из органа
          <span class="badge">{{ transferNot.count ? transferNot.count : 0 }}</span>
          <span class="badge"
                v-if="transferNot.not > 0"
                :style="collectDocClass ">{{ transferNot.not ? transferNot.not : 0 }}</span>
        </a>
      </div>
      <div class="col" v-if="transferClientNot">
        <a href="#" @click="showComponent('transferClient') "
           :class="[transferClient ? 'color ' : '']">Доставка клиенту
          <span class="badge">{{ transferClientNot.count ? transferClientNot.count : 0 }}</span>
          <span class="badge"
                v-if="transferClientNot.not > 0"
                :style="collectDocClass ">{{ transferClientNot.not ? transferClientNot.not : 0 }}</span>
        </a>
      </div>
      <div class="col" v-if="showFilterForOrk">
        <button class="btn btn-primary" @click="showForm = !showForm;changeHeight()">ФИЛЬТР</button>
      </div>
    </div>

    <div class="row " v-if="showForm" style="margin-top: 40px;margin-left:3%">

      <div>
        <div style=" font-size: 70%;">Скинуть фильтр</div>
        <button style=" margin-right: 40px;" type="button" class="close" @click="localStorageNull()" aria-hidden="true">
          ×
        </button>
      </div>
      <div class="col">
        <div style="font-size: 70%;">Удаленные</div>
        <input type="checkbox" id="checkbox" v-model="tempForm.deleted_at" style=" transform: scale(1.5)">
      </div>
      <div class="col">
        <div style="font-size: 70%;margin-right: 40px;">Активность</div>
        <select class="select" v-model="tempForm.isactive" id="isActiveSelectForm" :disabled="hungJobs"
                style="min-width: 140px;width: 120px !important">
          <option value="">Активность</option>
          <option value="1">Активна</option>
          <option value="2">Завершен</option>
          <option value="3">Отказ</option>
          <!--
          Зависшие работы (на текущий момент нет необходимости
          <option value="4">Зависшая</option>
          -->
        </select>
      </div>
      <div class="col">
        <div style=" font-size: 70%;">Дата от</div>
        <date-picker v-model="tempForm.dateFrom" :format="'DD.MM.YYYY'" valueType="format"></date-picker>
      </div>
      <div class="col">
        <div style=" font-size: 70%;">Дата до</div>
        <date-picker v-model="tempForm.dateTo" valueType="format" :format="'DD.MM.YYYY'"></date-picker>
      </div>
      <div class="col">
        <div style=" font-size: 70%;">Выберите менеджера</div>
        <select class="select" v-model="tempForm.userId" style="min-width: 140px;width: 150px">
          <option v-for="manager in managers" :key="manager.id" :value="manager.id">{{ manager.username }}</option>
        </select>
      </div>

      <div class="col" style="margin-top: 20px;">
        <button class="btn btn-primary" @click="sendForm()" style="width:120px; margin-right: 10px;border-radius: 20px">
          Получить
        </button>
      </div>
    </div>
    <div class="row" style="margin-top: 30px; ">
      <div style="width: 20px"></div>
      <div class="col-lg ">
        <!--        <task v-if="task"></task>-->
        <hung-jobs v-if="hungJobs"></hung-jobs>
        <outcall v-if="outcall" :mybuisness="true"></outcall>
        <lead v-if="lead" :mybuisness="true"></lead>
        <application v-if="application" :tax="true" :mybuisness="true"></application>
        <kp v-if="kp && !showItem" :mybuisness="true"></kp>
        <agreement v-if="agreement && !showItem" :mybuisness="true"></agreement>

        <Item
            v-if="showItem && (kp||agreement||ork)"
            :kpId="showItem.kp_id"
            :agreementId="showItem.agreement_id"
            :orkId="showItem.ork_id"
            :mybuisness="true"
        />

        <ork v-if="ork && !showItem" :mybuisness="true"></ork>
        <createAppls v-if="createAppls"></createAppls>
        <createLead v-if="createLead"></createLead>
        <Start v-if="start" @close="getClose" :dateOrkDelay="dateOrkDelay"></Start>
        <CollectDoc v-if="collectDoc" @close="getClose"></CollectDoc>
        <Analysis v-if="analysis" @close="getClose"></Analysis>
        <DecorateDoc v-if="decorateDoc" @close="getClose"></DecorateDoc>
        <WorkClose v-if="workClose" @close="getClose"></WorkClose>
        <Transfer v-if="transfer" @close="getClose"></Transfer>
        <TransferClient v-if="transferClient"></TransferClient>
        <div v-if="comments" class="row">
          <div class="col-2 "></div>
          <div class="col-8 ">
            <comments></comments>
          </div>
          <div class="col-2-lg "></div>
        </div>
      </div>
      <div style="width: 20px"></div>
    </div>
  </section>
</template>

<script>
// import Task from './task'
import HungJobs from './hungJobs'
import Outcall from './outcall'
import Lead from './lead'
import Application from './application'
import Kp from './kp'
import Agreement from './agreement'
import Ork from './ork'
import Item from '../item'
import CreateAppls from '../create/createAppls'
import CreateLead from '../create/createLead'
import Comments from '../comments'
import Start from '../../components/ork/orkWork/start'
import CollectDoc from '../../components/ork/orkWork/collectDoc'
import Analysis from '../../components/ork/orkWork/analysis'
import DecorateDoc from '../../components/ork/orkWork/decorateDoc'
import WorkClose from '../../components/ork/orkWork/workClose'
import Transfer from '../../components/ork/orkWork/transfer'
import TransferClient from '../../components/ork/orkWork/transferClient'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/ru'
import Vuex from 'vuex'
import DateFunc from '../../utils/dateFunc'
import Acl from '../../utils/acl'


export default {
  props: ['name'],
  mixins: [DateFunc, Acl],
  name: 'IndexPage',
  data() {
    return {
      tempForm: {
        userId: '',
        dateFrom: this.firstDayMonth(new Date()),
        dateTo: this.inDateTime(new Date()),
        isactive: 1,
        deleted_at: false
      },
      showForm: false,
      // task: false,
      navItems: {
        hungJobs: {
          show: false,

        }
      },
      hungJobs: false,
      outcall: false,
      lead: false,
      application: false,
      kp: false,
      agreement: false,
      ork: false,
      comments: false,
      createAppls: false,
      createLead: false,
      start: false,
      collectDoc: false,
      analysis: false,
      decorateDoc: false,
      workClose: false,
      transfer: false,
      transferClient: false,
      commentId: null,
      userId: null,
      height: '',
      item: false,
      commentCloseVal: false,
      close: '',
      collectDocClass: 'background-color: #f50b0b',
      showFilterForOrk: false, // Фрагмент для permissions
    }
  },
  components: {
    // Task,
    Outcall,
    Lead,
    Application,
    Kp,
    Agreement,
    Ork,
    Comments,
    Item,
    CreateAppls,
    CreateLead,
    DatePicker,
    Start,
    CollectDoc,
    Analysis,
    DecorateDoc,
    WorkClose,
    Transfer,
    TransferClient,
    HungJobs,
  },
  watch: {
    valComent: function (val) {
      val = true
      // this.task = false
      this.outcall = false
      this.lead = false
      this.application = false
      this.kp = false
      this.agreement = false
      this.ork = false
      this.createAppls = false
      this.createLead = false
      this.start = false
      this.collectDoc = false
      this.analysis = false
      this.decorateDoc = false
      this.workClose = false
      this.transfer = false
      this.transferClient = false
      this.hungJobs = false
      this.comments = val
    },
    commentClose(val) {
      this.comments = val.state
      this[val.component] = true
    },
  },
  computed: {
    ...Vuex.mapGetters({
      user: 'auth/user',
      apiUrl: 'app/apiUrl',
      // taskPagination: 'task/pagination',
      hungTaskPagination: 'hungJobs/pagination',
      outcallPagination: 'outcall/pagination',
      leadPagination: 'lead/pagination',
      applPagination: 'application/pagination',
      kpPagination: 'kp/pagination',
      agreementPagination: 'agreement/pagination',
      orkPagination: 'ork/pagination',
      storeForm: 'mybuisness/form',
      managers: 'app/users',
      valComentStore: 'comments/valComent',
      commentClose: 'comments/commentClose',
      showItem: 'item/showItem',
      startNot: 'ork/startNot',
      collectDocNot: 'ork/collectDocNot',
      analysisNot: 'ork/analysisNot',
      decorateDocNot: 'ork/decorateDocNot',
      workCloseNot: 'ork/workCloseNot',
      transferNot: 'ork/transferNot',
      transferClientNot: 'ork/transferClientNot',
      dateOrkDelay: 'ork/dateOrkDelay',
    }),
    valComent() {
      return Object.assign({}, this.valComentStore)
    }
  },
  methods: {
    ...Vuex.mapMutations({
      setForm: 'mybuisness/setForm',
      setHeader: 'app/setCurrentPageHeader',
    }),
    ...Vuex.mapActions({
      check: 'auth/check',
      // findTask: 'task/find',
      findHungJobs: 'hungJobs/find',
      findOutcall: 'outcall/find',
      findLead: 'lead/find',
      findApplication: 'application/find',
      findKp: 'kp/find',
      findAgreement: 'agreement/find',
      findOrk: 'ork/find',
      findOrkNotice: 'ork/findOrkNotice',
      findDelayOrkDate: 'ork/findDelayOrkDate',
      findUsers: 'app/getUsers',
      findCity: 'city/findAll',
    }),
    sendForm() {
      const form = Object.assign({}, this.tempForm);
      this.setForm(form)
      // this.findTask(this.storeForm)
      this.findHungJobs(this.storeForm)
      this.findOutcall(this.storeForm)
      this.findLead(this.storeForm)
      this.findApplication(this.storeForm)
      this.findKp(this.storeForm)
      this.findAgreement(this.storeForm)
      this.findOrkNotice(this.storeForm)
      this.findOrk(this.storeForm)
      localStorage.setItem('storeForm', JSON.stringify(this.storeForm))
    },
    localStorageNull() {
      localStorage.clear()
      this.setForm(null)
      this.tempForm.userId = this.user.id
      this.tempForm.dateFrom = this.firstDayMonth(new Date())
      this.tempForm.dateTo = this.inDateTime(new Date())
      this.tempForm.isactive = 1
      this.sendForm(this.tempForm)
    },
    changeHeight() {
      return this.height = `height: ${this.showForm ? 200 : 70}px`
    },
    setUserId() {
      const obj = Object.assign({}, this.user);
      this.tempForm.userId = obj.id
    },
    showComponent(comp) {
      this.hungJobs = false
      // this.task = false
      this.outcall = false
      this.lead = false
      this.application = false
      this.kp = false
      this.agreement = false
      this.ork = false
      this.item = false
      this.start = false
      this.collectDoc = false
      this.analysis = false
      this.decorateDoc = false
      this.workClose = false
      this.transfer = false
      this.transferClient = false

      if (comp != null && comp !== '') {
        this[comp] = true;
      }
    },
    getLocalStorage() {
      let storeForm = localStorage.getItem('storeForm');

      if (storeForm) {
        this.localStorage = Object.assign({}, JSON.parse(storeForm))
        this.setForm(this.localStorage)
      }

    },
    getClose(val) {
      this.close = val
      this.showComponent(val)
    },
    checkRoleShowFilter() {
      const manager = this.can('manager');
      const rbacManage = this.can('rbacManage');
      const ork = this.can('ork');

      if (manager === undefined && rbacManage === undefined && ork) {
        this.showFilterForOrk = true;
      }
    }
  },
  created() {
    this.checkRoleShowFilter()
    this.setHeader('Мои дела')
    this.findUsers()
    this.setUserId()
    this.findDelayOrkDate()
    this.getLocalStorage()
    if (!this.storeForm) {
      this.check()
          .then(() => {
            this.tempForm.userId = this.user.id
            this.tempForm.isactive = 1
            this.sendForm()
          })
    } else {
      this.storeForm.clients_id = null
      this.tempForm = Object.assign({}, this.storeForm)
      this.tempForm.isactive = 1
      this.sendForm()
    }

    this[this.$route.query.active] = true
  }
}
</script>
<style scoped>
.pane {
  margin-right: 1%;
  margin-left: 1%;
  font-size: 16px;
  height: 70px;
  align-content: center;
}

.badge {
  display: inline-block;
  min-width: 10px;
  padding: 3px 7px;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  background-color: #777;
  border-radius: 10px;
}
</style>
