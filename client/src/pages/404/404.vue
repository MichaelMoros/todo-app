<template>
    <section class="bg-white dark:bg-gray-900 flex items-center justify-center h-screen">
        <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12 absolute left-0 right-0">
            <h1
                class="mb-4 text-3xl font-extrabold tracking-tight text-center leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Not Found</h1>
            <p
                class="mb-8 text-lg font-normal text-gray-500 text-center lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
            </p>
            <router-link to="/">
                <button type="button"
                    class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-base px-6 py-3.5 text-center mr-2 mb-2">
                    Go Back
                </button>
            </router-link>
        </div>
    </section>
</template>