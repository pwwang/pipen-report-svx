<script>
import Footer from '../components/Footer.svelte';

export let proc_name;
export let proc_desc;
</script>

<div class="flex flex-col min-h-full">
    <div class="bg-primary-900 fixed w-full">
        <div class="py-5 px-10 text-gray-50">
            <h1 class="text-2xl">{proc_name}</h1>
            <p>{proc_desc}</p>
        </div>
    </div>

    <div class="container border-l-2 flex-grow m-5 ml-64 pl-10 mt-32">
        <slot></slot>
    </div>

    <Footer />
</div>

<style>
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
