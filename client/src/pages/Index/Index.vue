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
    <section class="bg-white dark:bg-gray-900 flex items-center justify-center h-screen">
        <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12 absolute left-0 right-0">
            <h1
                class="mb-4 text-4xl font-extrabold tracking-tight text-center leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Todo App</h1>
            <p
                class="mb-8 text-lg font-normal text-gray-500 text-center lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                created using Tailwind + Flowbite
            </p>
            <button @click="start" type="button"
                class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-base px-6 py-3.5 text-center mr-2 mb-2">
                Get Started
            </button>
        </div>
    </section>
</template>
