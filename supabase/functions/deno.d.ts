/** Deno global types for Supabase Edge Functions */
declare namespace Deno {
  function serve(
    handler: (req: Request) => Response | Promise<Response>
  ): { finish: Promise<void> };
}
