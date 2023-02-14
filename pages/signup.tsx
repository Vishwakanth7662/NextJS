
import React, { useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { single } from 'react-icons-kit/entypo/single'
import MainService from '../services/main-service';
import { Icon } from 'react-icons-kit';
import { eye } from 'react-icons-kit/feather/eye';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import styles from "../styles/signup/signup.module.scss";
import { useRouter } from 'next/router'

var imageHost = process.env.NEXT_PUBLIC_IMAGEHOST!;
var token: string | null;
type formTypes = {
  name: string,
  email: string,
  password: string,
  confirmPassword: string
}


function Signup() {
  const router = useRouter()
  var baseUrl = process.env.NEXT_PUBLIC_BASEURL;
  console.log(baseUrl);

  let redirectUrlGoogle = baseUrl + '/oauth2/authorization/google?redirectUri=' + "/add-account";
  let redirectUrlCoinbase = baseUrl + '/oauth2/authorization/coinbase?redirectUri=' + "/add-account";
  const { register, handleSubmit, formState: { errors } } = useForm();
  const mainService: any = MainService("SignUp");
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [showError, errorShown] = useState(false);
  const [showLoader, loaderShown] = useState(false);
  const [type, setType] = useState("password");
  const [type2, setType2] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const [icon2, setIcon2] = useState(eyeOff);
  const [isFocused, setFocus] = useState(false);
  const [emailWarn, isEmailWarn] = useState(false);
  const [toggled, isToggle] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(true);
  var EMAIL_PRODUCT_UPDATES: String = "true";
  var apiSiteKey = String(process.env.REACT_APP_SITEKEY)!;
  let preferences = new Map();
  const recaptchaRef: any = useRef(null);

  if (!toggled) {
    EMAIL_PRODUCT_UPDATES = "false";
    preferences.set('EMAIL_PRODUCT_UPDATES', EMAIL_PRODUCT_UPDATES);
  } else {
    EMAIL_PRODUCT_UPDATES = "true";
    preferences.set('EMAIL_PRODUCT_UPDATES', EMAIL_PRODUCT_UPDATES);
  }

  var submitDisabled: boolean = true;
  var isValid: boolean = false;
  var lengthValid: boolean = false;
  var isNumber: boolean = false;
  var isUpperCase: boolean = false;
  var isLowerCase: boolean = false;
  var isSpecial: boolean = false;
  var noPasswordMatch: boolean = false;
  var emailInput: String = "";
  var showErrorTop: boolean = false;

  if (confirmPassword !== password && confirmPassword !== "") {
    noPasswordMatch = true;
  }
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
      setIcon(eye)
      setType("text")
    }
    else {
      setIcon(eyeOff)
      setType("password")
    }
  }

  const handleToggle2 = () => {
    if (type2 === 'password') {
      setIcon2(eye)
      setType2("text")
    }
    else {
      setIcon2(eyeOff)
      setType2("password")
    }
  }

  if (email === "" && password === "" && confirmPassword === "") {
    submitDisabled = true;
  } else {
    submitDisabled = false;
  }

  const onSubmit: SubmitHandler<any> = (d: any) => {
    loaderShown(true);
    console.log("Onsubmit req");
    saveUser();
  }

  async function saveUser() {
    let preferencesArr: any = [];
    for (let [key, value] of preferences) {
      let preferencesObj: any = { type: key, value: value };
      preferencesArr.push(preferencesObj);
    }
    let data = { name, email, password, confirmPassword, preferences: preferencesArr }
    loaderShown(true);
    let redirect: boolean = false;
    try {
      let response = await mainService("signup", data, 'user', null);
      console.log(response);
      console.log("Signup success");
      router.push("/signup-success")
    }
    catch (e: any) {
      console.log(e)
      errorShown(true);
      setError(e.data.error.message);
      loaderShown(false);
    }
  }

  function onChange(value: any) {
    token = value;
    if (token == null) {
      setDisableSubmit(true);
    } if (token != null) {
      setDisableSubmit(false);
    }
    console.log("Captcha value:", value);
  }


  return (
    <div className={styles.signup_page}>
      <div>
        <div className={`container-fluid ${styles.background_map}`}>
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-lg-5 col-sm-10 col-12">
                {/* form section  */}
                <form className={styles.form_container} onSubmit={handleSubmit(onSubmit)}   >
                  <div className={`text-center ${styles.logo}`}>
                    <a className={`navbar-brand ${styles.navbar_brand}`} href="/"> <img src={imageHost + '/new-logo.svg'} alt="" /></a>
                  </div>
                  <h2 className="text-center">Create Your Free Account</h2>

                  {
                    showError ? <div className="alert alert-danger">{error}</div> : null
                  }


                  <div className={`form-group ${styles.form_group}`}>
                    <label >Enter Name</label>
                    <input type="text" name="name" autoComplete="off" className="form-control"
                      placeholder="Enter Full Name" aria-describedby="helpId" value={name} onChange={(e) => {
                        setName(e.target.value);
                      }} />
                  </div>


                  <div className={`form-group ${styles.form_group}`}>
                    <label >Email ID<span>*</span></label>

                    <input id="email" placeholder="Enter Email ID" {...register("email", { required: true })}
                      required pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" className="form-control" autoComplete="off"
                      type="email" name="email" value={email} onChange={(e) => {
                        setEmail(e.target.value); emailInput = e.target.value; if (emailInput == "") {
                          isEmailWarn(true);
                        } else {
                          isEmailWarn(false);
                        }
                      }} />

                  </div>
                  {
                    emailWarn ? <div className='confirm-pwd-info'><img className='up-arrow' src={imageHost + '/arrow-signup.svg'} /><img className='warn-input' src={imageHost + '/warning-signup.svg'} />Please Enter Email Id <a className='dismiss-warning' onClick={() => { isEmailWarn(false) }}><img src={imageHost + '/dismiss-warning.svg'} /></a></div> : <div></div>
                  }
                  <div className={`form-group ${styles.eye_icon_container} ${styles.form_group}`}>
                    <label >Password<span>*</span></label>

                    <input id="pwd" placeholder="Enter Password"
                      required {...register("password", { required: true })} name="password" autoComplete="off"
                      type={type} onFocus={() => { setFocus(true) }} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                      className="form-control " value={password} onChange={(e) => { setPassword(e.target.value) }} />


                    <span className={`${styles.eye_icon} ${styles.show_icon}`} onClick={handleToggle}><Icon icon={icon} size={25} /></span>
                    <span className={`${styles.eye_icon} ${styles.hide_icon}`} onClick={handleToggle}><Icon icon={icon} size={18} /></span>


                  </div>

                  {
                    isFocused && !isValid ? <div className={styles.pwd_info}><div className={styles.pwd_info_heading}>The Password must contain atleast</div><ul className={styles.the_info}>
                      <li className={lengthValid ? `${styles.text_green}` : ''}>{lengthValid ? <img className={styles.info_tick} src={imageHost + '/icons.svg'} alt='Tick svg' /> : <Icon icon={single} className={styles.icon} size={30} />}<p className='lh-lg d-inline-block m-0'>8 Characters</p></li>
                      <li className={isNumber ? `${styles.text_green}` : ''}>{isNumber ? <img className={styles.info_tick} src={imageHost + '/icons.svg'} alt='Tick svg' /> : <Icon icon={single} className={styles.icon} size={30} />}<p className='lh-lg d-inline-block m-0'>1 Number</p></li>
                      <li className={isUpperCase ? `${styles.text_green}` : ''}>{isUpperCase ? <img className={styles.info_tick} src={imageHost + '/icons.svg'} alt='Tick svg' /> : <Icon icon={single} className={styles.icon} size={30} />}<p className='lh-lg d-inline-block m-0'>1 UpperCase Letter</p></li>
                      <li className={isLowerCase ? `${styles.text_green}` : ''}>{isLowerCase ? <img className={styles.info_tick} src={imageHost + '/icons.svg'} alt='Tick svg' /> : <Icon icon={single} className={styles.icon} size={30} />}<p className='lh-lg d-inline-block m-0'>1 LowerCase Letter</p></li>
                      <li className={isSpecial ? `${styles.text_green}` : ''}>{isSpecial ? <img className={styles.info_tick} src={imageHost + '/icons.svg'} alt='Tick svg' /> : <Icon icon={single} className={styles.icon} size={30} />}<p className='lh-lg d-inline-block m-0'>1 Special Character</p></li>
                    </ul></div> : <div></div>
                  }

                  <div className={`form-group ${styles.form_group} ${styles.eye_icon_container}`}>
                    <label >Confirm Password<span>*</span></label>

                    <input id="cPwd" className="form-control"
                      required autoComplete="off" {...register("confirmPassword", { required: true })}
                      placeholder="Enter Confirm Password" type={type2} name="confirmPassword" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />

                    <span className={`${styles.show_icon} ${styles.eye_icon}`} onClick={handleToggle2}><Icon icon={icon2} size={25} /></span>
                    <span className={`${styles.hide_icon} ${styles.eye_icon}`} onClick={handleToggle2}><Icon icon={icon2} size={18} /></span>

                  </div>



                  {
                    noPasswordMatch ?
                      <div className={styles.confirm_pwd_info}>
                        <img className={styles.up_arrow} src={imageHost + '/arrow-signup.svg'} />
                        <img className={styles.warn_input} src={imageHost + '/warning-signup.svg'} />Password does not match
                      </div> : <div></div>
                  }
                  <div className={`form-check form-switch ${styles.subscribe_div}`}>
                    <input className={`form-check-input ${styles.subscribe_input}`} type="checkbox" onClick={() => {
                      isToggle(!toggled);
                    }} role="switch" id="subscribe-switch" defaultChecked={toggled} />
                    <label className={`form-check-label ${styles.subscribe_label}`} htmlFor="subscribe-switch">Subscribe For Product Update</label>
                  </div>


                  {
                    showLoader ?
                      <div id='loader' className="text-center p-3">
                        <img src={imageHost + '/loader-small.gif'} alt="loader" />
                      </div> : <button
                        className={`btn  form-control ${styles.submit_form}`} disabled={submitDisabled} type="submit">GET STARTED </button>


                  }

                  <div className={styles.tnc}>
                    By creating an account on CRPTM, you are confirming to
                    agree to our <a className={styles.tnc_links} target="_blank" href="/terms-of-use">Terms of Use</a> and <a className={styles.tnc_links} target="_blank" href="/privacy-policy">Privacy Policy</a> .
                  </div>
                  <h5 className="text-center">Or continue with</h5>
                  <div className="row text-center mt-4 ">
                    <div className="col-6  ">
                      <div className="google-auth ">
                        <a className="btn  form-control " href={redirectUrlGoogle}><img className="img-fluid" src={imageHost + '/google-auth.png'} alt="" />
                          Google</a>
                      </div>
                    </div>
                    <div className="col-6  ">
                      <div className="coinbase-auth">
                        <a className="btn  form-control " href={redirectUrlCoinbase}><img className="img-fluid" src={imageHost + '/coinbase-auth.png'} alt="" />Coinbase</a>
                      </div>
                    </div>
                  </div>

                  <a id="log-in" href="login" >
                    <h6 className="text-center  mb-2"> Already have an account ? <span className=" text-center"
                    >Log In</span></h6>
                  </a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
