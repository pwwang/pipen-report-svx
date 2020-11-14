<script>
export let name;
export let slug;
export let desc;
</script>

<a
    href="{slug}.html"
    class="block rounded m-5 elevation-1 cursor-pointer hover:elevation-5 overflow-hidden duration-200 ease-in"
>
    <div class="p-5">
        <h2 class="text-xl">{name}</h2>
        <p>{desc}</p>
    </div>
</a>
