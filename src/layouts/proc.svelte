<script>
import Footer from '../components/Footer.svelte';
import { Icon } from 'pipen-smelte';

export let proc_name;
export let proc_desc;
</script>

<div class="flex flex-col min-h-full">
    <div class="bg-primary-900 fixed w-full flex flex-row items-center z-50">
        <div class="py-5 px-10 text-gray-50 flex-grow">
            <h1 class="text-2xl">{proc_name}</h1>
            <p>{proc_desc}</p>
        </div>
        <div class="pr-10">
            <a href="index.html" title="Back to Cover Page ...">
                <Icon class="" color="white" reverse>exit_to_app</Icon>
            </a>
        </div>
    </div>

    <div class="container flex-grow m-5 pl-16 mt-32">
        <slot></slot>
    </div>

    <Footer />
</div>

<style>
.container {
    padding-left: 18rem;
}

:global(.container h1) {
    margin-top: var(--m-4);
    font-size: var(--text-3xl);
}
:global(.container h2) {
    margin-top: var(--m-2);
    font-size: var(--text-2xl);
}
:global(.container h3) {
    margin-top: var(--m-1);
    font-size: var(--text-xl);
}
:global(.container h4) {
    margin-top: var(--m-1);
    font-size: var(--text-lg);
}
:global(.container h5) {
    margin-top: var(--m-1);
    font-size: var(--text-base);
}
:global(.container p) {
    margin-bottom: var(--m-1);
}
</style>
