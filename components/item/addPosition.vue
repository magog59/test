<template>
    <section>
           <!-- <div class="row " >
               <div  class="container" style="width: 1000px;">

                   <h4 align="center" >Изменить позицию</h4> 
                    <div class="col">
                        <button type="button" class="close" @click="edit = null" aria-hidden="true">×</button>
                    </div> 
                    <div class="row">
                       
                        <div class="col-5 offset-1">
                            <div class="row"  style="margin-top: 30px"> 
                                <div style="font-size: 70%; margin-right: 50%;">Документ</div>
                                        <select class="select"  v-model="form.document_id" >
                                              <option  v-for="document in documents" :key="document.id" :value="document.id" >{{document.name}}</option>
                                        </select>  
                                  </div>
                                  <div class="row" style="margin-top: 30px"> 
                                        <div style="font-size: 70%; margin-right: 70%;">Название</div>
                                        <textarea class="form-control"  v-model="form.nameproduct" placeholder="Название" style="height: 100px;"  ></textarea>
                                  </div>
                                  <div class="row" style="margin-top: 30px"> 
                                        <div style="font-size: 70%; margin-right: 70%;">Тип</div>
                                        <input type="text" class="form-control" v-model="form.typemarkmodel" >
                                  </div>
                                  <div class="row" style="margin-top: 30px"> 
                                        <div style="font-size: 70%; margin-right: 40%;">Срок оформления</div>
                                        <input type="text" class="form-control" v-model="edit.days" >
                                  </div>
                                  <div class="row" style="margin-top: 30px"> 
                                    <div style="font-size: 70%; margin-right: 50%;">Время</div>
                                       <select class="select"  v-model="form.timeline" >
                                          <option  v-for="item in timeline" :key="item.id" :value="item.id" >{{item.name}}</option>
                                      </select>
                                  </div>
                                 
                            </div>
                           
                            <div class="col-5 offset-1">
                               <div class="row"  style="margin-top: 30px"> 
                                      <div style=" font-size: 70%;text-align:rigth">Стоимость </div>
                                      <input type="text" class="form-control" v-model="form.cost" >
                                </div> 
                                <div class="row"  style="margin-top: 30px"> 
                                      <div style="font-size: 70%; text-align:rigth">Постащик</div>
                                      <select class="select"  v-model="form.provider_id" >
                                          <option  v-for="provider in providers" :key="provider.id" :value="provider.id" >{{provider.name}}</option>
                                      </select>
                                </div>
                                <div class="row"  style="margin-top: 30px"> 
                                      <div style="font-size: 70%; text-align:rigth">Скидка</div>
                                      <input type="text" class="form-control" v-model="form.discount" placeholder="Скидка">
                                </div>
                                <div class="row"  style="margin-top: 30px"> 
                                      <div style=" font-size: 70%;text-align:rigth">Себестоимость ед</div>
                                      <input type="text" class="form-control" v-model="form.our_cost" >
                                </div> 
                               
                                <div class="row"  style="margin-top: 30px"> 
                                      <div style=" font-size: 70%;text-align:rigth">ПИ на руки</div>
                                      <select class="select"  v-model="form.pionhand" @keypress.enter.prevent="this.form.pionhand">
                                              <option value="10">ДА</option>
                                              <option value="20">НЕТ</option>
                                      </select>
                                </div> 
                                 <div class="row"  style="margin-top: 30px"> 
                                      <div style=" font-size: 70%;text-align:rigth">Инспекционный контроль</div>
                                      <select class="select"  v-model="form.control" @keypress.enter.prevent="this.form.control">
                                              <option value="10">ДА</option>
                                              <option value="20">НЕТ</option>
                                      </select>
                                </div> 
                            </div>
                      </div>
                     
                      <div class="row justify-content-center"  style="margin-top: 30px" >
                            <button class="btn btn-success"  @click="update">Сохранить</button>
                      </div>
                      <div style="height: 200px;"></div>
                   
                </div>
              
           
            </div> -->
    </section>
</template>
<script>
export default {
    name: 'addPosition',
    props:['form']
}
</script>>