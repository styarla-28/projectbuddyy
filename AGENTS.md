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
