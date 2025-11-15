import { redirect, fail } from "@sveltejs/kit";

export const load = async ({ locals, url }) => {
  return {
    name: "",
  };
};

export const actions = {
  ask: async ({ locals, request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries([...formData]);

    try {
      console.log("Question:", data.question);

      const selectedCards = JSON.parse(data.selectedCards || "[]");
      console.log("Selected cards:", selectedCards);
      console.log("Number of cards:", selectedCards.length);

      return {
        success: true,
        message: "Success",
        // url: "/redirect-path",
      };
    } catch (error) {
      return fail(400, {
        error: true,
        message: "Something went wrong please try agian later.",
      });
    }
  },
};
