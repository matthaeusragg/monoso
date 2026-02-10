const colors = {
    light: {
      // React Navigation / System Defaults
      theme: {
        primary: '#1f7a8c', // The "Action" color. It styles the active tab icon and active header buttons.
        background: '#f1f5f9', // The main canvas behind your screens. If your screen has no container style, this is what you see.
        card: '#ffffff', // The background color for Headers (Top) and Tab Bars (Bottom).
        text: '#0f172a', // The default color for titles in the Header and labels in the Tab Bar.
        border: "#e2e8f0", // The thin line separating the header or tab bar from the main content.
        // notification: ..., // Used specifically for badge counts (the little red circles) on tab icons.
      },
      // Functional Design Tokens
      content: {
        primary: '#0f172a',   // Main titles
        secondary: '#475569', // Subtitles/body
        tertiary: '#94a3b8',  // Captions/labels
        light: '#acb7c8', // light-ish grey independently of theme
        medium: '#64748b', // medium-ish grey independently of theme
        accent: '#1f7a8c',    // Brand teal
        softAccent: '#88d0cd',
        onAccent: '#ffffff',  // Text on top of teal buttons
        negative: '#aa3e3e',
        positive: '#378b56',
      },
      surface: {
        main: '#f1f5f9',      // App canvas
        elevated: '#ffffff',  // Cards, Modals
        sunken: '#e0e6ec',    // Input backgrounds
        inverted: '#022b3a',
        transparent: '#022b3a66',

      },
      outline: {
        default: '#e2e8f0',
        focus: '#1f7a8c',
      },
    },
    dark: {
      theme: {
        primary: '#38b2ac', // The "Action" color. It styles the active tab icon and active header buttons.
        background: '#292b39', // The main canvas behind your screens. If your screen has no container style, this is what you see.
        card: '#22232b', // The background color for Headers (Top) and Tab Bars (Bottom).
        text: '#f1f5f9', // The default color for titles in the Header and labels in the Tab Bar.
        border: "#1e293b", // The thin line separating the header or tab bar from the main content.
        // notification: ..., // Used specifically for badge counts (the little red circles) on tab icons.
      },
      content: {
        primary: '#d3deea',
        secondary: '#acb7c8',
        tertiary: '#64748b',
        light: '#acb7c8',
        medium: '#64748b',
        accent: '#38b2ac',
        softAccent: '#6dcbc6',
        onAccent: '#ffffff',
        negative: '#aa3e3e',
        positive: '#378b56',
      },
      surface: {
        main: '#292b39',
        elevated: '#47495a',
        sunken: '#1e293b',
        inverted: '#ffffff',
        transparent: '#ffffff66',
      },
      outline: {
        default: '#1e293b',
        focus: '#38b2ac',
      },
    },
}

export default colors;
