# Restaurant Companion

# မြန်ဆန် — COMPETITION MVP V1

## ONE-PROMPT BUILD — TARGET A SMALL/MEDIUM FRONTEND SCOPE

## IMPORTANT: DO NOT EXPAND BEYOND THIS SPEC

Improve the CURRENT existing project for:

# မြန်ဆန်

Do NOT create a new project.

Reuse existing components, routing, styles, and working features whenever possible.

This is a competition MVP and must remain deliberately limited in scope.

# CRITICAL SCOPE RULE

Build ONLY the experiences listed in this prompt.

Do not automatically add additional dashboards, pages, integrations, database infrastructure, admin systems, or advanced features.

This phase is FRONTEND + MOCK STATE ONLY.

DO NOT implement:

- Supabase

- database

- migrations

- authentication

- Google OAuth

- email

- real AI APIs

- real OCR

- payment gateway

- POS integration

- advanced admin

- CRM

- advanced analytics

- inventory

- reservations

- multi-branch

- real-time backend

- cloud storage

- server infrastructure

We will connect those ourselves later.

Use centralized local mock state so the UI can later be connected to Supabase without being redesigned.

---

# THE PRODUCT

မြန်ဆန် is a friendly restaurant digitalization service for restaurant owners in Myanmar.

It is especially designed for:

- non-technical restaurant owners

- older restaurant owners

- traditional restaurant owners

- younger restaurant managers

- businesses that want technology but do not want to learn complicated software

The owner should NOT need to understand:

KDS

SaaS

API

CMS

automation

integration architecture

or other technical terms.

မြန်ဆန် should translate restaurant problems into understandable solutions.

The main product promise is:

# "သင့်ဆိုင်အတွက် ဘာလိုအပ်လဲ ပြောပါ။

နည်းပညာပိုင်းကို မြန်ဆန်က ကူညီပေးပါမယ်။"

The AI must feel like a kind service consultant.

NOT a software configuration assistant.

---

# MVP STORY

The complete MVP should tell this story:

Luxury Landing Page

↓

Free AI Consultation

↓

မြန်ဆန် understands restaurant problems

↓

AI recommends a simple setup

↓

Owner chooses/customizes package

↓

Owner chooses website + QR style

↓

OPTIONAL website preview

↓

Continue service setup

↓

Final setup summary

↓

Owner Home

↓

Customer QR Ordering Demo

This must feel like ONE continuous journey.

---

# ONLY BUILD THESE 6 CORE EXPERIENCES

1. Premium image-led Landing Page

2. Friendly AI Consultation

3. Recommendation + Package / Setup Customization

4. Restaurant Website + QR Customization / Preview

5. Simple Owner Home

6. Customer QR Ordering Demo

Do not build additional major systems in this generation.

---

# 1. PREMIUM LANDING PAGE

The landing page should immediately feel premium and modern.

Think:

- luxury restaurant

- boutique hotel

- premium hospitality website

- modern lifestyle brand

- elegant food-tech company

Do NOT make it look like:

- generic SaaS

- ERP

- admin dashboard

- white cards everywhere

- purple AI startup

---

## HERO

Use a LARGE restaurant photography background.

Use existing project imagery or high-quality externally hosted royalty-free restaurant photography.

IMPORTANT:

Do NOT spend effort generating custom AI images in this phase.

Use imagery showing:

- beautiful restaurant interior

- warm ambient lighting

- wooden tables

- elegant dining

- food

- plants

- human hospitality

Apply a subtle dark/warm gradient overlay.

Hero approximately:

75–85vh desktop.

Content should be left-aligned or editorially positioned rather than everything centered.

Logo / Name:

မြန်ဆန်

Headline:

သင့်ဆိုင်အတွက် လိုအပ်တာကို ပြောပါ။

ကျန်တာကို မြန်ဆန်က ကူညီပေးပါမယ်။

Supporting text:

A simpler way to bring your restaurant online —

without learning complicated technology.

Primary CTA:

[ အခမဲ့ အကြံပေးမှု စတင်မယ် ]

Secondary CTA:

[ Customer Experience ကြည့်မယ် ]

Small trust text:

✓ Easy to understand

✓ Burmese + English

✓ No technical knowledge needed

---

# LANDING CONTENT

Keep the homepage SHORT.

Only include:

Hero

How It Works

What မြန်ဆန် Can Help With

Restaurant Website Preview

Package Preview

Final CTA

Do NOT build a giant 12-section marketing site.

---

# HOW IT WORKS

Use a clean editorial three-step layout:

01

Tell Us About Your Restaurant

02

We Recommend What You Need

03

Choose Your Setup

Avoid 3 oversized identical cards.

Use:

large numbers

subtle dividers

photography

simple typography

---

# WHAT WE HELP WITH

Use plain owner-friendly language.

Examples:

Customer order တင်တာ ပိုလွယ်အောင်

Menu update လုပ်တာ ပိုလွယ်အောင်

ဆိုင်အတွက် professional website ရအောင်

Table QR ပြင်ဆင်ပေးတာ

Kitchen မှာ order တွေ မြင်ရလွယ်အောင်

Staff အသုံးပြုရလွယ်အောင်

Do not lead with technical feature names.

---

# 2. LANDING → AI CONSULTATION

This transition is VERY IMPORTANT.

When:

Start Free Consultation

is clicked:

DO NOT abruptly navigate into a dashboard.

Use smooth client-side transition.

Animate:

hero opacity 1 → 0

hero translateY 0 → -12px

chat opacity 0 → 1

chat translateY 16px → 0

Duration:

approximately 300–450ms.

Keep:

same brand header

same warm background

same visual identity

The user should feel:

"I just started talking to မြန်ဆန်."

---

# 3. AI CONSULTANT UX

Route:

/consult

The consultation should look like a modern premium chatbot.

NOT a dashboard.

Desktop:

centered conversation

max-width around 820px.

Mobile:

full width.

There must be:

ONE main scroll area.

DO NOT permanently display:

service grids

package grids

progress sidebars

website builder

pricing panels

on the right side.

If options are needed, show them contextually inside:

- chat

- modal

- drawer

- bottom sheet

---

# AI HEADER

Keep minimal:

မြန်ဆန်

Small subtitle:

Free Restaurant Consultation

Right:

မြန်မာ / EN

Theme

Exit

Optional small status:

● သင့်ဆိုင်အကြောင်း သိအောင် မေးနေပါတယ်

No giant progress indicator.

---

# AI PERSONALITY

The AI must be:

- patient

- kind

- calm

- conversational

- respectful

- easy to understand

- never judgmental

- never aggressively sales-focused

Especially important for older/non-technical owners.

Example:

"မသေချာသေးလည်း ရပါတယ်။

သင့်ဆိုင်အခြေအနေအရ မြန်ဆန်က အရင်အကြံပြုပေးနိုင်ပါတယ်။"

Avoid:

"Configure your KDS."

"Select CMS."

"Choose integration architecture."

---

# CONSULTATION QUESTIONS

Keep consultation SHORT.

Ask around 5 easy questions.

ONE question at a time.

### Question 1

ဘယ်လိုဆိုင်မျိုး ဖွင့်ထားပါသလဲ?

Quick options:

Hotpot / BBQ

Cafe

မြန်မာစားသောက်ဆိုင်

Casual Dining

Other

---

### Question 2

ဆိုင်မှာ Table ဘယ်လောက်လောက်ရှိပါသလဲ?

Options:

1–10

11–20

21–40

40+

---

### Question 3

Customer တွေ အခု order ဘယ်လိုတင်ကြပါသလဲ?

Options:

Waiter ကိုခေါ်တယ်

စာရွက်နဲ့ order ရေးတယ်

ဖုန်း/POS သုံးထားတယ်

Other

---

### Question 4

ဆိုင်မှာ အခက်ဆုံးက ဘာဖြစ်နေပါသလဲ?

Options:

Customer က waiter စောင့်ရတာ

Order မှားတာ

Menu ပြောင်းရတာခက်တာ

Kitchen ဆီ order ရောက်တာနှေးတာ

---

### Question 5

တစ်ခုခုပိုလွယ်သွားမယ်ဆိုရင် ဘာကိုအရင်လိုချင်ပါသလဲ?

Options:

Customer order မြန်စေချင်တယ်

Staff အလုပ်လွယ်စေချင်တယ်

ဆိုင် website လိုချင်တယ်

Menu update ပိုလွယ်ချင်တယ်

[ မြန်ဆန်က အကြံပြုပေးပါ ]

---

# MOCK AI

Do NOT call a real AI API.

Implement a deterministic local consultant.

But make the UX feel conversational.

Use consultation answers to choose sensible recommendations.

Example:

Hotpot

18 tables

Waiter ordering

Waiting problem

→ recommend Growth setup.

Keep mock consultant logic centralized.

Example:

src/services/mockConsultant.ts

Do not spread if/else logic throughout UI components.

---

# 4. RECOMMENDATION

Do not end consultation after questions.

Transition naturally.

AI:

"အခု သင့်ဆိုင်အခြေအနေကို နားလည်ပါပြီ။

18 Table ရှိပြီး customer တွေ waiter စောင့်နေရတာဆိုတော့ ဒီ setup နဲ့ အရင်စတာ အဆင်ပြေမယ်လို့ အကြံပြုပါတယ်။"

Show ONE recommendation card.

Example:

SHWE HOTPOT

Recommended for Your Restaurant

✓ Customer က QR scan ပြီး ကိုယ်တိုင် order တင်နိုင်မယ်

✓ Menu ကို ပြန်မပုံနှိပ်ဘဲ update လုပ်နိုင်မယ်

✓ Kitchen က order အသစ်တွေကို ရှင်းရှင်းလင်းလင်း မြင်နိုင်မယ်

✓ ဆိုင်အတွက် professional website ရမယ်

Primary:

[ ဒီ Setup ကိုယူမယ် ]

Secondary:

[ ကိုယ်တိုင်ပြင်မယ် ]

Small:

[ ဘာကြောင့် ဒီလိုအကြံပြုတာလဲ? ]

---

# 5. PACKAGE SYSTEM

Use only THREE packages.

Keep them simple.

Do not overwhelm the owner with technical comparison tables.

---

## မြန်ဆန် START

For restaurants that want an easy first step.

Customer benefits:

✓ Customer can view menu from phone

✓ Customer can order using table QR

✓ Simple restaurant website

✓ Table QR setup

---

## မြန်ဆန် GROWTH

Mark:

RECOMMENDED

For busier restaurants.

Everything in Start plus:

✓ Customized restaurant website

✓ Kitchen order screen

✓ Customized QR design

✓ Basic staff training

---

## မြန်ဆန် PARTNER

For owners who want more help from our team.

Everything in Growth plus:

✓ Menu setup assistance

✓ QR stand assistance

✓ Priority help

✓ More managed setup

✓ Future POS consultation

---

# PACKAGE DISPLAY

During conversation:

only show the recommended package first.

Example:

Growth

Recommended for Shwe Hotpot

[Choose Growth]

[Customize]

[Compare Plans]

Only when:

Compare Plans

is clicked:

open a modal / drawer showing all 3.

This reduces visual clutter.

---

# 6. CUSTOMIZED SETUP

The owner must be able to customize their package.

But DO NOT show 20 checkboxes.

Use simple owner-language.

Example:

Your Setup

CUSTOMER

[x] Customer can scan & order

[x] Phone menu

YOUR RESTAURANT

[x] Professional website

[x] Kitchen order screen

HELP FROM မြန်ဆန်

[x] Basic staff training

[ ] QR stand preparation

[ ] Menu setup assistance

Buttons:

[ ← Back ]

[ Save & Continue ]

---

# SMART DEFAULTS

Reduce clicks.

Based on consultation:

preselect sensible options.

For an 18-table hotpot:

default:

Growth

18 tables

Bilingual

QR ordering

Kitchen order view

Professional website

Premium/Traditional website recommendation

The owner should mostly CONFIRM choices rather than build everything manually.

---

# 7. BACK BUTTON — MUST WORK CORRECTLY

This is a critical bug to fix.

Every setup stage MUST contain:

← Back

Back means:

go to the IMMEDIATELY PREVIOUS stage.

It must NOT automatically return to Home.

Examples:

Package Customization

← Recommendation

Website Setup

← Package

QR Setup

← Website

Service Setup

← QR

Summary

← Service Setup

Preserve ALL selections when going backward.

Home should only be reached when the owner explicitly chooses:

Exit Setup

---

# 8. SIMPLE SETUP NAVIGATION

Do NOT use a 10-step progress bar.

Only show:

Consultation

→ Your Setup

→ Review

Within Your Setup internally maintain:

package

website

QR

services

but don't visually overwhelm the owner.

---

# 9. WEBSITE STYLE

After package selection:

AI:

"Customer တွေ သင့်ဆိုင် website ကို ဝင်တဲ့အခါ ဘယ်လိုခံစားစေချင်ပါသလဲ?"

Show only:

Warm & Friendly

Modern & Clean

Traditional

Luxury

Map these choices automatically to one of THREE templates.

Do not ask users about:

CSS

layout

font system

components

web design terminology.

---

# 10. THREE WEBSITE TEMPLATES

Only create THREE reusable restaurant templates.

## MODERN

Large photography

Clean typography

Light surfaces

Simple editorial spacing

## TRADITIONAL

Warm cream

Wood / natural tones

Hospitality-oriented feel

Cultural warmth

## LUXURY

Large cinematic photography

Dark/rich overlay

Elegant serif headings

Premium spacing

Muted gold / restaurant-specific accent

Three excellent templates are enough.

Do NOT create more.

---

# 11. WEBSITE CUSTOMIZATION

Keep controls minimal.

Only allow:

Restaurant Name

Template

Main Color

Tagline

Hero Image

Language

Do NOT build:

drag/drop editor

section-builder

Wix clone

advanced typography editor

custom CSS

---

# LUXURY IMAGE STYLE

The generated restaurant website must look like a REAL premium hospitality website.

Use:

large background images

full-width hero photography

large food images

restaurant interior images

soft gradients

dark overlays

editorial layouts

asymmetric image/text layouts

subtle zoom animations

generous whitespace

Avoid:

card-grid after card-grid

SaaS-looking sections

dashboard elements

---

# DEMO RESTAURANT

Use:

SHWE HOTPOT

Website luxury theme:

Deep Burgundy

Warm Ivory

Muted Gold

Charcoal

Hero:

premium hotpot / restaurant interior photography

Headline:

Gather. Share. Enjoy.

Supporting:

A warm hotpot experience made for sharing.

Buttons:

Order Now

Explore Menu

---

# WEBSITE PREVIEW CONTENT

Keep the restaurant website short but visually impressive:

Hero

3 Signature Dishes

Short Restaurant Story

Small Menu Preview

Atmosphere Image

Opening Hours + Location

Small Gallery

Footer

No huge marketing website.

---

# 12. WEBSITE PREVIEW IS OPTIONAL — CRITICAL

Preview must NEVER be a dead end.

After website settings:

AI:

"Website preview အဆင်သင့်ဖြစ်ပါပြီ။

အခုကြည့်မလား၊ setup ကိုဆက်လုပ်မလား?"

Buttons:

[ Preview Website ]

[ Continue Setup ]

---

# IF PREVIEW IS OPENED

Always show persistent navigation:

[ ← Back to Setup ]

[ Edit ]

[ Continue Setup → ]

Do NOT only show:

Back Home

The preview should be a temporary branch from the setup journey.

---

# 13. QR CUSTOMIZATION

After website:

AI:

"Table မှာ customer scan လုပ်ဖို့ QR ပုံစံရွေးရအောင်."

Show only THREE:

Simple

Traditional

Premium

Also provide:

[ မြန်ဆန်က ရွေးပေးပါ ]

Recommended choice should already be selected based on website style.

Example QR preview:

SHWE HOTPOT

SCAN TO ORDER

[ QR ]

TABLE 07

Powered by မြန်ဆန်

Buttons:

[ ← Back ]

[ Continue ]

---

# 14. SERVICE HELP

After QR:

AI:

"နောက်ဆုံးအနေနဲ့ ဘယ်အပိုင်းတွေကို မြန်ဆန် team က ကူညီပေးရမလဲ?"

Use large/simple options:

Menu ကို digital ပြောင်းပေးပါ

QR stand ပြင်ဆင်ပေးပါ

Staff ကို အသုံးပြုနည်း သင်ပေးပါ

Website setup ကူညီပေးပါ

ကိုယ်တိုင်လုပ်မယ်

Do NOT mention complicated professional-service terminology.

---

# 15. FINAL SETUP SUMMARY

Show one clean review screen.

Example:

SHWE HOTPOT

Your မြန်ဆန် Setup

PACKAGE

Growth

CUSTOMER ORDERING

QR Ordering

WEBSITE

Luxury

TABLE QR

18 Tables

Premium Style

HELP REQUESTED

Staff Training

QR Stand Setup

Buttons:

[ ← Edit Setup ]

[ Confirm My Setup ]

[ Save for Later ]

Because this phase has no backend:

Confirm My Setup

should update frontend state and show a polished mock success screen.

Do NOT pretend real payment occurred.

---

# 16. SUCCESS SCREEN

Do not automatically throw the owner back to Home.

Show:

"အဆင်သင့်ဖြစ်ပါပြီ 🎉

Shwe Hotpot အတွက် setup ကို သိမ်းထားပါတယ်."

Then:

[ Go to My Restaurant ]

[ Preview Customer Experience ]

[ Edit Setup ]

This prevents another dead end.

---

# 17. SIMPLE OWNER HOME

Route:

/owner

Do NOT create a complex dashboard.

Use a subtle wide restaurant image header.

Example:

Good afternoon, Daw Mya

SHWE HOTPOT

Then:

TODAY

4 Active Orders

320,000 MMK Sales

2 Sold Out

One large AI-like input:

မြန်ဆန်ကို ဘာကူညီပေးခိုင်းချင်ပါသလဲ?

Quick buttons:

Menu

Orders

Website

QR

Keep it very simple.

Do not build full analytics.

---

# 18. CUSTOMER QR ORDERING

Route example:

/r/shwe-hotpot/table/7

This must be HIGHLY POLISHED because it is customer-facing.

Mobile first.

Use:

large food/background image at top

restaurant branding

Table 07

sticky category navigation

Categories:

Popular

Hotpot

Sides

Drinks

Only around 6–8 menu items.

---

# MENU ITEMS

Use polished imagery.

Examples:

Chicken Hotpot

12,000 MMK

Seafood Hotpot

18,000 MMK

Premium Beef Set

22,000 MMK

SOLD OUT

Milk Tea

3,000 MMK

Allow:

Add

Quantity +/-

Remove

---

# CART

Mobile:

sticky bottom pill:

3 Items · 27,000 MMK

[View Order]

Opening it should use a bottom sheet.

Show:

items

quantity

total

notes

[Place Order]

No signup.

---

# MOCK ORDER

After Place Order:

Order #A104

✓ Received

● Preparing

○ Ready

Use frontend state only.

Do NOT implement kitchen/backend yet.

---

# 19. DESIGN SYSTEM

မြန်ဆန် PRODUCT UI:

Royal Crimson:

#991B1B

Primary Hover:

#7F1D1D

Warm Amber:

#D97706

Light Background:

#FFF9F2

Surface:

#FFFFFF

Text:

#18181B

Dark:

#0F0F11

Dark Surface:

#18181B

Do NOT introduce:

purple AI gradients

bright blue

cyan

random colors

---

# RESTAURANT WEBSITE

The restaurant website uses the RESTAURANT'S branding rather than the မြန်ဆန် palette.

Only small:

Powered by မြန်ဆန်

in footer.

---

# 20. MODERN MOTION

Use subtle:

fade

translate

crossfade

drawer motion

image zoom

hover transitions

Keep durations:

250–450ms.

Do not build complex animation systems.

Respect reduced motion.

---

# 21. IMAGE USAGE

Use photography as part of the design.

Prefer:

full bleed

background photography

large editorial images

food closeups

restaurant interior

warm human hospitality

Do not simply place identical images inside a grid of cards.

IMPORTANT FOR CREDIT CONTROL:

Reuse the same carefully chosen set of restaurant images throughout this MVP where appropriate.

Do NOT generate dozens of separate assets.

---

# 22. MOBILE FIRST

Must work well at:

375px

430px

Also:

768px

1440px

For older owners:

large tap targets

clear Back / Continue buttons

readable font sizes

short labels

no tiny controls

---

# 23. CENTRALIZED MOCK STATE

Create ONE lightweight frontend store/context.

Track only:

restaurantType

tableCount

orderingMethod

mainProblem

mainGoal

recommendedPackage

selectedPackage

selectedServices

websiteStyle

restaurantColor

tagline

QRStyle

helpServices

currentStage

order/cart demo state

Do NOT introduce Redux unless already installed.

Use existing simple state management or React context.

---

# 24. REUSABLE COMPONENTS

To reduce implementation complexity, reuse components.

Create only what is useful:

AIMessage

UserMessage

ChatComposer

QuickChoices

RecommendationCard

SelectionSheet

PackageCard

WebsiteStyleSelector

RestaurantPreview

QRPreview

SetupNavigation

SetupSummary

RestaurantMenu

CartSheet

Do not create unnecessarily abstract component systems.

---

# 25. ROUTES

Keep routes limited:

/

 /consult

 /setup

 /preview/shwe-hotpot

 /owner

 /r/shwe-hotpot/table/7

Do not create dozens of routes.

If existing project routing differs, adapt rather than restructuring everything.

---

# 26. DEMO RESET

Provide a small:

Reset Demo

option somewhere appropriate for development/demo.

This should reset frontend mock state.

Useful for competition demonstrations.

Do not make it prominent for normal owner flow.

---

# 27. EXACT COMPETITION FLOW

This must work:

Landing

↓

Start Free Consultation

↓

Hotpot

↓

11–20 Tables

↓

Waiter Ordering

↓

Customers Wait

↓

Want Faster Ordering

↓

AI recommends Growth

↓

Choose Growth

↓

Customize if desired

↓

Choose Luxury website

↓

Website Preview OPTIONAL

IF preview:

Back to Setup works

Continue Setup works

↓

Choose Premium QR

↓

Choose Staff Training + QR Stand Help

↓

Review Setup

↓

Confirm

↓

Success

↓

My Restaurant

OR

Customer Experience

↓

Customer opens Table 07

↓

Adds food

↓

Places order

↓

Sees Received / Preparing

No dead end anywhere.

---

# 28. CREDIT-CONTROL INSTRUCTIONS

CRITICAL:

Do not expand this scope.

Do not automatically add features because they might be useful later.

Do not build backend placeholders beyond simple service interfaces.

Do not build admin.

Do not build KDS in this version.

Do not build real AI.

Do not build authentication.

Do not build complex analytics.

Do not generate many unique image assets.

Do not create more than three packages.

Do not create more than three website templates.

Do not create more than three QR templates.

Do not create more than 6 main routes.

Reuse components.

Prioritize completing the exact user journey over adding functionality.

---

# DEFINITION OF DONE

This MVP is complete when:

✓ Landing looks premium and image-led.

✓ Landing → consultation transition feels smooth.

✓ AI consultation is simple enough for non-technical owners.

✓ Technical terminology is mostly hidden.

✓ AI recommends instead of forcing configuration.

✓ Three packages work.

✓ Customization works.

✓ Back always goes to previous stage.

✓ Back does NOT automatically return Home.

✓ Setup state is preserved.

✓ Website preview is optional.

✓ Website preview has Back to Setup and Continue Setup.

✓ Luxury restaurant preview feels like a real restaurant website.

✓ QR selection works.

✓ Service-help selection works.

✓ Final summary works.

✓ Success screen is not a dead end.

✓ Owner mini-home works.

✓ Customer ordering demo works.

✓ Light and dark mode are visually coherent.

✓ Mobile is polished.

✓ No backend was added.

✓ No unnecessary pages were added.

✓ Existing project functionality was not unnecessarily destroyed.

---

# FINAL PRODUCT FEELING

The restaurant owner should think:

"Technology အကြောင်းသိဖို့ မလိုဘူး။

ဆိုင်မှာ ဘာအခက်အခဲရှိလဲ မြန်ဆန်ကို ပြောလိုက်ရုံပဲ။

ကျွန်တော့်ဆိုင်နဲ့ ကိုက်တဲ့အရာကို သူတို့ရွေးပေးတယ်၊

ကြိုက်သလို နည်းနည်းပြင်ပြီး စလို့ရတယ်။"

Build exactly this experience.

DO NOT EXPAND THE MVP BEYOND THIS PROMPT.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://myan-san-easy.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0f3ce140-2796-44e0-8f60-87ba4ea85307).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
