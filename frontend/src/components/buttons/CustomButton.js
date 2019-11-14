import React from "react"
import { Button } from "reactstrap"

const CustomButton = ({
    onClick = () => {},
    content = "",
    disabled = false,
    title = "",
    ...props
}) => (
    <Button color="secondary" disabled={disabled} onClick={onClick} {...props}>
        {content}
    </Button>
)

export default CustomButton
