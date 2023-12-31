<template>
    <div class="mainContainer">

        <!-- Header -->
        <Header v-model="searchQuery" />

        <!-- BoxContainer -->
        <div class="shiftBoxesBody" ref="scrollContainer">
            <div v-for="(datesArray, monthYear) in filteredShifts" :key="monthYear" class="shiftBoxContainer">

                <!-- Monthly Boxes -->
                <MonthShiftBox :datesArray="datesArray" :monthYear="monthYear" :selectAll="selectAll"
                    :groupedShifts="groupedShifts" @updateShiftStatus="loadData" @confirmDeclineShifts="loadData"
                    @toggleSelectAll="toggleSelectAll" :filteredShiftCount="filteredShiftsCount(monthYear)" />
            </div>
        </div>

        <!-- Scrolls right left -->
        <Scrolls @scroll="scroll" :canScrollLeft="canScrollLeft" :canScrollRight="canScrollRight" />
    </div>
</template>

<script>
import '@Assets/styles/schedule.css'
import Header from './Header.vue'
import Scrolls from './Scrolls.vue';
import MonthShiftBox from './MonthShiftBox.vue';
import axios from 'axios';
import { SHIFTS } from '@Services/routes';

const SCROLL_AMOUNT = 300;

export default {
    components: {
        Header,
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
            shiftsData: []
        };
    },
    mounted() {
        // Check the scroll status after the DOM has been updated
        this.$nextTick(() => this.checkScroll());
        this.loadData()
    },

    watch: {
        // Watch for changes in the groupedShifts object
        groupedShifts: {
            handler(newValue, oldValue) {
                this.updateParentCheckboxes(newValue, oldValue);

                //keep checking scroll position
                // Check the scroll status after the DOM has been updated
                this.$nextTick(() => this.checkScroll());
            },
            deep: true // Watch for deep changes within the object
        }
    },

    computed: {
        filteredShifts() {
            if (!this.searchQuery) return this.groupedShifts; // No search query, return all shifts
            const filtered = {};

            for (const [monthYear, dateGroups] of Object.entries(this.groupedShifts)) {
                filtered[monthYear] = dateGroups
                    .map(dateGroup => ({
                        ...dateGroup,
                        shifts: dateGroup.shifts.filter(shift => this.matchesSearchQuery(shift, this.searchQuery)),
                    }))
                    .filter(dateGroup => dateGroup.shifts.length > 0); // Keep dateGroups that still have shifts after filtering
            }

            return filtered;
        },

        filteredShiftsCount() {
            return (monthYear) => {
                // Ensure that there are date groups for the monthYear
                return Object.values(this.filteredShifts[monthYear] || {}).reduce((count, dateGroup) => {
                    return count + dateGroup.shifts.length;
                }, 0);
            };
        }
    },

    methods: {
        loadData() {
            axios.get(`${SHIFTS}`)
                .then((response) => {
                    this.shiftsData = response.data; // Update the component's data with the fetched data
                    this.groupShiftsByMonth();
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        },

        updateParentCheckboxes() {
            for (const monthYear in this.groupedShifts) {
                this.selectAll[monthYear] = this.groupedShifts[monthYear].every(dateGroup =>
                    dateGroup.shifts.every(shift => shift.selected)
                );
            }
        },

        matchesSearchQuery(shift, query) {
            return shift.userName.toLowerCase().includes(query.toLowerCase());
        },

        groupShiftsByMonth() {
            const shiftsByMonthAndDate = this.shiftsData.reduce((acc, userData) => {
                const shiftDate = new Date(userData.startedAt);
                const monthYearKey = `${shiftDate.toLocaleString('default', { month: 'long' })} ${shiftDate.getFullYear()}`;
                const dateKey = shiftDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
                if (!acc[monthYearKey]) acc[monthYearKey] = {};
                if (!acc[monthYearKey][dateKey]) acc[monthYearKey][dateKey] = [];

                acc[monthYearKey][dateKey].push(this.transformUserDataToShift(userData));

                return acc;
            }, {});

            this.groupedShifts = this.sortShiftsByMonth(shiftsByMonthAndDate);
        },

        transformUserDataToShift(userData) {
            return {
                chiName: userData.chiName,
                role: userData.role,
                id: userData.id,
                userId: userData.userId,
                userName: `${userData.firstName} ${userData.lastName}`,
                status: userData.status,
                startedAt: userData.startedAt,
                endedAt: userData.endedAt,
            };
        },

        sortShiftsByMonth(shiftsByMonthAndDate) {
            return Object.keys(shiftsByMonthAndDate)
                .sort(this.compareMonths)
                .reduce((acc, monthYear) => {
                    acc[monthYear] = Object.keys(shiftsByMonthAndDate[monthYear])
                        .sort((dateA, dateB) => new Date(dateA) - new Date(dateB))
                        .map(date => ({
                            date,
                            shifts: shiftsByMonthAndDate[monthYear][date]
                                .sort((shiftA, shiftB) => new Date(shiftA.startedAt) - new Date(shiftB.startedAt))
                        }));

                    return acc;
                }, {});
        },

        compareMonths(a, b) {
            const getMonthYearDate = monthYear => new Date(monthYear.split(' ')[1], new Date(Date.parse(`${monthYear.split(' ')[0]}1, 2023`)).getMonth());
            return getMonthYearDate(a) - getMonthYearDate(b);
        },

        toggleSelectAll(monthYear) {
            const currentState = this.selectAll[monthYear];
            this.selectAll[monthYear] = !currentState;

            this.groupedShifts[monthYear].forEach(dateGroup => {
                dateGroup.shifts
                    .forEach(shift => {
                        shift.selected = !currentState;
                    });
            });
        },

        scroll(direction) {
            const container = this.$refs.scrollContainer;

            if (direction === 'right') container.scrollLeft += SCROLL_AMOUNT;
            else if (direction === 'left') container.scrollLeft -= SCROLL_AMOUNT;

            this.checkScroll(); // Call checkScroll to update canScrollLeft and canScrollRight
        },

        checkScroll() {
            const leftButton = this.$el.querySelector('.scroll-height-left');
            const rightButton = this.$el.querySelector('.scroll-height-right');
            const container = this.$refs.scrollContainer;

            this.canScrollLeft = container.scrollLeft > 0;
            this.canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth;

            if (this.canScrollLeft) leftButton.style.display = 'block'; // Show the left button
            else leftButton.style.display = 'none';

            if (this.canScrollRight) rightButton.style.display = 'block'; // Show the right button
            else rightButton.style.display = 'none';
        }
    },
};
</script>  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            