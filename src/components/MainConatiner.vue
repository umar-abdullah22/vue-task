<template>
    <div class="mainContainer">

        <!-- Header -->
        <Header v-model="searchQuery" />

        <!-- BoxContainer -->
        <div class="shiftBoxesBody" ref="scrollContainer">
            <div v-for="(datesArray, monthYear) in filteredShifts" :key="monthYear" class="shiftBoxContainer">

                <!-- Monthtly Boxes -->
                <MonthShiftBox :datesArray="datesArray" :monthYear="monthYear" :selectAll="selectAll"
                    :groupedShifts="groupedShifts" @updateShiftStatus="updateShiftStatus"
                    @confirmDeclineShifts="confirmDeclineShifts" @toggleSelectAll="toggleSelectAll"
                    :filteredShiftCount="filteredShiftsCount(monthYear)" />
            </div>
        </div>

        <!-- Scrolls rihgt left -->
        <Scrolls @scroll="scroll" :canScrollLeft="canScrollLeft" :canScrollRight="canScrollRight" />

    </div>
</template>
<script>

import data from '../data.json'
import '../assets/schedule.css'
import Header from './Header.vue'
import ShiftItem from './ShiftItem.vue';
import DateGroup from './DateGroup.vue';
import Scrolls from './Scrolls.vue';
import MonthShiftBox from './MonthShiftBox.vue';

export default {
    components: {
        Header,
        ShiftItem,
        DateGroup,
        Scrolls,
        MonthShiftBox
    },
    data() {
        return {
            groupedShifts: {},
            searchQuery: '',
            selectAll: {},
            canScrollLeft: false,
            canScrollRight: true,
        };
    },
    mounted() {
        this.groupShiftsByMonth();
        this.$nextTick(() => {
            // Check the scroll status after the DOM has been updated
            this.checkScroll();
        });
    },

    watch: {
        // Watch for changes in the groupedShifts object
        groupedShifts: {
            handler(newValue, oldValue) {
                console.log('ehre')
                this.updateParentCheckboxes(newValue, oldValue);

                this.$nextTick(() => {
                    this.checkScroll();
                });
            },
            deep: true // Watch for deep changes within the object
        }
    },

    computed: {

        filteredShifts() {
            if (!this.searchQuery) return this.groupedShifts; // No search query, return all shifts
            const filtered = {};
            for (const [monthYear, dateGroups] of Object.entries(this.groupedShifts)) {
                filtered[monthYear] = dateGroups.map(dateGroup => ({
                    ...dateGroup,
                    shifts: dateGroup.shifts.filter(shift => this.matchesSearchQuery(shift, this.searchQuery)),
                })).filter(dateGroup => dateGroup.shifts.length > 0); // Keep dateGroups that still have shifts after filtering
            }
            return filtered;
        },

        filteredShiftsCount() {
            // Return a function that computes the count for a specific monthYear
            return (monthYear) => {
                let count = 0;
                // Ensure that there are date groups for the monthYear
                if (this.filteredShifts[monthYear]) {
                    for (const dateGroup of this.filteredShifts[monthYear]) {
                        // Add the count of shifts in each dateGroup
                        count += dateGroup.shifts.length;
                    }
                }
                return count;
            };
        }
    },

    methods: {
        filteredShiftsForMonth(monthYear) {
            // Assuming `filteredShifts` is the computed property with all filtered shifts
            // This method returns only the filtered shifts for a specific month and year
            return this.filteredShifts[monthYear] || [];
        },

        updateParentCheckboxes() {
            for (const monthYear in this.groupedShifts) {
                this.selectAll[monthYear] = this.groupedShifts[monthYear].every(dateGroup =>
                    dateGroup.shifts.every(shift => shift.selected)
                );
            }
        },

        matchesSearchQuery(shift, query) {
            // Implement your search matching logic here
            // For example, this might look like:
            return shift.userName.toLowerCase().includes(query.toLowerCase());
        },

        isMonthAllSelected(monthYear) {
            return this.groupedShifts[monthYear]?.every(dateGroup =>
                dateGroup.shifts.every(shift => shift.selected)
            );
        },

        filterDateGroup(dateGroup, query) {
            const filteredShifts = dateGroup.shifts.filter(shift =>
                shift.userName.toLowerCase().includes(query)
            );

            return filteredShifts.length ? { ...dateGroup, shifts: filteredShifts } : null;
        },

        groupShiftsByMonth() {
            const shiftsByMonthAndDate = data.reduce((acc, userData) => {
                const shiftDate = new Date(userData.startedAt);
                const monthYearKey = `${shiftDate.toLocaleString('default', { month: 'long' })} ${shiftDate.getFullYear()}`;
                const dateKey = shiftDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

                if (!acc[monthYearKey]) acc[monthYearKey] = {};
                if (!acc[monthYearKey][dateKey]) acc[monthYearKey][dateKey] = [];

                acc[monthYearKey][dateKey].push(this.mapUserToShift(userData));

                return acc;
            }, {});

            this.groupedShifts = this.sortShiftsByMonth(shiftsByMonthAndDate);
            this.initializeSelectAll();
        },

        mapUserToShift(userData) {
            return {
                chiName: userData.chiName,
                role: userData.role,
                id: userData.userId,
                userName: `${userData.firstName} ${userData.lastName}`,
                status: userData.status,
                startedAt: userData.startedAt,
                endedAt: userData.endedAt,
            };
        },

        sortShiftsByMonth(shiftsByMonthAndDate) {
            return Object.keys(shiftsByMonthAndDate).sort(this.compareMonths).reduce((acc, monthYear) => {
                acc[monthYear] = Object.keys(shiftsByMonthAndDate[monthYear])
                    .sort((a, b) => new Date(a) - new Date(b))
                    .map(date => ({
                        date,
                        shifts: shiftsByMonthAndDate[monthYear][date].sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt))
                    }));

                return acc;
            }, {});
        },

        compareMonths(a, b) {
            const getMonthYearDate = monthYear => new Date(monthYear.split(' ')[1], new Date(Date.parse(`${monthYear.split(' ')[0]} 1, 2012`)).getMonth());
            return getMonthYearDate(a) - getMonthYearDate(b);
        },

        initializeSelectAll() {
            Object.keys(this.groupedShifts).forEach(monthYear => {
                if (!(monthYear in this.selectAll)) {
                    this.selectAll[monthYear] = false;
                }
            });
        },

        toggleSelectAll(monthYear) {
            const currentState = this.selectAll[monthYear];
            this.selectAll[monthYear] = !currentState;

            this.groupedShifts[monthYear].forEach(dateGroup => {
                dateGroup.shifts.forEach(shift => {
                    shift.selected = !currentState;
                });
            });
        },
        updateShift(monthYear, date, shiftId) {
            const dateGroup = this.groupedShifts[monthYear].find(group => group.date === date);
            const shift = dateGroup.shifts.find(shift => shift.id === shiftId);
            if (shift) {
                shift.selected = !shift.selected;
            }
            this.updateSelectAllCheckboxes();
        },

        updateShiftStatus({ updatedGroupedShifts, monthYear }) {
            // Update the groupedShifts data with the updated values
            this.groupedShifts = updatedGroupedShifts;
            // Uncheck all checkboxes
            this.uncheckAllCheckboxes(monthYear);
        },

        // Add a method to uncheck all checkboxes
        uncheckAllCheckboxes(monthYear) {
            this.selectAll[monthYear] = false;
        },

        confirmDeclineShifts({ action, monthYear, updatedShifts }) {
            // Update the relevant month's data with the new statuses
            this.groupedShifts[monthYear] = updatedShifts;
            // Update the checkboxes
            this.updateParentCheckboxes();
        },

        getSelectedShifts() {
            // Utility method to get all selected shifts
            let selectedShifts = [];
            Object.values(this.groupedShifts).forEach(monthGroup => {
                monthGroup.forEach(dateGroup => {
                    selectedShifts = selectedShifts.concat(
                        dateGroup.shifts.filter(shift => shift.selected)
                    );
                });
            });
            return selectedShifts;
        },
        findShiftById({ action }) {
            // Utility method to find a shift by its ID
            for (const monthGroup of Object.values(this.groupedShifts)) {
                for (const dateGroup of monthGroup) {
                    console.log(data)
                    const shift = dateGroup.shifts.find(shift => shift.id === action.id);
                    if (shift) return shift;
                }
            }
            return null;
        },

        scroll(direction) {
            const container = this.$refs.scrollContainer;
            const amountToScroll = 300; // Adjust this value as needed
            if (direction === 'right') {
                container.scrollLeft += amountToScroll;
            } else if (direction === 'left') {
                container.scrollLeft -= amountToScroll;
            }
            this.checkScroll(); // Call checkScroll to update canScrollLeft and canScrollRight
        },

        checkScroll() {
            const leftButton = this.$el.querySelector('.scroll-height-left');
            const container = this.$refs.scrollContainer;
            this.canScrollLeft = container.scrollLeft > 0;
            this.canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth;
            if (this.canScrollLeft) {
                leftButton.style.display = 'block'; // Show the left button
            }
            else {
                leftButton.style.display = 'none';
            }
        }
    },
};
</script>  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            