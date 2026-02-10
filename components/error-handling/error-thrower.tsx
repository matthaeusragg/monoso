// this component throws an error for testing the error boundary

export const ErrorThrowerComponent = () => {
    throw new Error("Successfully threw a test error.")
}