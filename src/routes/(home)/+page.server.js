import { redirect, fail } from "@sveltejs/kit";

export const load = async ({ locals, url }) => {
  return {
    name: "",
  };
};

export const actions = {
  new: async ({ locals, request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries([...formData]);

    try {
      console.log(data);

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
