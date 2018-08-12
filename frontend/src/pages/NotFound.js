import React, {Fragment} from "react"
import Heading from "../components/Heading"

const HeadingContent = () =>
    "Nenalezeno"

const NotFound = () => {
    return (
        <div className="text-center">
            <Heading content={<HeadingContent/>}/>
            <p>
                Stránka nebo hledaný objekt neexistuje!
            </p>
        </div>
    )
}

export default NotFound
