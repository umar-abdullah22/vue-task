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

import DateGroup from './DateGroup.vue';

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
            //  determine if any shift is selected...
            return this.groupedShifts[this.monthYear].some(dateGroup =>
                dateGroup.shifts.some(shift => shift.selected && shift.status.toLowerCase() === 'pending')
            );
        },
    },

    methods: {
        toggleSelectAll() {
            this.$emit('toggleSelectAll', this.monthYear);
        },

        updateShiftStatus(status) {
            this.$emit('updateShiftStatus', { monthYear: this.monthYear, status });
        },

        anySelected() {
            this.$emit('anySelected', this.monthYear);

        },

        confirmDeclineShifts(action) {
            const updatedShifts = this.datesArray.map(dateGroup => ({
                ...dateGroup,
                shifts: dateGroup.shifts.map(shift => ({
                    ...shift,
                    status: shift.selected && shift.status.toLowerCase() === 'pending' ? action : shift.status,
                    selected: false
                }))
            }));

            this.$emit('confirmDeclineShifts', { action, monthYear: this.monthYear, updatedShifts });
        },

        confirmDeclineShift(action) {
            const monthYear = this.monthYear;

            for (const dateGroup of this.groupedShifts[monthYear]) {
                for (const shift of dateGroup.shifts) {
                    // Check if shift.startedAt is defined before splitting
                    if (shift.startedAt) {

                        // Update the status of the selected shift
                        if (shift.id === action.id) {
                            shift.status = action.status;
                            this.selectAll[monthYear] = false
                        }
                    }
                }
            }

            // Emit an event to notify the parent component of the shift status update
            this.$emit('updateShiftStatus', { updatedGroupedShifts: this.groupedShifts, monthYear });
        },
    }
};
</script>
