<script>
export default {
    props: {
        code: Number,
        message: String
    },
    computed: {
        errorMessageHeader() {
            return this.code === 400 ? 'Path not available' : 'Something went wrong'
        },
        errorSubMesssage() {
            return this.code === 400 ? 'Path must be between 1-10 characters only' : this.message
        },
        buttonText() {
            return this.code === 400 ? 'Go Back' : 'Refresh Page'
        }
    },
    methods: {
        routeTo() {
            if (this.code === 400) this.$router.go(-1)
            else this.$router.go()
        }
    }
}
</script>
<template>
    <section class="bg-white dark:bg-gray-900 h-screen flex justify-center">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 my-auto">
            <div class="mx-auto max-w-screen-sm text-center">
                <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                    {{ errorMessageHeader }}
                </p>
                <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                    {{ errorSubMesssage }}</p>
                <a @click="routeTo"
                    class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:cursor-pointer hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                    {{ buttonText }}
                </a>
            </div>
        </div>
    </section>
</template>