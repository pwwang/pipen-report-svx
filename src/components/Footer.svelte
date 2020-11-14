<script>
import pipeline from '../data/pipeline.json';
const versions = pipeline.versions;
</script>

<div class="text-right italic pr-10 pb-5 text-sm text-gray-400">
    Powered by
    <a class="text-secondary-500" target="_blank" href="https://github.com/pwwang/pipen">pipen</a> v{versions.pipen}
    <a class="text-secondary-500" target="_blank" href="https://github.com/pwwang/pipen-report">pipen-report</a> v{versions['pipen-report']}
    <a class="text-secondary-500" target="_blank" href="https://github.com/pwwang/pipen-report-svx">pipen-report-svx</a> v{versions['pipen-report-svx']}
</div>
