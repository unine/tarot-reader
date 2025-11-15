<script>
  import {
    CalendarIcon,
    HouseIcon,
    InboxIcon,
    SearchIcon,
    SettingsIcon,
    ArrowLeftFromLineIcon,
    ArrowRightFromLineIcon,
    SunIcon,
    MoonIcon,
  } from "@lucide/svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { useSidebar } from "$lib/components/ui/sidebar/index.js";
  import { toggleMode } from "mode-watcher";
  import { Button } from "$lib/components/ui/button/index.js";

  const sidebar = useSidebar();

  // Menu items.
  const items = [
    {
      title: "Home",
      url: "#",
      icon: HouseIcon,
    },
  ];
</script>

<Sidebar.Root collapsible="icon">
  <Sidebar.Header
    class="flex items-center justify-between border-b {sidebar.state ===
    'expanded'
      ? 'p-4'
      : ''}"
  >
    <div class="flex justify-between items-center w-full">
      {#if sidebar.open}
        <h3 class="">Tarot Reaader</h3>
      {/if}
      <div class="flex flex-wrap gap-1.5">
        <Button
          onclick={toggleMode}
          variant="outline"
          size="icon"
          class="size-8"
        >
          <SunIcon
            class="h-4 w-4 rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
          />
          <MoonIcon
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
          />
          <span class="sr-only">Toggle theme</span>
        </Button>
        <Button
          onclick={() => sidebar.toggle()}
          variant="outline"
          size="icon"
          class="size-8"
        >
          {#if sidebar.state === "expanded"}
            <ArrowLeftFromLineIcon
              class="h-4 w-4 transition-transform duration-200"
            />
          {:else}
            <ArrowRightFromLineIcon
              class="h-4 w-4 transition-transform duration-200"
            />
          {/if}
          <span class="sr-only">Toggle Sidebar</span>
        </Button>
      </div>
    </div>
  </Sidebar.Header>

  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={item.url} {...props}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>

  <!-- <Sidebar.Footer class="p-4 border-t">
    <div class="flex items-center gap-2">
      <div class="h-6 w-6 rounded-full bg-muted"></div>
      <span>User Name</span>
    </div>
  </Sidebar.Footer> -->
</Sidebar.Root>
