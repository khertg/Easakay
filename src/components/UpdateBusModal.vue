<template>
    <b-modal id="updatebus-modal-tall" title="Update Bus" @ok="updateBus">
        <h6>Bus Main Details</h6>
        <span>Name:</span> <input name="name" v-model="name" > <br>
        <span>Image:</span> <input name="image" type="file" @change="uploadImage($event)"> <br>
        <span>Icon Image:</span> <input name="image1" type="file" @change="uploadIconImage($event)"> <br>
        <span>PlateNumber:</span> <input name="platenumber" v-model="plateNumber" > <br>
        <span>BusType:</span> <input name="busttype" v-model="busType"> <br>
        <span>Company:</span> <input name="company" v-model="company"> <br>
        <span>DepartureTime:</span> <input name="departuretime" v-model="departureTime"> <br>
        <span>ArrivalTime:</span> <input name="arrivaltime" v-model="arrivalTime"> <br>
        <span>DepartureDate:</span> <input name="departuredate" v-model="departureDate"> <br>
        <span>Fare:</span> <input name="fare" v-model="fare"> <br>
        <span>AvailableSeats:</span> <input name="availableseats" type="number" v-model="availableSeats"> <br>
        <hr/>

        <h6>Bus Route</h6>
        <span>From:</span> <input name="from" v-model="from"> <br>
        <span>To:</span> <input name="to" v-model="to"> <br>
        <span>Address:</span> <input name="address" v-model="address"> <br>

        <template v-slot:modal-footer="{ cancel, ok }">
            <b-button size="sm" variant="success" @click="ok()">
                Update
            </b-button>
            <b-button size="sm" variant="danger" @click="cancel()">
                Cancel
            </b-button>
        </template>
    </b-modal>
</template>

<script>
import { EventBus } from '../main';

export default {
    name:"UpdateBusModal",
    props:["bus"],
    data() {
        return {
            name: "",
            image: "",
            image1: "",
            plateNumber: "",
            busType: "",
            company: "",
            departureTime: "",
            arrivalTime: "",
            departureDate: Date.now().toString(),
            fare:"",
            availableSeats: 0,
            from: "",
            to: "",
            address: "",
            imageData: null,
            imageIconData: null
        }
    },
    methods:{
        uploadImage(e){
            this.imageData = e.target.files[0];
        },
        uploadIconImage(e){
            this.imageIconData = e.target.files[0];
        },
        updateBus(){

            let busData = new FormData();
            busData.append('bus_id', this.bus_id);
            busData.append('name', this.name);
            busData.append('image', this.image);
            busData.append('image1', this.image1);
            busData.append('imageFile',this.imageData);
            busData.append('iconBusFile',this.imageIconData);
            busData.append('plateNumber', this.plateNumber);
            busData.append('busType', this.busType);
            busData.append('company', this.company);
            busData.append('departureTime', this.departureTime);
            busData.append('arrivalTime', this.arrivalTime);
            busData.append('departureDate', this.departureDate);
            busData.append('fare', this.fare);
            busData.append('availableSeats', this.availableSeats);
            busData.append('from', this.from);
            busData.append('to', this.to);
            busData.append('address', this.address);
            
            console.log(busData);
            EventBus.$emit('crudUpdateBus',busData);
        }
    },
    created(){

        EventBus.$on('fillInputsForUpdate',(bus)=>{
            this.bus_id = bus.bus_id;
            this.name = bus.name;
            this.image = bus.image;
            this.image1 = bus.image1;
            this.plateNumber = bus.plateNumber;
            this.busType = bus.busType;
            this.company = bus.company;
            this.departureTime = bus.departureTime;
            this.arrivalTime = bus.arrivalTime;
            this.departureDate = bus.departureDate;
            this.fare = bus.fare;
            this.availableSeats = bus.availableSeats;
            this.from = bus.busRoute.from;
            this.to = bus.busRoute.to;
            this.address = bus.busRoute.address;
        })
    }
}
</script>