<template>
    <div class="shiftData">
        <input type="checkbox" v-model="shift.selected" />
        <div class="shiftData_contentSide">
            <p>{{ formatShiftTime(shift.startedAt) + '-' + formatShiftTime(shift.endedAt) }}</p>
            <p>{{ shift.id + ' - ' + shift.userName + ' ' }}<span>{{ shift.chiName }}</span></p>
            <div class="stateRow">
                <div v-if="shift.role === 'ST'" class="highlightTurquoiseGreen"></div>
                <div v-else-if="shift.role === 'EN'" class="highlightTurquoiseRed"></div>
                <div v-else class="highlightTurquoiseBlue"></div>
                <p>{{ shift.role }}</p>
            </div>
            <div class="contentSideBtn" v-if="shift.status.toLowerCase() === 'pending'">
                <button @click="confirmDeclineShift('declined')">Decline</button>
                <button @click="confirmDeclineShift('confirmed')">Confirm</button>

            </div>
            <div v-else>
                <p v-if="shift.status.toLowerCase() === 'declined'" class="shiftDeclineBtn">
                    {{ formatCapitalize(shift.status) }}</p>
                <p v-else class="shiftConfirmBtn">{{ formatCapitalize(shift.status) }}</p>

            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { BASE_URL } from '@Constants/urls';
export default {
    name: 'ShiftItem',
    props: {
        shift: {
            type: Object,
            required: true
        },
        id: {
            type: Number,
            required: true
        }
    },
    emits: ['confirmDeclineShifts', 'updateShiftStatus'],
    methods: {

        confirmDeclineShifts(action) {
            this.$emit('confirmDeclineShifts', action);
        },

        confirmDeclineShift(action) {
            this.shift.status = action;
            this.shift.selected = false
            // Emit an event to notify the parent component of the status change
            this.$emit('updateShiftStatus', this.shift);
        },

        async confirmDeclineShift(action) {
            // Make a POST request to update the shift status
            try {
                const response = await axios.post(`${BASE_URL}/api/update-status`, {
                    ids: [this.shift.id],
                    status: action,
                });

                // Check if the status was updated successfully
                if (response.data.message === 'Status updated successfully') {
                    // Update the status of the current shift locally
                    this.shift.status = action;
                    this.shift.selected = false;

                    // Emit an event to notify the parent component of the status change
                    this.$emit('updateShiftStatus', this.shift);
                } else {
                    console.error('Error updating status:', response.data.message);
                }
            } catch (error) {
                console.error('Error updating status:', error);
            }
        },

        formatCapitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },

        formatShiftTime(dateTimeStr) {
            const dateTime = new Date(dateTimeStr);
            const options = { hour: 'numeric', minute: 'numeric', hour12: true };
            return dateTime.toLocaleTimeString('en-US', options);
        },
    }
};
</script>