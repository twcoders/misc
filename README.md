Power Platform solution packaging

Prereqs
- Install Power Platform CLI (pac) on macOS: https://aka.ms/powerplatform-vscode
- Sign in once: pac auth create --cloud --url https://make.powerapps.com --kind ADMIN

Build the PCF control
- cd pcf/orgchart-pcf
- npm install
- npm run build

Create a solution and add the control
- cd pcf/orgchart-pcf
- pac solution init --publisher-name "OrgChart" --publisher-prefix orc
- pac solution add-reference --path .

Pack the solution ZIP
- pac solution pack --folder . --zipfile ../orgchart-pcf-solution.zip --processCanvasApps false

Import into Dataverse
- Open make.powerapps.com → Solutions → Import → choose orgchart-pcf-solution.zip

Notes
- Output build artifacts are in pcf/orgchart-pcf/out/controls
- If you already have a solution, you can instead run: pac solution add-reference --path . --solution-name <existing>
# PCF Packaging Guide

This folder contains a PCF control scaffold (`orgchart-pcf`) you can build and deploy as part of a Dataverse solution.

Quick steps:
1) Open a terminal in `pcf/orgchart-pcf`
2) Install: `npm install`
3) Build: `npm run build`
4) Initialize a solution (first time):
   - `pac solution init --publisher-name YourName --publisher-prefix new`
   - `pac solution add-reference --path .`
5) Pack for import:
   - `pac solution pack --zipfile ./orgchart-pcf-solution.zip --folder . --processCanvasApps false`
6) Import the zip into your environment, then add the control to a form and set its properties.

During development, you can use:
- `pac pcf push` for fast iteration directly into your environment.

Notes:
- Make sure you have Power Platform CLI installed and authenticated (`pac auth create`).
- If your organization blocks CDNs, modify `index.ts` ensureLibraries() to reference web resources instead of cdnjs.
