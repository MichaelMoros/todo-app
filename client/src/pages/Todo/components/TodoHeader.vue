<script>
import { getBoolValue } from '../../../helpers/helpers'

export default {
    props: {
        path: String,
        authConfig: Boolean,
        accessToken: String
    },
    methods: {
        closeModal() {
            if (this.isProcessing) return
            else this.isOpen = false
        },
        openModal() {
            this.isOpen = true
        },
        async handleFormSubmit(e) {
            e.preventDefault()

            const bool = getBoolValue(this._authConfig)

            if (bool && !this.todo_password.password) {
                this.todo_password.error = 'Password field is required.'
                return
            } else if (!bool || bool && this.todo_password.password) {
                try {
                    const API_ROUTE = import.meta.env.VITE_BASE_URL

                    const payload = {
                        requireauth: bool,
                        password: this.todo_password.password
                    }

                    const endpoint = API_ROUTE + '/' + this.path;

                    this.isProcessing = true
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        body: JSON.stringify(payload),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.accessToken
                        }
                    })

                    const response = await res.json()
                    const { data, error } = response

                    if (error) throw error

                    const accessToken = data?.accessToken || null
                    this.isProcessing = false
                    this.isOpen = false
                    this.todo_password.password = ''
                    this.todo_password.error = null
                    this.$emit('update-requireauth-state', bool, accessToken)
                } catch (error) {
                    this.isOpen = false
                    this.isProcessing = false
                    if (error.message !== 'Password field is required.') return
                    else alert(error.message)
                }
            }
        },
        handleAuthChange(e) {
            const bool = getBoolValue(e.target.value)

            if (bool === null) return

            if (!bool) {
                this.todo_password.password = ''
                this.todo_password.error = null
            }

            this._authConfig = bool
        },
        handleUpdatePassword(e) {
            const value = e.target.value
            if (this.todo_password.password.length === 0 && value.length > 0) {
                this.todo_password.error = null;
            }
        },
        toggleVisibility() {
            this.passwordVisibility = !this.passwordVisibility
        }
    },
    data() {
        return {
            isOpen: false,
            isProcessing: false,
            _authConfig: null,
            todo_password: {
                password: '',
                error: null
            },
            passwordVisibility: false
        }
    },
    mounted() {
        const bool = getBoolValue(this.authConfig)
        this._authConfig = bool
    },
    emits: ['update-requireauth-state']
}

</script>

<template>
    <h5 class="text-2xl font-normal dark:text-gray-400">
        Using {{ path }}
        <div class="inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-gear hover:scale-125 duration-500 hover:pointer" @click="openModal" viewBox="0 0 16 16">
                <path
                    d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                <path
                    d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
            </svg>
        </div>
        <div class="relative inline-flex group" v-if="authConfig === 'true' || authConfig === true">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock-fill"
                viewBox="0 0 16 16">
                <path
                    d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
            </svg>
            <div class="absolute top-0 flex flex-col items-center hidden mt-6 group-hover:flex">
                <span
                    class="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black shadow-lg">This
                    path requires authentication.</span>
                <div class="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
            </div>
        </div>
    </h5>

    <div class="container mx-auto">
        <Transition>
            <div v-show="isOpen"
                class="absolute inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50 ">
                <div class="max-w-2xl p-6 bg-white rounded-md shadow-xl">
                    <div class="flex items-center justify-between">
                        <h3 class="text-2xl">Todo Settings</h3>
                        <svg @click="closeModal" xmlns="http://www.w3.org/2000/svg"
                            class="w-8 h-8 text-red-900 cursor-pointer" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="mt-4">
                        <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">
                            Set Todo Privacy</h3>
                        <form @submit="handleFormSubmit">
                            <ul class="grid gap-6 w-full md:grid-cols-2 mb-6">
                                <li>
                                    <input type="radio" id="hosting-small" name="require-auth" class="hidden peer"
                                        value="false" v-model="_authConfig" @click="handleAuthChange">
                                    <label for="hosting-small"
                                        class="inline-flex justify-between items-center p-5 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div class="block">
                                            <div class="w-full text-lg font-semibold">Public</div>
                                            <div class="w-full">No authentication</div>
                                        </div>
                                        <svg aria-hidden="true" class="ml-3 w-6 h-6" fill="currentColor"
                                            viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd"
                                                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                                clip-rule="evenodd"></path>
                                        </svg>
                                    </label>
                                </li>
                                <li>
                                    <input type="radio" id="hosting-big" name="require-auth" value="true"
                                        class="hidden peer" v-model="_authConfig" @click="handleAuthChange">
                                    <label for="hosting-big"
                                        class="inline-flex justify-between items-center p-5 w-full text-gray-500 bg-white rounded-lg border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div class="block">
                                            <div class="w-full text-lg font-semibold">Private</div>
                                            <div class="w-full">Requires authentication</div>
                                        </div>
                                        <svg aria-hidden="true" class="ml-3 w-6 h-6" fill="currentColor"
                                            viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd"
                                                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                                clip-rule="evenodd"></path>
                                        </svg>
                                    </label>
                                </li>
                            </ul>

                            <!-- Start -->
                            <div v-if="_authConfig === 'true' || _authConfig === true" class="mb-5">
                                <label for="default-input"
                                    class="block mb-2 text-lg font-medium text-gray-900 dark:text-white">
                                    Password
                                </label>
                                <div class="flex">
                                    <div class="relative w-full">
                                        <input :type="`${passwordVisibility ? 'text' : 'password'}`"
                                            v-model="todo_password.password"
                                            class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-l-lg rounded-r-lg border-l-gray-300 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                                            placeholder="Password">
                                        <button type="button" @click="toggleVisibility"
                                            class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">


                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="20"
                                                v-if="passwordVisibility" fill="currentColor" class="bi bi-eye"
                                                viewBox="0 0 16 16">
                                                <path
                                                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                                <path
                                                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                            </svg>

                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="20" v-else
                                                fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                                <path
                                                    d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                                <path
                                                    d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                                <path
                                                    d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                                            </svg>
                                        </button>
                                    </div>

                                </div>
                                <p class="mt-2 text-sm text-red-600 dark:text-red-500 font-medium"
                                    v-if="todo_password.error">
                                    {{ todo_password.error }}
                                </p>
                            </div>
                            <!-- End  -->

                            <button type="button" @click="closeModal"
                                class="px-6 py-2 text-blue-800 border border-blue-600 rounded"
                                :class="`${isProcessing ? 'cursor-not-allowed' : ''}`">
                                Cancel
                            </button>
                            <button type="submit" class="px-6 py-2 ml-2 text-blue-100 bg-blue-600 rounded"
                                :class="`${isProcessing ? 'cursor-not-allowed' : ''}`">
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>
<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
