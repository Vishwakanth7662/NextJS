import styles from "../styles/signup/signup-success.module.scss";
var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
import Link from 'next/link'

function signupsuccess() {
    setTimeout(() => {
        window.location.href = "/login"
    }, 3000);
    return (
        <div className={styles.signup_success}>
            <div className={`container-fluid ${styles.container_fluid}`}>
                <div className="container">
                    <div className="row justify-content-center align-items-center pt-4">
                        <div className="text-center">
                            <a href="#" className={`mb-3 ${styles.navbar_brand}`}> <img className={styles.navbar_img} src={imageHost + '/new-logo.svg'}
                                alt="" /></a>
                        </div>

                        <div className={`col-lg-4 col-md-4 col-sm-8 col-12 ${styles.form_container}`}>
                            <h2 className={`text-center ${styles.form_container_head}`}>Congratulations!</h2>
                            <div className="text-center mb-2"><img src={imageHost + '/signup-success-tick.svg'} /></div>
                            <p className={`text-center ${styles.form_container_para}`}>Your Account has been  Created </p>

                            <p className="text-center" >We are redirecting you to <Link href={"/login"}>login</Link></p>
                            <div className="text-center"> <img src={imageHost + '/loader-small.gif'} alt="loader" /></div>
                        </div>
                    </div>
                </div>
            </div>



        </div>
    )
}

export default signupsuccess
