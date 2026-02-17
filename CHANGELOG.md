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

## [Internal testing release 3(1.0.0)]

### Fixed

- Some computations for spreadable transactions: Shown time periods, partial amounts and alternative texts for empty transaction arrays

### Added

- An option to navigate to the transaction details screen from the category details screen on the analysis tab
- Alerts when user performs deletions or discards changes

### Removed

- some too generic default category keywords

### Improved

- Theme colouring for the line chart on the category analysis details screen
- Categories screen now has a separate local state
- Save buttons light up when user edits need saving
- More intuitive button placements in some places