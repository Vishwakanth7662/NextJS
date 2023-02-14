import { useEffect, useState } from 'react';
import styles from "../styles/login/login.module.scss";
import { parseCookies, setCookie, destroyCookie } from 'nookies'

type formTypes = {
  userNameOrEmail: string,
  password: string,

}
export async function getServerSideProps(context: any) {
  console.log(context.query);
  let data = context.query;
  return {
    props: {
      params: data
    }
  }
}

function Signin({ params }: any) {

  var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
  var baseUrl = process.env.NEXT_PUBLIC_BASEURL!;
  let redirectUrlGoogle = baseUrl + '/oauth2/authorization/google?redirectUri=' + "/add-account";
  let redirectUrlCoinbase = baseUrl + '/oauth2/authorization/coinbase?redirectUri=' + "/add-account";
  console.log(params);
  const [showError, setshowError] = useState(false);
  const [message, setMessage] = useState("")
  const [showLoader, loaderShown] = useState(false);
  const [type, setType] = useState("password");
  const [type2, setType2] = useState("password");
  const [password, setPassword] = useState("")
  const [isFocused, setFocus] = useState(false);
  const [emailWarn, isEmailWarn] = useState(false);
  const [toggled, isToggle] = useState(true);

  var submitDisabled: boolean = true;
  var isValid: boolean = false;
  var lengthValid: boolean = false;
  var isNumber: boolean = false;
  var isUpperCase: boolean = false;
  var isLowerCase: boolean = false;
  var isSpecial: boolean = false;
  var noPasswordMatch: boolean = false;
  var emailInput: String = "";

  if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
    isValid = true;
  } else {
    isValid = false;
  }

  if (password.length >= 8) {
    lengthValid = true;
  }
  if (/\d/.test(password)) {
    isNumber = true;
  }
  if (/[A-Z]/.test(password) && password !== "") {
    isUpperCase = true;
  }
  if (/[a-z]/.test(password) && password !== "") {
    isLowerCase = true;
  }
  if (/[@$!%*?&]/.test(password) && password !== "") {
    isSpecial = true;
  }

  const handleToggle = () => {
    if (type === 'password') {
      setType("text")
    }
    else {
      setType("password")
    }
  }
  useEffect(() => {
    if (params.message) {
      setshowError(true)
      setMessage(params.message)
    }
    loaderShown(false)
  }, []);

  function fetchQueryParams() {
    loaderShown(true)
    if (params.message) {
      setshowError(true)
      setMessage(params.message)
    }
    loaderShown(false)
  }

  function getCurrentUrl(): string {
    const cookies = parseCookies();
    let currentUrl: string = cookies.currentUrl;
    return currentUrl;
  }

  let url = baseUrl + "/authenticate";
  console.log(url);

  return (
    <div className={styles.signin_page}>
      <div className={styles.background_map}>
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-5 col-12 " >
              <form action={url} method='POST' className={styles.form_container}   >
                <div className={`${styles.logo} text-center`}>
                  <a className="navbar-brand" href="/"> <img src={'/images/new-logo.svg'} height={50} width={300} alt="" /></a>
                </div>
                <h2 className="text-center">Login to your account</h2>
                {
                  showError ? <div className={`${styles.alert} alert-danger p-2 mb-2`}>{message}</div> : null
                }
                <div className="form-group">
                  <label className="mb-0">Email</label>
                  <input id="userName" className="form-control" pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" required autoComplete="off"
                    placeholder="Enter Email" type="email" name="userNameOrEmail" />
                </div>
                <div>
                  <input className='d-none' name="redirectUri" value={getCurrentUrl()} type="text" id='Token' readOnly />
                </div>
                <div className={`${styles.eye_icon_container} form-group`}>
                  <label >Password</label>
                  <input id="password" onFocus={() => { setFocus(true) }} onChange={(e) => { setPassword(e.target.value) }} required type={type} autoComplete="off"
                    className="form-control placeicon" placeholder="Enter Password" name='password' />
                  <span className={`${styles.eye_icon} ${styles.show_icon}`} onClick={handleToggle}></span>
                  <span className={`${styles.eye_icon} ${styles.hide_icon}`} onClick={handleToggle}></span>
                </div>

                <h6 className={styles.pointer_hover}><a href="/reset-password" className={styles.forgot_password}>Forgot Password ?</a></h6>
                {
                  showLoader ? <div id='loader' className="text-center p-3">
                    <img src={imageHost + '/loader-small.gif'} alt="loader" />
                  </div> :
                    <button type="submit" className={`btn form-control ${styles.submit_form}`} onClick={fetchQueryParams}   >
                      LOGIN
                    </button>
                }
                <h5 className="text-center">Or continue with</h5>
                <div className="row text-center mt-4 ">
                  <div className="col-6">
                    <div className={styles.google_auth}>
                      <a className="btn  form-control " href={redirectUrlGoogle}><img src={'/images/google-auth.png'} alt="" />
                        Google</a>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className={styles.coinbase_auth}>
                      <a className="btn  form-control" href={redirectUrlCoinbase}><img src={'/images/coinbase_auth.png'}
                        alt="" />Coinbase</a>
                    </div>
                  </div>
                </div>
                <h6 className="text-center mb-2">Don't have an account ? <a id="sign-in" href="/signup">
                  Sign Up</a></h6>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin
