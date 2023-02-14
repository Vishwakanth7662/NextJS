


const Error500 = () => {
    return (
        <div className="error-500">
            <div className="error-box">
                <img src={process.env.REACT_APP_IMAGEHOST + "/error-500.svg"} alt="" />
                <h3 className="heading my-3">Error found !</h3>
                <p className="paragraph my-3">The server encountered an unexpected condition and we have notified our <span className="abnes-font">CRPTM</span> Support team about the same. Please try again after sometime.</p>
                <button type="button" className="btn btn-dark back-btn rounded-pill px-4" onClick={() => window.location.href = "/"}>Back to home</button>
            </div>
        </div>
    )
}

export default Error500;