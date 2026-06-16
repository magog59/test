<template>
  <section style="text-align: left">
          <div class="row new_container" v-if="client != null && (edit == null || edit.id != client.id)"  >
              <!-- <div class="col-1"></div> -->
              <div class="col-12" style="background-color: #bdccd7" >
                  <p>{{client.name}}</p>
              </div>
          </div> 
          <div class="row new_container" v-if="client != null && (edit == null || edit.id != client.id)"  style="font-size: 14px" >
              <!-- <div class="col-1"></div> -->
              <div class="col-4">
                      <b>Полное название: </b>{{ client.full_name }}<br>  
                      <b> Название: </b>{{ client.name }}<br>  
                      <b> Короткое название: </b>{{ client.short_name }}<br>  
                      <b>Тип клиента: </b>{{getClientType(client.clienttype_id).name }}<br> 				         
                      <b>Сфера деятельности: </b>{{ getSpheres(client.sphere_id).spherename }}<br> 	  
                      <b>Менеджер: </b>{{ getManager(client.manager).username }}<br> 
                      <b>Область: </b>{{ getCity(client.city_id).name }}<br> 
                      <b>ИНН: </b>{{ client.inn }}<br>     
              </div>
              <div class="col-4">
                      <b>Сайт: </b><a :href="client.site"  target="_blank">{{client.site}}</a><br>
                      <b>ОГРН: </b>{{ client.ogrn }}<br> 
                      <b>КПП: </b>{{ client.kpp }}<br> 
                      <b>ОКПО: </b>{{ client.okpo }}<br> 
                      <b>Юр. адрес: </b>{{ client.uraddress }}<br> 
                      <b>Фактический адрес: </b>{{ client.factaddress }}<br> 
                      <b>ABC: </b>{{ getABCnameById(client.abc_analize) }}<br>
              </div>
              <div class="col-4">
                  <b>Почтовый адрес: </b>{{ client.postaddress }}<br> 
                  <b>Банк: </b>{{ client.bank }}<br> 
                  <b>БИК: </b>{{ client.bik }}<br> 
                  <b>Р/С: </b>{{ client.rs }}<br> 
                  <b>К/С: </b>{{ client.ks }}<br>      
                  <b>Телефон: </b>{{ client.phone }}<br>
              </div>
              <!-- <div class="col-1"></div> -->
          </div>

          <div class="row new_container"  v-if="edit == null || edit.id != client.id" >
            <div class="col-2 justify-content-right">
                <a href="#"  >
                      <img  
                            src="../../../static/images/iconsColors/edit.png" 
                            title="Редактировать" 
                            style="max-width:20px"
                            @click="toChange(client)"
                            v-if="edit == null"
                      >
                </a>
								<a  v-if="client.ogrn !== null && client.inn !== null " :href="'https://zachestnyibiznes.ru/company/ul/'+
											client.ogrn.trim() +'_'+
											client.inn"
											target="_blank"
											>
														<img
														src="../../../static/images/iconsColors/zachestnyibiznes.png"
														title="Перейти на сайт zachestnyibiznes.ru/"
														style="max-width:30px; margin-left:40px"
											>
								</a>
								<a  v-if="client.inn !== null " :href="'https://декларации-соответствия.рус/search/?q='+client.inn"
										target="_blank"
										>
												<img
												src="../../../static/images/iconsColors/deklarachii.png"
												title="Перейти на сайт декларации-соответствия.рус"
												style="max-width:35px; margin-left:40px;margin-top: 2px"
												>
								</a>
            </div>
        </div>
	
					<div class="row" v-if="edit != null && edit.id == client.id">
              <div  class="container" style="width: 1000px;">
                    <!----Редактировать компанию---->
                    <h4 align="center" >Редактировать компанию</h4>  
                     <div class="col">
                          <button type="button" class="close" @click="edit = null" aria-hidden="true">×</button>
                    </div>
                    <div class="row "> 
                        <!---1part---->
                        <div class="col-5 offset-1">
                          
                            <div class="row"  style="margin-top: 30px"> 
                                <div style="font-size: 70%; text-align:right">Полное название</div>
                                <input type="text" class="form-control" v-model="edit.full_name" > 
                            </div>
                            <div class="row"  style="margin-top: 30px">
                                <div style="font-size: 70%; margin-right: 70%;">Название</div> 
                                <input type="text" class="form-control" v-model="edit.name" > 
                            </div>
                            <div class="row"  style="margin-top: 30px">
                                  <div style="font-size: 70%; margin-right: 70%;">Тип </div> 
                                  <select class="select" v-model="edit.clienttype_id">
                                      <option v-for="clientType in clientTypes" :key="clientType.id" v-bind:value="clientType.id">{{clientType.name}}</option>
                                  </select> 
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                  <div style="font-size: 70%; margin-right: 70%;">АВС</div>
                                  <select class="select" v-model="edit.abc_analize">
                                      <option v-for="elem in ABCList" :key="elem.id" v-bind:value="elem.id">{{elem.name}}</option>
                                  </select>
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                  <div style="font-size: 70%; margin-right: 70%;">Сфера деятельности</div>
                                  <select class="select"  v-model="edit.sphere_id" >
                                        <option  v-for="sphere in spheres" :key="sphere.id" :value="sphere.id" >{{sphere.spherename}}</option>
                                  </select>
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                  <div style="font-size: 70%; margin-right: 70%;">Менеджер</div>
                                  <select class="select"  v-model="edit.manager" >
                                      <option  v-for="user in users" :key="user.id" :value="user.id" >{{user.username}}</option>
                                  </select>
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                  <div style="font-size: 70%; margin-right: 70%;">Город</div>
                                  <select class="select"  v-model="edit.city_id" >
                                      <option  v-for="city in citys" :key="city.id" :value="city.id" >{{city.name}}</option>
                                  </select>
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                  <div style="font-size: 70%; margin-right: 70%;">Сайт</div>
                                  <input type="text" class="form-control" v-model="edit.site" > 
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                  <div style="font-size: 70%; margin-right: 70%;">ИНН</div>
                                  <input type="text" class="form-control" v-model="edit.inn" > 
                            </div>
                            <div class="row"  style="margin-top: 30px">
                                  <div style="font-size: 70%; margin-right: 70%;">ОГРН</div> 
                                  <input type="text" class="form-control" v-model="edit.ogrn" > 
                            </div>
                        </div>
                        <div class="col-5 offset-1" >
                            <!---2part---->
                            <div class="row"  style="margin-top: 30px"> 
                                <div style="font-size: 70%; text-align: right">Короткое название</div>
                                <input type="text" class="form-control" v-model="edit.short_name" > 
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                  <div style="font-size: 70%; margin-right: 70%;">КПП</div> 
                                  <input type="text" class="form-control" v-model="edit.kpp" > 
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                  <div style="font-size: 70%; margin-right: 70%;">ОКПО</div> 
                                  <input type="text" class="form-control" v-model="edit.okpo" > 
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                  <div style="font-size: 70%; margin-right: 70%;">Юр. адрес</div> 
                                  <input type="text" class="form-control" v-model="edit.uraddress" > 
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                  <div style="font-size: 70%; margin-right: 70%;">Фактический адрес</div> 
                                  <input type="text" class="form-control" v-model="edit.factaddress" > 
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                  <div style="font-size: 70%; margin-right: 70%;">Почтовый адрес</div> 
                                  <input type="text" class="form-control" v-model="edit.postaddress" > 
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                  <div style="font-size: 70%; margin-right: 70%;">Банк</div> 
                                  <input type="text" class="form-control" v-model="edit.bank" > 
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                  <div style="font-size: 70%; margin-right: 70%;">БИК</div> 
                                  <input type="text" class="form-control" v-model="edit.bik" > 
                            </div>
                            <div class="row"  style="margin-top: 30px"> 
                                  <div style="font-size: 70%; margin-right: 70%;">Р/С</div> 
                                  <input type="text" class="form-control" v-model="edit.rs" > 
                            </div>
                            <div class="row"  style="margin-top: 30px" > 
                                  <div style="font-size: 70%; margin-right: 70%;">К/С</div> 
                                  <input type="text" class="form-control" v-model="edit.ks" > 
                            </div>
														<div class="row"  style="margin-top: 30px" >
															<div style="font-size: 70%; margin-right: 70%;">Телефон</div>
															<input type="text" class="form-control" v-model="edit.phone" >
														</div>
                        </div>
                    </div>
                    <div class="row justify-content-center"  style="margin-top: 30px" >
                           <button class="btn btn-success"  @click="update">Сохранить</button>
                    </div>
                    <div style="height: 200px;"></div>

              </div>
              <!----endContainer-----> 
               
        </div>
        <!----endForm-----> 

        <div class="row new_container">
              <!-- <div class="col-1"></div> -->
              <div class="col-12">
                  <panel :id ="clientsId" v-if="edit == null || edit.id != client.id" ></panel>
              </div>
        </div>  
        <div style="height: 400px;"></div>
 </section>
</template>

<script>
  import Acl from '../../utils/acl'
  import Vuex from 'vuex'    
  import Panel from './showComponent/panel'
  

 export default {
    mixins: [Acl],
    name: 'show',
    data () {
      return {
          form:{},
          search: null,
          page: null,
          edit: null,
          user: null,
          params: null,
          clientsId: this.$route.params.id,
          localStorage: null
      }
    },
    components: {
      Panel,
    },
    computed: {
      ...Vuex.mapGetters({
            apiUrl: 'app/apiUrl',
            clients: 'clients/clientAccount',
            pagination: 'clients/pagination',
            users: 'app/users',
            citys: 'city/datalist',
            clientTypes: 'dictionary/clientType',
            ABCList: 'dictionary/ABCList',
            spheres: 'sphere/datalist',
            storeForm: 'mybuisness/form',
             
      }), 
      client(){
         return  this.clients[0]
      }
    },
    methods: {
      ...Vuex.mapMutations({
          setMessage: 'app/setMessage',
          setError: 'app/setError',
          setHeader:'app/setCurrentPageHeader',
          setForm:'mybuisness/setForm',  
      }),
      ...Vuex.mapActions({
          save: 'clients/save',
          find: 'clients/findNew',
          drop: 'outcall/delete',
          findSphere: 'sphere/find',
          findUsers: 'app/getUsers',
          findCity: 'city/findAll',
          // findDoc: 'document/findAll',
      }),
      saveData(){
        this.setError(null)
        this.save(this.form)
            .then(() =>{
              this.findData()
            })
      },
      update() {
        this.setError(null)
        this.save(this.edit)
            .then(() =>{
              this.edit = null
              this.findData()
            })
      },
      deleteData(id){
        this.setError(null)
        this.drop(id)
            .then(() =>{
                this.findData()
            })
      },
      toChange(model){
          this.edit = Object.assign({}, model)
      },
      setPage(i){
        this.page = i
        this.findData()
      },
      findData(){
          this.find(this.$route.params.id) 
         
      },
      returnTo(){
        this.$router.push('../../mybuisness/')
      },
      getCity(id){
          var res = {}
          this.citys.map((el) => {  
            if(id === el.id){
                res = el
            }
          })
          return res
      },
      getClientType(id){
        var rezult = {}
        this.clientTypes.map((el) => {
            if(id === el.id){
              rezult = el
            }
        })
        return rezult
      },
      getSpheres(id){
          var result = {}
          this.spheres.map((el) => {
              if (id === el.id) {
                  result = el
              }
          })
          return result
      },
      getManager(id){
            if(id == null && id === ''){
              return
            }
            var result = {}
            this.users.map((el) => {
            if (id === el.id) {
                  result = el
                }
            })
            return result   
      },
      getLocalStorage(){
        var obj = {}
        if (localStorage.getItem('storeForm')){
            obj = JSON.parse(localStorage.getItem('storeForm'))
            this.localStorage = Object.assign({}, obj)
            this.setForm(this.localStorage)
        }
      },
      getABCnameById(id) {
        let name = ''
        this.ABCList.map((element) => {
          if (element.id == id) {
            name = element.name
          }
        })
        return name
      },
    },
    created() {
      this.findData()
      this.setHeader('Компания')
      this.findSphere()
      this.findUsers()
      this.findCity()
      this.getLocalStorage()
    }
  }
</script>
<style >
.panel-default {
    border-color: #ddd;
}
.panel-heading {
    color: #333;
    background-color: #f5f5f5;
    border-color: #ddd;
    text-align:left
}
.panel {
  border: 1px solid ;
  text-align:left
   
}
.panel-body {
    padding: 15px;
}
.new_container{
  padding: 0 35px;
}
</style>
