<template>
    <div class="boxMonthHeading">
        <div class="left_boxMonthHeading">

            <input type="checkbox" :id="'select-all-' + monthYear" :value="monthYear" :checked="selectAll[monthYear]"
                @change="toggleSelectAll()" />
            <div class="month-heading-content">
                <p>{{ monthYear }}</p>
                <p class="shift-numbers">({{ filteredShiftCount }} held shifts)</p>
            </div>
        </div>

        <!-- conditional check box action buttons -->
        <div :class="!anySelectedComputed ? 'right_boxMonthHeading' : 'headerBtns'">
            <button :disabled="!anySelectedComputed" @click="confirmDeclineShifts('declined')">Decline</button>
            <button :disabled="!anySelectedComputed" @click="confirmDeclineShifts('confirmed')">Confirm</button>
        </div>
    </div>

    <!-- Group by Dates inside month -->
    <div v-for="dateGroup in datesArray" :key="dateGroup.date" class="dateGroup">
        <DateGroup :dateGroup="dateGroup" @updateShiftStatus="confirmDeclineShift" />
    </div>
</template>

<script>

import { SHIFTS } from '@Services/routes';
import DateGroup from './DateGroup.vue';
import axios from 'axios';

export default {
    name: 'MonthShiftBox',
    components: {
        DateGroup
    },
    props: {
        monthYear: {
            type: String,
            required: true
        },
        datesArray: {
            type: Array,
            required: true
        },
        selectAll: {
            type: Object,
            required: true
        },
        groupedShifts: {
            type: Object,
            required: true
        },
        filteredShiftCount: {
            type: Number,
            required: true
        }
    },

    emits: ['updateShiftStatus', 'confirmDeclineShifts', 'toggleSelectAll'],

    computed: {
        anySelectedComputed() {
            // determine if any shift is selected...
            return this.groupedShifts[this.monthYear].some(dateGroup =>
                dateGroup.shifts.some(shift => shift.selected && shift.status.toLowerCase() === 'pending')
            );
        },
    },

    methods: {
        toggleSelectAll() {
            this.$emit('toggleSelectAll', this.monthYear);
        },

        updateShiftStatus() {
            this.$emit('updateShiftStatus');
        },

        anySelected() {
            this.$emit('anySelected', this.monthYear);

        },

        async confirmDeclineShifts(status) {
            const ids = this.datesArray
                .map((dateGroup) =>
                    dateGroup.shifts
                        .filter((shift) => shift.selected && shift.status.toLowerCase() === 'pending')
                        .map((shift) => shift.id)
                )
                .flat()

            // Make an API request to update the shifts
            try {
                await axios.put(`${SHIFTS}`, { ids, status });
                this.$emit('confirmDeclineShifts');
            } catch (error) {
                console.error('Error updating status:', error);
            }
        },

        confirmDeclineShift() {
            this.$emit('updateShiftStatus');
        }
    }
};
</script>
