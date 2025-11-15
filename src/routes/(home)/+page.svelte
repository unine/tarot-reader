<script>
  import { enhance } from "$app/forms";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { majorArcana, drawCards } from "$lib/utils.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";

  let formElement = $state();
  let questionValue = $state("");
  let selectedCards = $state([]);
  let cardDialog = $state(false);
  let spreadCards = $state([]);
  let availableSlots = $state([1, 2, 3]);
  const maxCards = 3; // For 3-card spread

  function showCardDrawDialog() {
    // Show ALL cards from the major arcana (shuffled)
    const shuffled = [...majorArcana].sort(() => Math.random() - 0.5);
    spreadCards = shuffled.map((card, index) => ({
      ...card,
      position: index,
      isRevealed: false,
      isSelected: false,
    }));
    selectedCards = [];
    availableSlots = [1, 2, 3];
    cardDialog = true;
  }

  function closeDialog() {
    cardDialog = false;
    selectedCards = [];
    availableSlots = [1, 2, 3];
    spreadCards = [];
  }

  function selectCard(cardIndex) {
    if (availableSlots.length === 0) return; // No slots available

    // Get the lowest available slot
    const nextSlot = Math.min(...availableSlots);

    // Remove this slot from available slots
    availableSlots = availableSlots.filter((slot) => slot !== nextSlot);

    // Select the card
    spreadCards[cardIndex].isSelected = true;

    const cardWithOrder = {
      ...spreadCards[cardIndex],
      selectionOrder: nextSlot,
    };

    // Add to selectedCards and keep it sorted by selectionOrder
    selectedCards = [...selectedCards, cardWithOrder].sort(
      (a, b) => a.selectionOrder - b.selectionOrder
    );
  }

  function unselectCard(cardIndex) {
    // Find the card being unselected
    const cardToRemove = selectedCards.find(
      (card) => card.position === cardIndex
    );
    if (!cardToRemove) return;

    // Add its order back to available slots
    availableSlots = [...availableSlots, cardToRemove.selectionOrder].sort(
      (a, b) => a - b
    );

    // Remove from UI and selectedCards
    spreadCards[cardIndex].isSelected = false;
    selectedCards = selectedCards.filter((card) => card.position !== cardIndex);
  }

  function resetSelection() {
    selectedCards = [];
    availableSlots = [1, 2, 3];
    spreadCards = spreadCards.map((card) => ({
      ...card,
      isSelected: false,
    }));
  }

  function submitWithCards() {
    cardDialog = false;
    // The enhance function will handle adding cards to formData
    formElement.requestSubmit();
  }
</script>

<div class="p-4 flex flex-col justify-center items-center min-h-svh">
  <div class="flex flex-col justify-center items-center gap-4 w-[600px]">
    <h1 class="text-3xl uppercase font-semibold">What question on your mind</h1>

    <form
      bind:this={formElement}
      action="?/ask"
      method="post"
      class="w-full flex flex-col gap-2"
      use:enhance={({ formData, cancel }) => {
        if (selectedCards.length === 0) {
          cancel();
          showCardDrawDialog();
          return;
        }

        const cleanSelectedCards = selectedCards.map((card) => ({
          id: card.id,
          name: card.name,
          image: card.image,
          meaning: card.meaning,
          selectedOrder: card.selectionOrder,
        }));

        // Add selected cards to formData
        formData.set("selectedCards", JSON.stringify(selectedCards));

        return async ({ result, update }) => {
          if (result.type === "success") {
            questionValue = "";
            selectedCards = [];
            spreadCards = [];
            cardDialog = false;
          }
          await update();
        };
      }}
    >
      <Textarea
        name="question"
        bind:value={questionValue}
        placeholder="Ask me anything..."
        class="min-h-[100px] resize-none"
        required
      />
      <div class="text-right">
        <Button type="submit">Next</Button>
      </div>
    </form>
  </div>
</div>

<Sheet.Root bind:open={cardDialog}>
  <Sheet.Content side="bottom" class="h-[80vh]">
    <Sheet.Header>
      <Sheet.Title>Draw Your Cards</Sheet.Title>
      <Sheet.Description>
        Select {maxCards} cards from the full deck below
      </Sheet.Description>
    </Sheet.Header>

    <div class="123">
      <div class="flex justify-center items-end gap-0 min-h-40 px-4">
        {#each spreadCards as card, index}
          <button
            onclick={() =>
              card.isSelected ? unselectCard(index) : selectCard(index)}
            disabled={!card.isSelected && selectedCards.length >= maxCards}
            class="transition-all duration-300 hover:scale-105 hover:-translate-y-4 focus:outline-none {card.isSelected
              ? 'ring-4 ring-primary ring-opacity-60 -translate-y-6 scale-110 z-10'
              : ''} shrink-0"
            style="transform: rotate({(index - (spreadCards.length - 1) / 2) *
              3.5}deg) {card.isSelected
              ? 'translateY(-1.5rem) scale(1.1)'
              : ''}; margin-left: {index > 0 ? '-0.75rem' : '0'};"
          >
            <img
              src="/cards/CardBacks.png"
              alt="Card Back"
              class="w-16 h-auto rounded-md shadow-lg transition-all duration-300 {!card.isSelected &&
              selectedCards.length >= maxCards
                ? 'opacity-20 grayscale'
                : 'hover:shadow-xl'}"
            />
            {#if card.isSelected}
              <div
                class="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-pulse z-20"
              >
                {selectedCards.findIndex((c) => c.position === index) + 1}
              </div>
            {/if}
          </button>
        {/each}
      </div>

      <div class="text-center my-6">
        <div class="text-sm text-muted-foreground mb-2">
          Selected: {selectedCards.length} / {maxCards}
        </div>
        <div class="text-xs text-muted-foreground">
          Choose from all {majorArcana.length} Major Arcana cards
        </div>
        {#if selectedCards.length > 0}
          <div class="text-xs text-muted-foreground mt-1">
            Cards will be revealed after submission
          </div>
        {/if}
      </div>
    </div>

    <Sheet.Footer class="mt-0">
      <div class="flex justify-between w-full">
        <div class="flex gap-2">
          <Button variant="outline" onclick={closeDialog}>Cancel</Button>
          <Button variant="outline" onclick={resetSelection}>
            Reset Selection
          </Button>
        </div>

        <Button
          onclick={submitWithCards}
          disabled={selectedCards.length !== maxCards}
        >
          Submit Reading ({selectedCards.length}/{maxCards})
        </Button>
      </div>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
