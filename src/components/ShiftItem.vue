<template>
    <div class="shiftData">
        <input type="checkbox" v-model="shift.selected" />
        <div class="shiftData_contentSide">
            <p>{{ formatDate(shift.startedAt) + '-' + formatDate(shift.endedAt) }}</p>
            <p>{{ shift.id + ' - ' + shift.userName + ' ' }}<span>{{ shift.chiName }}</span></p>
            <div class="stateRow">
                <div v-if="shift.role === 'ST'" class="highlightTurquoiseGreen"></div>
                <div v-else-if="shift.role === 'EN'" class="highlightTurquoiseRed"></div>
                <div v-else class="highlightTurquoiseBlue"></div>
                <p>{{ shift.role }}</p>
            </div>
            <div class="contentSideBtn" v-if="shift.status.toLowerCase() === 'pending'">
                <button @click="confirmDeclineShift('declined', shift.id)">Decline</button>
                <button @click="confirmDeclineShift('confirmed', shift.id)">Confirm</button>

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

export default {
    name: 'ShiftItem',
    props: ['shift', 'id'],
    emits: ['confirmDeclineShifts', 'updateShiftStatus'],
    methods: {

        confirmDeclineShifts(action) {
            this.$emit('confirmDeclineShifts', action);
        },

        confirmDeclineShift(action, id) {
            this.shift.status = action;
            this.shift.selected = false
            // Emit an event to notify the parent component of the status change
            this.$emit('updateShiftStatus', this.shift);
        },

        formatCapitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },

        formatDate(dateStr) {
            const date = new Date(dateStr);
            return `${date.toLocaleString('default', { timeStyle: 'short' })}`;
        },
    }
};
</script>