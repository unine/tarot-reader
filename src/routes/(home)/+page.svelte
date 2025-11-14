<script>
  import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>

<div class="p-4 flex flex-col justify-center items-center min-h-svh">
  <div class="flex flex-col justify-center items-center gap-4 w-[600px]">
    <h1 class="text-3xl uppercase font-semibold">What question on your mind</h1>
    <form action="?/ask" method="post" class="w-full">
      <Textarea
        name="question"
        placeholder="Ask me anything..."
        class="min-h-[100px] resize-none"
      />
    </form>
  </div>
</div>
