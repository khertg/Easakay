<template>
    <b-modal id="addbus-modal-tall" title="Add Bus" @ok="addBus">

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
                Add
            </b-button>
            <b-button size="sm" variant="danger" @click="cancel()">
                Cancel
            </b-button>
        </template>
    </b-modal>
</template>

<script>
import { EventBus } from '../main';
import uuid from 'uuid';

export default {
    name:"AddBusModal",
    data() {
        return {
            name: "test",
            image: "",
            image1: "",
            plateNumber: "test-123",
            busType: "Aircon",
            company: "Ceres",
            departureTime: "08:00 AM",
            arrivalTime: "04:00 PM",
            departureDate: Date.now().toString(),
            fare:"150 pesos",
            availableSeats: 50,
            from: "South bus terminal",
            to: "Argao",
            address: "123 street talamban, cebu city",
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
        addBus(e){
            let busData = new FormData();
            busData.append('bus_id', uuid.v4());
            busData.append('name', this.name);
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
            EventBus.$emit('crudAddBus',busData);
        }
    },
}
</script>