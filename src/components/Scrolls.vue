<template>
    <!--Right Scroll Button -->
    <div class="scroll-height-right">
        <button v-if="canScrollRight" class="scroll-right scroll-btn" @click="scroll('right')">
            <img src="../assets/icons/right-arrow.svg" />
        </button>
    </div>

    <!--Left Scroll Button -->
    <div class="scroll-height-left">
        <button v-if="canScrollLeft" class="scroll-left scroll-btn" @click="scroll('left')">
            <img src="../assets/icons/left-arrow.svg" />
        </button>
    </div>
</template>

<script>
export default {
    name: 'Scrolls',
    emits: ['scroll'],
    props: {
        canScrollRight: {
            type: Boolean,
        },
        canScrollLeft: {
            type: Boolean,
        }
    },

    methods: {
        scroll(direction) {
            this.$emit('scroll', direction);
        }
    }
}
</script>