import React, {useEffect} from  "react"
import {auth} from "../../index"
import { userSignedOut } from "../../store/actions/authStatus"

import {connect} from "react-redux" 

const Logout = (props) => {
    useEffect (() => {
        auth.signOut()
        props.signUserOut()
        props.history.push("/auth")
        
    }, [props])
    
    return <p></p>
} 


const mapDispatchToProps = dispatch => {
    return {
        signUserOut: () => dispatch(userSignedOut())
    }
}

export default connect(null, mapDispatchToProps)(Logout)