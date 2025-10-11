//1.- Ensure every private view adopts the shared neumorphic shell for visual consistency.
import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { I18nProvider } from "@/app/providers/I18nProvider"
import { ModulesConfigurator } from "../ModulesConfigurator"
import { ProfileShowcase } from "../ProfileShowcase"
import { RolesMatrix } from "../RolesMatrix"
import { SecurityInsights } from "../SecurityInsights"
import { SettingsControlPanel } from "../SettingsControlPanel"
import { TeamsOverview } from "../TeamsOverview"
import { UsersDirectory } from "../UsersDirectory"
import { ViewsAnalysisMatrix } from "../ViewsAnalysisMatrix"

function renderWithI18n(node: React.ReactNode) {
  //2.- Wrap components with the i18n provider so localized copy resolves during assertions.
  return render(<I18nProvider defaultLocale="en">{node}</I18nProvider>)
}

describe("Private view neumorphic shells", () => {
  const cases = [
    {
      //3.- Verify the modules configurator surfaces the neumorphic shell.
      name: "ModulesConfigurator",
      testId: "modules-neumorphic-card",
      element: <ModulesConfigurator />,
    },
    {
      //4.- Confirm the profile showcase leverages the shared card wrapper.
      name: "ProfileShowcase",
      testId: "profile-neumorphic-card",
      element: <ProfileShowcase />,
    },
    {
      //5.- Check the roles matrix adopts the neumorphic treatment.
      name: "RolesMatrix",
      testId: "roles-neumorphic-card",
      element: <RolesMatrix />,
    },
    {
      //6.- Ensure the security insights view is wrapped correctly.
      name: "SecurityInsights",
      testId: "security-neumorphic-card",
      element: <SecurityInsights />,
    },
    {
      //7.- Validate settings control panel renders inside the shell.
      name: "SettingsControlPanel",
      testId: "settings-neumorphic-card",
      element: <SettingsControlPanel />,
    },
    {
      //8.- Confirm teams overview uses the shared neumorphic card.
      name: "TeamsOverview",
      testId: "teams-neumorphic-card",
      element: <TeamsOverview />,
    },
    {
      //9.- Verify the users directory wraps the provided panel content.
      name: "UsersDirectory",
      testId: "users-neumorphic-card",
      element: <UsersDirectory panel={<div data-testid="stub-panel" />} />,
    },
    {
      //10.- Ensure the views analysis matrix maintains neumorphic styling.
      name: "ViewsAnalysisMatrix",
      testId: "views-neumorphic-card",
      element: <ViewsAnalysisMatrix />,
    },
  ] as const

  for (const testCase of cases) {
    it(`wraps ${testCase.name} in the neumorphic shell`, () => {
      renderWithI18n(testCase.element)
      const card = screen.getByTestId(testCase.testId)
      expect(card).toHaveClass("neumorphic-card")
    })
  }
})
