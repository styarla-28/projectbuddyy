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
- Keep Home artwork and companion interaction in CozyRoom, and optional grounding activities in GroundingSheet; this keeps the hub focused and activities independently maintainable.
- Define all painted palette colors and texture/shadow styling in src/styles.css; semantic tokens preserve consistent theming across Home and shared navigation.
- Keep optional check-in choices and the current step in the mounted CheckInSheet session state, separate from its temporary tools view; exits preserve progress without storing sensitive answers.
- Route check-in activity selections into the shared GroundingSheet and keep breathing phase timing in breathing.ts; Home box breathing and check-in stream breathing retain their distinct rhythms.
- Keep sensory preferences in the root-mounted SensoryProvider and apply the effective quiet state to body; route changes and portaled activities must honor the same reduced-motion and media-muting controls.
- Define shared motion timing and easing in src/styles.css and compose companion breathing and settling on separate elements; independent transforms preserve the breathing rhythm.
