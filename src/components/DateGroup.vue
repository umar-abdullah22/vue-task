<template>
    <div class="boxDateHeading">
        <p>{{ getDateFormatted(dateGroup.date) }}</p>
    </div>
    <!-- Shift Data -->
    <div v-for="(shift, id) in dateGroup.shifts" :key="id">
        <ShiftItem :shift="shift" :id="id" @confirmDeclineShifts="confirmDeclineShifts"
            @updateShiftStatus="confirmDeclineShift" />
        <div v-if="id < dateGroup.shifts.length - 1" class="boxBreakLine"></div>
    </div>
</template>

<script>

import ShiftItem from './ShiftItem.vue';

export default {
    name: 'DateGroup',
    components: {
        ShiftItem
    },
    props: {
        dateGroup: {
            type: Object,
            required: true
        }
    },
    emits: ['confirmDeclineShifts', 'updateShiftStatus'],
    methods: {

        getDateFormatted(date) {
            const dateObject = new Date(date);

            const formattedDate = dateObject.toLocaleDateString('en-US', {
                month: 'long',
            });
            return ` ${dateObject.getDate()} ${formattedDate}`
        },

        confirmDeclineShifts(action) {
            this.$emit('confirmDeclineShifts', action);
        },

        confirmDeclineShift(action, id) {
            this.$emit('updateShiftStatus', { action, id });
        },

    }
};
</script>

