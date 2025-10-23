<script setup>
    import { defineProps } from 'vue';
    import AvatarComponent from './AvatarComponent.vue';

    const props = defineProps({
        profile: {
            type: Object,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        reverse: {
            type: Boolean,
            default: false,
        }
    });
</script>

<template>
    <div class="flex items-start gap-2">
        <p v-if="!reverse">{{ profile.name }}</p>
        <AvatarComponent
            :status="status"
            :avatarUrl="profile.avatar"
        />
        <p v-if="reverse">{{ profile.name }}</p>
    </div>
</template>