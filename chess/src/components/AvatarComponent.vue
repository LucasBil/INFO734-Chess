<script setup>
    import { defineProps } from 'vue';

    const props = defineProps({
        status: {
            type: String,
            required: true,
        },
        avatarUrl: {
            type: String,
            required: true
        }
    });

</script>

<template>
    <div :class="`avatar avatar-${status}`">
        <div class="h-8 rounded-full">
            <img :src="avatarUrl" />
        </div>
    </div>
</template>