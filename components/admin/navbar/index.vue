<template>
<section>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <img src="../../../../static/images/iconBest/logo.png" alt="" style="max-width:40px">
        <div class="collapse navbar-collapse " >
                <ul class="navbar-nav mr-auto ">
                     <a class="navbar-brand" href="#" > Современные решения </a>
                </ul>
                 <ul class="navbar-nav mr-auto ">
                      <span class="navbar-brand" style="color:#1ca3db;">{{currentPageHeader}}</span>
                </ul>
                <ul class="navbar-nav  " style="margin-top: 10px;">
                     <li class="nav-item" >
                        <input type="text" class="search" v-model="search" @keypress.enter.prevent="searchReq" placeholder="Введите запрос">
                    </li>
                    <li class="nav-item" >
                          <a    href="#" 
                                @click="searchReq()">
                                    <img  src="../../../../static/images/iconsColors/search.svg" 
                                          title="" 
                                          style="max-width:30px; margin-left: 7px;">
                          </a>
                    </li>
                     <li class="nav-item">
                        <a  href="#" class="nav-link active" @click="toClients()" >Компании</a>
                    </li>
                    <li class="nav-item">
                        <a  href="#" class="nav-link active" @click="toMybuisness()" >Мои дела</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" @click="isHideMenuReport = !isHideMenuReport;getClick('isHideMenuReport')"  href="#" >Отчеты</a>
                    </li>
                        <div class="btn-group show">

                        <div class="btn-group dropleft">
                            <div
                                    class="dropdown-menu menushow"
                                    style="border-radius:1px ; top:50%;"
                                    :class="{show: !isHideMenuReport}"
                            >
                                <li>
                                    <a class="dropdown-item" @click="toFunnel()">Воронка</a>
                                </li>
                                <li>
                                    <div class="dropdown-divider"></div>
                                </li>

                                <li>
                                    <a class="dropdown-item" @click="toCallreport()">Звонки общий</a>
                                </li>
                                 <li>
                                    <a class="dropdown-item" @click="toZadarmacalls()">Звонки zadarma</a>
                                </li>
                                <li>
                                    <a class="dropdown-item" @click="toConverce()">Конверсия</a>
                                </li>
                                <li>
                                    <a class="dropdown-item" @click="toPayrep()">Отчет от выплатах</a>
                                </li>
                                  <li>
                                    <a class="dropdown-item" @click="toReestDoc()">Реестр выданных документов</a>
                                </li>
															<li>
																<a class="dropdown-item" @click="toCloseWork()">Отчет по закрытым работам</a>
															</li>
                                 <li>
                                    <a class="dropdown-item" @click="toDoingclients()">Отчет по действующим</a>
                                </li>
                                <li>
                                    <a class="dropdown-item" @click="toReportOrk()">Отчет ОРК</a>
                                </li>
                                  <li>
                                    <a class="dropdown-item" @click="toPlan()">План</a>
                                </li>
																<li>
																	<a class="dropdown-item" @click="toTask()">Отчеты по задачам</a>
																</li>
                            </div>
                        </div>
                    </div>
                    <li class="nav-item">
                        <a class="nav-link active" @click="isHideMenu = !isHideMenu;getClick('isHideMenu')" href="#">{{user.username}}</a>
                    </li>
                </ul>
                <div class="btn-group show">
                    <div class="btn-group dropleft">
                        <div
                                    class="dropdown-menu menushow"
                                    style="border-radius:1px;"
                                    :class="{show: !isHideMenu}"
                        >
                                <li>
                                    <a class="dropdown-item" @click="toChangePassword">Сменить пароль</a>
                                </li>
                                <li>
                                    <div class="dropdown-divider"></div>
                                </li>
                                <li>
                                    <a v-if="can('settings')" class="dropdown-item" @click="toPekCities">Города ПЭК</a>
                                </li>
                                <li>
                                    <a class="dropdown-item" @click="toUsers">Пользователи</a>
                                </li>
                                <li>
                                    <div class="dropdown-divider"></div>
                                </li>
                                <li>
                                    <a class="dropdown-item" @click="toSphere">Сферы деятельности</a>
                                </li>
                                <li>
                                    <a class="dropdown-item" @click="toSource">Источник</a>
                                </li>
                                  <li>
                                    <a class="dropdown-item" @click="toCity">Область</a>
                                </li>
                                  <li>
                                    <a class="dropdown-item" @click="toContacttype">Тип контакта</a>
                                </li>
                                 <li>
                                    <a class="dropdown-item" @click="toDocument">Документ</a>
                                </li>
                                  <li>
                                    <a class="dropdown-item" @click="toProvider">Поставщики</a>
                                </li>
                                 <li>
                                    <a class="dropdown-item" @click="toDeclinematter">Причина отказа</a>
                                    <hr>
                                </li>
                                <li>
                                    <div class="dropdown-divider"></div>
                                </li>
                                <li>
                                    <a class="dropdown-item" @click="toLogout">Выход</a>
                                </li>
                        </div>
                    </div>
                </div>
        </div>
          <li class="nav-item d-xl-none" >
              <input type="text" class="search" v-model="search" @keypress.enter.prevent="searchReq" placeholder="Введите запрос">
          </li>
         <div class="btn-group show  d-xl-none" >
             <button class="btn btn-secondary"  @click="isHideMenuReport = !isHideMenuReport"><i class="fa fa-hamburger"></i></button>
                    <div class="btn-group dropleft">
                        <div
                                    class="dropdown-menu menushow"
                                    style="border-radius:1px;"
                                    :class="{show: !isHideMenuReport}"
                        >
                        <li class="nav-item">
                            <a  href="#" class="nav-link active" @click="toClients()" >Компании</a>
                        </li>
                        <li class="nav-item">
                            <a  href="#" class="nav-link active" @click="toMybuisness()" >Мои дела</a>
                        </li>
                        </div>
                </div>
        </div>
       
    </nav>
   
</section>
</template>


<script>
  import Vuex from 'vuex'
  import Acl from '../../../utils/acl'

  export default {
    mixins: [Acl],
    name: 'navbar',
    data() {
      return {
        isHideMenu: true,
        isHideMenuReport: true,
        search: null,
        counter: 0
      }
    },
    computed: {
      ...Vuex.mapGetters({
            isAuthenticated: 'auth/isAuthenticated',
            user: 'auth/user',
            currentPageHeader: 'app/currentPageHeader',
      }),
    },
    methods:{
       ...Vuex.mapMutations({
            setSearch:'search/setQuery',
            setHeader:'app/setCurrentPageHeader',
        }),
      ...Vuex.mapActions({
          findClients: 'search/findCients',
          findClientsContact: 'search/findClientsContact',
      }),  
      toLogout(){
        this.$router.push('/logout')
        this.isHideMenu = !this.isHideMenu
      },
      toChangePassword(){
        this.$router.push('/changepassword')
        this.isHideMenu = !this.isHideMenu
      },
      toUsers(){
        this.$router.push('/users')
        this.isHideMenu = !this.isHideMenu
      },
      toSphere(){
        this.$router.push('/sphere')
        this.isHideMenu = !this.isHideMenu
      },
       toSource(){
        this.$router.push('/source')
        this.isHideMenu = !this.isHideMenu
      },
      toCity(){
        this.$router.push('/city')
        this.isHideMenu = !this.isHideMenu
      },
      toContacttype(){
        this.$router.push('/contacttype')
        this.isHideMenu = !this.isHideMenu
      },
      toDocument(){
        this.$router.push('/document')
        this.isHideMenu = !this.isHideMenu
      },
      toProvider(){
        this.$router.push('/provider')
        this.isHideMenu = !this.isHideMenu
      },
      toDeclinematter(){
        this.$router.push('/declinematter')
        this.isHideMenu = !this.isHideMenu
      },
      toClients(){
          if(this.$route.name == 'clients'){
              return
          }
          this.$router.push('/clients')
      },
      toMybuisness(){
          if(this.$route.name == 'mybuisness'){
              return
          }
          this.$router.push('/mybuisness')
      },
      toPlan(){
        this.$router.push('/reports/plan')
         this.isHideMenuReport = !this.isHideMenuReport
      },
      toFunnel(){
        this.$router.push('/reports/funnel')
         this.isHideMenuReport = !this.isHideMenuReport
      },
      toCallreport(){
        this.$router.push('/reports/callreport')
         this.isHideMenuReport = !this.isHideMenuReport
      },
      toZadarmacalls(){
        this.$router.push('/reports/zadarmacalls/1')
         this.isHideMenuReport = !this.isHideMenuReport
      },
      toConverce(){
          this.$router.push('/reports/converce')
          this.isHideMenuReport = !this.isHideMenuReport  
      },
      toPayrep(){
          this.$router.push('/reports/payrep')
          this.isHideMenuReport = !this.isHideMenuReport   
      },
      toDoingclients(){
          this.$router.push('/reports/doingclients')
          this.isHideMenuReport = !this.isHideMenuReport
      },
      toReestDoc(){
          this.$router.push('/reports/reestrdoc')
          this.isHideMenuReport = !this.isHideMenuReport
      },
			toCloseWork(){
				this.$router.push('/reports/closeWork')
				this.isHideMenuReport = !this.isHideMenuReport
			},
      toReportOrk(){
          this.$router.push('/reports/reportOrk')
          this.isHideMenuReport = !this.isHideMenuReport
      },
			toTask(){
				this.$router.push('/reports/reportTask')
				this.isHideMenuReport = !this.isHideMenuReport
			},
      searchReq(){
          this.setSearch(this.search)
          if (this.$route.name != 'search') {
            this.$router.push('/search')
          } else {
            this.findClients()
            this.findClientsContact() 
          }
      },
      getClick(val){
          document.onclick = () => this.showMenu(val) 
      },
      showMenu(val){
          this.counter++ 
          if( this.counter == 1){
              return
          }
          this.counter > 1 ? this[val] = true : ''
          this.counter = 0
      },
   
    }
  }
</script>

<style>
    .menushow {
        transform: translate3d(-202px, 27px, 0px);
    }
    .search {
      margin-top: 10px;
      height: 34px;
      padding: 6px 12px;
      font-size: 14px;
      line-height: 1.42857143;
      color: #555;
      background-color: #fff;
      background-image: none;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
      -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
      transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    }
 
</style>
