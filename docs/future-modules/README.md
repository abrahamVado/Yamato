# Future Modules Backlog Reference

//1.- Explain the purpose of this note for maintainers.
This reference explains where the curated list of prospective Yamato modules lives inside the Next.js application. It helps designers and engineers quickly locate and iterate on the backlog content that appears in the modules experience.

//2.- Identify the React component that renders the backlog.
The backlog is defined within [`web/src/components/views/private/ModulesConfigurator.tsx`](../../web/src/components/views/private/ModulesConfigurator.tsx). Inside that file, the `prospectiveModules` array holds every future module entry, and the `Future module backlog` `<Card>` renders the list on screen.

//3.- Describe how the UI surfaces the backlog to end users.
The `ModulesConfigurator` component is loaded by the private route at [`web/src/app/private/modules/page.tsx`](../../web/src/app/private/modules/page.tsx). When an authenticated operator visits `/private/modules`, the page mounts the component and displays two cards: the existing "Module control center" with live toggles and the "Future module backlog" card that lists all prospective modules.

//4.- Share testing coverage for the backlog content.
The end-to-end Playwright spec at [`web/tests/view-experiences.spec.ts`](../../web/tests/view-experiences.spec.ts) includes an assertion that the backlog heading and the flagship "Autonomous case triage" item render, ensuring the list remains visible in automated checks.
