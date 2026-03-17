# Changelog for the monoso app

## [Initial release (2 (1.0.0))] - 2026-02-10

Initial release
- Make your yearly electricity bill (and others) count towards each month equally
- Group your expenses into categories automatically and analyse them across different time periods
- Import transactions quickly with CSV import

### Added

- Overview tab with "Add transaction", "Recent transactions" and "Expense comparison" cards
- Analysis tab with
    - a settings dialog, 
    - a way to navigate between time periods and 
    - a donut chart for categories
- Category analysis detail screen including 
    - a category-specific line chart over the time periods set in the settings and 
    - a list of transactions for the selected category and time period
- Transactions tab with options to add transactions manually or via CSV import
- Transactions can be configured to be spread across a time period
- Categories tab to customize categories and their keywords
- Functionality to automatically categorize transactions by keyword search
- Light and dark theme support

## [Internal testing release 3(1.0.0)] - 2026-02-18

- Fixed some computations related to expenses spread across time periods
- Removed some too generic default category keywords
- Made design, navigation and user interaction across the app more intuitive

### Fixed

- Some computations for spreadable transactions: Shown time periods, partial amounts and alternative texts for empty transaction arrays

### Added

- An option to navigate to the transaction details screen from the category details screen on the analysis tab
- Alerts when user performs deletions or discards changes
- A simple "Loading..." screen to prevent flickering to empty state on app launch

### Removed

- Some too generic default category keywords

### Improved

- Theme colouring for the line chart on the category analysis details screen
- Categories screen now has a separate local state
- Save buttons light up when user edits need saving
- More intuitive button placements in some places
- The transactions details screen and the transactions input dialog are now keyboard aware


## [Internal testing release 4(1.0.1)] - 2026-03-12

- Added an option to specify the amount contribution of each transaction to the analysis
- Made adding and editing transactions more intuitive
- Improved the expense comparison, time period navigation and more across the app

### Added
- An option to specify the amount of a transaction included in the analysis. This feature can also be used to exclude a transaction entirely from the analysis
- One can now switch between expenses and incoming transactions in the transaction editor, instead of typing a negative amount. Under the hood, expenses are still managed as negative amounts. The amount field now only allows entering non-negative floating point numbers

### Fixed
- Added escape screen for the category analysis screen if (period-independently) all transactions for the category are removed from the analysis
- Added a fix to an error with the line chart that occurred when the average line is zero
- Refined the amount field validation to fail for "" and "-"

### Improved
- Automatic back navigation on confirming edits on the category keywords screen
- Numbers on the donut screen now show two decimal digits only
- Numbers across the app (except for the input field) now show thousands separators
- The time of spread period dates now defaults to the start/end of the day
- Minor default category keyword improvements
- Limited expense comparison to at most 12 prior periods for a more realistic comparison
- Optional transaction fields on the transaction editor view are now hidden behind an expandable row to avoid cluttering the view
- The period selected by default is now the one containing the current date (or the closest to it), instead of always the last computed period
- Amount validation in the transaction editor

## [Internal testing release 5(1.0.2)] - 2026-03-14 / First closed testing release

- Irregular transactions now show the correct proportionate amount in the analysis in all cases
- Selecting which periods to show on the category line chart is now more intiutive

### Fixed
- Fixed a bug that displayed spread transaction values incorrectly when one of the default spread dates are used

### Improved
- By default, the selected periods on the category screen now show the 6 previous periods relative to the current date
- Provided a dropdown to select of number of periods on the category analysis screen
- The period line chart's y axis now starts at 0

## Release 6(1.0.3) [Closed testing]

### Fixed
- Refined transaction comparison, so that now, (regular or analysis) amounts of "25.00" and "25" are considered equal. This prevents that upon opening the transaction details screen, the app thinks that changes have been made, even if the user hasn't, since upon loading the transaction details screen, "25.00" is parsed to "25"

### Added
- Extended transaction validation: The "Save"/"Submit" button on the transaction editor now does not save in more error cases
    - Additionally, the user receives an alert that and where the validation failed
- The CSV import now parses the CSV string using papaparse, and thus, supports more delimiters (previously only ";")
- The CSV import now validates all transactions to be imported, and alerts that and where the validation failed