<script setup>
    import { ref } from 'vue'
    const year = ref(new Date().getFullYear())
</script>

<template>
    <footer class="footer sm:footer-horizontal footer-center bg-[#AB2BFF] text-white p-4">
        <aside>
            <p>Copyright © {{ year }} - All right reserved by ACME Industries Ltd</p>
        </aside>
    </footer>
</template>