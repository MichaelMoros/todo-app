<script>
export default {
    data() {
        return {
            retry: 0
        }
    },
    methods: {
        async test() {
            const password = prompt('Protected Route, enter password')
            this.$emit('verify-user', password)
        }
    },
    mounted() {
        this.test()
    },
}
</script>
<template>

</template>