const textinput = "border rounded-xl my-2 text-light-content-primary dark:text-dark-content-primary border-light-content-primary dark:border-dark-content-primary"
const button = "mx-1 p-2 rounded-lg items-center justify-center"

export const className = {
  container: "flex-1 p-4",
  header: "flex-row justify-between items-center mb-4",
  item: "flex-row justify-between p-3 border-b",
  text: {
    heading1: "text-3xl font-bold text-light-content-accent dark:text-dark-content-accent",
    heading2: "text-2xl font-bold text-light-content-primary dark:text-dark-content-primary",
    heading3: "text-xl font-bold text-light-content-primary dark:text-dark-content-primary",
    subheading: "text-lg font-semibold text-light-content-primary dark:text-dark-content-primary",
    subheading2: "font-semibold text-light-content-primary dark:text-dark-content-primary",
    paragraph: "text-m text-light-content-secondary dark:text-dark-content-secondary",
    note: "text-sm text-light-content-tertiary dark:text-dark-content-tertiary",
    footnote: "text-xs text-light-content-tertiary dark:text-dark-content-tertiary",
    item: "text-lg text-light-content-onAccent dark:text-dark-content-onAccent",
    strong: "text-2xl font-semibold text-light-content-primary dark:text-dark-content-primary",
    strong2: "text-lg font-semibold text-light-content-primary dark:text-dark-content-primary",
    onAccent: "text-light-content-onAccent dark:text-dark-content-onAccent text-center font-medium",
  },
  input: {
    picker: `${textinput}`,
    textinput: `p-3 ${textinput}`,
  },
  button: {
    submit: `flex-1 ${button}`,
    cancel: `flex-1 ${button}`,
    primary: "flex rounded-lg ml-3 shadow-md items-center justify-center bg-light-content-accent dark:bg-dark-content-accent",
    secondary: "flex rounded-lg ml-3 shadow-md items-center justify-center bg-light-surface-elevated dark:bg-dark-surface-elevated",
    icon: "ml-5",
    end: `${button}`
  },
};