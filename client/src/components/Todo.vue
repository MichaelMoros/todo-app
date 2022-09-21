<script>

export default {
    data() {
        return {
            data: null
        }
    },
    mounted() {
        this.fetchData()
    },
    methods: {
        async fetchData() {
            try {
                const response = await fetch(import.meta.env.VITE_BASE_URL + '/' + this.$route.params.path)
                const data = await response.json()

                const { error } = data
                if (error) throw error

                this.data = data
            } catch (e) {
                console.log(e.message)
                this.data = null
            }
        }
    }
}
</script>
<template>
    <div v-if="data">
        <h1>Todo view</h1>
        <pre>{{ data }}</pre>
    </div>

    <div v-else>
        <h1>Todo View</h1>
        <pre>Nothing Here</pre>
    </div>
</template>
