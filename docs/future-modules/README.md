# Future Modules Backlog Reference

//1.- Explain the purpose of this note for maintainers.
This reference explains where the curated list of prospective Yamato modules lives inside the Next.js application. It helps designers and engineers quickly locate and iterate on the backlog content that appears in the modules experience.

//2.- Identify the React component that renders the backlog.
The backlog is defined within [`web/src/components/views/private/ModulesConfigurator.tsx`](../../web/src/components/views/private/ModulesConfigurator.tsx). The component hydrates localized data from `dict.private.modules.backlog.items`, falling back to the English defaults embedded in the file, and the `Future module backlog` `<Card>` renders the list on screen.

//3.- Describe how the UI surfaces the backlog to end users.
The `ModulesConfigurator` component is loaded by the private route at [`web/src/app/private/modules/page.tsx`](../../web/src/app/private/modules/page.tsx). When an authenticated operator visits `/private/modules`, the page mounts the component and displays two cards: the localized "Module control center" with enumerated toggles and the "Future module backlog" card that lists prospective modules such as "Predictive churn radar" and "AI onboarding concierge".

//4.- Share testing coverage for the backlog content.
Automated regression coverage lives in [`web/tests/modules-configurator.spec.ts`](../../web/tests/modules-configurator.spec.ts), which authenticates into the private area, waits for the module cards to finish rendering, and asserts both the control center and backlog rows appear with their localized numbering.
