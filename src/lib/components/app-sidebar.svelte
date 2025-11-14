<script>
  import {
    CalendarIcon,
    HouseIcon,
    InboxIcon,
    SearchIcon,
    SettingsIcon,
    ArrowLeftFromLineIcon,
    ArrowRightFromLineIcon,
  } from "@lucide/svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { useSidebar } from "$lib/components/ui/sidebar/index.js";

  const sidebar = useSidebar();

  console.log(sidebar.toggle);

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
  <Sidebar.Header class="flex items-center justify-between p-4 border-b">
    <div class="flex justify-between items-center w-full">
      {#if sidebar.open}
        <h3 class="">Tarot Reaader</h3>
      {/if}
      <button
        class="hover:cursor-pointer ml-auto"
        onclick={() => sidebar.toggle()}
      >
        {#if sidebar.open}
          <ArrowLeftFromLineIcon class="w-4" />
        {:else}
          <ArrowRightFromLineIcon class="w-4" />
        {/if}
      </button>
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
