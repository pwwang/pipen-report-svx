<script>
import pipeline from '../data/pipeline.json';
import Footer from '../components/Footer.svelte';
</script>

<div class="flex flex-col min-h-full">
    <div class="bg-primary-900 fixed w-full z-50">
        <div class="py-5 px-10 text-gray-50">
            <h1 class="text-2xl">{pipeline.name}</h1>
            <p>{pipeline.desc}</p>
        </div>
    </div>

    <div class="m-5 flex-grow mt-32">
        <slot></slot>
    </div>

    <Footer />
</div>

<style>
:global(nav.toc) {display: none}
</style>
