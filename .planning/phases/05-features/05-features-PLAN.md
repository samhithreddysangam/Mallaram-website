---
phase: 05-features
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - lib/i18n.ts
  - components/Providers.tsx
  - app/[locale]/page.tsx
autonomous: true
requirements:
  - FEAT-01
  - FEAT-02

must_haves:
  truths:
    - "All 9 features from temp_source_repo are integrated into main project"
    - "Each feature uses existing i18n system (lib/i18n.ts)"
    - "Each feature matches existing design system (Deep Green/Light Cream)"
    - "All components follow existing naming pattern (PascalCase folder structure)"
    - "No duplicate translation system - existing i18n is extended"
  artifacts:
    - path: "lib/i18n.ts"
      provides: "Extended translations for all new features"
      min_lines: 350
    - path: "components/Providers.tsx"
      provides: "Language toggle context used by all components"
      exports: ["useLang", "useTheme"]
    - path: "components/Dashboard/CommandCenter.tsx"
      provides: "IKP metrics dashboard section"
    - path: "components/Dashboard/AnalyticsDashboard.tsx"
      provides: "KPI analytics section"
    - path: "components/Transparency/TransparencyPortal.tsx"
      provides: "Financial transparency section"
    - path: "components/Transparency/WaterGovernance.tsx"
      provides: "Water/irrigation management section"
    - path: "components/Grievance/GrievanceSystem.tsx"
      provides: "Complaint submission and tracking section"
    - path: "components/Alerts/EmergencyAlerts.tsx"
      provides: "Emergency alerts section"
  key_links:
    - from: "components/Dashboard/*"
      to: "lib/i18n"
      via: "import { getDictionary } from '@/lib/i18n'"
      pattern: "dictionary\\.(command|analytics)"
    - from: "app/[locale]/page.tsx"
      to: "components/Transparency/*"
      via: "import TransparencyPortal from '@/components/Transparency/TransparencyPortal'"
      pattern: "import.*Transparency"
---

<objective>
Integrate 9 demo features from temp_source_repo into main mallaram-website while adapting to existing UI and i18n system.
</objective>

<execution_context>
@C:/Users/gunny/.config/opencode/get-shit-done/workflows/execute-plan.md
@C:/Users/gunny/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation/01-foundation-SUMMARY.md

# Feature source (temp_source_repo)
C:/Users/gunny/development/main projects/mallaram-website/temp_source_repo/mallaram-platform/src/components/GrievanceSystem.jsx
C:/Users/gunny/development/main projects/mallaram-website/temp_source_repo/mallaram-platform/src/components/AnalyticsDashboard.jsx
C:/Users/gunny/development/main projects/mallaram-website/temp_source_repo/mallaram-platform/src/components/CommandCenter.jsx
C:/Users/gunny/development/main projects/mallaram-website/temp_source_repo/mallaram-platform/src/components/WaterGovernance.jsx
C:/Users/gunny/development/main projects/mallaram-website/temp_source_repo/mallaram-platform/src/components/TransparencyPortal.jsx
C:/Users/gunny/development/main projects/mallaram-website/temp_source_repo/mallaram-platform/src/components/EmergencyAlerts.jsx
C:/Users/gunny/development/main projects/mallaram-website/temp_source_repo/mallaram-platform/src/context/Providers.jsx
C:/Users/gunny/development/main projects/mallaram-website/temp_source_repo/mallaram-platform/src/utils/translations.js
</context>

<tasks>

<task type="auto">
  <name>Task 1: Extend i18n translations for new features</name>
  <files>lib/i18n.ts</files>
  <action>
    Add new translation keys to existing Dictionary type and both enDict/teDict:
    - command: title, titleHighlight, subtitle, rainfall, canal, irrigation, sanitation, electricity, weather, aiInsight, aiText
    - analytics: title, titleHighlight, subtitle, governance, complaints, waterUsage, sanitation, prediction, health
    - transparency: title, titleHighlight, subtitle, budget, spent, projects, fundsTitle
    - water: title, titleHighlight, subtitle, canals, allocation
    - grievance: title, titleHighlight, subtitle, total, resolved, pending, avgTime, formTitle, formName, formPhone, formCategory, formDesc, formSubmit, categories
    - emergency: title, titleHighlight, subtitle, active, recent, whatsapp, sms, voice, flood, rain, announce
    - agriculture: title, subtitle, crop, yield, weather, market
    - gramSabha: title, subtitle, nextMeeting, previousMinutes
    - villageMap: title, subtitle, zoomIn, zoomOut, locate

    KEEP existing translations intact - only extend, don't replace.
  </action>
  <verify>Verify TypeScript compiles: npx tsc --noEmit lib/i18n.ts</verify>
  <done>Dictionary type has all new feature keys, both English and Telugu dictionaries have translations for all 9 features</done>
</task>

<task type="auto">
  <name>Task 2: Create Language/Theme context provider</name>
  <files>components/Providers.tsx</files>
  <action>
    Extend existing Providers.tsx to include language and theme context:
    - Add LangContext for i18n toggle (use existing locale pattern from lib/i18n)
    - Add useLang() hook that returns { lang, setLang, t }
    - Keep existing SessionProvider intact
    - Do NOT copy temp_source_repo Providers.jsx - adapt to use your existing i18n system

    The t() function should use getTranslations(dictionary) pattern from lib/i18n.ts.
  </action>
  <verify>Verify Providers compiles and exports useLang hook</verify>
  <done>Components can import { useLang } from '@/components/Providers' to access translations</done>
</task>

<task type="auto">
  <name>Task 3: Create Dashboard folder with CommandCenter & Analytics</name>
  <files>components/Dashboard/CommandCenter.tsx, components/Dashboard/AnalyticsDashboard.tsx</files>
  <action>
    Create components folder structure following existing pattern:
    - components/Dashboard/CommandCenter.tsx - adapt from temp_source_repo, use useLang(), match existing design (bg-cream, green colors)
    - components/Dashboard/AnalyticsDashboard.tsx - adapt from temp_source_repo, use useLang(), match existing design

    Key adaptations:
    - Replace temp_source_repo CSS variables with Tailwind classes matching your design (bg-cream, text-primary-green, etc.)
    - Use your existing component patterns (GlassCard, etc. if available, or standard Tailwind)
    - Remove temp_source_repo animations unless using framer-motion from existing project
    - Use t(lang, 'command.*') for all text content from i18n
  </action>
  <verify>Build passes: npm run build 2>&1 | Select-String -Pattern "error|Error" -Quiet</verify>
  <done>Both Dashboard components exist and render without errors</done>
</task>

<task type="auto">
  <name>Task 4: Create Transparency folder with TransparencyPortal & WaterGovernance</name>
  <files>components/Transparency/TransparencyPortal.tsx, components/Transparency/WaterGovernance.tsx</files>
  <action>
    Create components/Transparency/ folder with:
    - TransparencyPortal.tsx - adapt from temp_source_repo, use useLang()
    - WaterGovernance.tsx - adapt from temp_source_repo, use useLang()

    Apply same design adaptations as Task 3.
  </action>
  <verify>Build passes: npm run build</verify>
  <done>Both Transparency components exist and render without errors</done>
</task>

<task type="auto">
  <name>Task 5: Create Grievance folder with GrievanceSystem</name>
  <files>components/Grievance/GrievanceSystem.tsx</files>
  <action>
    Create components/Grievance/ folder with:
    - GrievanceSystem.tsx - adapt from temp_source_repo, use useLang()

    Note: This is a DEMO component with mock data (not functional backend). Keep the form UI but note it's for display only.
  </action>
  <verify>Build passes: npm run build</verify>
  <done>GrievanceSystem component exists and renders without errors</done>
</task>

<task type="auto">
  <name>Task 6: Create Alerts folder with EmergencyAlerts</name>
  <files>components/Alerts/EmergencyAlerts.tsx</files>
  <action>
    Create components/Alerts/ folder with:
    - EmergencyAlerts.tsx - adapt from temp_source_repo, use useLang()
  </action>
  <verify>Build passes: npm run build</verify>
  <done>EmergencyAlerts component exists and renders without errors</done>
</task>

</tasks>

<verification>
- [ ] All 9 features from temp_source_repo are integrated
- [ ] Each uses existing lib/i18n.ts translations (not temp_source_repo translations.js)
- [ ] Design matches existing project (Deep Green/Light Cream, Tailwind)
- [ ] Build passes without errors
</verification>

<success_criteria>
All features integrated as display/demo sections that match existing UI, using existing i18n system.
</success_criteria>

<output>
After completion, create `.planning/phases/05-features/05-features-01-SUMMARY.md`
</output>