<script>
export default {
    methods: {
        async start() {
            try {
                const resp = await fetch(import.meta.env.VITE_BASE_URL + '/')
                const data = await resp.json()
                const { error } = data

                if (error) throw error
                this.$router.push(`/${data.data.path}`)
            } catch (e) {
                this.path = null
            }
        }
    }
}
</script>
<template>
    <div class="container">
        <h1>Todo App</h1>
        <button @click="start">Get Started</button>
    </div>
</template>

<style>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100vh;
}

h1 {
    margin: 0;
    padding: 0;
}

h1+button {
    margin-top: 10px;
}

body {
    margin: 0;
    padding: 0;
}
</style>

