<template>
    <div class="headerContent">
        <img src="../assets/icons/time.svg" />
        <p>Indicates held shift with less than 24 hours response time</p>
    </div>
    <div class="searchHeading">
        <p>Caregiver Name</p>
        <div class="searchFieldContainer">
            <input type="search" placeholder="Search" :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)" />
            <a v-if="!modelValue">
                <img src="../assets/icons/search.svg" />
            </a>
            <a v-else @click="clearSearch" class="crossIcon">
                <img src="../assets/icons/cross-17.svg" /> </a>
        </div>

    </div>
</template>

<script>

export default {
    name: 'Header',
    props: ['modelValue'],
    methods: {
        clearSearch() {
            this.$emit('update:modelValue', '');
        }
    }
};
</script>
