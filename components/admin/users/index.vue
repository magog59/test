<template>
    <div>
        <div class="row">
              <div class="col-lg-3 col-sm-4">
                  <input class="form-control" @keyup="findUsers(search)" @change="getUsers(search)" v-model="search" type="text">
              </div>
              <div class="col-lg-1 offset-1">
                  <button v-if="can('rbacManage')" class="btn btn-primary" @click.prevent="addModalShow = true">Добавить</button>
              </div>
        </div>
        <div class="row" style="margin-top: 10px;">
            <table class="table clients table-hover">
                <thead>
                <tr>
                    <th scope="col-lg">№</th>
                    <th scope="col-lg">Id</th>
                    <th scope="col-lg">Имя</th>
                    <th scope="col-lg">Электронный адрес</th>
                    <th scope="col-lg">Статус</th>
                    <th scope="col-lg" >Лимит ОРК</th>
                    <th scope="col-lg" >Маржа</th>
                    <th scope="col-lg">Caller_id</th>
                    <th scope="col-lg">Права / Роль</th>
                    <th scope="col-lg" v-if="can('rbacManage')"></th>      
                    <th scope="col-lg" v-if="can('rbacManage')"></th>
                </tr>
                </thead>
                <tbody v-for="(user, idx) in users" v-bind:key="user.id" >
                <tr   v-if="edit == null || edit.id != user.id" >
                    <td>{{ idx + 1 }}</td>
                    <td><a :href="'/profile/' + user.id">{{ user.id }}</a></td>
                    <td>{{ user.username }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ userStatuses[user.status]}}</td>
                    <td>{{user.limit_ork}}</td>
                    <td >{{getMarge(user.id)}}</td>
                    <td>{{user.caller_id}}</td>
                    <td><a :href="'/rightsUser/' + user.id">{{ user.id }}</a></td>
                      <td  >
                            <a  a href="#" 
                                v-if="can('rbacManage')"
                                 @click="toChange(user)">
                                      <img  src="../../../../static/images/iconsColors/edit.png" 
                                            title="Редактировать" 
                                            style="max-width:20px"
                                      >
                            </a>
                      </td> 
                    <td>
                        <confirm-button v-if="can('rbacManage')"
                                        :css="'fui-trash'"
                                        v-on:confirmation-success="deleteUsers(user.id)"
                                        title="Заблокировать пользователя">
                        </confirm-button>
                    </td>
                </tr>
                 <tr v-if="edit != null && edit.id === user.id" >
                      <td></td>
                      <td></td>
                      <td><input type="text" class="form-control" v-model="edit.username"></td>
                      <td><input type="text" class="form-control" disabled="disabled"></td>
                      <td>
                          <select class="select"  v-model="edit.status" >
                              <option  value="10" >Новый</option>
                              <option  value="20" >Активный</option>
                              <option  value="30" >Заблокированный</option>
                          </select>
                      </td>
                      <td><input type="text" class="form-control"  v-model="edit.limit_ork"></td>
                      <td></td>
                       <td><input type="text" class="form-control" v-model="edit.caller_id"></td>
                      <td><input type="text" class="form-control" disabled="disabled"></td>
                      <td><a class="fui-check" @click="update"></a></td>
                      <td><a class="fui-cross" @click="edit = null"></a></td>
                  </tr>
                </tbody>
            </table>
        </div>
        <add-form
                @closeAddForm="closeAddForm"
                @addUser="addUser"
                :isVisible="addModalShow"
                :newUser="newUser"/>
    </div>
</template>

<script>
  import Http from '../../../utils/http'
  import AddForm from './addForm'
  import Acl from '../../../utils/acl'
  import Vuex from 'vuex'
  import confirmButton from "../../../utils/confirmButton";

  export default {
    mixins: [Acl],
    name: 'users',
    data() {
      return {
        addModalShow: false,
        search: '',
        newUser: {
          email: null,
        },
        edit: null,
        permissions: []
      }
    },
    components: {
      AddForm, confirmButton

    },
    computed: {
      ...Vuex.mapGetters({
        apiUrl: 'app/apiUrl',
        userStatuses: 'app/userStatuses',
        users: 'app/users',
        userMarge: 'ork/userListMarge'
      }),
    },
    methods: {
      ...Vuex.mapActions({
        getUsers: 'app/getUsers',
        deleteUser: 'app/deleteUser',
        updateUs: 'app/updateUser',
        setLimit: 'ork/setLimit',
        getUserListMarge: 'ork/getUserListMarge'
      }),
      ...Vuex.mapMutations({
            setError: 'app/setError',
      }),
      findUsers(query){
        this.getUsers(query)
      },
      deleteUsers(id) {
        this.deleteUser(id)
          .then(() => {
            this.getUsers()
          })
      },
      addUser() {
        Http.post(this.apiUrl + 'user/create', {"User": {"email": this.newUser.email}})
          .then(() => {
            this.getUsers()
            this.newUser.email = null
            this.closeAddForm()
          })
          .catch((e) => {
            this.setError(e.response)
          })

      },
      closeAddForm() {
        this.addModalShow = false
      },
      toChange(model){
          this.edit = Object.assign({}, model)
        
      },
      update() {
            this.setError(null)
            this.updateUs(this.edit)
                .then(() =>{
                      this.edit = null
                      this.getUsers()
                })  
      },
      getMarge(id){
         return this.userMarge[id]
      }
     
    },
    created() {
      this.$store.commit('app/setCurrentPageHeader', 'Список пользователей')
      this.getUsers()
      this.getUserListMarge()
    }
  }
</script>
