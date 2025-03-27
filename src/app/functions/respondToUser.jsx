const { CircularProgress } = require("@mui/material")

exports.showSpinner = (stateVariable, displayText) => {
    return (
        stateVariable ?
            <CircularProgress size='20px' color='white' />
            :
            displayText
    )
}