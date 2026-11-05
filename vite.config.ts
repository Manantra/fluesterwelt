import tailwindcss from "@tailwindcss/vite";
import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
      },

      // Everything happens in the browser: the microphone never leaves the
      // device and there is no server to talk to.
      adapter: adapter({ fallback: "404.html" }),

      prerender: {
        // #how-it-works opens the info drawer rather than naming an element,
        // so nothing on the page carries that id on purpose.
        handleMissingId: ({ id, message }) => {
          if (id !== "how-it-works") throw new Error(message);
        },
      },
    }),
  ],
});
