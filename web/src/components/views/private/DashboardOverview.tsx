"use client"

//1.- Re-export the shadcn example gallery so existing pages keep their imports stable.
import { ShadcnExamplesDashboard, type DashboardExamplesProps } from "./shadcn/ShadcnExamplesDashboard"

export type DashboardOverviewProps = DashboardExamplesProps

export function DashboardOverview(props: DashboardOverviewProps) {
  //2.- Delegate to the new gallery component that stitches together every ui.shadcn.com example.
  return <ShadcnExamplesDashboard {...props} />
}
