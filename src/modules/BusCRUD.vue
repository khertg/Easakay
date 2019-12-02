<template>
    <div>
        <h3>Bus Crud</h3>
        <div>
            <b-button variant="primary" v-b-modal.addbus-modal-tall >Add Bus</b-button>
            <AddBusModal/>
            <UpdateBusModal/>
        </div>

        <div v-bind:key="bus.bus_id" v-for="bus in buses">
            <div>
                 <b-row>
                    <div class="col-sm-2">
                    <br />
                    <b-img id="image" thumbnail fluid v-bind:src="bus.image" alt="Image 1"></b-img>

                    <p>{{ bus.name }} {{ bus.plateNumber }} . {{ bus.busType }}</p>
                    </div>
                    <div class="col-sm-3">
                    <h5 class="text-center">{{ bus.company }}</h5>
                    <hr />

                    <p>
                        Departure Time: {{ bus.departureTime }}
                        <br />Arrival Time: {{ bus.arrivalTime }}
                        <br />Date: {{ bus.departureDate }}
                    </p>
                    </div>
                    <div class="col-sm-5">
                    <h5 class="text-center">{{ bus.busRoute.from }} - {{ bus.busRoute.to }}</h5>
                    <hr />
                    </div>
                    <div class="col-sm-2">
                    <h5 class="text-center">{{ bus.availableSeats }} Seats</h5>
                    <hr />

                    <b-form >
                        <b-button variant="danger" @click.prevent="deleteBus(bus.bus_id)">DELETE</b-button> &nbsp;
                        <b-button v-b-modal.updatebus-modal-tall @click="instanciateDataForUpdate(bus)">UPDATE</b-button>
                    </b-form>
                    </div>
                </b-row>
                
            </div>
        </div>
        
    </div>
</template>

<script>
import AddBusModal from '../components/AddBusModal';
import UpdateBusModal from '../components/UpdateBusModal';
import { EventBus } from '../main';
import axios from 'axios';

let url = "http://localhost:8082/crud/buses";
let config = { headers: {'Content-Type': 'multipart/form-data'} };

export default {
    components:{
        AddBusModal,
        UpdateBusModal
    },
    name:"BusCRUD",
    data(){
        return {
            buses : [],
            show : false,
            showMode : '',
            modalLabel : '',
            bus : null
        }
    }, 
    methods: {
        deleteBus(bus_id){
            this.$bvModal.msgBoxConfirm('Are you sure you want to delete this bus?.', {
                title: 'Please Confirm',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            })
            .then(value => {
                if(value){
                    EventBus.$emit('crudDeleteBus',{data : { bus_id: bus_id }});
                }
            })
            .catch(err => {
                alert("An error occured!")
            })
        },
        instanciateDataForUpdate(bus){
            EventBus.$emit('fillInputsForUpdate',bus);
        },
        showModal(showMode, modalLabel, bus = null){
            this.show = true;
            this.showMode = showMode;
            this.modalLabel = modalLabel;
            this.bus = bus;

            if(showMode =='update'){
                EventBus.$emit('fillInputsForUpdate',bus);
                this.$bvModal.show('modal-tall')
            }
        },
        close(){
            this.show = false;
            this.showMode = '';
        },
        getAllBus(){
            this.buses = [];
             axios.get(url)
                .then((resp)=>{
                    console.log(resp);
                    this.buses = resp.data.buses;
                })
                .catch((err)=>{
                    alert("Error getting all Bus!")
                })
        }
    },
    mounted(){

        //ADDING A BUS
        EventBus.$on('crudAddBus',(data)=>{
            axios.post(url,data,config)
                .then((resp)=>{
                    console.log(resp);
                    this.buses = [...this.buses, resp.data.bus];
                    this.$bvModal.msgBoxOk(resp.data.message, {
                        title: 'Info',
                        size: 'sm',
                        buttonSize: 'sm',
                        okVariant: 'success',
                        headerClass: 'p-2 border-bottom-0',
                        footerClass: 'p-2 border-top-0',
                        centered: true
                        })
                })
                .catch((err)=>{
                    console.log(err)
                    alert("Error adding Bus!")
                })
        })

        //UPDATING A BUS
        EventBus.$on('crudUpdateBus',(data)=>{
            axios.put(url,data,config)
                .then((resp)=>{
                    console.log(resp);
                    var foundIndex = this.buses.findIndex(x => x.bus_id == resp.data.bus.bus_id);
                    this.$set(this.buses,foundIndex,resp.data.bus)

                    this.$bvModal.msgBoxOk(resp.data.message, {
                        title: 'Info',
                        size: 'sm',
                        buttonSize: 'sm',
                        okVariant: 'success',   
                        headerClass: 'p-2 border-bottom-0',
                        footerClass: 'p-2 border-top-0',
                        centered: true
                        })
                })
                .catch((err)=>{
                    console.log(err)
                    alert("Error updating Bus!")
                })
        })

        //DELETING A BUS
        EventBus.$on('crudDeleteBus',(data)=>{
            console.log(data)
            axios.delete(url,data)
                .then((resp)=>{
                    console.log(resp);
                    this.buses = this.buses.filter(bus => bus.bus_id !== resp.data.bus_id)
                    this.$bvModal.msgBoxOk(resp.data.message, {
                        title: 'Info',
                        size: 'sm',
                        buttonSize: 'sm',
                        okVariant: 'success',
                        headerClass: 'p-2 border-bottom-0',
                        footerClass: 'p-2 border-top-0',
                        centered: true
                        })
                })
                .catch((err)=>{
                    console.log(err)
                    alert("Error deleting Bus!")
                })
        })



    },
    created(){
         axios.get(url)
            .then((resp)=>{
                console.log(resp);
                this.buses = resp.data.buses;
            })
            .catch((err)=>{
                alert("Error getting all Bus!")
            })
    }
}
</script>