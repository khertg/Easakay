<template>
    <b-modal id="addbus-modal-tall" title="Add Bus" @ok="addBus">
        <b-form-group label="Name: ">
            <b-form-input v-model="name" type="text" name="name" placeholder="Enter name"></b-form-input>
        </b-form-group>
        <b-form-group label="Image:" label-for="file-default">
            <b-form-file name="imageData" v-model="imageData"></b-form-file>
        </b-form-group>
        <b-form-group label="Image Icon:" label-for="file-default">
            <b-form-file name="imageIconData" v-model="imageIconData"></b-form-file>
        </b-form-group>
        <b-form-group label="Plate Number: ">
            <b-form-input v-model="plateNumber" name="plateNumber" type="text" placeholder="Enter plate number"></b-form-input>
        </b-form-group>
        <b-form-group label="Bus Type: ">
            <b-form-input v-model="busType" name="busType" type="text" placeholder="Enter bus type"></b-form-input>
        </b-form-group>
        <b-form-group label="Company: ">
            <b-form-input v-model="company" name="company" type="text" placeholder="Enter company"></b-form-input>
        </b-form-group>
         <b-form-group label="Departure Time: ">
            <b-form-input v-model="departureTime" name="departureTime" type="text" placeholder="Enter departure time"></b-form-input>
        </b-form-group>
         <b-form-group label="Arrival Time: ">
            <b-form-input v-model="arrivalTime" name="arrivalTime" type="text" placeholder="Enter arrival time"></b-form-input>
        </b-form-group>
         <b-form-group label="Departure Date: ">
            <b-form-input v-model="departureDate" name="departureDate" type="date" placeholder="Enter departure date"></b-form-input>
        </b-form-group>
         <b-form-group label="Fare: ">
            <b-form-input v-model="fare" name="fare" type="text" placeholder="Enter fare"></b-form-input>
        </b-form-group>
         <b-form-group label="Available Seats: ">
            <b-form-input v-model="availableSeats" name="availableSeats" type="text" placeholder="Enter available seats"></b-form-input>
        </b-form-group>
         <b-form-group label="From: ">
            <b-form-input v-model="from" name="from" type="text" placeholder="Enter from"></b-form-input>
        </b-form-group>
         <b-form-group label="To: ">
            <b-form-input v-model="to" name="to" type="text" placeholder="Enter to"></b-form-input>
        </b-form-group>
         <b-form-group label="Address: ">
            <b-form-input v-model="address" name="address" type="text" placeholder="Enter address"></b-form-input>
        </b-form-group>

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