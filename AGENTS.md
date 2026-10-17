<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## UI architecture
- Render fitted scarf and acorn-cap paintings through the shared CompanionFigure, with tint masks following the selected painting; integrated art keeps clothing seated consistently at every buddy size.
- Keep Home artwork and companion interaction in CozyRoom, and optional grounding activities in GroundingSheet; this keeps the hub focused and activities independently maintainable.
- Define all painted palette colors, global typography and texture/shadow styling in src/styles.css, aliasing shared semantic colors to the pb theme roles; centralized tokens keep screens and portaled activities consistent.
- Keep optional check-in choices and the current step in the mounted CheckInSheet session state, separate from its temporary tools view; exits preserve progress without storing sensitive answers.
- Route check-in activity selections into the shared GroundingSheet and keep breathing phase timing in breathing.ts; Home box breathing and check-in stream breathing retain their distinct rhythms.
- Keep sensory preferences in the root-mounted SensoryProvider and apply the effective quiet state to body; route changes and portaled activities must honor the same reduced-motion and media-muting controls.
- Define shared motion timing and easing in src/styles.css and compose companion breathing and settling on separate elements; independent transforms preserve the breathing rhythm.
- Keep the full-screen Tactile Texture Pad as its own route with canvas surfaces in TexturePad.tsx; focused activities hide the bottom nav and Home/check-in route into it.
- AI calls live in src/lib/*.server.ts behind createServerFn wrappers in *.functions.ts; keeps the gateway key and prompts server-only.
- Use content-sized tool cards, viewport-aware texture grid rows, and shared bounded bottom sheets; wrapping and short-screen scrolling keep all controls reachable without clipping.
