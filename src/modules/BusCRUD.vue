<template>
    <div>
        <div class="container h-100" style="margin-top:60px;">
            <div class="row h-100 justify-content-center align-items-center">
                <b-card header-tag="header" footer-tag="footer" style="width:80rem;">
                    <template v-slot:header>
                        <h6 class="mb-0">BUS CRUD
                            <b-button variant="primary" size="sm" class="float-right" v-b-modal.addbus-modal-tall >Add Bus</b-button>
                            <b-button variant="success" style="margin-right:0.5rem;" size="sm" class="float-right" @click="notify()" >Notify</b-button>
                        </h6>
                    </template>
                    <b-table small :fields="fields" :items="buses" responsive="sm" class="mt-3" outlined>
                        <template v-slot:cell(image)="data">
                            <img :src="data.item.image" alt="" width="50" height="50">
                        </template>

                        <template v-slot:cell(name)="data">
                            {{ data.item.name }}
                        </template>

                        <template v-slot:cell(busType)="data">
                            <b class="text-info">{{ data.item.busType.toUpperCase() }}</b>
                        </template>

                        <template v-slot:cell(actions)="data">
                            <div class="table-button-container">
                                <b-button variant="danger" size="sm" @click.prevent="deleteBus(data.item.bus_id)">DELETE</b-button> &nbsp;
                                <b-button v-b-modal.updatebus-modal-tall size="sm" @click="instanciateDataForUpdate(data.item)">UPDATE</b-button>
                            </div>
                        </template>  
                    </b-table>
                    <template v-slot:footer>
                        <em>Copyrights reserved &#9400;2019</em>
                    </template>
                </b-card>
            </div>  
        </div>

        <AddBusModal/>
        <UpdateBusModal/>
        
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
            fields: [
                 { key: 'image', label: 'Image'},
                 { key: 'name', label: 'Name'},
                 { key: 'plateNumber', label: 'Plate Number'},
                 { key: 'busType', label: 'Bus Type'},
                 ,'company'
                 ,'fare'
                 ,'availableSeats'
                 ,'actions'
            ],
            buses : [],
            show : false,
            showMode : '',
            modalLabel : '',
            bus : null
        }
    },
    sockets: {
        connect: function () {
            console.log('socket connected')
        }
    },
    methods: {
        //This function will send username to the server.
        notify(){
            this.$socket.emit("notification", { username: localStorage.getItem("username") });
        }
        ,deleteBus(bus_id){
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

        const channelName = 'channel.'+ localStorage.getItem('username');
        this.sockets.subscribe(channelName, (data) => {
        //  this.sockets.subscribe('channel.'+ localStorage.getItem('username'), (data) => {
            alert(data.message);
        });

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