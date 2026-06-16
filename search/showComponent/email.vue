<template>
    <section>
      <div class="form-row justify-content-end">
           <div class="col-4"></div>
           <pagination class="col-4" @setPage="setPage" :padding="2" :totalpages="pagination.total/pagination.limit" :page="pagination.page"></pagination>
        </div>
      <table class="table table-border table-hover" style="margin-top:20px">
            <tr align="left">
                <th>Название</th>
                <th>E-mail</th>
                <th>Comment</th>
            </tr>
            <tbody v-for="model in datalist.data" :key="model.idx">
            <tr align="left">
                <!-- <td>{{model.name}}</td> -->
                   <td><a  target="_blank" :href="'/clients/show/'+ model.id+''" >{{model.name}}</a></td>
                <td>{{model.email}}</td>
                <td>{{model.comment}}
                     
              </td>
            </tr>
            </tbody>
        </table>
    </section>
</template>

<script>
  import Acl from '../../../utils/acl'
  import Vuex from 'vuex'
  import pagination from "../../../utils/pagination"
 
  export default {
    mixins: [Acl],
    name: 'email',
    props:['search'],
    data() {
      return {
        form: {
        },
        page: null,
        edit: null,
      }
    },
    components: {
      pagination
    },
    computed: {
      ...Vuex.mapGetters({
        apiUrl: 'app/apiUrl',
        datalist: 'search/byEmail',
        pagination: 'search/pagination'
    }),
    },
    methods: {
      ...Vuex.mapMutations({
        setMessage: 'app/setMessage',
        setError: 'app/setError',
        setHeader: 'app/setCurrentPageHeader'
      }),
      ...Vuex.mapActions({
          find: 'search/findCients',
      }),
      setPage(i) {
        this.page = i
        this.findData()
      },
      findData() {
        this.find({page: this.page, search: this.search})
      },
      toComments(id){
          this.$store.commit('comments/setValComment', {object_id:id, type:90,  component:'',  radom: Math.random().toFixed(2) }, {root: true})
      },
    },
    created() {
      this.setHeader('E-mail')
      this.page = this.pagination.page
    }
  }
</script>
<style>
    .disabled {
        color: lightgrey;
    }

</style>
