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

    <div class="border-l-2 flex-grow m-5 ml-64 pl-10 mt-32">
        <slot></slot>
    </div>

    <Footer />
</div>
