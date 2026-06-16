<template>
  <section >
        <div class="" >
                <div class="panel row" style="padding: 0 15px">
                    <div class="" >
                        <a href="#"  @click="showComponent('contacts')" :class="[contacts ? 'color ' : ''] ">Контакты<span class="badge">{{  contactsPagination.total ? contactsPagination.total : 0 }}</span></a>
                    </div>
                    <div class="col">
                        <a href="#"  @click="showComponent('outcall')" :class="[outcall ? 'color ' : '']" >Звонки<span class="badge">{{  outcallPagination.notice ? outcallPagination.notice : 0 }}</span></a>
                    </div>
                    <div class="">
                        <a href="#"  @click="showComponent('lead')" :class="[lead ? 'color ' : '']">ЭК<span class="badge"  >{{  leadPagination.notice ? leadPagination.notice : 0 }}</span></a>
                    </div>
                    <div class="col">
                        <a href="#"  @click="showComponent('application')" :class="[application ? 'color ' : '']" >Заявки<span class="badge" >{{  applPagination.notice ? applPagination.notice : 0}}</span></a>
                    </div>
                    <div >
                        <a href="#"    @click="showComponent('kp')" :class="[kp ? 'color ' : '']" >Комм-ские<span class="badge" >{{  kpPagination.notice ? kpPagination.notice : 0}}</span></a>
                    </div>
                    <div class="col">
                        <a href="#"   @click="showComponent('agreement')" :class="[agreement ? 'color ' : '']">Договоры<span class="badge" >{{  agreementPagination.notice ? agreementPagination.notice : 0}}</span></a>
                    </div>
                    <div class="col">
                        <a href="#"   @click="showComponent('ork')" :class="[ork ? 'color ' : '']"  >ОРК<span class="badge" >{{  orkPagination.notice ? orkPagination.notice : 0}}</span></a>
                    </div>
                    <div >
                        <a href="#"   @click="showComponent('callStory')" :class="[callStory ? 'color ' : '']"  >История звонков<span class="badge" >{{  callsPagination.total ? callsPagination.total : 0}}</span></a>
                    </div>
                    <div class="col">
                        <a href="#"   @click="showComponent('story')" :class="[story ? 'color ' : '']"  >История<span class="badge" > 0</span></a>
                    </div>
                    <div class="col">
                        <a href="#"   @click="showComponent('doc') " :class="[doc ? 'color ' : '']"  >Док-ты<span class="badge" >{{  documentPagination.total ? documentPagination.total : 0}}</span></a>
                    </div>

                </div>
    
                <contacts  v-if="contacts" :clients_id="id" ></contacts>
                <outcall  v-if="outcall" :showButtonForm="true"  :clients_id="id" :panel="true"></outcall>
                <lead  v-if="lead"  :showButtonForm="true" :clients_id="id" :panel="true"></lead>

                <application  v-if="application" :our_cost="true" :panel="true" :clients_id="id"></application>
                <kp  v-if="kp && !showItem" :panel="true" :clients_id="id" ></kp>
                <agreement  v-if="agreement && !showItem" :panel="true" :clients_id="id"></agreement>
                <ork  v-if="ork && !showItem" :panel="true" :clients_id="id"></ork>

                <Item  
                        v-if="showItem && (kp||agreement||ork)" 
                        :kpId="showItem.kp_id" 
                        :agreementId="showItem.agreement_id"  
                        :orkId="showItem.ork_id"  
                        :clients_id="id"  
                        :panel="true"
                />


                <callStory  v-if="callStory" :clients_id="id" ></callStory>
                <story  v-if="story" ></story>
                <doc  v-if="doc" :clients_id="id" ></doc>
                <comments  v-if="comments" :clients_id="id"  ></comments>
        
        </div> 
    </section>
</template>

<script>
import Contacts from '../showComponent/contacts'
import Outcall from '../../mybuisness/outcall'
import Lead from '../../mybuisness/lead'
import Application from '../../mybuisness/application'
import Kp from '../..//mybuisness/kp'
import Agreement from '../../mybuisness/agreement'
import Ork from '../../mybuisness/ork'
import Item from '../../item'
import callStory from '../showComponent/callStory'
import Story from '../showComponent/story'
import Doc from '../showComponent/doc'
import Comments from '../../comments'
import Vuex from 'vuex'

export default {
    name: 'panel',
    props: ['id'],
    data () {
        return {
            tempForm: { clients_id: this.id}, 
            showForm: false,    
            comments:false,
            contacts: true,
            outcall: false,
            lead: false,
            application: false,   
            kp: false,
            agreement: false,
            ork: false,
            callStory:false,
            story:false,
            doc:false,
            isActive: null
        }
    },
     components:{
        Contacts,
        Outcall,
        Lead,
        Application,
        Kp,
        Agreement,
        Ork,
        callStory,
        Story,            
        Doc,  
        Comments,   
        Item         
    },
    watch:{
        valComent: function(){
            this.comments = true
            this.contacts = false
            this.outcall= false
            this.lead= false
            this.application= false
            this.kp = false,
            this.agreement = false
            this.ork = false
            this.callStory = false
            this.story =false
            this.doc = false   
        },
        commentClose(val){
          this.comments = val.state
          this[val.component] = true
        },
    },
    computed:{
        ...Vuex.mapGetters({
                user: 'auth/user',
                apiUrl: 'app/apiUrl',
                storeForm: 'mybuisness/form',   
                managers: 'app/users',
                valComentStore: 'comments/valComent',
                contactsPagination: 'contacts/pagination',
                outcallPagination: 'outcall/pagination',
                leadPagination: 'lead/pagination',
                applPagination: 'application/pagination',
                kpPagination: 'kp/pagination',
                agreementPagination: 'agreement/pagination',
                orkPagination: 'ork/pagination',
                callsPagination: 'calls/pagination',
                documentPagination: 'document/pagination',
                showItem: 'item/showItem',
                commentClose: 'comments/commentClose',
        }),
        form(){
            return  Object.assign({}, this.storeForm)  
        },
        valComent(){
            return  Object.assign({}, this.valComentStore)  
        },
       
      },
    methods:{
        ...Vuex.mapMutations({
                setPanelForm:'mybuisness/setPanelForm',
                setHeader:'app/setCurrentPageHeader' 
         }),
        ...Vuex.mapActions({
                findOutcall: 'outcall/find',
                findLead: 'lead/find',
                findApplication: 'application/find',   
                findKp: 'kp/find',
                findAgreement: 'agreement/find',
                findOrk: 'ork/find',
                findCalls: 'calls/find',
                findContacts: 'contacts/find',
                findDocument: 'document/findDocItem',
                findUsers: 'app/getUsers'
        }),
        commentShow(){
            if(this.valComent.id != ''){
                this.comments = true
            }
        },
        setF(){
            var obj = {}
            obj.clients_id = this.id
            this.sendForm(obj)
            
        },
        sendForm(obj){ 

            this.findOutcall(obj)
            this.findLead(obj)
            this.findApplication(obj)  
            this.findKp(obj)
            this.findAgreement(obj)
            this.findOrk(obj)
            this.findCalls(obj)
            this.findContacts(obj)
            this.findDocument(obj)
        },
        showComponent(comp){ 
            this.contacts = false
            this.outcall = false 
            this.lead = false  
            this.application = false   
            this.kp = false  
            this.agreement = false  
            this.ork = false  
            this.callStory = false  
            this.story = false  
            this.doc = false  
            this.comments = false  

            if(comp != null && comp != '') {
                this[comp] = true
            }
        },
    },
    created (){
        this.setHeader('Аккаунт компании') 
        this.setF()
    },
 
  }
</script>
<style scoped>

.panel.a{
    color:blue
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
.color{
    color: red
}
</style>